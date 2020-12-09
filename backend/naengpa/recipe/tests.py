"""tests for recipe"""
import json
from django.contrib.auth import get_user_model
from django.test import TestCase, Client
from user.models import Region
from food_category.models import FoodCategory
from .models import Recipe, Image, RecipeIngredient, RecipeLike

User = get_user_model()


class RecipeTestCase(TestCase):
    def setUp(self):
        # create a user
        test_region = Region.objects.create(
            si_name='서울시', gu_name='관악구', dong_name='대학동')
        test_user = User.objects.create_user(
            username='test',
            password='test',
            email='test',
            name='테스트',
            date_of_birth='000000',
            region=test_region,
            region_range=1,
        )
        test_user.save()

        test_food_category = FoodCategory.objects.create(name="육류")
        test_recipe = Recipe.objects.create(
            author=test_user,
            food_name="음식",
            food_category=test_food_category,
            cook_time=10,
            recipe_content="테스트"
        )

    def test_recipe_list(self):
        # user is not defined
        response = self.client.get(
            '/api/recipes/', content_type='application/json')
        self.assertEqual(response.status_code, 401)

        # with authorization
        self.client.login(username='test', password='test')

        # method get
        response = self.client.get('/api/recipes/')
        self.assertEqual(response.status_code, 200)

        # # method post
        # recipe_str = json.dumps({'foodName': 'apple', 'cookTime': 1,
        #                          'content': '사과', 'foodCategory': '육류', 'ingredients': ['사과']})
        # response = self.client.post('/api/recipes/', {
        #     'recipe': recipe_str,
        #     'image': '',
        # })
        # self.assertEqual(response.status_code, 201)

        # bad request method
        response = self.client.put('/api/recipes/', json.dumps({'foodName': 'apple', 'cookTime': 1, 'content': "사과", 'foodImageFiles': [], }),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 405)

    def test_recipe_detail(self):
        response = self.client.get('/api/recipes/1/')
        self.assertEqual(response.status_code, 401)

        # with authorization
        self.client.login(username='test', password='test')

        response = self.client.get('/api/recipes/1/')
        self.assertEqual(response.status_code, 200)

        # delete recipe
        response = self.client.delete('/api/recipes/1/')
        self.assertEqual(response.status_code, 204)

        # bad request method
        response = self.client.post('/api/recipes/1/')
        self.assertEqual(response.status_code, 405)
