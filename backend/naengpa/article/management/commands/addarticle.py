import os
import csv
import random
import requests
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from article.models import Article, Image
from ingredient.models import Ingredient
from utils.aws_utils import upload_images_from_urls

User = get_user_model()


class Command(BaseCommand):
    """makes up Article database"""

    def add_arguments(self, parser):
        parser.add_argument('csv_path', type=str)

    def handle(self, *args, **kwargs):
        """makes up article db table with csv file"""
        if 'csv_path' not in kwargs.keys():
            print("please specify path to csv input file")
            return

        input_fname = kwargs['csv_path']
        if not os.path.isfile(input_fname):
            print("given path is not a file")
            return
        if os.path.splitext(input_fname)[1] != ".csv":
            print("only csv file input is allowed")
            return

        user_id_list = User.objects.values_list('id', flat=True)

        with open(input_fname, newline='') as csvfile:
            spamreader = csv.reader(
                csvfile, delimiter=',', quotechar='"')
            for row in spamreader:
                title, content, item, price, img_path = row
                price = 0 if not price else price
                content = content.replace('<SEP>', '\n')
                item = Ingredient.objects.get(name=item)
                print(title, content, item, price, img_path)

                with transaction.atomic():
                    try:
                        Article.objects.get(title=title, item=item)
                        print("[skip]", title, item)
                    except Article.DoesNotExist:
                        random_user_id = random.choice(user_id_list)
                        is_for_sale = True if random.randrange(
                            10) > 1 else False
                        is_for_exchange = True if random.randrange(
                            10) > 5 else False
                        is_for_share = True if random.randrange(
                            10) > 8 else False
                        is_for_share = True if not price else is_for_share
                        if not is_for_sale and not is_for_exchange and not is_for_share:
                            is_for_sale = True

                        new_article = Article.objects.create(
                            author_id=random_user_id,
                            title=title,
                            content=content,
                            item=item,
                            price=price,
                            is_for_sale=is_for_sale,
                            is_for_exchange=is_for_exchange,
                            is_for_share=is_for_share,
                        )
                        print(new_article)

                        s3_path = upload_images_from_urls(
                            [img_path], 'article', new_article.id)[0]
                        Image.objects.create(
                            author_id=random_user_id, file_path=s3_path, article_id=new_article.id)

                        random_user = User.objects.get(id=random_user_id)
                        random_user.naengpa_score += 50
                        random_user.save(update_fields=['naengpa_score'])
