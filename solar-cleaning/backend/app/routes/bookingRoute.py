# app/routes/booking.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ..models.bookingModel import Booking
from ..models.clientModel import Client
from ..models.workerModel import Worker
from .. import db
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from ..utils import haversine, get_coordinates

booking_bp = Blueprint('booking_bp', __name__, url_prefix='/api/bookings')


def get_day_index(date_str):
    date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
    return date_obj.weekday()  # Monday is 0 and Sunday is 6


def get_slot_index(time_slot):
    slots = {
        "09:00-11:00": 0,
        "11:00-13:00": 1,
        "13:00-15:00": 2,
        "15:00-17:00": 3,
        "17:00-19:00": 4
    }

    print(f"Received time_slot: {time_slot}, Type: {type(time_slot)}")
    return slots.get(time_slot)


def add_recurring_bookings(client_id, worker_id, start_date, time_slot, status, recurrence, recurrence_period):
    current_date = datetime.strptime(start_date, '%Y-%m-%d').date()
    recurrence_days = {
        'daily': 1,
        'weekly': 7,
        'biweekly': 14,
        'monthly': 30,
        'ten': 10,  # Added ten days option
        'twenty': 20  # Added twenty days option
    }

    if recurrence in recurrence_days:
        interval = recurrence_days[recurrence]
        end_date = current_date + relativedelta(months=recurrence_period)

        print(f"Start Date: {current_date}")
        print(f"End Date: {end_date}")
        print(f"Recurrence Interval (days): {interval}")

        while current_date <= end_date:
            print(f"Current Date: {current_date}, End Date: {end_date}")
            print(f"Checking availability for date: {current_date} and time_slot: {time_slot}")
            day_index = get_day_index(current_date.strftime('%Y-%m-%d'))
            slot_index = get_slot_index(time_slot)
            print(f"Day index: {day_index}, Slot index: {slot_index}")

            worker = Worker.query.get(worker_id)  # Fetch fresh instance
            print(f"Worker availability before booking: {worker.availability}")

            # Check if a booking already exists
            existing_booking = Booking.query.filter_by(
                client_id=client_id,
                worker_id=worker_id,
                date=current_date,
                time_slot=time_slot
            ).first()

            if existing_booking:
                print(f"Booking already exists for date: {current_date} and time_slot: {time_slot}")
            elif worker and worker.availability[day_index][slot_index]:
                new_booking = Booking(
                    client_id=client_id,
                    worker_id=worker_id,
                    date=current_date,
                    time_slot=time_slot,
                    status=status,
                    recurrence=recurrence,
                    recurrence_period=recurrence_period  # Save the recurrence period
                )
                worker.availability[day_index][slot_index] = False
                db.session.add(worker)
                db.session.add(new_booking)
                db.session.commit()  # Commit after each addition
                print(f"Booking added for date: {current_date} and time_slot: {time_slot}")
                print(f"Worker availability after booking: {worker.availability}")
            else:
                print(f"Worker not available on date: {current_date} and time_slot: {time_slot}")

            current_date += timedelta(days=interval)
            # Ensure the loop stops if the next current_date exceeds end_date
            if current_date > end_date:
                print(f"Reached the end date: {end_date}. Stopping further bookings.")
                break

@booking_bp.route('/create-booking', methods=['POST'])
@jwt_required()
def create_booking():
    print("create_booking route hit")
    data = request.get_json()
    print(f"Received data: {data}")
    if not all(key in data for key in ['client_id', 'date', 'time_slot', 'status']):
        return jsonify({'error': 'Bad Request', 'message': 'Missing required fields'}), 400

    client = Client.query.filter_by(id=data['client_id']).first()

    if not client:
        return jsonify({'error': 'Not Found', 'message': 'Client not found'}), 404

    client_lat, client_lon = client.latitude, client.longitude

    workers = Worker.query.all()
    closest_worker = None
    min_distance = float('inf')
    day_index = get_day_index(data['date'])
    slot_index = get_slot_index(data['time_slot'])
    print(f"Converted slot_index: {slot_index}")
    if slot_index is None:
        return jsonify({'error': 'Bad Request', 'message': 'Invalid time slot'}), 400

    if 'worker_id' in data and data['worker_id'] is not None:
        closest_worker = Worker.query.filter_by(id=data['worker_id']).first()
        if not closest_worker or not closest_worker.availability[day_index][slot_index]:
            return jsonify({'error': 'Conflict', 'message': 'Specified worker not available for the selected time slot'}), 409
    else:
        for worker in workers:
            if worker.availability[day_index][slot_index]:
                worker_lat, worker_lon = worker.latitude, worker.longitude
                distance = haversine(client_lat, client_lon, worker_lat, worker_lon)
                if distance < min_distance:
                    min_distance = distance
                    closest_worker = worker

        if not closest_worker:
            return jsonify({'error': 'Conflict', 'message': 'No available workers found for the selected time slot'}), 409

    # Check if a booking already exists
    existing_booking = Booking.query.filter_by(
        client_id=client.id,
        worker_id=closest_worker.id,
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
        time_slot=data['time_slot']
    ).first()

    if existing_booking:
        return jsonify({'error': 'Conflict', 'message': 'Booking already exists for the selected time slot'}), 409

    new_booking = Booking(
        client_id=client.id,
        worker_id=closest_worker.id,
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
        time_slot=data['time_slot'],
        status=data['status'],
        recurrence=data.get('recurrence'),
        recurrence_period=data.get('recurrence_period')  # Save the recurrence period
    )

    print(f"Worker availability before booking: {closest_worker.availability}")

    closest_worker.availability[day_index][slot_index] = False
    db.session.add(closest_worker)
    db.session.add(new_booking)
    db.session.commit()  # Ensure the availability change is committed

    print(f"Worker availability after booking: {closest_worker.availability}")

    if 'recurrence' in data:
        recurrence_period = data.get('recurrence_period', 1)  # Default to 1 month if not provided
        add_recurring_bookings(client.id, closest_worker.id, data['date'], data['time_slot'], data['status'], data['recurrence'], recurrence_period)

    return jsonify(new_booking.to_dict()), 201

@booking_bp.route('/get-all-bookings', methods=['GET'])
@jwt_required()
def get_all_bookings():
    bookings = Booking.query.all()
    return jsonify([booking.to_dict() for booking in bookings]), 200


@booking_bp.route('/get-booking-by-id/<int:booking_id>', methods=['GET'])
@jwt_required()
def get_booking_by_id(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    return jsonify(booking.to_dict()), 200


@booking_bp.route('/update-booking/<int:booking_id>', methods=['PUT'])
@jwt_required()
def update_booking(booking_id):
    data = request.get_json()
    if not all(key in data for key in ['client_id', 'worker_id', 'date', 'time_slot', 'status']):
        return jsonify({'error': 'Bad Request', 'message': 'Missing required fields'}), 400

    booking = Booking.query.get_or_404(booking_id)

    # Define new_slot_index based on the time_slot provided in the request
    new_slot_index = get_slot_index(data['time_slot'])
    if new_slot_index is None:
        return jsonify({'error': 'Bad Request', 'message': 'Invalid time slot'}), 400

    # Update client_id if it has changed
    if booking.client_id != data['client_id']:
        booking.client_id = data['client_id']

    # Update worker_id if it has changed and handle availability
    if booking.worker_id != data['worker_id']:
        # Mark old availability as true
        old_day_index = get_day_index(booking.date.strftime('%Y-%m-%d'))
        old_slot_index = get_slot_index(booking.time_slot)
        old_worker = Worker.query.get(booking.worker_id)
        if old_worker:
            old_worker.availability[old_day_index][old_slot_index] = True

        # Mark new availability as false
        new_day_index = get_day_index(data['date'])
        new_worker = Worker.query.get(data['worker_id'])
        if new_worker:
            new_worker.availability[new_day_index][new_slot_index] = False

        booking.worker_id = data['worker_id']

    # Update date if it has changed
    if booking.date != datetime.strptime(data['date'], '%Y-%m-%d').date():
        booking.date = datetime.strptime(data['date'], '%Y-%m-%d').date()

    # Update time_slot if it has changed
    if booking.time_slot != data['time_slot']:
        # Mark old availability as true
        old_day_index = get_day_index(booking.date.strftime('%Y-%m-%d'))
        old_slot_index = get_slot_index(booking.time_slot)
        old_worker = Worker.query.get(booking.worker_id)
        if old_worker:
            old_worker.availability[old_day_index][old_slot_index] = True

        # Mark new availability as false
        new_day_index = get_day_index(data['date'])
        new_worker = Worker.query.get(data['worker_id'])
        if new_worker:
            new_worker.availability[new_day_index][new_slot_index] = False

        booking.time_slot = data['time_slot']

    # Update status if it has changed
    if booking.status != data['status']:
        booking.status = data['status']

    # Update recurrence if it has changed
    if booking.recurrence != data.get('recurrence'):
        booking.recurrence = data.get('recurrence')
    
    # Update recurrence_period if it has changed
    if 'recurrence_period' in data:
        booking.recurrence_period = data['recurrence_period']


    db.session.commit()
    return jsonify(booking.to_dict()), 200




@booking_bp.route('/delete-booking/<int:booking_id>', methods=['DELETE'])
@jwt_required()
def delete_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    # Mark availability as true
    worker = Worker.query.get(booking.worker_id)
    day_index = get_day_index(booking.date.strftime('%Y-%m-%d'))

    slot_index = get_slot_index(booking.time_slot)

    if slot_index is None:
        return jsonify({'error': 'Internal Server Error', 'message': 'Invalid time slot'}), 500

    worker.availability[day_index][slot_index] = True

    db.session.delete(booking)
    db.session.commit()
    return jsonify({'message': 'Booking deleted successfully'}), 200
