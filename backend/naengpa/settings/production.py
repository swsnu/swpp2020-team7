# pylint: skip-file
from .base import *


DEBUG = False

AWS_EC2_ELASTIC_IP = get_env_value('AWS_EC2_ELASTIC_IP')
AWS_EC2_DNS_HOST_NAME = get_env_value('AWS_EC2_DNS_HOST_NAME')
ALLOWED_HOSTS = [AWS_EC2_ELASTIC_IP, AWS_EC2_DNS_HOST_NAME]
