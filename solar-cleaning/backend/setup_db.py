from app import create_app, db
from app.models.bookingModel import Booking
from app.models.workerModel import Worker

app = create_app()

with app.app_context():
    db.create_all()
    print("Database tables created successfully.")
