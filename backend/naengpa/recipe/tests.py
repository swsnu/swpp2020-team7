"""tests for recipe"""
from django.test import TestCase, Client
import json
from .models import Recipe, Image
# Create your tests here.


class RecipeTestCase(TestCase):
    def test_user_authentication(self):
        client = Client(enforce_csrf_checks=True)
        response = client.get('/api/recipes/', content_type='application/json')

        # user is not defined
        self.assertEqual(response.status_code, 401)
        csrftoken = response.cookies['csrftoken'].value

        response = client.post('/api/recipes/', json.dumps({'foodName': 'apple', 'cookTime': 0, 'recipeContent': "사과", 'foodImages': [], }),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        # user is not defined
        self.assertEqual(response.status_code, 401)

    def test_recipe(self):
        client = Client()
        response = client.get('/api/recipes/', content_type='application/json')
        response = client.post('/api/signup/', json.dumps({'username': 'nimo', 'name': "nimo", 'password': "nimo", 'dateOfBirth': "19950506", "email": "dori@dori.com"}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 201)
        response = client.put('/api/recipes/', json.dumps({'foodName': 'apple', 'cookTime': 0, 'recipeContent': "사과", 'foodImages': [], }),
                              content_type='application/json')
        # method put not allowed
        self.assertEqual(response.status_code, 405)
        response = client.post('/api/recipes/', json.dumps({'foodName': 'apple', 'cookTime': 0, 'recipeContent': "사과", 'foodImages': ["image", ], }),
                               content_type='application/json')
        # method post
        self.assertEqual(response.status_code, 201)

        response = client.get('/api/recipes/')
        # method get
        self.assertEqual(response.status_code, 200)

    def test_recipe_detail(self):
        client = Client()
        response = client.get('/api/recipes/0/')
        self.assertEqual(response.status_code, 405)
