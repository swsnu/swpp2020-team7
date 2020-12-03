"""utils for aws s3"""
from datetime import datetime
from django.utils import timezone
import os
import boto3

from settings.env import S3_URL, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_STORAGE_BUCKET_NAME, AWS_S3_REGION_NAME


session = boto3.Session(
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_S3_REGION_NAME
)
s3 = session.resource('s3')
s3_bucket = s3.Bucket(AWS_STORAGE_BUCKET_NAME)


def get_filename_format(prefix, fid, user_id, file_idx, fname):
    """
    return file path for aws s3 storage
    prefix: recipe or article
    fid(feed_id): recipe_id or article_id
    user_id: id of the author
    file_idx: index of current file in the files to upload
    fname: given input file name
    """
    current_time = datetime.now().strftime("%Y%m%d-%H%M%S-%f")
    current_time_aware = timezone.make_aware(current_time)
    return "{}/{}/{}-{}-{}{}".format(prefix, fid, user_id, current_time_aware, file_idx, os.path.splitext(fname)[1])


def upload_images(files, prefix, feed_id, user_id):
    """
    upload images to aws s3 storage
    files: image files (request.FILES.getlist('image'))
    prefix: recipe or article
    feed_id: recipe_id or article_id
    user_id: user_id
    returns list of s3 path for each uploaded image
    """
    images_path = []
    for idx, img in enumerate(files):
        file_path = get_filename_format(
            prefix, feed_id, user_id, idx, img.name)
        s3_bucket.put_object(
            Key=file_path,
            Body=img.read(),
        )
        images_path.append(S3_URL + file_path)
    return images_path
