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
    return slots.get(time_slot, -1)

def add_recurring_bookings(client_id, worker_id, start_date, time_slot, status, recurrence, subscription_end):
    current_date = datetime.strptime(start_date, '%Y-%m-%d').date()
    subscription_end_date = datetime.strptime(subscription_end, '%Y-%m-%d').date()
    recurrence_days = {
        'daily': 1,
        'weekly': 7,
        'biweekly': 14,
        'monthly': 30
    }

    if recurrence in recurrence_days:
        interval = recurrence_days[recurrence]
        while current_date <= subscription_end_date:
            day_index = get_day_index(current_date.strftime('%Y-%m-%d'))
            slot_index = get_slot_index(time_slot)

            worker = Worker.query.get(worker_id)
            if worker and worker.availability[day_index][slot_index]:
                new_booking = Booking(
                    client_id=client_id,
                    worker_id=worker_id,
                    date=current_date,
                    time_slot=time_slot,
                    status=status
                )
                worker.availability[day_index][slot_index] = False
                db.session.add(new_booking)

            current_date += timedelta(days=interval)

    db.session.commit()

@booking_bp.route('/', methods=['GET', 'POST'])
@jwt_required()
def manage_bookings():
    if request.method == 'GET':
        bookings = Booking.query.all()
        return jsonify([booking.to_dict() for booking in bookings]), 200
    elif request.method == 'POST':
        data = request.get_json()
        if not all(key in data for key in ['client_name', 'date', 'time_slot', 'status']):
            return jsonify({'error': 'Bad Request', 'message': 'Missing required fields'}), 400

        client = Client.query.filter_by(name=data['client_name']).first()

        if not client:
            return jsonify({'error': 'Not Found', 'message': 'Client not found'}), 404

        client_lat, client_lon = client.latitude, client.longitude

        workers = Worker.query.all()
        closest_worker = None
        min_distance = float('inf')
        day_index = get_day_index(data['date'])
        slot_index = get_slot_index(data['time_slot'])

        if 'worker_name' in data:
            # Manually assign worker if worker_name is provided
            closest_worker = Worker.query.filter_by(name=data['worker_name']).first()
            if not closest_worker or not closest_worker.availability[day_index][slot_index]:
                return jsonify({'error': 'Conflict', 'message': 'Specified worker not available for the selected time slot'}), 409
        else:
            # Automatically assign closest worker
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
            time_slot=data['time_slot'],
            status=data['status'],
            recurrence=data.get('recurrence')
        )

        # Mark availability as false
        closest_worker.availability[day_index][slot_index] = False
        db.session.add(new_booking)

        if 'recurrence' in data:
            add_recurring_bookings(client.id, closest_worker.id, data['date'], data['time_slot'], data['status'], data['recurrence'], client.subscription_end)

        db.session.commit()
        return jsonify(new_booking.to_dict()), 201

@booking_bp.route('/<int:booking_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def handle_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)

    if request.method == 'GET':
        return jsonify(booking.to_dict()), 200
    elif request.method == 'PUT':
        data = request.get_json()
        if not all(key in data for key in ['client_name', 'worker_name', 'date', 'time_slot', 'status']):
            return jsonify({'error': 'Bad Request', 'message': 'Missing required fields'}), 400

        client = Client.query.filter_by(name=data['client_name']).first()
        worker = Worker.query.filter_by(name=data['worker_name']).first()

        if not client or not worker:
            return jsonify({'error': 'Not Found', 'message': 'Client or Worker not found'}), 404

        old_day_index = get_day_index(booking.date.strftime('%Y-%m-%d'))
        old_slot_index = get_slot_index(booking.time_slot)

        new_day_index = get_day_index(data['date'])
        new_slot_index = get_slot_index(data['time_slot'])

        if (data['worker_name'] != booking.worker.name or data['time_slot'] != booking.time_slot or data['date'] != booking.date.strftime('%Y-%m-%d')) and not worker.availability[new_day_index][new_slot_index]:
            return jsonify({'error': 'Conflict', 'message': 'Worker not available for the selected time slot'}), 409

        # Mark the old availability as true
        old_worker = Worker.query.get(booking.worker_id)
        old_worker.availability[old_day_index][old_slot_index] = True

        # Mark the new availability as false
        worker.availability[new_day_index][new_slot_index] = False

        booking.client_id = client.id
        booking.worker_id = worker.id
        booking.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        booking.time_slot = data['time_slot']
        booking.status = data['status']
        booking.recurrence = data.get('recurrence', booking.recurrence)  # Update recurrence
        db.session.commit()
        return jsonify(booking.to_dict()), 200
    elif request.method == 'DELETE':
        # Mark availability as true
        worker = Worker.query.get(booking.worker_id)
        day_index = get_day_index(booking.date.strftime('%Y-%m-%d'))
        slot_index = get_slot_index(booking.time_slot)
        worker.availability[day_index][slot_index] = True

        db.session.delete(booking)
        db.session.commit()
        return jsonify({'message': 'Booking deleted successfully'}), 200
