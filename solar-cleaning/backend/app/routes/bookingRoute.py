from flask import Blueprint, request, jsonify
from ..models.booking import Booking
from .. import db
from datetime import datetime

bp = Blueprint('booking', __name__)

@bp.route('/api/bookings', methods=['GET', 'POST'])
def manage_bookings():
    if request.method == 'GET':
        bookings = Booking.query.all()
        return jsonify([booking.to_dict() for booking in bookings]), 200
    elif request.method == 'POST':
        data = request.get_json()
        new_booking = Booking(
            name=data['name'],
            contact=data['contact'],
            address=data['address'],
            panels=data['panels'],
            charges=data['charges'],
            booking_date=datetime.strptime(data['booking_date'], '%Y-%m-%d'),
            interval=data['interval']
        )
        db.session.add(new_booking)
        db.session.commit()
        return jsonify(new_booking.to_dict()), 201
