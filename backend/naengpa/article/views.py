"""views for article"""
import json
from operator import itemgetter
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest, HttpResponseForbidden,  HttpResponseNotFound, HttpResponseNotAllowed
from django.views.decorators.csrf import ensure_csrf_cookie
from django.db import transaction
from django.db.models import Q
from utils.aws_utils import upload_images
from ingredient.models import Ingredient
from .models import Article, Image


@ensure_csrf_cookie
@transaction.atomic
def article_list(request):
    """get article list"""
    if request.method == 'GET':
        ''' GET /api/articles/ get article list '''
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
        if not Article.objects.count():  # if article list is empty
            return JsonResponse([])

        query = request.GET.get('value', "")
        selected_list = Article.objects.select_related(
            'author', 'item', 'images').exclude(done=True)
        sorted_list = selected_list.filter(Q(title__icontains=query) | Q(content__icontains=query)).all().order_by(
            '-created_at') if query else selected_list.all().order_by('-created_at')

        article_collection = [{
            "id": article.id,
            "authorId": article.author.id,
            "author": article.author.username,
            "title": article.title,
            "content": article.content,
            "item": article.item.name,
            "price": article.price,
            "views": article.views,
            "images": article.images.all().values('id', 'file_path'),
            "createdAt": article.created_at.strftime("%Y.%m.%d")
        } for article in sorted_list]
        return JsonResponse(article_collection, safe=False)

    elif request.method == 'POST':
        """ POST /api/articles/ post new article """
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
        try:
            author_id = request.user.id
            req_data = eval(request.POST.dict().get('recipe', ''))  # FIXME:
            # req_data = json.loads(request.body.decode())
            title, content, item_str, price = itemgetter(
                'title', 'content', 'item', 'price')(req_data)
            images = request.FILES.getlist('image')
            item = Ingredient.objects.get(name=item_str)
            article = Article.objects.create(
                author_id=author_id,
                title=title,
                content=content,
                item_id=item.id,
                price=price)
        except (KeyError, json.decoder.JSONDecodeError):
            return HttpResponseBadRequest()
        except Ingredient.DoesNotExist:
            return HttpResponseBadRequest()

        images_path = upload_images(
            images, "article", article.id, author_id)
        for path in images_path:
            Image.objects.create(author_id=author_id,
                                 file_path=path, article_id=article.id)

        return JsonResponse(data={
            "id": article.id,
            "authorId": author_id,
            "author": article.author.username,
            "title": article.title,
            "content": article.content,
            "item": item.name,
            "price": article.price,
            "views": article.views,
            "images": article.images.all().values('id', 'file_path'),
            "createdAt": article.created_at,
        }, status=201)
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])


@ensure_csrf_cookie
@transaction.atomic
def article_info(request, aid):
    '''process article of given id'''
    if request.method == 'GET':
        ''' GET /api/articles/:aid/ get article of given id '''
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
        try:
            article = Article.objects.select_related(
                'author', 'item', 'images').get(id=aid)
        except Article.DoesNotExist:
            return HttpResponseNotFound()

        return JsonResponse(data={
            "id": article.id,
            "authorId": article.author.id,
            "author": article.author.username,
            "title": article.title,
            "content": article.content,
            "item": article.item.name,
            "price": article.price,
            "views": article.views,
            "images": article.images.all().values('id', 'file_path'),
            "createdAt": article.created_at,
        }, status=201)
    else:
        return HttpResponseNotAllowed(['GET'])
