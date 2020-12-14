"""tests for extrant ml feature"""
"""test for article"""

import json
from django.contrib.auth import get_user_model
from django.test import TestCase, Client
from user.models import Region
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
        response = self.client.post('/api/extract/', "recipe: {'foodName': 'apple', 'cookTime': 0, 'content': '사과'}, image: []",
                                    content_type='multipart/form-data')
        self.assertEqual(response.status_code, 401)

        # with authorization
        self.client.login(username='test', password='test')

        # get ml feature list done
        response = self.client.post('/api/extract/',
                                    {
                                        'recipe': json.dumps({"foodName": "apple", "cookTime": 0, 'content': '사과'}),
                                        'image': ''
                                    })
        self.assertEqual(response.status_code, 200)

        # bad request method
        response = self.client.get('/api/extract/')
        self.assertEqual(response.status_code, 405)

        response = self.client.put('/api/extract/')
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/extract/')
        self.assertEqual(response.status_code, 405)
