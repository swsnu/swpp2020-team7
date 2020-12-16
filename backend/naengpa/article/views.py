"""views for article"""
import json
from operator import itemgetter
from django.http import JsonResponse, HttpResponseBadRequest,  HttpResponseForbidden, HttpResponseNotFound
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.core.cache import cache
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404
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


def _get_cache_or_set_article_by_id(id):
    article_data = cache.get('article:{}'.format(id))
    if not article_data:
        try:
            article = Article.objects.select_related(
                'author', 'author__region', 'item', 'item__category'
            ).prefetch_related('images').get(pk=id)
        except Article.DoesNotExist:
            return HttpResponseNotFound()
        article_data = {
            "id": article.id,
            "authorId": article.author.id,
            "author": article.author.username,
            "region": article.author.region.name,
            "profileImage": article.author.profile_image,
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
            "createdAt": article.created_at.strftime("%Y년 %m월 %d일 %H:%M")
        }
        cache.set('article:{}'.format(id), article_data)
    return article_data


def article_list_get(request):
    ''' GET /api/articles/ get article list '''
    query = request.GET.get('q')
    is_for_sale = request.GET.get('fs')
    is_for_exchange = request.GET.get('fe')
    is_for_share = request.GET.get('fh')
    page = request.GET.get('p', 1)

    included_region_ids = request.user.region.neighborhoodregion_set.filter(
        region_range=request.user.region_range).values_list('neighborhood_id', flat=True)

    filtered_list = Article.objects.exclude(
        done=True
    ).filter(
        author__region__id__in=included_region_ids
    )

    options = [is_for_sale, is_for_exchange, is_for_share]
    if 'true' in options and 'false' in options:
        q = Q()
        if is_for_sale == 'true':
            q |= Q(is_for_sale=True)
        if is_for_exchange == 'true':
            q |= Q(is_for_exchange=True)
        if is_for_share == 'true':
            q |= Q(is_for_share=True)
        filtered_list = filtered_list.filter(q)

    if query:
        q = Q()
        q |= Q(title__icontains=query) | Q(content__icontains=query) | Q(
            querystring__icontains=F('item__name')) | Q(item__name__icontains=query)
        filtered_list = filtered_list.annotate(
            querystring=Value(query, output_field=CharField())
        ).filter(q)

    sorted_list = filtered_list.order_by('-created_at')
    paginator = Paginator(sorted_list, 9)
    paged_list = paginator.get_page(page)

    article_collection = [_get_cache_or_set_article_by_id(
        aid) for aid in paged_list.object_list.values_list('id', flat=True)]

    return JsonResponse({
        "articleList": article_collection,
        "lastPageIndex": paginator.count,
    }, safe=False)


@transaction.atomic
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

    return JsonResponse(_get_cache_or_set_article_by_id(article.id), status=201)


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
@api_view(['GET', 'PUT', 'DELETE'])
@login_required_401
@transaction.atomic
def article_info(request, aid):
    '''process article of given id'''
    if request.method == 'GET':
        ''' GET /api/articles/:aid/ get article of given id '''
        return JsonResponse(_get_cache_or_set_article_by_id(aid))

    elif request.method == 'PUT':
        ''' PUT /api/articles/:aid/ put article of given id '''
        article = get_object_or_404(Article, pk=aid)
        if request.user.id != article.author.id:
            return HttpResponseForbidden()
        try:
            true, false = True, False
            article_data = json.loads(request.data.get('article'))
            title, content, price, options = itemgetter(
                'title', 'content', 'price', 'options')(article_data)
            if len(options) != 3 or True not in options.values():
                raise InvalidOptionsGivenError

            article.title = title
            article.content = content
            article.price = price
            article.is_for_sale = options['isForSale']
            article.is_for_exchange = options['isForExchange']
            article.is_for_share = options['isForShare']
            article.save()
        except (KeyError, json.decoder.JSONDecodeError, InvalidOptionsGivenError):
            return HttpResponseBadRequest()

        images = request.FILES.getlist('image')
        if images:
            images_path = upload_images(
                images, "article", aid)
            Image.objects.filter(
                author_id=request.user.id, article_id=aid).delete()
            for path in images_path:
                Image.objects.create(author_id=request.user.id,
                                     file_path=path, article_id=aid)

        return JsonResponse(_get_cache_or_set_article_by_id(aid), status=201)
    elif request.method == 'DELETE':
        ''' DELETE /api/articles/:aid/ delete article of given id '''
        try:
            article = Article.objects.select_related(
                'author', 'author__region', 'item').get(pk=aid)
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
            "profileImage": article.author.profile_image,
            "createdAt": article.created_at,
        }
        article.delete()

        return JsonResponse(data=deleted_article, status=200)
