
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from faker import Faker
from user.models import Region, Fridge
import random
from django.db import IntegrityError


class Command(BaseCommand):
    """makes up User database"""

    def handle(self, *args, **options):
        """makes up User db table with faker data"""
        input_fname = "user/management/commands/user.txt"

        user_faker = Faker('ko_KR')
        region_id_list = Region.objects.values_list('id', flat=True)
        User = get_user_model()

        with open(input_fname, "r") as f:
            password = f.readline()

        count = 0
        print('[start]')
        while(count < 50):
            name = user_faker.simple_profile()['name']
            username = user_faker.simple_profile()['username']
            email = user_faker.free_email()
            date_of_birth = user_faker.date_of_birth().strftime("%y%m%d")
            random_region_id = random.choice(region_id_list)
            region_range = random.randrange(1, 6)
            print("[user {}]".format(count), name, username, email,
                  date_of_birth, "region-id:", random_region_id, "region-range", region_range)

            try:
                user = User.objects.create_user(
                    username=username,
                    password=password,
                    email=email,
                    name=name,
                    date_of_birth=date_of_birth,
                    region_id=random_region_id,
                    region_range=region_range,
                )
                user.save()
                my_fridge = Fridge(user=user)
                my_fridge.save()
                count += 1
            except IntegrityError as e:
                pass
