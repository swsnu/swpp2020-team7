"""tests for recipe"""
import json
from django.contrib.auth import get_user_model
from django.test import TestCase, Client
from user.models import Region
from ingredient.models import Ingredient, IngredientCategory
from food_category.models import FoodCategory
from user.models import Fridge
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
        test_fridge = Fridge(user=test_user)
        test_fridge.save()

        test_food_category = FoodCategory.objects.create(name="육류")
        self.mock_recipe = Recipe.objects.create(
            author=test_user,
            food_name="음식",
            food_category=test_food_category,
            cook_time=10,
            recipe_content="테스트"
        )

        test_category = IngredientCategory.objects.create(name="과일류")
        test_ingredient = Ingredient.objects.create(
            category=test_category,
            name="사과")

        RecipeIngredient.objects.create(
            ingredient_id=test_ingredient.id, quantity='test', recipe_id=self.mock_recipe.id)

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

        response = self.client.get('/api/recipes/?query=test')
        self.assertEqual(response.status_code, 200)

        response = self.client.get('/api/recipes/?sort_by=ingredient')
        self.assertEqual(response.status_code, 200)

        response = self.client.get('/api/recipes/?sort_by=likes')
        self.assertEqual(response.status_code, 200)

        # method post
        recipe_str = json.dumps({'foodName': 'apple', 'cookTime': 1,
                                 'content': 'test', 'foodCategory': '육류', 'ingredients': [{
                                     'name': '사과',
                                     'quantity': 10,
                                 }]})
        response = self.client.post('/api/recipes/', {
            'recipe': recipe_str,
            'image': '',
        })
        self.assertEqual(response.status_code, 201)

        # bad request method
        response = self.client.put('/api/recipes/')
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/recipes/')
        self.assertEqual(response.status_code, 405)

    def test_recipe_detail(self):
        response = self.client.get(
            '/api/recipes/{}/'.format(self.mock_recipe.id))
        self.assertEqual(response.status_code, 401)

        # with authorization
        self.client.login(username='test', password='test')

        response = self.client.get(
            '/api/recipes/{}/'.format(self.mock_recipe.id))
        self.assertEqual(response.status_code, 200)

        # delete recipe
        response = self.client.delete(
            '/api/recipes/{}/'.format(self.mock_recipe.id))
        self.assertEqual(response.status_code, 204)

        # bad request method
        response = self.client.post(
            '/api/recipes/{}/'.format(self.mock_recipe.id))
        self.assertEqual(response.status_code, 405)

        response = self.client.put(
            '/api/recipes/{}/'.format(self.mock_recipe.id))
        self.assertEqual(response.status_code, 405)

    def test_today_recipe_list(self):
        # user is not defined
        response = self.client.get('/api/recipes/today/')
        self.assertEqual(response.status_code, 200)

        # bad request method
        response = self.client.post('/api/recipes/today/')
        self.assertEqual(response.status_code, 405)

        response = self.client.put('/api/recipes/today/')
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/recipes/today/')
        self.assertEqual(response.status_code, 405)

    def test_recipe_like(self):
        # user is not defined
        response = self.client.put(
            '/api/recipes/{}/like/'.format(self.mock_recipe.id), follow=True)
        self.assertEqual(response.status_code, 401)

        # with authorization
        self.client.login(username='test', password='test')

        # put comment
        response = self.client.put(
            '/api/recipes/{}/like/'.format(self.mock_recipe.id))
        self.assertEqual(response.status_code, 200)

        # bad request method
        response = self.client.get(
            '/api/recipes/{}/like/'.format(self.mock_recipe.id))
        self.assertEqual(response.status_code, 405)

        response = self.client.post(
            '/api/recipes/{}/like/'.format(self.mock_recipe.id))
        self.assertEqual(response.status_code, 405)

        response = self.client.delete(
            '/api/recipes/{}/like/'.format(self.mock_recipe.id))
        self.assertEqual(response.status_code, 405)
