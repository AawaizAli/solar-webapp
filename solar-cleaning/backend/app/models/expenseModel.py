# app/models/expenseModel.py
from .. import db
from datetime import datetime

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    description = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            'date': self.date.strftime('%Y-%m-%d'),
            'description': self.description,
            'amount': self.amount
        }
