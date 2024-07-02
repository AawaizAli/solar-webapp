# app/routes/booking.py
from flask import Blueprint, request, jsonify
from ..models.bookingModel import Booking
from ..models.availibilityModel import Availability
from .. import db
from datetime import datetime

booking_bp = Blueprint('booking_bp', __name__, url_prefix='/api/bookings')

@booking_bp.route('/', methods=['GET', 'POST'])
def manage_bookings():
    if request.method == 'GET':
        bookings = Booking.query.all()
        return jsonify([booking.to_dict() for booking in bookings]), 200
    elif request.method == 'POST':
        data = request.get_json()
        if not all(key in data for key in ['client_id', 'worker_id', 'date', 'time_slot', 'location', 'status']):
            return jsonify({'error': 'Bad Request', 'message': 'Missing required fields'}), 400

        # Check worker availability
        availability = Availability.query.filter_by(
            worker_id=data['worker_id'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            time_slot=data['time_slot'],
            is_available=True
        ).first()

        if not availability:
            return jsonify({'error': 'Conflict', 'message': 'Worker not available for the selected time slot'}), 409

        new_booking = Booking(
            client_id=data['client_id'],
            worker_id=data['worker_id'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            time_slot=data['time_slot'],
            location=data['location'],
            status=data['status']
        )

        # Mark availability as false
        availability.is_available = False

        db.session.add(new_booking)
        db.session.commit()
        return jsonify(new_booking.to_dict()), 201

@booking_bp.route('/<int:booking_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)

    if request.method == 'GET':
        return jsonify(booking.to_dict()), 200
    elif request.method == 'PUT':
        data = request.get_json()
        if not all(key in data for key in ['client_id', 'worker_id', 'date', 'time_slot', 'location', 'status']):
            return jsonify({'error': 'Bad Request', 'message': 'Missing required fields'}), 400

        # Check worker availability if the worker or time slot is changing
        if data['worker_id'] != booking.worker_id or data['time_slot'] != booking.time_slot or data['date'] != booking.date.strftime('%Y-%m-%d'):
            availability = Availability.query.filter_by(
                worker_id=data['worker_id'],
                date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
                time_slot=data['time_slot'],
                is_available=True
            ).first()

            if not availability:
                return jsonify({'error': 'Conflict', 'message': 'Worker not available for the selected time slot'}), 409

            # Mark the old availability as true
            old_availability = Availability.query.filter_by(
                worker_id=booking.worker_id,
                date=booking.date,
                time_slot=booking.time_slot
            ).first()
            if old_availability:
                old_availability.is_available = True

            # Mark the new availability as false
            availability.is_available = False

        booking.client_id = data['client_id']
        booking.worker_id = data['worker_id']
        booking.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        booking.time_slot = data['time_slot']
        booking.location = data['location']
        booking.status = data['status']
        db.session.commit()
        return jsonify(booking.to_dict()), 200
    elif request.method == 'DELETE':
        # Mark availability as true
        availability = Availability.query.filter_by(
            worker_id=booking.worker_id,
            date=booking.date,
            time_slot=booking.time_slot
        ).first()
        if availability:
            availability.is_available = True

        db.session.delete(booking)
        db.session.commit()
        return jsonify({'message': 'Booking deleted successfully'}), 200
