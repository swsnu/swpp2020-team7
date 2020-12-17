'''utility functions for logmeal detection'''
import io
import requests
from PIL import Image
from django.core.files.uploadedfile import InMemoryUploadedFile
from naengpa.settings.env import LOGMEAL_TOKEN

LOGMEAL_API_URL = 'https://api.logmeal.es/v2/recognition/dish'

TEMP_IMAGE_FILE_NAME = 'test.jpeg'

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


def convert_png_to_jpeg(img_data):
    png = Image.open(img_data)
    jpeg = Image.new('RGB', (png.width, png.height), color=(255, 255, 255))
    jpeg.paste(png, (0, 0), png)
    jpeg.save(TEMP_IMAGE_FILE_NAME, 'jpeg')
    saved_jpeg = Image.open(TEMP_IMAGE_FILE_NAME)
    new_io = io.BytesIO()
    saved_jpeg.save(new_io, format='JPEG')
    test = open(TEMP_IMAGE_FILE_NAME, 'rb')
    return InMemoryUploadedFile(test, None, TEMP_IMAGE_FILE_NAME, 'image/jpeg',
                                new_io.tell, None)


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
    if img.name.endswith('png'):
        img = convert_png_to_jpeg(img)

    headers = {'Authorization': 'Bearer {}'.format(LOGMEAL_TOKEN)}
    response = ''

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
