"""tests for comment"""
import json
from django.contrib.auth import get_user_model
from django.test import TestCase, Client
from user.models import Region
from recipe.models import Recipe
from food_category.models import FoodCategory
from .models import Comment, CommentLike

User = get_user_model()


class CommentTestCase(TestCase):
    """ testcase for comments api """

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

        test_food_category = FoodCategory.objects.create(
            name="밥류")
        self.test_recipe = Recipe.objects.create(
            author=test_user,
            food_name='테스트',
            food_category=test_food_category,
            cook_time=10,
            recipe_content='테스트',
        )
        self.mock_comment = Comment.objects.create(
            author=test_user,
            recipe_id=self.test_recipe.id,
            content='test',
        )

    def test_comment_list(self):
        # user is not defined
        response = self.client.post('/api/comments/', follow=True)
        self.assertEqual(response.status_code, 401)

        # with authorization
        self.client.login(username='test', password='test')

        response = self.client.post('/api/comments/')
        self.assertEqual(response.status_code, 400)

        # post comment
        response = self.client.post('/api/comments/', {
            'recipeId': self.test_recipe.id,
            'content': 'test',
        })
        self.assertEqual(response.status_code, 201)

        # bad request method
        response = self.client.get('/api/comments/')
        self.assertEqual(response.status_code, 405)

        response = self.client.put('/api/comments/')
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/comments/')
        self.assertEqual(response.status_code, 405)

    def test_comment(self):
        # user is not defined
        response = self.client.put(
            '/api/comments/{}/'.format(self.mock_comment.id), follow=True)
        self.assertEqual(response.status_code, 401)

        # with authorization
        self.client.login(username='test', password='test')

        # put comment
        response = self.client.put(
            '/api/comments/{}/'.format(self.mock_comment.id), json.dumps({
                'content': 'new content',
            }), content_type='application/json')
        self.assertEqual(response.status_code, 200)

        # delete comment
        response = self.client.delete(
            '/api/comments/{}/'.format(self.mock_comment.id))
        self.assertEqual(response.status_code, 204)

        # bad request method
        response = self.client.get(
            '/api/comments/{}/'.format(self.mock_comment.id))
        self.assertEqual(response.status_code, 405)

        response = self.client.post(
            '/api/comments/{}/'.format(self.mock_comment.id))
        self.assertEqual(response.status_code, 405)

    def test_comment_like(self):
        # user is not defined
        response = self.client.put(
            '/api/comments/{}/like/'.format(self.mock_comment.id), follow=True)
        self.assertEqual(response.status_code, 401)

        # with authorization
        self.client.login(username='test', password='test')

        # put comment
        response = self.client.put(
            '/api/comments/{}/like/'.format(self.mock_comment.id))
        self.assertEqual(response.status_code, 200)

        # bad request method
        response = self.client.get(
            '/api/comments/{}/like/'.format(self.mock_comment.id))
        self.assertEqual(response.status_code, 405)

        response = self.client.post(
            '/api/comments/{}/like/'.format(self.mock_comment.id))
        self.assertEqual(response.status_code, 405)

        response = self.client.delete(
            '/api/comments/{}/like/'.format(self.mock_comment.id))
        self.assertEqual(response.status_code, 405)
