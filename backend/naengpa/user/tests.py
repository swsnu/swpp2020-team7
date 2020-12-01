# """test for user"""
# import json
# import uuid
# from django.test import TestCase, Client
# from django.contrib.auth.models import AbstractUser
# from ingredient.models import Ingredient, IngredientCategory
# from .models import User, Fridge, FridgeIngredient
# from django.views.decorators.csrf import ensure_csrf_cookie
# # Create your tests here.


# class UserTestCase(TestCase):
#     def test_csrf(self):
#         # By default, csrf checks are disabled in test client
#         # To test csrf protection we enforce csrf checks here
#         client = Client(enforce_csrf_checks=True)
#         response = client.post('/api/signup/', json.dumps({'username': 'chris', 'email': 'swpp@snu.ac.kr', 'password': 'chris', 'name': 'chris', 'dateOfBirth': '980515'}),
#                                content_type='application/json')
#         self.assertEqual(response.status_code, 403)

#         response = client.get('/api/signup/')
#         # Get csrf token from cookie
#         csrftoken = response.cookies['csrftoken'].value

#         # check signout 401
#         response = client.get('/api/logout/')
#         self.assertEqual(response.status_code, 401)

#         response = client.post('/api/signup/', json.dumps({'username': 'chris', 'email': 'swpp@snu.ac.kr', 'password': 'chris', 'name': 'chris', 'dateOfBirth': '980515'}),
#                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
#         self.assertEqual(response.status_code, 201)

#         response = client.get('/api/login/')
#         # Get csrf token from cookie
#         csrftoken = response.cookies['csrftoken'].value

#         response = client.post('/api/login/', json.dumps({'username': 'chris', 'password': 'chris'}),
#                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
#         self.assertEqual(response.status_code, 200)

#         response = client.post('/api/login/', json.dumps({'username': 'chris', 'password': 'chris'}),
#                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
#         self.assertEqual(response.status_code, 403)

#         # signout
#         response = client.get('/api/logout/', HTTP_X_CSRFTOKEN=csrftoken)
#         self.assertEqual(response.status_code, 204)

#         response = client.post('/api/logout/', HTTP_X_CSRFTOKEN=csrftoken)
#         self.assertEqual(response.status_code, 403)

#         # user_list
#         response = client.get('/api/users/', HTTP_X_CSRFTOKEN=csrftoken)
#         self.assertEqual(response.status_code, 200)

#     # check 405(Method not allowed)
#     def test_method(self):
#         client = Client()

#         # signup
#         response = client.get('/api/signup/')
#         self.assertEqual(response.status_code, 405)

#         response = client.put('/api/signup/')
#         self.assertEqual(response.status_code, 405)

#         response = client.delete('/api/signup/')
#         self.assertEqual(response.status_code, 405)

#         # login
#         response = client.get('/api/login/')
#         self.assertEqual(response.status_code, 405)

#         response = client.put('/api/login/')
#         self.assertEqual(response.status_code, 405)

#         response = client.delete('/api/login/')
#         self.assertEqual(response.status_code, 405)

#         # signout
#         response = client.post('/api/logout/')
#         self.assertEqual(response.status_code, 405)

#         response = client.put('/api/logout/')
#         self.assertEqual(response.status_code, 405)

#         response = client.delete('/api/logout/')
#         self.assertEqual(response.status_code, 405)

#         # user
#         test_uid = uuid.uuid4()
#         response = client.post('/api/users/{}/'.format(test_uid))
#         self.assertEqual(response.status_code, 405)

#         response = client.delete('/api/users/{}/'.format(test_uid))
#         self.assertEqual(response.status_code, 405)

#         # user_list
#         response = client.post('/api/users/')
#         self.assertEqual(response.status_code, 405)

#         response = client.put('/api/users/')
#         self.assertEqual(response.status_code, 405)

#         response = client.delete('/api/users/')
#         self.assertEqual(response.status_code, 405)

#         # user_fridge
#         response = client.put('/api/users/{}/fridge/'.format(test_uid))
#         self.assertEqual(response.status_code, 405)

#         response = client.delete('/api/users/{}/fridge/'.format(test_uid))
#         self.assertEqual(response.status_code, 405)

#         # user_ingredient
#         test_uid = uuid.uuid4()
#         response = client.post('/api/users/{}/ingredients/1/'.format(test_uid))
#         self.assertEqual(response.status_code, 405)

#         response = client.get('/api/users/{}/ingredients/1/'.format(test_uid))
#         self.assertEqual(response.status_code, 405)

#     def test_authentication(self):
#         client = Client()
#         response = client.get('/api/logout/')
#         test_uid = uuid.uuid4()

#         response = client.get('/api/users/{}/fridge/'.format(test_uid))
#         self.assertEqual(response.status_code, 401)

#         response = client.post('/api/login/', json.dumps({'username': 'test', 'password': 'testpassword'}),
#                                content_type='application/json')
#         self.assertEqual(response.status_code, 401)

#         response = client.put('/api/users/{}/'.format(test_uid), json.dumps({
#             'id': 'test',
#             'password': 'test',
#             'username': 'test',
#             'email': 'test@email.com',
#             'name': 'test',
#             'dateOfBirth': '000000',
#             'naengpa_score': '0'
#         }), content_type='application/json')
#         self.assertEqual(response.status_code, 400)

#         response = client.post('/api/users/{}/fridge/'.format(test_uid), json.dumps({}),
#                                content_type='application/json')
#         self.assertEqual(response.status_code, 401)

#         response = client.delete(
#             '/api/users/{}/ingredients/0/'.format(test_uid))
#         self.assertEqual(response.status_code, 401)

#         response = client.put('/api/users/{}/ingredients/0/'.format(test_uid))
#         self.assertEqual(response.status_code, 401)

#         response = client.post('/api/signup/', json.dumps({'username': 'chris', 'email': 'swpp@snu.ac.kr', 'password': 'chris', 'name': 'chris', 'dateOfBirth': '980515'}),
#                                content_type='application/json')
#         self.assertEqual(response.status_code, 201)
#         user1 = User.objects.all()[0]

#         response = client.put('/api/users/{}/'.format(user1.id), json.dumps({
#             'id': 'test',
#             'password': 'test',
#             'username': 'test',
#             'email': 'test@email.com',
#             'name': 'test',
#             'dateOfBirth': '000000',
#             'naengpa_score': '0'
#         }), content_type='application/json')
#         self.assertEqual(response.status_code, 401)

#         response = client.get('/api/users/{}/fridge/'.format(user1.id))
#         self.assertEqual(response.status_code, 200)

#         response = client.post('/api/users/{}/fridge/'.format(user1.id), json.dumps({'ingredient_id': 10}),
#                                content_type='application/json')
#         self.assertEqual(response.status_code, 404)

#         response = client.post('/api/users/{}/fridge/'.format(user1.id), json.dumps({'ingredient_id': 0}),
#                                content_type='application/json')
#         self.assertEqual(response.status_code, 404)

#         response = client.delete(
#             '/api/users/{}/ingredients/0/'.format(user1.id))
#         self.assertEqual(response.status_code, 404)

#         response = client.put('/api/users/{}/ingredients/0/'.format(user1.id))
#         self.assertEqual(response.status_code, 404)

#         client.get('/api/logout/')
#         response = client.post('/api/signup/', json.dumps({'username': 'dori', 'email': 'swpp@snu.ac.kr', 'password': 'dori', 'name': 'dori', 'dateOfBirth': '980515'}),
#                                content_type='application/json')
#         self.assertEqual(response.status_code, 201)
#         user2 = User.objects.all()[1]

#         response = client.get('/api/users/{}/fridge/'.format(test_uid))
#         self.assertEqual(response.status_code, 400)

#         response = client.delete(
#             '/api/users/{}/ingredients/0/'.format(test_uid))
#         self.assertEqual(response.status_code, 400)

#         response = client.put('/api/users/{}/ingredients/0/'.format(test_uid))
#         self.assertEqual(response.status_code, 400)

#         response = client.post('/api/signup/', json.dumps({'username': 'dori', 'email': 'swpp@snu.ac.kr', 'password': 'dori', 'name': 'dori', 'dateOfBirth': '980515'}),
#                                content_type='application/json')
#         self.assertEqual(response.status_code, 500)

#         response = client.post(
#             '/api/login/', json.dumps({'username': 'dori', 'password': 'dori'}),  content_type='application/json')
#         self.assertEqual(response.status_code, 201)

#     def test_user_and_user_ingredient(self):
#         client = Client()
#         response = client.post('/api/signup/', json.dumps({'username': 'dori', 'email': 'swpp@snu.ac.kr', 'password': 'dori', 'name': 'dori', 'dateOfBirth': '980515'}),
#                                content_type='application/json')
#         self.assertEqual(response.status_code, 201)
#         user = User.objects.all()[0]
#         response = client.get('/api/users/{}/fridge/'.format(user.id))

#         response = client.get('/api/ingredients/')
#         response = client.post(
#             '/api/users/{}/fridge/'.format(user.id), json.dumps({'ingredient_id': 300, }), content_type='application/json')
#         self.assertEqual(response.status_code, 201)

#         response = client.put('/api/users/{}/ingredients/300/'.format(user.id))
#         self.assertEqual(response.status_code, 200)

#         response = client.delete(
#             '/api/users/{}/ingredients/300/'.format(user.id))
#         self.assertEqual(response.status_code, 200)

#         response = client.get('/api/users/{}/'.format(user.id))
#         self.assertEqual(response.status_code, 200)

#         response = client.put('/api/users/{}/'.format(user.id), json.dumps({'name': 'dori', 'email': 'swpp@snu.ac.kr', 'password': 'dori', 'dateOfBirth': '980515'}),
#                               content_type='application/json')
#         self.assertEqual(response.status_code, 201)

#     def test_key_json_error(self):
#         client = Client()
#         response = client.post('/api/signup/', json.dumps({'username': 'dori', 'password': 'dori', 'name': 'dori', 'dateOfBirth': '980515'}),
#                                content_type='application/json')
#         self.assertEqual(response.status_code, 400)

#         response = client.post('/api/login/', json.dumps({'username': 'dori', }),
#                                content_type='application/json')
#         self.assertEqual(response.status_code, 400)

#         response = client.post('/api/signup/', json.dumps({'username': 'dori', 'email': 'swpp@snu.ac.kr', 'password': 'dori', 'name': 'dori', 'dateOfBirth': '980515'}),
#                                content_type='application/json')
#         self.assertEqual(response.status_code, 201)
#         user = User.objects.all()[0]
#         response = client.get('/api/ingredients/')
#         response = client.post(
#             '/api/users/{}/fridge/'.format(user.id), json.dumps({}), content_type='application/json')
#         self.assertEqual(response.status_code, 400)
