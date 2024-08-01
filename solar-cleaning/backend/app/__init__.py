# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from app.config.config import Config
import datetime  # Import the datetime module

db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=7)

    CORS(app, resources={r"/*": {"origins": "*"}})
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    jwt.init_app(app) 

    # Import models to ensure they are registered
    from app.models import bookingModel, workerModel, userModel, clientModel

    @login_manager.user_loader
    def load_user(user_id):
        return userModel.User.query.get(int(user_id))

    from app.routes.bookingRoute import booking_bp
    from app.routes.workerRoute import worker_bp
    from app.routes.authRoute import auth_bp
    from app.routes.clientRoute import client_bp
    from app.routes.reportRoute import report_bp

    
    app.register_blueprint(booking_bp)
    app.register_blueprint(worker_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(client_bp)
    app.register_blueprint(report_bp)
    

    return app
