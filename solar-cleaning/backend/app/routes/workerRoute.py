# app/routes/worker.py
from flask import Blueprint, request, jsonify
from ..models.workerModel import Worker
from .. import db
from ..utils import get_coordinates 
from flask_jwt_extended import jwt_required
 # Import the geocoding function

worker_bp = Blueprint('worker_bp', __name__, url_prefix='/api/workers')

@worker_bp.route('/create-worker', methods=['POST'])
@jwt_required()
def create_worker():
    data = request.get_json()
    if not all(key in data for key in ['name', 'area']):
        return jsonify({'error': 'Bad Request', 'message': 'Name and area are required'}), 400

    # latitude, longitude = get_coordinates(data['area'])
    # if latitude is None or longitude is None:
    #     return jsonify({'error': 'Invalid base area'}), 400

    new_worker = Worker(
        name=data['name'],
        area=data['area'],
        latitude=data['latitude'],
        longitude=data['longitude'],
        availability=data['availability']
    )
    db.session.add(new_worker)
    db.session.commit()
    return jsonify(new_worker.to_dict()), 201


@worker_bp.route('/get-all-workers', methods=['GET'])
@jwt_required()
def get_all_workers():
    workers = Worker.query.all()
    return jsonify([worker.to_dict() for worker in workers]), 200

@worker_bp.route('/get-worker-by-id/<int:worker_id>', methods=['GET'])
@jwt_required()
def get_worker_by_id(worker_id):
    worker = Worker.query.get_or_404(worker_id)
    return jsonify(worker.to_dict()), 200


@worker_bp.route('/update-worker/<int:worker_id>', methods=['PUT'])
@jwt_required()
def update_worker(worker_id):
    worker = Worker.query.get_or_404(worker_id)
    data = request.get_json()
    if 'name' in data:
        worker.name = data['name']
    if 'area' in data:
        worker.area = data['area']
        # latitude, longitude = get_coordinates(data['area'])
        # if latitude is None or longitude is None:
        #     return jsonify({'error': 'Invalid base area'}), 400
        worker.latitude = data['latitude']
        worker.longitude = data['longitude']
    if 'availability' in data:
        worker.availability = data['availability']
    db.session.commit()
    return jsonify(worker.to_dict()), 200

@worker_bp.route('/delete-worker/<int:worker_id>', methods=['DELETE'])
@jwt_required()
def delete_worker(worker_id):
    worker = Worker.query.get_or_404(worker_id)
    db.session.delete(worker)
    db.session.commit()
    return jsonify({'message': 'Worker deleted successfully'}), 200
    
@worker_bp.route('/name/<string:name>', methods=['GET'])
@jwt_required()
def get_worker_by_name(name):
    worker = Worker.query.filter_by(name=name).first()
    if worker is None:
        return jsonify({'error': 'Worker not found'}), 404
    return jsonify(worker.to_dict()), 200