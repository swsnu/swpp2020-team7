import os
import csv
import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from ingredient.models import Ingredient
from food_category.models import FoodCategory
from recipe.models import Recipe, RecipeIngredient, Image
from utils.konlpy_utils import extract_ingredients
from utils.aws_utils import upload_images_with_local_path

User = get_user_model()


class Command(BaseCommand):
    """makes up Region database"""

    def add_arguments(self, parser):
        parser.add_argument('csv_path', type=str)
        parser.add_argument('img_dir', type=str)

    def handle(self, *args, **kwargs):
        """makes up Region db table with gu-dong data in Seoul"""
        if 'csv_path' not in kwargs.keys():
            print("please specify path to csv input file")
            return
        elif 'img_dir' not in kwargs.keys():
            print("please specify path to image folder")
            return

        from pandas import read_excel
        input_fname, image_dir = kwargs['csv_path'], kwargs['img_dir']
        if not os.path.isfile(input_fname):
            print("given path is not a file")
            return
        if os.path.splitext(input_fname)[1] != ".xlsx":
            print("only csv file input is allowed")
            return
        if not os.path.isdir(image_dir):
            print("given image folder does not exist")
            return

        user_id_list = User.objects.values_list('id', flat=True)

        data = read_excel(input_fname)
        for _, row in data.iterrows():
            food_name, food_category_num, cook_time, recipe_content, image_path = list(
                row)
            image_path = [os.path.join(image_dir, 'img_{}'.format(
                num_ext.strip())) for num_ext in image_path.split(',')]
            print(food_name, food_category_num,
                  cook_time, recipe_content, image_path)
            with transaction.atomic():
                try:
                    Recipe.objects.get(food_name=food_name)
                    print("[skip]", food_name, food_category_num)
                except Recipe.DoesNotExist:
                    random_user_id = random.choice(user_id_list)
                    food_category = FoodCategory.objects.get(
                        pk=food_category_num)
                    new_recipe = Recipe.objects.create(
                        author_id=random_user_id,
                        food_category=food_category,
                        food_name=food_name.strip(),
                        cook_time=cook_time,
                        recipe_content=recipe_content.strip()
                    )
                    print(new_recipe)

                    random_user = User.objects.get(id=random_user_id)
                    random_user.naengpa_score += 100
                    random_user.save()

                    ingredients = map(lambda x: x['name'], extract_ingredients(
                        food_name + ' ' + recipe_content))

                    for name in ingredients:
                        RecipeIngredient.objects.create(
                            ingredient=Ingredient.objects.get(name=name), recipe_id=new_recipe.id
                        )

                    s3_images_path = upload_images_with_local_path(
                        image_path, "recipe", new_recipe.id)
                    for path in s3_images_path:
                        Image.objects.create(
                            file_path=path, recipe_id=new_recipe.id)
