# app/models/scheduleModel.py
from .. import db
from datetime import datetime

class Schedule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    day = db.Column(db.String(20), nullable=False)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)
    pv = db.Column(db.Integer, nullable=False)
    payment = db.Column(db.Float, nullable=False)
    worker_id = db.Column(db.Integer, db.ForeignKey('worker.id'), nullable=False)
    time = db.Column(db.String(20), nullable=False)

    client = db.relationship('Client', backref=db.backref('schedules', lazy=True))
    worker = db.relationship('Worker', backref=db.backref('schedules', lazy=True))

    def to_dict(self):
        return {
            'date': self.date.strftime('%Y-%m-%d'),
            'day': self.day,
            'client': self.client.to_dict(),
            'pv': self.pv,
            'payment': self.payment,
            'worker': self.worker.to_dict(),
            'time': self.time
        }
