from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Point
from utils.kakao_utils import geocode
from user.models import Region

User = get_user_model()


class Command(BaseCommand):
    """makes up Region database"""

    def handle(self, *args, **options):
        """makes up Region db table with gu-dong data in Seoul"""
        input_fname = "user/management/commands/region.txt"

        region_data = {}
        with open(input_fname, "r") as f:
            for line in f.readlines():
                gu_name, dong_str = line.strip().split('\t')
                dong_list = dong_str.split('/')
                region_data[gu_name.strip()] = dong_list

        si_name = "서울시"
        print('[start]')
        for gu_name, dong_list in region_data.items():
            for dong_name in dong_list:
                try:
                    Region.objects.get(
                        si_name=si_name, gu_name=gu_name, dong_name=dong_name)
                    print("[skip]", si_name, gu_name, dong_name)
                except Region.DoesNotExist:
                    latitude, longitude = geocode("{} {} {}".format(
                        si_name, gu_name, dong_name))
                    location = Point(longitude, latitude)
                    print(Region.objects.create(
                        si_name=si_name, gu_name=gu_name, dong_name=dong_name, location=location))

        region_snu = Region.objects.get(
            si_name="서울시", gu_name="관악구", dong_name="대학동")
        for user in User.objects.select_related('region').all():
            if not user.region:
                user.region = region_snu
                user.save()
