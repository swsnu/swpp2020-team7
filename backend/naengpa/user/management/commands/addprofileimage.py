import os
import csv
import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from ingredient.models import Ingredient
from utils.aws_utils import upload_profile_images_with_local_path

User = get_user_model()


class Command(BaseCommand):
    """makes up Recipe database"""

    def add_arguments(self, parser):
        parser.add_argument('img_dir', type=str)

    def handle(self, *args, **kwargs):
        """makes up profile images with image directory input"""
        if 'img_dir' not in kwargs.keys():
            print("please specify path to image folder")
            return
        image_dir = kwargs['img_dir']
        if not os.path.isdir(image_dir):
            print("given image folder does not exist")
            return

        user_id_list = list(User.objects.values_list('id', flat=True))
        random.shuffle(user_id_list)
        image_path_list = [os.path.join(image_dir, '{}.jpg'.format(
            num)) for num in range(1, 62)]
        random.shuffle(image_path_list)

        s3_path_list = upload_profile_images_with_local_path(
            image_path_list, user_id_list)

        print(s3_path_list)
        for idx, path in enumerate(s3_path_list):
            with transaction.atomic():
                random_user = User.objects.get(id=user_id_list[idx])
                random_user.profile_image = path
                random_user.save(update_fields=['profile_image'])
                print(f"[{random_user.name}] profile image created: {path}")
