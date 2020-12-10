'''utility functions for logmeal detection'''
import requests
from naengpa.settings.env import LOGMEAL_TOKEN

LOGMEAL_API_URL = 'https://api.logmeal.es/v2/recognition/dish'

food_category_result = {
    'meat': '육류',
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
    def __init__(self, message, code):
        self.code = code
        super(InvalidImageFileGiven, self).__init__(message)


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
        resp = resp.json()
        if resp['code'] == 715:
            print('[logmeal api] too large image file given')
        elif resp['code'] == 711:
            print('[logmeal api] invalid image file format given')
        else:
            print('[logmeal api] something went wrong')
        raise InvalidImageFileGiven(resp['message'], resp['code']) from err

    if response not in food_category_result.keys():
        response = ''
    return food_category_result[response]
