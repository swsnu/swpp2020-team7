"""test for article"""
import json
from django.contrib.auth import get_user_model
from django.test import TestCase, Client
from user.models import Region
from ingredient.models import Ingredient, IngredientCategory
from .models import Article, Image

User = get_user_model()


class ArticleTestCase(TestCase):
    """ testcase for articles api """

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

        test_category = IngredientCategory.objects.create(name="과일류")
        test_ingredient = Ingredient.objects.create(
            category=test_category,
            name="딸기")
        test_article = Article.objects.create(
            author=test_user,
            title='테스트',
            content='테스트',
            item=test_ingredient,
        )

    def test_article_list(self):
        # with authorization
        self.client.login(username='test', password='test')

        # get article list
        response = self.client.get('/api/articles/')
        self.assertEqual(response.status_code, 200)

        # post article
        mock_article = json.dumps({'title': 'test', 'content': 'test', 'item': '딸기', 'price': 0, 'options': {
            'isForSale': True, 'isForExchange': False, 'isForShare': False}})
        response = self.client.post('/api/articles/', {
            'article': mock_article,
            'image': ''})
        self.assertEqual(response.status_code, 201)

        # bad request method
        response = self.client.put('/api/articles/')
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/articles/')
        self.assertEqual(response.status_code, 405)

    def test_article(self):
        mock_article = Article.objects.all()[0]
        mock_article_id = mock_article.id
        self.assertEqual(str(
            mock_article), f'[{mock_article_id}] {mock_article.title} by {mock_article.author}')

        # user is not defined
        response = self.client.get(
            '/api/articles/{}/'.format(mock_article_id), follow=True)
        self.assertEqual(response.status_code, 401)

        # with authorization
        self.client.login(username='test', password='test')

        # get article
        response = self.client.get('/api/articles/{}/'.format(mock_article_id))
        self.assertEqual(response.status_code, 200)

        # cache test
        response = self.client.get('/api/articles/{}/'.format(mock_article_id))
        self.assertEqual(response.status_code, 200)

        # bad request method
        response = self.client.post(
            '/api/articles/{}/'.format(mock_article_id))
        self.assertEqual(response.status_code, 405)

        # put article
        mock_article = json.dumps({'title': 'test_new', 'content': 'test_new', 'price': 777, 'options': {
            'isForSale': False, 'isForExchange': True, 'isForShare': False}})
        response = self.client.put('/api/articles/{}/'.format(mock_article_id), {
            'article': mock_article,
            'image': ''}, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        # delete article
        response = self.client.delete(
            '/api/articles/{}/'.format(mock_article_id))
        self.assertEqual(response.status_code, 200)
