"""tests for extrant ml feature"""
import json
from django.contrib.auth import get_user_model
from django.test import TestCase, Client
from user.models import Region
from .models import Recipe, Image

User = get_user_model()


class MlTestCase(TestCase):
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
