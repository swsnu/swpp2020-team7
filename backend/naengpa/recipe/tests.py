"""tests for recipe"""
import json
from django.contrib.auth import get_user_model
from django.test import TestCase, Client
from user.models import Region
from .models import Recipe

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

    def test_user_authentication(self):
        client = Client(enforce_csrf_checks=True)
        response = client.get('/api/recipes/', content_type='application/json')

        # user is not defined
        self.assertEqual(response.status_code, 401)
        csrftoken = response.cookies['csrftoken'].value

        response = client.post('/api/recipes/',  "recipe: {'foodName': 'apple', 'cookTime': 0, 'recipeContent': '사과'}, image: []",
                               content_type='multipart/form-data', HTTP_X_CSRFTOKEN=csrftoken)
        # user is not defined TODO: check
        self.assertEqual(response.status_code, 400)

    def test_recipe(self):
        client = Client()
        response = client.get('/api/recipes/', content_type='application/json')
        response = client.post('/api/signup/', json.dumps({'username': 'nimo', 'name': "nimo", 'password': "nimo", 'dateOfBirth': "19950506", "email": "dori@dori.com"}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 201)
        response = client.put('/api/recipes/', json.dumps({'foodName': 'apple', 'cookTime': 0, 'recipeContent': "사과", 'foodImageFiles': [], }),
                              content_type='application/json')
        # method put not allowed
        self.assertEqual(response.status_code, 405)
        response = client.post('/api/recipes/', "recipe: {'foodName': 'apple', 'cookTime': 0, 'recipeContent': '사과'}, image: []",
                               content_type='multipart/form-data')
        # method post TODO:
        self.assertEqual(response.status_code, 400)

        response = client.get('/api/recipes/')
        # method get
        self.assertEqual(response.status_code, 200)

    def test_recipe_detail(self):
        client = Client()
        response = client.post('/api/signup/', json.dumps({'username': 'nimo', 'name': "nimo", 'password': "nimo", 'dateOfBirth': "19950506", "email": "dori@dori.com"}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 201)
        response = client.post('/api/recipes/', "recipe: {'foodName': 'apple', 'cookTime': 0, 'recipeContent': '사과'}, image: []",
                               content_type='multipart/form-data')
        self.assertEqual(response.status_code, 400)
        #response = client.get('/api/recipes/0/')
        #self.assertEqual(response.status_code, 201)
        #response = client.delete('/api/recipes/0/')
        #self.assertEqual(response.status_code, 200)
        response = client.post('/api/recipes/0/')
        self.assertEqual(response.status_code, 405)
