# app/routes/worker.py
from flask import Blueprint, request, jsonify
from ..models.workerModel import Worker
from .. import db
from ..utils import get_coordinates  # Import the geocoding function

worker_bp = Blueprint('worker_bp', __name__, url_prefix='/api/workers')

@worker_bp.route('/', methods=['GET', 'POST'])
def manage_workers():
    if request.method == 'GET':
        workers = Worker.query.all()
        return jsonify([worker.to_dict() for worker in workers]), 200
    elif request.method == 'POST':
        data = request.get_json()
        if not all(key in data for key in ['name', 'base_location']):
            return jsonify({'error': 'Bad Request', 'message': 'Name and base_location are required'}), 400

        latitude, longitude = get_coordinates(data['base_location'])
        if latitude is None or longitude is None:
            return jsonify({'error': 'Invalid base location'}), 400

        new_worker = Worker(
            name=data['name'],
            base_location=data['base_location'],
            latitude=latitude,
            longitude=longitude,
            availability=[[True] * 5 for _ in range(7)]
        )
        db.session.add(new_worker)
        db.session.commit()
        return jsonify(new_worker.to_dict()), 201

@worker_bp.route('/<int:worker_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_worker(worker_id):
    worker = Worker.query.get_or_404(worker_id)

    if request.method == 'GET':
        return jsonify(worker.to_dict()), 200
    elif request.method == 'PUT':
        data = request.get_json()
        if not all(key in data for key in ['name', 'base_location']):
            return jsonify({'error': 'Bad Request', 'message': 'Name and base_location are required'}), 400
        
        latitude, longitude = get_coordinates(data['base_location'])
        if latitude is None or longitude is None:
            return jsonify({'error': 'Invalid base location'}), 400

        worker.name = data['name']
        worker.base_location = data['base_location']
        worker.latitude = latitude
        worker.longitude = longitude
        if 'availability' in data:
            worker.availability = data['availability']
        db.session.commit()
        return jsonify(worker.to_dict()), 200
    elif request.method == 'DELETE':
        db.session.delete(worker)
        db.session.commit()
        return jsonify({'message': 'Worker deleted successfully'}), 200
