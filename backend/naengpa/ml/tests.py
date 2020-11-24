"""tests for extrant ml feature"""
# from django.test import TestCase
from django.test import TestCase, Client
import json
# Create your tests here.


class MlTestCase(TestCase):
    def test_extract_ml_feature_list(self):
        client = Client()
        response = client.get('/api/extract/',
                              content_type='application/json')
        # user is not defined
        self.assertEqual(response.status_code, 405)
        response = client.post('/api/extract/', "recipe: {'foodName': 'apple', 'cookTime': 0, 'recipeContent': '사과'}, image: []",
                               content_type='multipart/form-data')
        self.assertEqual(response.status_code, 401)
        response = client.post('/api/signup/', json.dumps({'username': 'nimo', 'name': "nimo", 'password': "nimo", 'dateOfBirth': "19950506", "email": "dori@dori.com"}),
                               content_type='application/json')
        response = client.post('/api/extract/', "recipe: {'foodName': 'apple', 'cookTime': 0, 'recipeContent': '사과'}, image: []",
                               content_type='multipart/form-data')
        # get ml feature list done
        # self.assertEqual(response.status_code, 200)
        response = client.put('/api/extract/',
                              content_type='application/json')
        # bad requeset
        self.assertEqual(response.status_code, 405)
