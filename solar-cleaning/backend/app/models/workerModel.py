# app/models/workerModel.py
from .. import db

class Worker(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    area = db.Column(db.String(200), nullable=True) 
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    availability = db.Column(db.JSON, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'area': self.area,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'availability': self.availability
        }
