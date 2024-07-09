# app/routes/report.py
from flask import Blueprint, request, jsonify
from ..models.bookingModel import Booking
from flask_jwt_extended import jwt_required
from ..models.clientModel import Client
from ..models.workerModel import Worker
from .. import db
from datetime import datetime

report_bp = Blueprint('report_bp', __name__, url_prefix='/api/reports')

@report_bp.route('/daily-summary', methods=['GET'])
@jwt_required()
def daily_summary():
    date_str = request.args.get('date')
    if not date_str:
        return jsonify({'error': 'Bad Request', 'message': 'Date is required'}), 400

    try:
        date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Bad Request', 'message': 'Invalid date format. Use YYYY-MM-DD.'}), 400

    bookings = Booking.query.filter_by(date=date_obj).all()
    total_earnings = sum(booking.client.charges for booking in bookings)
    total_expenses = 0  # This would be dynamically calculated based on your expense logic
    net_profit = total_earnings - total_expenses

    summary = {
        'date': date_str,
        'total_bookings': len(bookings),
        'total_earnings': total_earnings,
        'total_expenses': total_expenses,
        'net_profit': net_profit,
        'bookings': [booking.to_dict() for booking in bookings]
    }

    return jsonify(summary), 200

@report_bp.route('/monthly-summary', methods=['GET'])
@jwt_required()
def monthly_summary():
    month_str = request.args.get('month')
    if not month_str:
        return jsonify({'error': 'Bad Request', 'message': 'Month is required'}), 400

    try:
        month_obj = datetime.strptime(month_str, '%Y-%m').date()
    except ValueError:
        return jsonify({'error': 'Bad Request', 'message': 'Invalid month format. Use YYYY-MM.'}), 400

    bookings = Booking.query.filter(db.extract('year', Booking.date) == month_obj.year,
                                    db.extract('month', Booking.date) == month_obj.month).all()
    total_earnings = sum(booking.client.charges for booking in bookings)
    total_expenses = 0  # This would be dynamically calculated based on your expense logic
    net_profit = total_earnings - total_expenses

    summary = {
        'month': month_str,
        'total_bookings': len(bookings),
        'total_earnings': total_earnings,
        'total_expenses': total_expenses,
        'net_profit': net_profit,
        'bookings': [booking.to_dict() for booking in bookings]
    }

    return jsonify(summary), 200
