from django.core.management.base import BaseCommand
from food_category.models import FoodCategory, Food


class Command(BaseCommand):
    """makes up FoodCategory database"""

    def handle(self, *args, **options):
        """makes up database"""
        food_category_list = ['육류', '디저트류', '해산물류', '밥류', '면류', '채소류',
                              '빵류', '튀김류', '계란/알류', '수프/국/찌개류', '유제품류', '과일류', '기타']

        print('[start]')
        for category in food_category_list:
            try:
                food_category = FoodCategory.objects.get(name=category)
            except FoodCategory.DoesNotExist:
                food_category = FoodCategory.objects.create(
                    name=category)
                print(f'FoodCategory [{food_category}] created')
