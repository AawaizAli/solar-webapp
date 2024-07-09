# app/models/clientModel.py
from .. import db

class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contact_details = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    total_panels = db.Column(db.Integer, nullable=False)
    charges = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'contact_details': self.contact_details,
            'address': self.address,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'total_panels': self.total_panels,
            'charges': self.charges
        }
