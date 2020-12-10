"""utility functions with konlpy"""
from collections import OrderedDict
from konlpy.tag import Kkma
from ingredient.models import Ingredient

kkma = Kkma()

ingredients = Ingredient.objects.values_list('name', flat=True)


def extract_ingredients(content):
    noun_list = kkma.nouns(content)
    print("추출된 명사 리스트: ", noun_list)

    ingredient_dict = {}
    # extract nouns only and compare with the ingredient list
    for item in noun_list:
        if item in ingredients:
            try:
                ingredient_dict[item] += 1
            except KeyError:
                ingredient_dict[item] = 1

    context = [
        {
            "name": name,
            "quantity": count
        } for name, count in sorted(ingredient_dict.items(), key=lambda x: -x[1])
    ]
    return context
