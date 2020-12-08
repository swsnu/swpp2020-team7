"""tests for foodCategory"""
import json
from django.contrib.auth import get_user_model
from django.test import TestCase, Client
from user.models import Region
from .models import FoodCategory

User = get_user_model()


class FoodCategoryTestCase(TestCase):
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

    def test_food_category_list(self):
        # user is not defined
        response = self.client.get('/api/foodcategory/', follow=True)
        self.assertEqual(response.status_code, 401)

        # with authorization
        login = self.client.login(username='test', password='test')

        # get ingredient list
        response = self.client.get('/api/foodcategory/')
        self.assertEqual(response.status_code, 200)

        # bad request method
        response = self.client.put('/api/foodcategory/')
        self.assertEqual(response.status_code, 405)
