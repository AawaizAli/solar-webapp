# app/models/booking.py
from .. import db

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)
    worker_id = db.Column(db.Integer, db.ForeignKey('worker.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time_slot = db.Column(db.String(20), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(20), nullable=False)

    client = db.relationship('Client', backref=db.backref('bookings', lazy=True))
    worker = db.relationship('Worker', backref=db.backref('bookings', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'client_id': self.client_id,
            'worker_id': self.worker_id,
            'date': self.date,
            'time_slot': self.time_slot,
            'location': self.location,
            'status': self.status,
            'client': self.client.to_dict(),
            'worker': self.worker.to_dict()
        }
