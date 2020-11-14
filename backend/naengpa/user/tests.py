"""test for user"""
import json
import uuid
from django.test import TestCase, Client
from django.contrib.auth.models import AbstractUser
from .models import User, Fridge, FridgeIngredient
from django.views.decorators.csrf import ensure_csrf_cookie
# Create your tests here.


class UserTestCase(TestCase):
    def test_csrf(self):
        # By default, csrf checks are disabled in test client
        # To test csrf protection we enforce csrf checks here
        client = Client(enforce_csrf_checks=True)
        response = client.post('/api/signup/', json.dumps({'username': 'chris', 'email': 'swpp@snu.ac.kr', 'password': 'chris', 'name': 'chris', 'dateOfBirth': '980515'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 403)

        response = client.get('/api/signup/')
        # Get csrf token from cookie
        csrftoken = response.cookies['csrftoken'].value

        # check signout 401
        response = client.get('/api/logout/')
        self.assertEqual(response.status_code, 401)

        response = client.post('/api/signup/', json.dumps({'username': 'chris', 'email': 'swpp@snu.ac.kr', 'password': 'chris', 'name': 'chris', 'dateOfBirth': '980515'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)

        response = client.get('/api/login/')
        # Get csrf token from cookie
        csrftoken = response.cookies['csrftoken'].value

        response = client.post('/api/login/', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)

        response = client.post('/api/login/', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 403)

        # signout
        response = client.get('/api/logout/', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 204)

        response = client.post('/api/logout/', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 403)

        # user_list
        response = client.get('/api/users/', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)

    # check 405(Method not allowed)
    def test_method(self):
        client = Client()

        # signup
        response = client.get('/api/signup/')
        self.assertEqual(response.status_code, 405)

        response = client.put('/api/signup/')
        self.assertEqual(response.status_code, 405)

        response = client.delete('/api/signup/')
        self.assertEqual(response.status_code, 405)

        # login
        response = client.get('/api/login/')
        self.assertEqual(response.status_code, 405)

        response = client.put('/api/login/')
        self.assertEqual(response.status_code, 405)

        response = client.delete('/api/login/')
        self.assertEqual(response.status_code, 405)

        # signout
        response = client.post('/api/logout/')
        self.assertEqual(response.status_code, 405)

        response = client.put('/api/logout/')
        self.assertEqual(response.status_code, 405)

        response = client.delete('/api/logout/')
        self.assertEqual(response.status_code, 405)

        # user_list
        response = client.post('/api/users/')
        self.assertEqual(response.status_code, 405)

        response = client.put('/api/users/')
        self.assertEqual(response.status_code, 405)

        response = client.delete('/api/users/')
        self.assertEqual(response.status_code, 405)

        # user_fridge
        test_uid = uuid.uuid4()
        response = client.put('/api/users/{}/fridge/'.format(test_uid))
        self.assertEqual(response.status_code, 405)

        response = client.delete('/api/users/{}/fridge/'.format(test_uid))
        self.assertEqual(response.status_code, 405)

        # user_ingredient
        test_uid = uuid.uuid4()
        response = client.put('/api/users/{}/ingredients/1/'.format(test_uid))
        self.assertEqual(response.status_code, 405)

        response = client.post('/api/users/{}/ingredients/1/'.format(test_uid))
        self.assertEqual(response.status_code, 405)

        response = client.get('/api/users/{}/ingredients/1/'.format(test_uid))
        self.assertEqual(response.status_code, 405)

    def test_authentication(self):
        client = Client()
        '''
        response = client.post('/api/signup/', json.dumps({'username': 'chris', 'email': 'swpp@snu.ac.kr', 'password': 'chris', 'name': 'chris', 'dateOfBirth': '980515'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 201)
        '''
        response = client.post('/api/login/', json.dumps({'username': 'test', 'password': 'testpassword'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 401)
