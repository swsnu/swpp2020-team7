"""views for ingredient"""
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from .models import Ingredient, IngredientCategory
from django.views.decorators.csrf import ensure_csrf_cookie


@ensure_csrf_cookie
def ingredient_list(request):
    """/api/ingredients/ Get article list"""
    if request.method == 'GET':
        create_ingredients(request)
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
        return_data = {category.name: [
            item for item in category.ingredients.all().values('id', 'name')]
            for category in IngredientCategory.objects.all()}
        return JsonResponse(return_data, safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])


@ ensure_csrf_cookie
def create_ingredients(request):
    """makes up database"""
    ingredient_dict = {}
    ingredient_dict['과일'] = '사과, 배, 귤, 바나나, 망고, 복숭아, 파인애플, 포도, 자두, 감, 수박, 멜론, 참외, 딸기, 키위, 블루베리, 체리, 석류'.split(
        ', ')
    ingredient_dict['채소'] = '양파, 마늘, 파, 생강, 오이, 가지, 고구마, 감자, 호박, 옥수수, 고추, 피망, 파프리카, 상추, 깻잎, 시금치, 부추, 양배추, 양상추, 브로콜리, 샐러드, 어린잎채소, 버섯, 배추, 무, 아스파라거스, 허브류, 인삼, 더덕'.split(
        ', ')
    ingredient_dict['고기'] = '소고기, 돼지고기, 닭고기, 양고기, 오리고기'.split(', ')
    ingredient_dict['수산물/건해산'] = '고등어, 갈치, 꽁치, 연어, 장어, 자반고등어, 오징어, 낙지, 주꾸미, 문어, 새우, 꽃게, 대게, 전복, 굴, 소라, 홍합, 바지락, 명란, 날치알, 진미채, 건오징어, 쥐포, 멸치'.split(
        ', ')
    ingredient_dict['우유/유제품'] = '우유, 요거트, 요구르트, 두유, 버터, 생크림, 파마산 치즈, 슬라이스치즈, 모짜렐라치즈, 크림치즈, 과일치즈'.split(
        ', ')
    ingredient_dict['계란/알류'] = '계란, 메추리알'.split(', ')
    ingredient_dict['가공육'] = '소시지, 햄, 베이컨'.split(', ')
    ingredient_dict['두부/콩류'] = '두부, 콩나물, 숙주나물, 콩'.split(', ')
    ingredient_dict['라면/면류'] = '라면, 짜장라면, 비빔라면, 볶음라면, 우동, 칼국수, 소면'.split(', ')
    ingredient_dict['즉석식품/통조림'] = '참치캔, 통조림햄, 닭가슴살캔, 생선캔, 골뱅이캔'.split(', ')
    ingredient_dict['소스/잼류'] = '굴소스, 케찹, 마요네즈, 돈가스소스, 토마토소스, 크림소스, 로제소스, 오일소스, 바질 페스토, 딸기잼, 블루베리잼'.split(', ')
    ingredient_dict['김치/장류'] = '국간장, 진간장, 고추장, 된장, 배추김치, 깍두기, 열무김치'.split(', ')
    ingredient_dict['양념류'] = '소금, 설탕, 후추, 식초'.split(', ')

    print('[start]')
    for category, name_list in ingredient_dict.items():
        try:
            ingredient_category = IngredientCategory.objects.get(name=category)
        except IngredientCategory.DoesNotExist:
            ingredient_category = IngredientCategory.objects.create(
                name=category)
            print(f'IngredientCategory [{ingredient_category}] created')

        for name in name_list:
            try:
                Ingredient.objects.get(name=name)
            except Ingredient.DoesNotExist:
                print(Ingredient.objects.create(
                    category=ingredient_category, name=name))

    return HttpResponse()
