from flask_restx import Resource, Namespace,fields
from models import User
from flask import  request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required

from werkzeug.security import generate_password_hash, check_password_hash

auth_ns=Namespace('auth', description="A namespace for out Authentication")


sign_up_model = auth_ns.model(
    "SignUp",
    {
        'username': fields.String(),
        "email": fields.String(),
        "password": fields.String()
    }
)

login_model = auth_ns.model(
    "Login",
    {
        "username": fields.String(),
        "password": fields.String()
    }
)

@auth_ns.route('/signup')
class SignUp(Resource):
    # @auth_ns.marshal_with(sign_up_model)
    @auth_ns.expect(sign_up_model)
    def post(self):
        data=request.get_json()

        username = data.get('username')

        db_user = User.query.filter(User.username==username).first()

        if db_user is not None:
            return jsonify({"message": f"User with username {username} is already exists"})

        new_user = User(
            username=data.get('username'),
            email = data.get('email'),
            password = generate_password_hash(data.get('password'))
        )


        new_user.save()

        return jsonify({"message" : "User created successful"})

@auth_ns.route('/login')
class Login(Resource):

    @auth_ns.expect(login_model)
    def post(self):
        data=request.get_json()

        username = data.get('username')
        password = data.get('password')

        db_user = User.query.filter(User.username == username).first()

        if db_user and check_password_hash(db_user.password, password):
            access_token = create_access_token(identity=db_user.username)
            refresh_token = create_refresh_token(identity=db_user.username)

            return jsonify(
                {"access_token": access_token,
                 "refresh_token": refresh_token
                 }

            )
