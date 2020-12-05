
import os
from dotenv import load_dotenv
from django.core.exceptions import ImproperlyConfigured

load_dotenv()


def get_env_value(var_name):
    """help function for os.getenv to handle KeyError"""
    try:
        return os.getenv(var_name)
    except KeyError:
        error_msg = 'Set the {} environment variable'.format(var_name)
        raise ImproperlyConfigured(error_msg) from None


# AWS S3 BUCKET
S3_URL = get_env_value("S3_URL")
DEFAULT_FILE_STORAGE = get_env_value("DEFAULT_FILE_STORAGE")
AWS_ACCESS_KEY_ID = get_env_value("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = get_env_value("AWS_SECRET_ACCESS_KEY")
AWS_STORAGE_BUCKET_NAME = get_env_value("AWS_STORAGE_BUCKET_NAME")
AWS_S3_REGION_NAME = get_env_value("AWS_S3_REGION_NAME")
AWS_S3_FILE_OVERWRITE = get_env_value("AWS_S3_REGION_NAME")

# Kakao REST Api key
APP_REST_API_KEY = get_env_value("APP_REST_API_KEY")

# Logmeal ML Api
LOGMEAL_TOKEN = get_env_value("LOGMEAL_TOKEN")
