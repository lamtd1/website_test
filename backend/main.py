from flask import Flask
from flask_restx import Api
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from config import DevConfig
from models import Recipe, User
from exts import db

from recipes import recipe_ns
from auth import auth_ns


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)

    # Allow frontend dev server to send/receive cookies
    CORS(
        app,
        resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}},
        supports_credentials=True,
    )

    db.init_app(app)

    migrate=Migrate(app, db)
    JWTManager(app)

    api = Api(app, doc='/docs')
    api.add_namespace(recipe_ns)
    api.add_namespace(auth_ns)

    @app.shell_context_processor
    def make_shell_context():
        return {
            "db": db,
            "Recipe": Recipe,
            "User": User,
        }
    return app
