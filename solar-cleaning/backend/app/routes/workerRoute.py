# app/routes/workers.py
from flask import Blueprint, request, jsonify
from ..models.workerModel import Worker
from .. import db

worker_bp = Blueprint('worker_bp', __name__, url_prefix='/api/workers')

@worker_bp.route('/', methods=['GET', 'POST'])
def manage_workers():
    if request.method == 'GET':
        workers = Worker.query.all()
        return jsonify([worker.to_dict() for worker in workers]), 200
    elif request.method == 'POST':
        data = request.get_json()
        if not data or not 'name' in data:
            return jsonify({'error': 'Bad Request', 'message': 'Name is required'}), 400
        new_worker = Worker(name=data['name'])
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
        if not data or not 'name' in data:
            return jsonify({'error': 'Bad Request', 'message': 'Name is required'}), 400
        worker.name = data['name']
        db.session.commit()
        return jsonify(worker.to_dict()), 200
    elif request.method == 'DELETE':
        db.session.delete(worker)
        db.session.commit()
        return jsonify({'message': 'Worker deleted successfully'}), 200
