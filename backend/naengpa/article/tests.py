# # Create your tests here.
# """test for article"""
# from django.test import TestCase, Client
# import json
# from .models import Recipe, Image


# class ArticleTestCase(TestCase):
#     def test_user_authentication(self):
#         client = Client(enforce_csrf_checks=True)
#         response = client.get(
#             '/api/articles/', content_type='application/json')

#         # check csrf token
#         self.assertEqual(response.status_code, 401)
#         csrftoken = response.cookies['csrftoken'].value
#         response = client.post('/api/articles/',  "article: {'title': 'test', 'content': 'test', 'item': 'test', 'price': 'test'}, image: []",
#                                content_type='multipart/form-data', HTTP_X_CSRFTOKEN=csrftoken)

#         # user shouldn't be authenticated
#         self.assertEqual(response.status_code, 400)

#     def test_article(self):
#         client = Client()
#         response = client.get(
#             '/api/articles/', content_type='application/json')
#         response = client.post('/api/signup/', json.dumps({'username': 'nimo', 'name': "nimo", 'password': "nimo", 'dateOfBirth': "19950506", "email": "dori@dori.com"}),
#                                content_type='application/json')
#         self.assertEqual(response.status_code, 201)

#         # method put not allowed
#         response = client.put('/api/recipes/', json.dumps({'foodName': 'apple', 'cookTime': 0, 'recipeContent': "사과", 'foodImages': [], }),
#                               content_type='application/json')
#         self.assertEqual(response.status_code, 405)

#         # method post
#         response = client.post('/api/recipes/', "recipe: {'foodName': 'apple', 'cookTime': 0, 'recipeContent': '사과'}, image: []",
#                                content_type='multipart/form-data')
#         self.assertEqual(response.status_code, 400)

#         # method get
#         response = client.get('/api/articles/')
#         self.assertEqual(response.status_code, 200)

#     def test_recipe_detail(self):
#         client = Client()
#         response = client.get('/api/recipes/0/')
#         self.assertEqual(response.status_code, 405)
