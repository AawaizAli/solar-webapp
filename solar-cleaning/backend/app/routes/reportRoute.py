# app/routes/report.py
from flask import Blueprint, jsonify
from app.models.bookingModel import Booking
from app.models.clientModel import Client
from app.models.workerModel import Worker
from app.models.scheduleModel import Schedule
from app.models.dailyAccountModel import DailyAccount
from app.models.expenseModel import Expense
from app.models.salaryModel import Salary

report_bp = Blueprint('report_bp', __name__, url_prefix='/api/reports')

@report_bp.route('/get-all-reports', methods=['GET'])
def get_reports():
    # Existing report data
    bookings = Booking.query.all()
    booking_data = [booking.to_dict() for booking in bookings]

    clients = Client.query.all()
    client_data = [client.to_dict() for client in clients]

    workers = Worker.query.all()
    worker_data = [worker.to_dict() for worker in workers]

    # Schedule data
    schedules = Schedule.query.all()
    schedule_data = [schedule.to_dict() for schedule in schedules]

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
        'schedules': schedule_data,
        'daily_accounts': daily_account_data,
        'expenses': expense_data,
        'salaries': salary_data
    })
