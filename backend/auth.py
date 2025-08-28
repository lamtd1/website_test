from flask_restx import Resource, Namespace,fields
from models import User
from flask import  request, jsonify, make_response
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    set_refresh_cookies,
    unset_jwt_cookies,
)
from werkzeug.security import generate_password_hash, check_password_hash
from exts import db
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

        db_user = db.session.query(User).filter(User.username==username).first()

        if db_user is not None:
            return jsonify({"message": f"User with username {username} is already exists"})

        new_user = User(
            username=data.get('username'),
            email = data.get('email'),
            password = generate_password_hash(data.get('password'))
        )


        new_user.save()

        return make_response({"message" : "User created successful"}, 201)

@auth_ns.route('/login')
class Login(Resource):

    @auth_ns.expect(login_model)
    def post(self):
        data=request.get_json()

        username = data.get('username')
        password = data.get('password')

        db_user = db.session.query(User).filter(User.username == username).first()

        if db_user and check_password_hash(db_user.password, password):
            # Issue access token (client stores in memory) and refresh token (HttpOnly cookie)
            access_token = create_access_token(identity=db_user.username)
            refresh_token = create_refresh_token(identity=db_user.username)

            resp = make_response(jsonify({"access_token": access_token}), 200)
            # Store refresh token in HttpOnly cookie
            set_refresh_cookies(resp, refresh_token)
            return resp
        return make_response(jsonify({"message": "Invalid credentials"}), 401)
    
@auth_ns.route('/refresh')
class RefreshResource(Resource):
    @jwt_required(refresh=True, locations=["cookies"])
    def post(self):
        # Uses refresh token from HttpOnly cookie
        current_user = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user)
        return make_response(jsonify({"access_token": new_access_token}), 200)

@auth_ns.route('/logout')
class LogoutResource(Resource):
    def post(self):
        # Clear JWT cookies (refresh cookie)
        resp = make_response(jsonify({"message": "Logged out"}), 200)
        unset_jwt_cookies(resp)
        return resp