# pylint: skip-file
from .base import *


WSGI_APPLICATION = 'naengpa.wsgi.debug.application'

DEBUG = True

ALLOWED_HOSTS = ['127.0.0.1', 'localhost']
