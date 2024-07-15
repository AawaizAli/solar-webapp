# app/routes/booking.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ..models.bookingModel import Booking
from ..models.clientModel import Client
from ..models.workerModel import Worker
from .. import db
from datetime import datetime, timedelta
from ..utils import haversine, get_coordinates

booking_bp = Blueprint('booking_bp', __name__, url_prefix='/api/bookings')
from datetime import datetime, timedelta

def get_day_index(date_str):
    date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
    return date_obj.weekday()  # Monday is 0 and Sunday is 6

def get_slot_index(time_slot):
    slots = {
        0: "09:00-11:00",
        1: "11:00-13:00",
        2: "13:00-15:00",
        3: "15:00-17:00",
        4: "17:00-19:00"
    }
    
    print(f"Received time_slot: {time_slot}, Type: {type(time_slot)}")
    return int(time_slot), slots.get(time_slot, None)

def add_recurring_bookings(client_id, worker_id, start_date, time_slot, status, recurrence, subscription_end_date):
    current_date = datetime.strptime(start_date, '%Y-%m-%d').date()
    recurrence_days = {
        'daily': 1,
        'weekly': 7,
        'biweekly': 14,
        'monthly': 30
    }

    if recurrence in recurrence_days:
        interval = recurrence_days[recurrence]
        print(f"Starting recurring booking with interval: {interval} days")
        while current_date <= subscription_end_date:
            print(f"Checking availability for date: {current_date} and time_slot: {time_slot}")
            day_index = get_day_index(current_date.strftime('%Y-%m-%d'))
            slot_index,time_slot_str = get_slot_index(time_slot)
            print(f"Day index: {day_index}, Slot index: {slot_index}, Time slot string: {time_slot}")

            worker = Worker.query.get(worker_id)  # Fetch fresh instance
            print(f"Worker availability before booking: {worker.availability}")
            if worker and worker.availability[day_index][slot_index]:
                new_booking = Booking(
                    client_id=client_id,
                    worker_id=worker_id,
                    date=current_date,
                    time_slot=time_slot_str,
                    status=status,
                    recurrence=recurrence
                )
                worker.availability[day_index][slot_index] = False
                db.session.add(new_booking)
                db.session.commit()  # Commit after each addition
                print(f"Booking added for date: {current_date} and time_slot: {time_slot}")
                print(f"Worker availability after booking: {worker.availability}")
            else:
                print(f"Worker not available on date: {current_date} and time_slot: {time_slot}")

            current_date += timedelta(days=interval)

# Existing route
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
    slot_index = (data['time_slot']) 
    slot_index, time_slot_str = get_slot_index(data['time_slot'])
    print(f"Converted slot_index: {slot_index}, time_slot_str: {time_slot_str}")
    if time_slot_str is None:
        return jsonify({'error': 'Bad Request', 'message': 'Invalid time slot'}), 400

    if 'worker_id' in data:
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

    new_booking = Booking(
        client_id=client.id,
        worker_id=closest_worker.id,
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
        time_slot=time_slot_str,
        status=data['status'],
        recurrence=data.get('recurrence')
    )

    print(f"Worker availability before booking: {closest_worker.availability}")

    closest_worker.availability[day_index][slot_index] = False
    db.session.add(new_booking)
    db.session.commit()  # Ensure the availability change is committed

    print(f"Worker availability after booking: {closest_worker.availability}")

    if 'recurrence' in data:
        subscription_end_date = client.subscription_end
        print(f"Subscription end date: {subscription_end_date}, Type: {type(subscription_end_date)}")
        add_recurring_bookings(client.id, closest_worker.id, data['date'], slot_index, data['status'], data['recurrence'], subscription_end_date)

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
    booking = Booking.query.get_or_404(booking_id)
    data = request.get_json()
    print(f"Received update data: {data}")

    # Existing booking details
    old_worker_id = booking.worker_id
    old_day_index = get_day_index(booking.date.strftime('%Y-%m-%d'))
    old_slot_index, old_time_slot_str = get_slot_index(booking.time_slot)

    # Update fields if provided
    if 'client_id' in data:
        client = Client.query.get(data['client_id'])
        if not client:
            return jsonify({'error': 'Not Found', 'message': 'Client not found'}), 404
        booking.client_id = client.id

    if 'worker_id' in data:
        worker = Worker.query.get(data['worker_id'])
        if not worker:
            return jsonify({'error': 'Not Found', 'message': 'Worker not found'}), 404
        booking.worker_id = worker.id
    else:
        worker = Worker.query.get(old_worker_id)

    if 'date' in data:
        new_day_index = get_day_index(data['date'])
        booking.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    else:
        new_day_index = old_day_index

    if 'time_slot' in data:
        new_slot_index, new_time_slot_str = get_slot_index(data['time_slot'])
        if new_slot_index == -1:
            return jsonify({'error': 'Bad Request', 'message': 'Invalid time slot'}), 400
        booking.time_slot = new_time_slot_str
    else:
        new_slot_index = old_slot_index

    if 'status' in data:
        booking.status = data['status']

    if 'recurrence' in data:
        booking.recurrence = data['recurrence']

    # Check for worker availability if date, time_slot, or worker_id changes
    if 'date' in data or 'time_slot' in data or 'worker_id' in data:
        if not worker.availability[new_day_index][new_slot_index]:
            return jsonify({'error': 'Conflict', 'message': 'Worker not available for the selected time slot'}), 409
        worker.availability[new_day_index][new_slot_index] = False
        if old_worker_id != booking.worker_id:
            old_worker = Worker.query.get(old_worker_id)
            old_worker.availability[old_day_index][old_slot_index] = True
        else:
            worker.availability[old_day_index][old_slot_index] = True

    db.session.commit()
    return jsonify(booking.to_dict()), 200




@booking_bp.route('/delete-booking/<int:booking_id>', methods=['DELETE'])
@jwt_required()
def delete_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    # Mark availability as true
    worker = Worker.query.get(booking.worker_id)
    day_index = get_day_index(booking.date.strftime('%Y-%m-%d'))
    
    def get_slot_index_from_string(time_slot):
        slots = {
            "09:00-11:00": 0,
            "11:00-13:00": 1,
            "13:00-15:00": 2,
            "15:00-17:00": 3,
            "17:00-19:00": 4
        }
        return slots.get(time_slot, None)
    
    slot_index = get_slot_index_from_string(booking.time_slot)
    
    if slot_index is None:
        return jsonify({'error': 'Internal Server Error', 'message': 'Invalid time slot'}), 500
    
    worker.availability[day_index][slot_index] = True

    db.session.delete(booking)
    db.session.commit()
    return jsonify({'message': 'Booking deleted successfully'}), 200
