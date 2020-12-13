"""test for user"""
import json
import uuid
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from ingredient.models import Ingredient, IngredientCategory
from .models import Region, Fridge, FridgeIngredient, Notification

User = get_user_model()


class UserTestCase(TestCase):
    """ testcase for users api """

    def setUp(self):
        # create a user
        test_region = Region.objects.create(
            si_name='서울시', gu_name='관악구', dong_name='대학동')
        self.test_user = User.objects.create_user(
            username='test',
            password='test',
            email='test',
            name='테스트',
            date_of_birth='000000',
            region=test_region,
            region_range=1,
        )
        self.test_user.save()
        test_fridge = Fridge(user=self.test_user)
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
        self.assertEqual(response.status_code, 200)

    def test_auth(self):
        # signup
        response = self.client.get('/api/signup/')
        self.assertEqual(response.status_code, 405)

        response = self.client.post('/api/signup/', json.dumps({
            'username': 'chris', 'email': 'swpp@snu.ac.kr', 'password': 'chris', 'name': 'chris', 'dateOfBirth': '980515', 'region': {'name': '관악구 대학동'}, 'regionRange': 1
        }), content_type='application/json')
        self.assertEqual(response.status_code, 201)

        response = self.client.put('/api/signup/')
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/signup/')
        self.assertEqual(response.status_code, 405)

        # login
        response = self.client.get('/api/login/')
        self.assertEqual(response.status_code, 405)

        response = self.client.post('/api/login/', {
            'username': 'test',
            'password': 'test',
        })
        self.assertEqual(response.status_code, 200)

        response = self.client.post('/api/login/', {
            'username': 'test',
            'password': 'wrong',
        })
        self.assertEqual(response.status_code, 401)

        response = self.client.put('/api/login/', json.dumps({
            'username': 'test'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)

        response = self.client.delete('/api/login/')
        self.assertEqual(response.status_code, 405)

        # signout
        response = self.client.get('/api/logout/')
        self.assertEqual(response.status_code, 204)

        response = self.client.post('/api/logout/')
        self.assertEqual(response.status_code, 405)

        response = self.client.put('/api/logout/')
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/logout/')
        self.assertEqual(response.status_code, 405)

        # change password
        response = self.client.get(
            '/api/users/{}/password/'.format(self.test_user.id))
        self.assertEqual(response.status_code, 405)

        response = self.client.post(
            '/api/users/{}/password/'.format(self.test_user.id))
        self.assertEqual(response.status_code, 405)

        response = self.client.put('/api/users/{}/password/'.format(self.test_user.id), {
            'currentPassword': 'test',
            'newPassword': 'test',
        })
        self.assertEqual(response.status_code, 401)

        # with authorization
        self.client.login(username='test', password='test')

        response = self.client.put('/api/users/{}/password/'.format(self.test_user.id), {
            "currentPassword": "test",
            "newPassword": "test"
        }, content_type='application/json')
        self.assertEqual(response.status_code, 201)

        response = self.client.put('/api/login/', {
            "username": 'test'
        }, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        response = self.client.delete(
            '/api/users/{}/password/'.format(self.test_user.id))
        self.assertEqual(response.status_code, 405)

    def test_exception(self):
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

        response = self.client.put('/api/users/{}/'.format(self.test_user.id), {
            'id': 'test',
            'password': 'test',
            'username': 'test',
            'email': 'test@email.com',
            'name': 'test',
            'dateOfBirth': '000000',
        })
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

        response = self.client.put('/api/users/{}/'.format(self.test_user.id), {
            'password': 'test',
            'username': 'test',
            'email': 'test@email.com',
            'name': 'test',
            'dateOfBirth': '000000',
        })
        self.assertEqual(response.status_code, 403)

        # with authorization
        self.client.login(username='test', password='test')

        user_put_data = json.dumps({
            'password': 'test',
            'username': 'test',
            'email': 'test@email.com',
            'name': 'test',
            'dateOfBirth': '000000',
        })
        response = self.client.put('/api/users/{}/'.format(self.test_user.id), {
            'user': user_put_data,
            'image': '',
        }, content_type='application/json')
        self.assertEqual(response.status_code, 201)

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
        self.assertEqual(response.status_code, 404)

    def test_user_info(self):
        response = self.client.get('/api/users/{}/'.format(self.test_user.id))
        self.assertEqual(response.status_code, 401)

        # with authorization
        self.client.login(username='test', password='test')

        response = self.client.get('/api/users/{}/'.format(self.test_user.id))
        self.assertEqual(response.status_code, 200)

        user_put_data = json.dumps(
            {'name': 'dori', 'email': 'swpp@snu.ac.kr', 'dateOfBirth': '980515'})
        response = self.client.put('/api/users/{}/'.format(self.test_user.id), {
            'user': user_put_data,
            'image': '',
        }, content_type='multipart/form-data')
        self.assertEqual(response.status_code, 400)

        user_put_data = json.dumps({'name': 'dori', 'email': 'swpp@snu.ac.kr',
                                    'password': 'wrong', 'dateOfBirth': '980515'})
        response = self.client.put('/api/users/{}/'.format(self.test_user.id), {
            'user': user_put_data,
            'image': '',
        }, content_type='application/json')
        self.assertEqual(response.status_code, 401)

        user_put_data = json.dumps(
            {'name': 'dori', 'email': 'swpp@snu.ac.kr', 'password': 'test', 'dateOfBirth': '980515'})
        response = self.client.put('/api/users/{}/'.format(self.test_user.id), {
            'user': user_put_data,
            'image': '',
        }, content_type='application/json')
        self.assertEqual(response.status_code, 201)

        response = self.client.post('/api/users/{}/'.format(self.test_user.id))
        self.assertEqual(response.status_code, 405)

        response = self.client.delete(
            '/api/users/{}/'.format(self.test_user.id))
        self.assertEqual(response.status_code, 405)

    def test_user_list(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, 200)

        # with authorization
        self.client.login(username='test', password='test')

        response = self.client.post('/api/users/')
        self.assertEqual(response.status_code, 405)

        response = self.client.put('/api/users/')
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/users/')
        self.assertEqual(response.status_code, 405)

    def test_user_recipes(self):
        response = self.client.get(
            '/api/users/{}/recipes/'.format(self.test_user.id))
        self.assertEqual(response.status_code, 401)

        response = self.client.get(
            '/api/users/{}/recipes/'.format(self.test_user.id))
        self.assertEqual(response.status_code, 200)

        response = self.client.post(
            '/api/users/{}/recipes/'.format(self.test_user.id))
        self.assertEqual(response.status_code, 405)

        response = self.client.put(
            '/api/users/{}/recipes/'.format(self.test_user.id))
        self.assertEqual(response.status_code, 405)

        response = self.client.delete(
            '/api/users/{}/recipes/'.format(self.test_user.id))
        self.assertEqual(response.status_code, 405)

    def test_fridge_ingredient(self):
        # with authorization
        self.client.login(username='test', password='test')

        test_ingredient_id = Ingredient.objects.all().values_list('id',
                                                                  flat=True)[0]
        # test user fridge
        response = self.client.get(
            '/api/users/{}/fridge/'.format(self.test_user.id))
        self.assertEqual(response.status_code, 200)

        response = self.client.post(
            '/api/users/{}/fridge/'.format(self.test_user.id), {'ingredient_id': test_ingredient_id})
        self.assertEqual(response.status_code, 201)

        response = self.client.put(
            '/api/users/{}/fridge/'.format(self.test_user.id))
        self.assertEqual(response.status_code, 405)

        response = self.client.delete(
            '/api/users/{}/fridge/'.format(self.test_user.id))
        self.assertEqual(response.status_code, 405)

        # test user ingredient
        response = self.client.get(
            '/api/users/{}/ingredients/{}/'.format(self.test_user.id, test_ingredient_id))
        self.assertEqual(response.status_code, 405)

        response = self.client.post(
            '/api/users/{}/ingredients/{}/'.format(self.test_user.id, test_ingredient_id))
        self.assertEqual(response.status_code, 405)

        response = self.client.put(
            '/api/users/{}/ingredients/{}/'.format(self.test_user.id, test_ingredient_id))
        self.assertEqual(response.status_code, 200)

        response = self.client.delete(
            '/api/users/{}/ingredients/{}/'.format(self.test_user.id, test_ingredient_id))
        self.assertEqual(response.status_code, 200)

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

    def test_regions(self):
        response = self.client.get('/api/regions/')
        self.assertEqual(response.status_code, 200)

        response = self.client.post('/api/regions/')
        self.assertEqual(response.status_code, 405)

        response = self.client.put('/api/regions/')
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/regions/')
        self.assertEqual(response.status_code, 405)

    def test_notifications(self):
        mock_notification = Notification.objects.create(
            recipient=self.test_user, content='test')
        response = self.client.get(
            '/api/notifications/{}/'.format(mock_notification.id))
        self.assertEqual(response.status_code, 405)

        response = self.client.post(
            '/api/notifications/{}/'.format(mock_notification.id))
        self.assertEqual(response.status_code, 405)

        response = self.client.put(
            '/api/notifications/{}/'.format(mock_notification.id))
        self.assertEqual(response.status_code, 405)

        response = self.client.delete(
            '/api/notifications/{}/'.format(mock_notification.id))
        self.assertEqual(response.status_code, 401)

        # with authorization
        self.client.login(username='test', password='test')

        response = self.client.delete(
            '/api/notifications/{}/'.format(mock_notification.id))
        self.assertEqual(response.status_code, 200)
