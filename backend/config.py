from decouple import config
import os
from datetime import timedelta

BASE_DIR = os.path.dirname(os.path.realpath(__file__))
class Config:
    SECRET_KEY = config('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = config('SQLALCHEMY_TRACK_MODIFICATIONS', cast=bool)
    # JWT configuration
    JWT_SECRET_KEY = config('JWT_SECRET_KEY', default=SECRET_KEY)
    JWT_TOKEN_LOCATION = ["headers", "cookies"]  # Access in headers, refresh in cookies
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=int(config('JWT_ACCESS_TOKEN_MINUTES', default=15)))
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=int(config('JWT_REFRESH_TOKEN_DAYS', default=7)))
    # Cookie settings (adjust for production: Secure=True, SameSite='None' behind HTTPS)
    JWT_COOKIE_SECURE = config('JWT_COOKIE_SECURE', cast=bool, default=False)
    JWT_COOKIE_SAMESITE = config('JWT_COOKIE_SAMESITE', default='Lax')
    JWT_COOKIE_CSRF_PROTECT = config('JWT_COOKIE_CSRF_PROTECT', cast=bool, default=False)


class DevConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///'+os.path.join(BASE_DIR, 'dev.db')
    DEBUG=True
    SQLALCHEMY_ECHO=True


class ProdConfig(Config):
    pass

class TestConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///test.db'
    SQLALCHEMY_ECHO=False
    TESTING=True