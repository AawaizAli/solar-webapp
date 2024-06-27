from .. import db
from datetime import datetime, timedelta

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    contact = db.Column(db.String(120), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    panels = db.Column(db.Integer, nullable=False)
    charges = db.Column(db.Float, nullable=False)
    booking_date = db.Column(db.Date, nullable=False)
    interval = db.Column(db.String(20), nullable=False)
    next_booking_date = db.Column(db.Date, nullable=False)

    def __init__(self, name, contact, address, panels, charges, booking_date, interval):
        self.name = name
        self.contact = contact
        self.address = address
        self.panels = panels
        self.charges = charges
        self.booking_date = booking_date
        self.interval = interval
        self.next_booking_date = booking_date + timedelta(days=int(interval))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'contact': self.contact,
            'address': self.address,
            'panels': self.panels,
            'charges': self.charges,
            'booking_date': self.booking_date.strftime('%Y-%m-%d'),
            'interval': self.interval,
            'next_booking_date': self.next_booking_date.strftime('%Y-%m-%d')
        }
