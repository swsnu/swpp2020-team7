"""tests for foodCategory"""
# from django.test import TestCase
from django.test import TestCase, Client
import json
from .models import FoodCategory

# Create your tests here.


class FoodCategoryTestCase(TestCase):
    def test_food_category_list(self):
        client = Client()

        # user is not defined
        response = client.get('/api/foodcategory/', follow=True)
        print(response.redirect_chain)
        self.assertEqual(response.status_code, 401)

        # signup test user
        mock_signup_user = {
            'name': 'nimo',
            'username': "nimo",
            'password': "nimo",
            'dateOfBirth': "19950506",
            'email': "dori@dori.com",
            'region': {
                'name': '관악구 대학동',
            },
            'regionRange': 2,
        }
        response = client.post('api/signup/',
                               json.dumps(mock_signup_user), content_type='application/json')

        # get ingredient list
        response = client.get('api/foodcategory/')
        self.assertEqual(response.status_code, 200)

        # wrong request method
        response = client.put('api/foodcategory/')
        self.assertEqual(response.status_code, 405)
