'''utility functions for logmeal detection'''
import requests
from naengpa.settings.env import LOGMEAL_TOKEN

LOGMEAL_API_URL = 'https://api.logmeal.es/v2/recognition/dish'

food_category_result = {
    'meat': '고기류',
    'dessert': '디저트류',
    'dairy': '유제품류',
    'seafood': '해산물류',
    'rice': '밥류',
    'fruit': '과일류',
    'noodles/pasta': '면류',
    'vegetables': '채소류',
    'fish': '해산물류',
    'bread': '빵류',
    'fried': '튀김류',
    'egg': '계란/알류',
    'soup': '수프/국/찌개류',
    '': '기타'}


# def convertToJpeg(img):
#     with BytesIO() as f:
#         img.save(f, format='JPEG')
#         return f.getvalue()

class InvalidImageFileGiven(Exception):
    pass


def extract_foodcategory(food_images):
    ''' extract foodcategory with lodmeal ai api '''
    if not food_images:
        return food_category_result['']

    # Parameters
    img = food_images[0]
    headers = {'Authorization': 'Bearer {}'.format(LOGMEAL_TOKEN)}
    response = ''
    # im1 = Image.open(r'path where the PNG is stored\file name.png')
    # im1.save(r'path where the JPG will be stored\new file name.jpg')

    # Food Dish/Groups Detection
    try:
        resp = requests.post(LOGMEAL_API_URL,
                             files={'image': img},
                             headers=headers)
        resp.raise_for_status()
        # print(resp.json()['foodFamily'])  # display groups only
        response = resp.text.split('"')[7]
    except IndexError:
        response = ''
    except requests.exceptions.HTTPError as err:
        if resp.status_code == 413:
            print('[logmeal api] too large image file given')
            # raise InvalidImageFileGiven(resp.json()['message']) from err
        if resp.status_code == 400:
            print('[logmeal api] invalid image file given')
            # raise InvalidImageFileGiven(resp.json()['message']) from err
        pass

    if response not in food_category_result.keys():
        response = ''
    return food_category_result[response]
