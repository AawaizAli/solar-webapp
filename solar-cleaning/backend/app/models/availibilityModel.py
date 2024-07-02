from .. import db

class Availability(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    worker_id = db.Column(db.Integer, db.ForeignKey('worker.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time_slot = db.Column(db.String(20), nullable=False)
    is_available = db.Column(db.Boolean, default=True)

    worker = db.relationship('Worker', backref=db.backref('availabilities', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'worker_id': self.worker_id,
            'date': self.date.strftime('%Y-%m-%d'),
            'time_slot': self.time_slot,
            'is_available': self.is_available
        }
