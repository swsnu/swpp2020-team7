"""test for user"""
import json
import uuid
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from ingredient.models import Ingredient, IngredientCategory
from .models import Region, Fridge, FridgeIngredient

User = get_user_model()


class UserTestCase(TestCase):
    """ testcase for users api """

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
        test_fridge = Fridge(user=test_user)
        test_fridge.save()
        test_category = IngredientCategory.objects.create(name="과일류")
        test_ingredient = Ingredient.objects.create(
            category=test_category,
            name="딸기")

    def test_csrf(self):
        # By default, csrf checks are disabled in test self
        # To test csrf protection we enforce csrf checks here
        client = Client(enforce_csrf_checks=True)

        response = client.post('/api/signup/', json.dumps({'username': 'chris', 'email': 'swpp@snu.ac.kr',
                                                           'password': 'chris', 'name': 'chris', 'dateOfBirth': '980515', 'region': {'name': '관악구 대학동'}, 'regionRange': 1}), content_type='application/json')
        self.assertEqual(response.status_code, 201)

        response = client.get('/api/signup/')
        # Get csrf token from cookie
        csrftoken = response.cookies['csrftoken'].value

        # check signout 401
        response = client.get('/api/logout/')
        self.assertEqual(response.status_code, 204)

        response = client.post('/api/signup/', {'username': 'chris', 'email': 'swpp@snu.ac.kr',
                                                'password': 'chris', 'name': 'chris', 'dateOfBirth': '980515'}, HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 400)

        response = client.get('/api/login/')
        # Get csrf token from cookie
        csrftoken = response.cookies['csrftoken'].value

        response = client.post(
            '/api/login/', {'username': 'chris', 'password': 'chris'}, HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)

        response = client.post('/api/login/', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 403)

        # signout
        response = client.get('/api/logout/', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 204)

        # user_list
        response = client.get('/api/users/', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 401)

    # check 405(Method not allowed)
    def test_method(self):
        # signup
        response = self.client.get('/api/signup/')
        self.assertEqual(response.status_code, 405)

        response = self.client.put('/api/signup/')
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/signup/')
        self.assertEqual(response.status_code, 405)

        # login
        response = self.client.get('/api/login/')
        self.assertEqual(response.status_code, 405)

        response = self.client.put('/api/login/')
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/login/')
        self.assertEqual(response.status_code, 405)

        # signout
        response = self.client.post('/api/logout/')
        self.assertEqual(response.status_code, 405)

        response = self.client.put('/api/logout/')
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/logout/')
        self.assertEqual(response.status_code, 405)

        # user
        test_uid = uuid.uuid4()
        response = self.client.post('/api/users/{}/'.format(test_uid))
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/users/{}/'.format(test_uid))
        self.assertEqual(response.status_code, 405)

        # user_list
        response = self.client.post('/api/users/')
        self.assertEqual(response.status_code, 405)

        response = self.client.put('/api/users/')
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/users/')
        self.assertEqual(response.status_code, 405)

        # user_fridge
        response = self.client.put('/api/users/{}/fridge/'.format(test_uid))
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/users/{}/fridge/'.format(test_uid))
        self.assertEqual(response.status_code, 405)

        # user_ingredient
        test_uid = uuid.uuid4()
        response = self.client.post(
            '/api/users/{}/ingredients/1/'.format(test_uid))
        self.assertEqual(response.status_code, 405)

        response = self.client.get(
            '/api/users/{}/ingredients/1/'.format(test_uid))
        self.assertEqual(response.status_code, 405)

    def test_authentication(self):
        test_uid = uuid.uuid4()
        response = self.client.get('/api/logout/')

        response = self.client.get('/api/users/{}/fridge/'.format(test_uid))
        self.assertEqual(response.status_code, 401)

        response = self.client.post('/api/login/', json.dumps({'username': 'test', 'password': 'testpassword'}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 401)

        response = self.client.put('/api/users/{}/'.format(test_uid), json.dumps({
            'id': 'test',
            'password': 'test',
            'username': 'test',
            'email': 'test@email.com',
            'name': 'test',
            'dateOfBirth': '000000',
            'naengpa_score': '0'
        }))
        self.assertEqual(response.status_code, 401)

        response = self.client.post(
            '/api/users/{}/fridge/'.format(test_uid), {})
        self.assertEqual(response.status_code, 401)

        response = self.client.delete(
            '/api/users/{}/ingredients/0/'.format(test_uid))
        self.assertEqual(response.status_code, 401)

        response = self.client.put(
            '/api/users/{}/ingredients/0/'.format(test_uid))
        self.assertEqual(response.status_code, 401)

        response = self.client.post('/api/signup/', json.dumps(
            {'username': 'chris', 'email': 'swpp@snu.ac.kr', 'password': 'chris', 'name': 'chris', 'dateOfBirth': '980515', 'region': {'name': '관악구 대학동'}, 'regionRange': 1}), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        test_user = User.objects.all()[0]

        response = self.client.put('/api/users/{}/'.format(test_user.id), json.dumps({
            'id': 'test',
            'password': 'test',
            'username': 'test',
            'email': 'test@email.com',
            'name': 'test',
            'dateOfBirth': '000000',
            'naengpa_score': '0'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 401)

        response = self.client.get(
            '/api/users/{}/fridge/'.format(test_user.id))
        self.assertEqual(response.status_code, 200)

        test_ingredient_id = Ingredient.objects.all().values_list('id',
                                                                  flat=True)[0]
        response = self.client.post(
            '/api/users/{}/fridge/'.format(test_user.id), {'ingredient_id': test_ingredient_id})
        self.assertEqual(response.status_code, 201)

        response = self.client.delete(
            '/api/users/{}/ingredients/0/'.format(test_user.id))
        self.assertEqual(response.status_code, 404)

        response = self.client.put(
            '/api/users/{}/ingredients/0/'.format(test_user.id))
        self.assertEqual(response.status_code, 404)

        self.client.get('/api/logout/')
        response = self.client.post('/api/signup/', json.dumps(
            {'username': 'dori', 'email': 'swpp@snu.ac.kr', 'password': 'dori', 'name': 'dori', 'dateOfBirth': '980515'}), content_type='application/json')
        self.assertEqual(response.status_code, 400)

        response = self.client.get('/api/users/{}/fridge/'.format(test_uid))
        self.assertEqual(response.status_code, 401)

        response = self.client.delete(
            '/api/users/{}/ingredients/0/'.format(test_uid))
        self.assertEqual(response.status_code, 401)

        response = self.client.put(
            '/api/users/{}/ingredients/0/'.format(test_uid))
        self.assertEqual(response.status_code, 401)

        response = self.client.post('/api/signup/',
                                    {'username': 'dori', 'email': 'swpp@snu.ac.kr', 'password': 'dori', 'name': 'dori', 'dateOfBirth': '980515'})
        self.assertEqual(response.status_code, 400)

        response = self.client.post(
            '/api/login/', {'username': 'dori', 'password': 'dori'})
        self.assertEqual(response.status_code, 401)

    def test_user_and_user_ingredient(self):
        # with authorization
        self.client.login(username='test', password='test')

        test_user_id = User.objects.all().values_list('id', flat=True)[0]
        test_ingredient_id = Ingredient.objects.all().values_list('id',
                                                                  flat=True)[0]
        response = self.client.get(
            '/api/users/{}/fridge/'.format(test_user_id))
        self.assertEqual(response.status_code, 200)

        response = self.client.post(
            '/api/users/{}/fridge/'.format(test_user_id), {'ingredient_id': test_ingredient_id})
        self.assertEqual(response.status_code, 201)

        response = self.client.put(
            '/api/users/{}/ingredients/{}/'.format(test_user_id, test_ingredient_id))
        self.assertEqual(response.status_code, 200)

        response = self.client.delete(
            '/api/users/{}/ingredients/{}/'.format(test_user_id, test_ingredient_id))
        self.assertEqual(response.status_code, 200)

        response = self.client.get('/api/users/{}/'.format(test_user_id))
        self.assertEqual(response.status_code, 200)

        response = self.client.put('/api/users/{}/'.format(test_user_id), json.dumps(
            {'name': 'dori', 'email': 'swpp@snu.ac.kr', 'password': 'test', 'dateOfBirth': '980515'}), content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_key_json_error(self):
        response = self.client.post('/api/signup/',
                                    {'username': 'dori', 'password': 'dori', 'name': 'dori', 'dateOfBirth': '980515'})
        self.assertEqual(response.status_code, 400)

        response = self.client.post(
            '/api/login/', {'username': 'dori'})
        self.assertEqual(response.status_code, 400)

        response = self.client.post('/api/signup/',
                                    json.dumps({'username': 'dori', 'email': 'swpp@snu.ac.kr', 'password': 'dori', 'name': 'dori', 'dateOfBirth': '980515', 'region': {'name': '관악구 대학동'}, 'regionRange': 1}), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        user = User.objects.all()[0]
        response = self.client.get('/api/ingredients/')
        response = self.client.post(
            '/api/users/{}/fridge/'.format(user.id), {})
        self.assertEqual(response.status_code, 400)
