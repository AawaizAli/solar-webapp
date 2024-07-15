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
    # Convert index to time slot if necessary
    if isinstance(time_slot, int) or time_slot.isdigit():
        time_slot = int(time_slot)
        slot_str = next((key for key, value in slots.items() if value == time_slot), None)
        if slot_str is None:
            print(f"Invalid time slot index: {time_slot}")
            return -1, None  # Invalid index
        return time_slot, slot_str  # Return both index and string
    slot_index = slots.get(time_slot, -1)
    if slot_index == -1:
        print(f"Invalid time slot string: {time_slot}")
    return slot_index, time_slot

def add_recurring_bookings(client_id, worker_id, start_date, time_slot, status, recurrence, subscription_end):
    current_date = datetime.strptime(start_date, '%Y-%m-%d').date()
    subscription_end_date = datetime.strptime(subscription_end, '%Y-%m-%d').date() if isinstance(subscription_end, str) else subscription_end

    recurrence_days = {
        'daily': 1,
        'weekly': 7,
        'biweekly': 14,
        'monthly': 30  # Assuming 30 days for simplicity
    }

    if recurrence in recurrence_days:
        interval = recurrence_days[recurrence]
        print(f"Adding recurring bookings with interval: {interval} days")  # Debug statement

        while current_date <= subscription_end_date:
            print(f"Checking availability for date: {current_date} and time_slot: {time_slot}")  # Debug statement

            day_index = get_day_index(current_date.strftime('%Y-%m-%d'))
            slot_index, slot_str = get_slot_index(time_slot)
            
            print(f"Day index: {day_index}, Slot index: {slot_index}, Time slot string: {slot_str}")  # Debug statement

            worker = Worker.query.get(worker_id)
            if worker:
                print(f"Worker availability on {current_date}: {worker.availability}")  # Debug statement
                if worker.availability[day_index][slot_index]:
                    new_booking = Booking(
                        client_id=client_id,
                        worker_id=worker_id,
                        date=current_date,
                        time_slot=slot_str,
                        status=status,
                        recurrence=recurrence
                    )
                    worker.availability[day_index][slot_index] = False
                    db.session.add(new_booking)

                    print(f"Booked for date: {current_date} and time_slot: {slot_str}")  # Debug statement
                else:
                    print(f"Worker not available on date: {current_date} and time_slot: {slot_str}")  # Debug statement
                    break  # Exit the loop if the worker is not available for any recurring booking
            else:
                print(f"Worker with ID {worker_id} not found")  # Debug statement
                break  # Exit the loop if the worker is not found

            current_date += timedelta(days=interval)

    db.session.commit()
    print("Recurring bookings added successfully") # Debug statement

  # Debug statement

@booking_bp.route('/create-booking', methods=['POST'])
@jwt_required()
def create_booking():
    data = request.get_json()
    print(f"Received data: {data}")

    # Check for missing required fields
    required_fields = ['client_id', 'date', 'time_slot', 'status']
    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        print(f"Missing required fields: {missing_fields}")
        return jsonify({'error': 'Bad Request', 'message': f'Missing required fields: {missing_fields}'}), 400

    # Check if client exists
    client = Client.query.get(data['client_id'])
    if not client:
        print("Client not found")
        return jsonify({'error': 'Not Found', 'message': 'Client not found'}), 404

    print(f"Found client: {client.name}")
    client_lat, client_lon = client.latitude, client.longitude

    # Fetch all workers and find the closest available one
    workers = Worker.query.all()
    closest_worker = None
    min_distance = float('inf')
    day_index = get_day_index(data['date'])
    slot_index, time_slot_str = get_slot_index(data['time_slot'])
    
    print(f"Day index: {day_index}, Slot index: {slot_index}")  # Debug statement
    for worker in workers:
        print(f"Worker ID {worker.id} availability: {worker.availability}")  # Debug statement

    if data.get('worker_id'):
        closest_worker = Worker.query.get(data['worker_id'])
        if not closest_worker:
            print("Worker not found")
            return jsonify({'error': 'Not Found', 'message': 'Worker not found'}), 404
        if not closest_worker.availability[day_index][slot_index]:
            print("Specified worker not available for the selected time slot")
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
            print("No available workers found for the selected time slot")
            return jsonify({'error': 'Conflict', 'message': 'No available workers found for the selected time slot'}), 409

    new_booking = Booking(
        client_id=client.id,
        worker_id=closest_worker.id,
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
        time_slot=time_slot_str,  # Use the string representation of the time slot
        status=data['status'],
        recurrence=data.get('recurrence')
    )

    closest_worker.availability[day_index][slot_index] = False  # Update the availability
    db.session.add(new_booking)

    if 'recurrence' in data:
        add_recurring_bookings(client.id, closest_worker.id, data['date'], time_slot_str, data['status'], data['recurrence'], client.subscription_end)

    try:
        db.session.commit()
    except Exception as e:
        print(f"Error committing to the database: {e}")
        return jsonify({'error': 'Internal Server Error', 'message': 'An error occurred while saving the booking'}), 500

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
        slot_index,_ = get_slot_index(booking.time_slot)
        worker.availability[day_index][slot_index] = True

        db.session.delete(booking)
        db.session.commit()
        return jsonify({'message': 'Booking deleted successfully'}), 200
