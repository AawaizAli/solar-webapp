# app/routes/availability.py
from flask import Blueprint, request, jsonify
from ..models.availibilityModel import Availability
from .. import db
from datetime import datetime

availability_bp = Blueprint('availability', __name__, url_prefix='/api/availabilities')

@availability_bp.route('/', methods=['POST'])
def add_availability():
    data = request.get_json()
    if not data or not all(key in data for key in ['worker_id', 'date', 'time_slot']):
        return jsonify({'error': 'Bad Request', 'message': 'worker_id, date, and time_slot are required'}), 400

    try:
        date_obj = datetime.strptime(data['date'], '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Bad Request', 'message': 'Invalid date format. Use YYYY-MM-DD.'}), 400

    new_availability = Availability(
        worker_id=data['worker_id'],
        date=date_obj,
        time_slot=data['time_slot'],
        is_available=data.get('is_available', True)
    )
    db.session.add(new_availability)
    db.session.commit()
    return jsonify(new_availability.to_dict()), 201

@availability_bp.route('/', methods=['GET'])
def get_availabilities():
    availabilities = Availability.query.all()
    return jsonify([availability.to_dict() for availability in availabilities]), 200

@availability_bp.route('/<int:availability_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_availability(availability_id):
    availability = Availability.query.get_or_404(availability_id)

    if request.method == 'GET':
        return jsonify(availability.to_dict()), 200
    elif request.method == 'PUT':
        data = request.get_json()
        if not data or not all(key in data for key in ['worker_id', 'date', 'time_slot']):
            return jsonify({'error': 'Bad Request', 'message': 'worker_id, date, and time_slot are required'}), 400

        try:
            date_obj = datetime.strptime(data['date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Bad Request', 'message': 'Invalid date format. Use YYYY-MM-DD.'}), 400

        availability.worker_id = data['worker_id']
        availability.date = date_obj
        availability.time_slot = data['time_slot']
        availability.is_available = data.get('is_available', availability.is_available)
        db.session.commit()
        return jsonify(availability.to_dict()), 200
    elif request.method == 'DELETE':
        db.session.delete(availability)
        db.session.commit()
        return jsonify({'message': 'Availability deleted successfully'}), 200
