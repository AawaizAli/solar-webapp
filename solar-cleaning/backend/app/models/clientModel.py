# app/models/clientModel.py
from .. import db
from datetime import datetime

class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contact_details = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    total_panels = db.Column(db.Integer, nullable=False)
    charge_per_clean = db.Column(db.Float, nullable=False)  # Updated field
    subscription_plan = db.Column(db.Integer, nullable=True)   # New field for subscription plan
    subscription_start = db.Column(db.Date, nullable=True)  # New field for subscription start date
    subscription_end = db.Column(db.Date, nullable=True)
    area = db.Column(db.String(100), nullable=True)  # New field for subscription end date

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'contact_details': self.contact_details,
            'address': self.address,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'total_panels': self.total_panels,
            'charge_per_clean': self.charge_per_clean,  # Updated field
            'subscription_plan': self.subscription_plan,
            'subscription_start': self.subscription_start.strftime('%Y-%m-%d') if self.subscription_start else None,
            'subscription_end': self.subscription_end.strftime('%Y-%m-%d') if self.subscription_end else None,
            'area': self.area,
        }
