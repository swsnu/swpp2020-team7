from django.core.management.base import BaseCommand
from ingredient.models import Ingredient, IngredientCategory


class Command(BaseCommand):
    """makes up Ingredient database"""

    def handle(self, *args, **options):
        """makes up Region db table with gu-dong data in Seoul"""
        input_fname = "ingredient/management/commands/ingredient.txt"

        ingredient_data = {}
        with open(input_fname, "r") as f:
            for line in f:
                print(line.strip().split('–'))
                category, ingredient_str = line.strip().split('–')
                ingredient_list = [item.strip()
                                   for item in ingredient_str.split(',')]
                ingredient_data[category.strip()] = ingredient_list

        print('[start]')
        for category, name_list in ingredient_data.items():
            try:
                ingredient_category = IngredientCategory.objects.get(
                    name=category)
            except IngredientCategory.DoesNotExist:
                ingredient_category = IngredientCategory.objects.create(
                    name=category)
                print(f'IngredientCategory [{ingredient_category}] created')

            for name in name_list:
                try:
                    Ingredient.objects.get(name=name)
                except Ingredient.DoesNotExist:
                    print(Ingredient.objects.create(
                        category=ingredient_category, name=name))
