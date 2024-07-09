# app/routes/client.py
from flask import Blueprint, request, jsonify
from ..models.clientModel import Client
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
        if not all(key in data for key in ['name', 'contact', 'address', 'number_of_panels', 'charges']):
            return jsonify({'error': 'Bad Request', 'message': 'Missing required fields'}), 400
        new_client = Client(
            name=data['name'],
            contact=data['contact'],
            address=data['address'],
            number_of_panels=data['number_of_panels'],
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
        if not all(key in data for key in ['name', 'contact', 'address', 'number_of_panels', 'charges']):
            return jsonify({'error': 'Bad Request', 'message': 'Missing required fields'}), 400
        client.name = data['name']
        client.contact = data['contact']
        client.address = data['address']
        client.number_of_panels = data['number_of_panels']
        client.charges = data['charges']
        db.session.commit()
        return jsonify(client.to_dict()), 200
    elif request.method == 'DELETE':
        db.session.delete(client)
        db.session.commit()
        return jsonify({'message': 'Client deleted successfully'}), 200
