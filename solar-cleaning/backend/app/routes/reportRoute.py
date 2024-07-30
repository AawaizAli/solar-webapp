# app/routes/report.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app.models.bookingModel import Booking
from app.models.clientModel import Client
from app.models.workerModel import Worker
from app.models.dailyAccountModel import DailyAccount
from app.models.expenseModel import Expense
from app.models.salaryModel import Salary
from .. import db
from datetime import datetime

report_bp = Blueprint('report_bp', __name__, url_prefix='/api/reports')

@report_bp.route('/get-all-reports', methods=['GET'])
@jwt_required()
def get_reports():
    # Existing report data
    bookings = Booking.query.all()
    booking_data = [booking.to_dict() for booking in bookings]

    clients = Client.query.all()
    client_data = [client.to_dict() for client in clients]

    workers = Worker.query.all()
    worker_data = [worker.to_dict() for worker in workers]

    # Daily account data
    daily_accounts = DailyAccount.query.all()
    daily_account_data = [account.to_dict() for account in daily_accounts]

    # Expenses data
    expenses = Expense.query.all()
    expense_data = [expense.to_dict() for expense in expenses]

    # Salary data
    salary_data = {}
    for worker in workers:
        salary_details = Salary.query.filter_by(worker_id=worker.id).all()
        salary_data[worker.name] = [detail.to_dict() for detail in salary_details]

    return jsonify({
        'bookings': booking_data,
        'clients': client_data,
        'workers': worker_data,
        'daily_accounts': daily_account_data,
        'expenses': expense_data,
        'salaries': salary_data
    })

@report_bp.route('/update-report', methods=['POST'])
@jwt_required()
def update_report():
    data = request.get_json()
    report_type = data.get('type')
    items = data.get('items')

    def parse_date(date_str):
        return datetime.strptime(date_str, '%Y-%m-%d').date()

    if report_type == 'bookings':
        Booking.query.delete()
        for item in items:
            new_booking = Booking(
                client_id=item[0],  # Assuming first element is client_id
                worker_id=item[1],  # Assuming second element is worker_id
                date=parse_date(item[2]),       # Assuming third element is date
                time_slot=item[3],  # Assuming fourth element is time_slot
                status=item[4],     # Assuming fifth element is status
                recurrence=item[5] if len(item) > 5 else None  # Assuming sixth element if available is recurrence
            )
            db.session.add(new_booking)
    elif report_type == 'salary':
        Salary.query.delete()
        for item in items:
            new_salary = Salary(
                worker_id=item[0],  # Assuming first element is worker_id
                date=parse_date(item[1]),       # Assuming second element is date
                day=item[2],        # Assuming third element is day
                advance=item[3],    # Assuming fourth element is advance
                incentive=item[4]   # Assuming fifth element is incentive
            )
            db.session.add(new_salary)
    elif report_type == 'expenses':
        Expense.query.delete()
        for item in items:
            print(f"Processing item: {item}")
            new_expense = Expense(
                date=parse_date(item[0]['value']),  # Assuming first element is date
                description=item[1]['value'],  # Assuming second element is description
                amount=float(item[2]['value'])  # Assuming third element is amount
            )
            db.session.add(new_expense)
    elif report_type == 'dailyAccount':
        DailyAccount.query.delete()
        for item in items:
            new_account = DailyAccount(
                date=parse_date(item[0]),               # Assuming first element is date
                day=item[1],                # Assuming second element is day
                total_earnings=item[2],     # Assuming third element is total_earnings
                petrol_expense=item[3],     # Assuming fourth element is petrol_expense
                total_daily_wage=item[4],   # Assuming fifth element is total_daily_wage
                tj_earnings_per_day=item[5] # Assuming sixth element is tj_earnings_per_day
            )
            db.session.add(new_account)

    db.session.commit()
    return jsonify({'message': 'Report updated successfully'}), 200

@report_bp.route('/delete-report', methods=['DELETE'])
@jwt_required()
def delete_report():
    data = request.get_json()
    report_type = data.get('type')

    if report_type == 'bookings':
        Booking.query.delete()
    elif report_type == 'salary':
        Salary.query.delete()
    elif report_type == 'expenses':
        Expense.query.delete()
    elif report_type == 'dailyAccount':
        DailyAccount.query.delete()

    db.session.commit()
    return jsonify({'message': 'Report deleted successfully'}), 200
