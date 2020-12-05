from django.core.management.base import BaseCommand
from food_category.models import FoodCategory, Food


class Command(BaseCommand):
    """makes up FoodCategory database"""

    def handle(self, *args, **options):
    """makes up database"""
    food_category_dict = {}
    food_category_dict['밥류'] = '볶음밥, 제육덮밥, '.split(
        ', ')
    food_category_dict['떡류'] = '시루떡, 무지개떡, 꿀떡, 인절미, 바람떡'.split(
        ', ')
    food_category_dict['빵류'] = '크림빵, 소보로빵, 크로와상'.split(', ')
    food_category_dict['면류'] = '짬뽕, 짜장면, 우동, 라면, 냉면'.split(
        ', ')
    food_category_dict['고기류'] = '제육볶음, 감자탕, 갈비찜, 소갈비'.split(
        ', ')
    food_category_dict['해산물류'] = '해물찜, 아구찜, 해물파스타'.split(', ')

    print('[start]')
    for category, name_list in food_category_dict.items():
        try:
            food_category = FoodCategory.objects.get(name=category)
        except FoodCategory.DoesNotExist:
            food_category = FoodCategory.objects.create(
                name=category)
            print(f'FoodCategory [{food_category}] created')

        for name in name_list:
            try:
                Food.objects.get(name=name)
            except Food.DoesNotExist:
                print(Food.objects.create(
                    category=food_category, name=name))