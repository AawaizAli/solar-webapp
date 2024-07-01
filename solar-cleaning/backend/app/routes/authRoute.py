from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.userModel import User
from app import db

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        return jsonify({'message': 'Login successful', 'access_token': access_token}), 200

    return jsonify({'message': 'Invalid credentials'}), 401

@auth_bp.route('/api/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200
