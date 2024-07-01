from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager
from flask_migrate import Migrate
from app.config.config import Config

db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)  # Enable CORS

    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)

    from app.models import bookingModel, workerModel, userModel

    @login_manager.user_loader
    def load_user(user_id):
        return userModel.User.query.get(int(user_id))

    with app.app_context():
        db.create_all()

    from app.routes.bookingRoute import booking_bp
    from app.routes.workerRoute import worker_bp
    from app.routes.authRoute import auth_bp
    from app.routes.availabilityRoute import availability_bp
    
    app.register_blueprint(booking_bp)
    app.register_blueprint(worker_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(availability_bp)

    return app
