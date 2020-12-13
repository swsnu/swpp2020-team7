"""tests for ingredient"""
import json
from django.contrib.auth import get_user_model
from django.test import TestCase, Client
from user.models import Region
from .models import Ingredient

User = get_user_model()


class IngredientTestCase(TestCase):
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

    def test_ingredient_list(self):
        # user is not defined
        response = self.client.get('/api/ingredients/',
                                   content_type='application/json')
        self.assertEqual(response.status_code, 200)

        # with authorization
        login = self.client.login(username='test', password='test')

        # get ingredient list
        response = self.client.get('/api/ingredients/',
                                   content_type='application/json')
        self.assertEqual(response.status_code, 200)

        # bad requeset method
        response = self.client.post('/api/ingredients/',
                                    content_type='application/json')
        self.assertEqual(response.status_code, 405)

        response = self.client.put('/api/ingredients/',
                                   content_type='application/json')
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/ingredients/',
                                      content_type='application/json')
        self.assertEqual(response.status_code, 405)
