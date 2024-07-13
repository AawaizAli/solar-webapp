# app/routes/client.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ..models.clientModel import Client
from .. import db
from datetime import datetime
from ..utils import get_coordinates  # Import the get_coordinates function

client_bp = Blueprint('client_bp', __name__, url_prefix='/api/clients')

@client_bp.route('/add-client', methods=['POST'])
@jwt_required()
def add_client():
    data = request.get_json()
    if not all(key in data for key in ['name', 'contact_details', 'address', 'total_panels', 'charge_per_clean']):
        return jsonify({'error': 'Bad Request', 'message': 'Missing required fields'}), 400

    # Get coordinates from address
    coordinates = get_coordinates(data['address'])
    if not coordinates:
        return jsonify({'error': 'Bad Request', 'message': 'Invalid address'}), 400

    latitude, longitude = coordinates

    subscription_start = datetime.strptime(data['subscription_start'], '%Y-%m-%d').date() if 'subscription_start' in data else None
    subscription_end = datetime.strptime(data['subscription_end'], '%Y-%m-%d').date() if 'subscription_end' in data else None
    
    new_client = Client(
        name=data['name'],
        contact_details=data['contact_details'],
        address=data['address'],
        latitude=latitude,
        longitude=longitude,
        total_panels=data['total_panels'],
        charge_per_clean=data['charge_per_clean'],  # Updated field
        subscription_plan=int(data['subscription_plan']) if 'subscription_plan' in data else None,
        subscription_start=subscription_start,
        subscription_end=subscription_end
    )
    db.session.add(new_client)
    db.session.commit()
    return jsonify(new_client.to_dict()), 201
    
@client_bp.route('/get-all-clients', methods=['GET'])
@jwt_required()
def get_all_clients():
        clients = Client.query.all()
        return jsonify([client.to_dict() for client in clients]), 200


@client_bp.route('/delete-client/<int:client_id>', methods=['DELETE'])
@jwt_required()
def delete_client(client_id):
    client = Client.query.get_or_404(client_id)
    db.session.delete(client)
    db.session.commit()
    return jsonify({'message': 'Client deleted successfully'}), 200

@client_bp.route('/get-client-by-id/<int:client_id>', methods=['GET'])
@jwt_required()
def get_client(client_id):
    client = Client.query.get_or_404(client_id)
    return jsonify(client.to_dict()), 200

@client_bp.route('/update-client/<int:client_id>', methods=['PUT'])
@jwt_required()
def update_client(client_id):
    client = Client.query.get_or_404(client_id)
    data = request.get_json()
    client.name = data.get('name', client.name)
    client.contact_details = data.get('contact', client.contact_details)
    client.address = data.get('address', client.address)

    # Get coordinates from address if address is updated
    if 'address' in data:
        coordinates = get_coordinates(data['address'])
        if not coordinates:
            return jsonify({'error': 'Bad Request', 'message': 'Invalid address'}), 400
        client.latitude, client.longitude = coordinates

    client.total_panels = data.get('total_panels', client.total_panels)
    client.charge_per_clean = data.get('charge_per_clean', client.charge_per_clean)  # Updated field
    client.subscription_plan = data.get('subscription_plan', client.subscription_plan)
    client.subscription_start = datetime.strptime(data['subscription_start'], '%Y-%m-%d').date() if 'subscription_start' in data else client.subscription_start
    client.subscription_end = datetime.strptime(data['subscription_end'], '%Y-%m-%d').date() if 'subscription_end' in data else client.subscription_end
    db.session.commit()
    return jsonify(client.to_dict()), 200



