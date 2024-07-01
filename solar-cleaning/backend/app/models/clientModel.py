# app/models/client.py
from .. import db

class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contact = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    number_of_panels = db.Column(db.Integer, nullable=False)
    charges = db.Column(db.Float, nullable=False)

# Similar structure for worker.py, booking.py, expense.py
