# app/models/dailyAccountModel.py
from .. import db
from datetime import datetime

class DailyAccount(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    day = db.Column(db.String(20), nullable=False)
    total_earnings_petrol = db.Column(db.Float, nullable=False)
    daily_total_wage = db.Column(db.Float, nullable=False)
    tj_earnings_per_day = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            'date': self.date.strftime('%Y-%m-%d'),
            'day': self.day,
            'total_earnings_petrol': self.total_earnings_petrol,
            'daily_total_wage': self.daily_total_wage,
            'tj_earnings_per_day': self.tj_earnings_per_day
        }
