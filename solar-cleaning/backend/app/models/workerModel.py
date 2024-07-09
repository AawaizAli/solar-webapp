# app/models/workerModel.py
from .. import db

class Worker(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    base_location = db.Column(db.String(200), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    availability = db.Column(db.JSON, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'base_location': self.base_location,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'availability': self.availability
        }
