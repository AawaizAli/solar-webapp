# app/models/bookingModel.py
from .. import db
from datetime import datetime


def get_time_slot_str(index):
    slots = {
        0: "09:00-11:00",
        1: "11:00-13:00",
        2: "13:00-15:00",
        3: "15:00-17:00",
        4: "17:00-19:00"
    }
    return slots.get(index, "Invalid time slot")

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)
    worker_id = db.Column(db.Integer, db.ForeignKey('worker.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time_slot = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), nullable=False)
    recurrence = db.Column(db.String(20), nullable=True)  # New field for recurre
    recurrence_period = db.Column(db.Integer, nullable=True)

    client = db.relationship('Client', backref=db.backref('bookings', lazy=True))
    worker = db.relationship('Worker', backref=db.backref('bookings', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'client_id': self.client_id,
            'worker_id': self.worker_id,
            'date': self.date.strftime('%Y-%m-%d'),
            'time_slot': self.time_slot,
            'status': self.status,
            'client': self.client.to_dict(),
            'worker': self.worker.to_dict(),
            'recurrence': self.recurrence,
            'recurrence_period': self.recurrence_period
        }
