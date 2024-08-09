# app/routes/client.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ..models.clientModel import Client
from ..models.bookingModel import Booking
from .. import db
from datetime import datetime
from ..utils import get_coordinates  # Import the get_coordinates function

client_bp = Blueprint('client_bp', __name__, url_prefix='/api/clients')

@client_bp.route('/add-client', methods=['POST'])
@jwt_required()
def add_client():
    data = request.get_json()
    if not all(key in data for key in ['name', 'contact_details', 'address', 'total_panels', 'charge_per_clean', 'area']):
        return jsonify({'error': 'Bad Request', 'message': 'Missing required fields'}), 400

    new_client = Client(
        name=data['name'],
        contact_details=data['contact_details'],
        address=data['address'],
        latitude=data['latitude'],
        longitude=data['longitude'],
        total_panels=data['total_panels'],
        charge_per_clean=data['charge_per_clean'],  # Updated field
        area=data['area']
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

    # Find all bookings related to this client
    related_bookings = Booking.query.filter_by(client_id=client_id).all()

    # Delete related bookings before deleting the client
    for booking in related_bookings:
        db.session.delete(booking)

    db.session.delete(client)
    try:
        db.session.commit()
    except Exception as e:
        print(f"Error committing to the database: {e}")
        return jsonify({'error': 'Internal Server Error', 'message': 'An error occurred while deleting the client'}), 500

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
    client.area = data.get('area', client.area)  # Update area field

    # Update latitude and longitude if provided
    client.latitude = data.get('latitude', client.latitude)
    client.longitude = data.get('longitude', client.longitude)

    client.total_panels = data.get('total_panels', client.total_panels)
    client.charge_per_clean = data.get('charge_per_clean', client.charge_per_clean)  # Updated field

    db.session.commit()
    return jsonify(client.to_dict()), 200
