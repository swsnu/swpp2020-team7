# pylint: skip-file
from .base import *


WSGI_APPLICATION = 'naengpa.wsgi.debug.application'

# Channels
ASGI_APPLICATION = 'naengpa.routing.application'
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
        },
    },
}

DEBUG = True

ALLOWED_HOSTS = ['127.0.0.1', 'localhost']
