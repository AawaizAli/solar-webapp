from flask import Blueprint, request, jsonify
from ..models.worker import Worker
from .. import db

bp = Blueprint('worker', __name__)

@bp.route('/api/workers', methods=['GET', 'POST'])
def manage_workers():
    if request.method == 'GET':
        workers = Worker.query.all()
        return jsonify([worker.to_dict() for worker in workers]), 200
    elif request.method == 'POST':
        data = request.get_json()
        new_worker = Worker(
            name=data['name'],
            availability=data['availability']
        )
        db.session.add(new_worker)
        db.session.commit()
        return jsonify(new_worker.to_dict()), 201
