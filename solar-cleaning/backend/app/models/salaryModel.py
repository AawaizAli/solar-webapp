# app/models/salaryModel.py
from .. import db
from datetime import datetime

class Salary(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    worker_id = db.Column(db.Integer, db.ForeignKey('worker.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    day = db.Column(db.String(20), nullable=False)
    advance = db.Column(db.Float, nullable=False)
    incentive = db.Column(db.Float, nullable=False)

    worker = db.relationship('Worker', backref=db.backref('salaries', lazy=True))

    def to_dict(self):
        return {
            'date': self.date.strftime('%Y-%m-%d'),
            'day': self.day,
            'advance': self.advance,
            'incentive': self.incentive,
            'worker': self.worker.to_dict()
        }
