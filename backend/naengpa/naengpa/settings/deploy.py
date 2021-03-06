# pylint: skip-file
from .base import *


WSGI_APPLICATION = 'naengpa.wsgi.deploy.application'

DEBUG = False

AWS_EC2_ELASTIC_IP = get_env_value('AWS_EC2_ELASTIC_IP')
AWS_EC2_DNS_HOST_NAME = get_env_value('AWS_EC2_DNS_HOST_NAME')
ALLOWED_HOSTS = ['127.0.0.1', 'localhost',
                 AWS_EC2_ELASTIC_IP, AWS_EC2_DNS_HOST_NAME]

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTOCOL', 'https')

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/home/ubuntu/logs/django.log',
        },
    },
    'loggers': {
        'django.request': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}
