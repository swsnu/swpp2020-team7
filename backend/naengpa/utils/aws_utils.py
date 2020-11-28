"""utils for aws s3"""
from datetime import datetime
import os
import boto3

from naengpa.settings import S3_URL, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_STORAGE_BUCKET_NAME, AWS_S3_REGION_NAME


session = boto3.Session(
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_S3_REGION_NAME
)
s3 = session.resource('s3')
s3_bucket = s3.Bucket(AWS_STORAGE_BUCKET_NAME)


def get_filename_format(prefix, fid, user_id, fname):
    """
    return file path for aws s3 storage
    prefix: recipe or article
    fid(feed_id): recipe_id or article_id
    user_id: id of the author
    fname: given input file name
    """
    return "{}/{}/{}-{}.{}".format(prefix, fid, user_id, datetime.now(), os.path.splitext(fname)[1])


def upload_images(files, prefix, feed_id, user_id):
    images_path = []
    for file in files:
        file_path = get_filename_format(prefix, feed_id, user_id, file.name)
        s3_bucket.put_object(
            Key=file_path,
            Body=file,
        )
        images_path.append(S3_URL + file_path)
    return images_path
