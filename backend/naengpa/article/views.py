"""views for article"""
import json
from operator import itemgetter
from django.http import JsonResponse, HttpResponseBadRequest,  HttpResponseNotFound
from django.views.decorators.csrf import ensure_csrf_cookie
from django.core.cache import cache
from django.db import transaction
from django.db.models.functions import Concat
from django.db.models import F, Q, Value, CharField
from rest_framework.decorators import api_view

from ingredient.models import Ingredient
from user.models import NeighborhoodRegion
from utils.aws_utils import upload_images
from utils.gis_utils import get_nearest_places_ids_from_region, get_nearest_places_names_from_region
from utils.auth import login_required_401
from .models import Article, Image


class InvalidOptionsGivenError(Exception):
    pass


def article_list_get(request):
    ''' GET /api/articles/ get article list '''
    query = request.GET.get('q')
    if not query:
        article_collection = cache.get('articles')
        if not article_collection:
            included_region_ids = NeighborhoodRegion.objects.filter(from_region_id=request.user.region.id,
                                                                    region_range=request.user.region_range).values_list('neighborhood_id', flat=True)
            sorted_list = Article.objects.select_related(
                'author', 'author__region', 'item'
            ).prefetch_related(
                'images',
            ).exclude(
                done=True
            ).filter(
                author__region__id__in=included_region_ids
            ).order_by('-created_at')
            article_collection = [{
                "id": article.id,
                "authorId": article.author.id,
                "author": article.author.username,
                "region": article.author.region.name,
                "title": article.title,
                "content": article.content,
                "item": {
                    "id": article.item.id,
                    "name": article.item.name,
                    "category": article.item.category.name,
                },
                "price": article.price,
                "views": article.views,
                "options": {
                    "isForSale": article.is_for_sale,
                    "isForExchange": article.is_for_exchange,
                    "isForShare": article.is_for_share,
                },
                "images": list(article.images.values('id', 'file_path')),
                "createdAt": article.created_at.strftime("%Y.%m.%d")
            } for article in sorted_list] if Article.objects.count() != 0 else []
            cache.set('articles', article_collection)
        else:
            included_region_names = request.user.region.neighborhoodregion_set.filter(
                region_range=request.user.region_range).distinct().annotate(name=Concat(F('neighborhood__gu_name'), Value(' '), F('neighborhood__dong_name'))).values_list('name', flat=True)
            article_collection = list(
                filter(lambda art: art['region'] in list(included_region_names), article_collection))
    else:
        included_region_ids = request.user.region.neighborhoodregion_set.filter(
            region_range=request.user.region_range).values_list('neighborhood_id', flat=True)
        q = Q(author__region__id__in=included_region_ids)
        if query:
            q |= Q(title__icontains=query) | Q(content__icontains=query) | Q(
                querystring__icontains=F('item__name'))

        sorted_list = Article.objects.select_related(
            'author', 'author__region', 'item'
        ).exclude(done=True).annotate(
            querystring=Value(query, output_field=CharField())
        ).filter(q).all().order_by('-created_at')

        article_collection = [{
            "id": article.id,
            "authorId": article.author.id,
            "author": article.author.username,
            "region": article.author.region.name,
            "title": article.title,
            "content": article.content,
            "item": {
                "id": article.item.id,
                "name": article.item.name,
                "category": article.item.category.name,
            },
            "price": article.price,
            "views": article.views,
            "options": {
                "isForSale": article.is_for_sale,
                "isForExchange": article.is_for_exchange,
                "isForShare": article.is_for_share,
            },
            "images": list(article.images.values('id', 'file_path')),
            "createdAt": article.created_at.strftime("%Y.%m.%d")
        } for article in sorted_list] if Article.objects.count() != 0 else []
    return JsonResponse(article_collection, safe=False)


@login_required_401
def article_list_post(request):
    """ POST /api/articles/ post new article """
    try:
        true, false = True, False
        author_id = request.user.id
        req_data = json.loads(request.POST.get('article'))
        title, content, item_str, price, options = itemgetter(
            'title', 'content', 'item', 'price', 'options')(req_data)
        if len(options) != 3 or True not in options.values():
            raise InvalidOptionsGivenError
        images = request.FILES.getlist('image')
        item = Ingredient.objects.get(name=item_str)
        article = Article.objects.create(
            author_id=author_id,
            title=title,
            content=content,
            item_id=item.id,
            price=price,
            is_for_sale=options['isForSale'],
            is_for_exchange=options['isForExchange'],
            is_for_share=options['isForShare'])
        request.user.naengpa_score += 100
        request.user.save()
    except (KeyError, json.decoder.JSONDecodeError):
        return HttpResponseBadRequest()
    except (Ingredient.DoesNotExist, InvalidOptionsGivenError):
        return HttpResponseBadRequest()

    images_path = upload_images(
        images, "article", article.id)
    for path in images_path:
        Image.objects.create(author_id=author_id,
                             file_path=path, article_id=article.id)

    return JsonResponse(data={
        "id": article.id,
        "authorId": author_id,
        "author": article.author.username,
        "region": article.author.region.name,
        "title": article.title,
        "content": article.content,
        "item": {
            "id": article.item.id,
            "name": article.item.name,
            "category": article.item.category.name,
        },
        "price": article.price,
        "views": article.views,
        "options": {
            "isForSale": article.is_for_sale,
            "isForExchange": article.is_for_exchange,
            "isForShare": article.is_for_share
        },
        "images": list(article.images.values('id', 'file_path')),
        "createdAt": article.created_at.strftime("%Y년 %m월 %d일 %H:%M"),
    }, status=201)


@ensure_csrf_cookie
@api_view(['GET', 'POST'])
@login_required_401
def article_list(request):
    """get article list or create an article"""
    if request.method == 'GET':
        return article_list_get(request)
    elif request.method == 'POST':
        return article_list_post(request)


@ensure_csrf_cookie
@api_view(['GET', 'DELETE'])
@login_required_401
@transaction.atomic
def article_info(request, aid):
    '''process article of given id'''
    if request.method == 'GET':
        ''' GET /api/articles/:aid/ get article of given id '''
        try:
            article = Article.objects.select_related(
                'author', 'author__region', 'item').get(id=aid)
        except Article.DoesNotExist:
            return HttpResponseNotFound()

        return JsonResponse(data={
            "id": article.id,
            "authorId": article.author.id,
            "author": article.author.username,
            "region": article.author.region.name,
            "title": article.title,
            "content": article.content,
            "item": {
                "id": article.item.id,
                "name": article.item.name,
                "category": article.item.category.name,
            },
            "price": article.price,
            "views": article.views,
            "options": {
                "isForSale": article.is_for_sale,
                "isForExchange": article.is_for_exchange,
                "isForShare": article.is_for_share
            },
            "images": list(article.images.values('id', 'file_path')),
            "createdAt": article.created_at.strftime("%Y년 %m월 %d일 %H:%M"),
        }, status=200)

    elif request.method == 'DELETE':
        ''' DELETE /api/articles/:aid/ delete article of given id '''
        try:
            article = Article.objects.select_related(
                'author', 'author__region', 'item').get(id=aid)
        except Article.DoesNotExist:
            return HttpResponseNotFound()

        deleted_article = {
            "id": article.id,
            "authorId": article.author.id,
            "author": article.author.username,
            "region": article.author.region.name,
            "title": article.title,
            "content": article.content,
            "item": {
                "id": article.item.id,
                "name": article.item.name,
                "category": article.item.category.name,
            },
            "price": article.price,
            "views": article.views,
            "options": {
                "isForSale": article.is_for_sale,
                "isForExchange": article.is_for_exchange,
                "isForShare": article.is_for_share
            },
            "images": list(article.images.values('id', 'file_path')),
            "createdAt": article.created_at,
        }
        article.delete()

        return JsonResponse(data=deleted_article, status=200)
