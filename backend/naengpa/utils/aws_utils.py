"""utils for aws s3"""
import os
import boto3
import requests
from PIL import Image
from io import BytesIO
from datetime import datetime
from django.utils import timezone
from naengpa.settings.env import S3_URL, AWS_S3_ACCESS_KEY_ID, AWS_S3_SECRET_ACCESS_KEY, AWS_STORAGE_BUCKET_NAME, AWS_S3_REGION_NAME


session = boto3.Session(
    aws_access_key_id=AWS_S3_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_S3_SECRET_ACCESS_KEY,
    region_name=AWS_S3_REGION_NAME
)
s3 = session.resource('s3')
s3_bucket = s3.Bucket(AWS_STORAGE_BUCKET_NAME)


class S3ImagesInvalidExtension(Exception):
    pass


def get_safe_ext(key):
    ext = os.path.splitext(key)[-1].strip('.').upper()
    if ext in ['JPG', 'JPEG']:
        return 'jpeg'
    elif ext in ['PNG']:
        return 'png'
    else:
        raise S3ImagesInvalidExtension('Extension is invalid')


def get_filename_format(prefix, fid, file_idx, fname):
    """
    return file path for aws s3 storage
    prefix: recipe or article
    fid(feed_id): recipe_id or article_id
    file_idx: index of current file in the files to upload
    fname: given input file name
    """
    current_time = timezone.now().strftime("%Y%m%d-%H%M%S-%f")
    return "{}/{}/{}-{}.{}".format(prefix, fid, current_time, file_idx, get_safe_ext(fname))


def upload_images(files, prefix, feed_id):
    """
    upload images to aws s3 storage
    files: image files (request.FILES.getlist('image'))
    prefix: recipe or article
    feed_id: recipe_id or article_id
    returns list of s3 path for each uploaded image
    """
    images_path = []
    for idx, img in enumerate(files):
        file_path = get_filename_format(
            prefix, feed_id, idx, img.name)
        s3_bucket.put_object(
            Key=file_path,
            Body=img.read(),
        )
        images_path.append(S3_URL + file_path)
    return images_path


def upload_images_with_local_path(paths, prefix, feed_id):
    """
    upload images to aws s3 storage
    paths: local path to image files (string[])
    prefix: recipe or article
    feed_id: recipe_id or article_id
    returns list of s3 path for each uploaded image
    """
    images_path = []
    for idx, path in enumerate(paths):
        file_path = get_filename_format(
            prefix, feed_id, idx, path)
        s3_bucket.put_object(
            Key=file_path,
            Body=open(path, 'rb').read(),
        )
        images_path.append(S3_URL + file_path)
    return images_path


def upload_profile_image(file, user_id):
    """
    upload a single profile image to aws s3 storage
    file: image file (request.FILES.getlist('image')[0])
    user_id: user_id
    returns list of s3 path for uploaded image
    """
    file_path = "profile/{}/profile_image{}".format(
        user_id, get_safe_ext(file.name))
    s3_bucket.put_object(
        Key=file_path,
        Body=file.read(),
    )
    s3_path = S3_URL + file_path
    return s3_path


def upload_profile_images_with_local_path(paths, user_id_list):
    """
    upload images to aws s3 storage
    paths: local path to image files (string[])
    user_id_list: list of user_id
    returns list of s3 path for each uploaded image
    """
    if len(paths) != len(user_id_list):
        print('wrong input for upload_profile_images_with_local_path')
        return

    images_path = []
    for idx, path in enumerate(paths):
        file_path = "profile/{}/profile_image{}".format(
            user_id_list[idx], os.path.splitext(path)[1])
        s3_bucket.put_object(
            Key=file_path,
            Body=open(path, 'rb').read(),
        )
        images_path.append(S3_URL + file_path)
    return images_path


def upload_images_from_urls(urls, prefix, feed_id):
    """
    upload images to aws s3 storage
    urls: url list to images
    prefix: recipe or article
    feed_id: recipe_id or article_id
    returns list of s3 path for each uploaded image
    """
    images_path = []
    for idx, url in enumerate(urls):
        response = requests.get(url)
        buffer = BytesIO(response.content)
        img = Image.open(buffer)
        file_path = get_filename_format(
            prefix, feed_id, idx, 'foo.jpeg' if img.format != 'PNG' else 'bar.png')
        s3_bucket.put_object(
            Key=file_path,
            Body=buffer.getvalue(),
        )
        images_path.append(S3_URL + file_path)
    return images_path
