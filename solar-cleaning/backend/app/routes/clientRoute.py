# app/routes/client.py
from flask import Blueprint, request, jsonify
from ..models.clientModel import Client
from ..utils import get_coordinates
from .. import db
from flask_jwt_extended import jwt_required

client_bp = Blueprint('client_bp', __name__, url_prefix='/api/clients')

@client_bp.route('/', methods=['GET', 'POST'])
@jwt_required()
def manage_clients():
    if request.method == 'GET':
        clients = Client.query.all()
        return jsonify([client.to_dict() for client in clients]), 200
    elif request.method == 'POST':
        data = request.get_json()
        if not all(key in data for key in ['name', 'contact_details', 'address', 'total_panels', 'charges']):
            return jsonify({'error': 'Bad Request', 'message': 'Missing required fields'}), 400
        
        latitude, longitude = get_coordinates(data['address'])
        if latitude is None or longitude is None:
            return jsonify({'error': 'Invalid address'}), 400

        new_client = Client(
            name=data['name'],
            contact_details=data['contact_details'],
            address=data['address'],
            latitude=latitude,
            longitude=longitude,
            total_panels=data['total_panels'],
            charges=data['charges']
        )
        db.session.add(new_client)
        db.session.commit()
        return jsonify(new_client.to_dict()), 201

@client_bp.route('/<int:client_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def handle_client(client_id):
    client = Client.query.get_or_404(client_id)

    if request.method == 'GET':
        return jsonify(client.to_dict()), 200
    elif request.method == 'PUT':
        data = request.get_json()
        if 'name' in data:
            client.name = data['name']
        if 'contact_details' in data:
            client.contact_details = data['contact_details']
        if 'address' in data:
            client.address = data['address']
            latitude, longitude = get_coordinates(data['address'])
            if latitude is None or longitude is None:
                return jsonify({'error': 'Invalid address'}), 400
            client.latitude = latitude
            client.longitude = longitude
        if 'total_panels' in data:
            client.total_panels = data['total_panels']
        if 'charges' in data:
            client.charges = data['charges']
        db.session.commit()
        return jsonify(client.to_dict()), 200
    elif request.method == 'DELETE':
        db.session.delete(client)
        db.session.commit()
        return jsonify({'message': 'Client deleted successfully'}), 200
