"""utility functions for kakao api"""
import json
import requests
from naengpa.settings.env import APP_REST_API_KEY


def geocode(addr):
    """
    kako geocode rest API
    addr: query string contatining address
    returns (latitude, longitude) of the best matching location
    """
    url = 'https://dapi.kakao.com/v2/local/search/address.json?query=' + addr
    headers = {"Authorization": "KakaoAK {}".format(APP_REST_API_KEY)}
    result = json.loads(str(requests.get(url, headers=headers).text))
    match_first = result['documents'][0]['address']
    return float(match_first['y']), float(match_first['x'])
