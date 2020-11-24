"""tests for foodCategory"""
# from django.test import TestCase
from django.test import TestCase, Client
import json
from .models import Food, FoodCategory
# Create your tests here.


class FoodCategoryTestCase(TestCase):
    def test_food_category_list(self):
        client = Client()
        response = client.get('/api/foodcategory/',
                              content_type='application/json')
        # user is not defined
        self.assertEqual(response.status_code, 401)
        response = client.post('/api/signup/', json.dumps({'username': 'nimo', 'name': "nimo", 'password': "nimo", 'dateOfBirth': "19950506", "email": "dori@dori.com"}),
                               content_type='application/json')
        response = client.get('/api/foodcategory/',
                              content_type='application/json')
        # get ingredient list done
        self.assertEqual(response.status_code, 200)
        response = client.put('/api/foodcategory/',
                              content_type='application/json')
        # bad requeset
        self.assertEqual(response.status_code, 405)
