from typing import Tuple
import json
import ipinfo
import re
import requests as rqs
from geolib import geohash

mapping = {
    'Music': 'KZFzniwnSyZfZ7v7nJ',
    'Sport': 'KZFzniwnSyZfZ7v7nE',
    'Arts': 'KZFzniwnSyZfZ7v7na',
    'Theatre': 'KZFzniwnSyZfZ7v7na',
    'Film' : 'KZFzniwnSyZfZ7v7nn',
    'Misc': 'KZFzniwnSyZfZ7v7n1',
}

with open(f"/api_config.json", encoding='utf-8') as f:
    json_str = json.load(f)
    GOOGLE_MAP_API_KEY = json_str['Google_Map']
    TICKET_API_KEY = json_str["Ticket_Master"]


def hexstring_to_normal(string: str):
    if ("+" in string): return string
    new_url = ""
    flag = 0
    num = ""
    for char in string:
        if (not flag and char != '%'):
            new_url+=char
        elif (char == '%'):
            flag = 2
        elif (flag == 2):
            num = char
            flag -= 1
        else:
            num += char
            new_url += chr(int(num, base=16))
            flag = 0
    return new_url


def url_transform(text: str)->str:
    text = hexstring_to_normal(text)
    return re.sub('[^a-zA-Z0-9\']+', '+', text)


def get_data(params:dict) ->str:
    url = f'https://app.ticketmaster.com/discovery/v2/events.json?apikey={TICKET_API_KEY}'
    url += ''.join([f'&{key}={val}' for key,val in params.items()])
    response = rqs.get(url).text
    return response


def query_result(params: dict) -> str:
    if (params['auto-loc']=='true'):
        loc = get_loc_from_ip(params['ip'])
    else:
        loc = get_loc_from_google(params['location'])
    hash_val = geohash.encode(loc[0], loc[1], 5)
    keyword = url_transform(params['keyword'])
    query_form = {
        'geoPoint': hash_val,
        'radius': params['distance'],
        'unit': 'miles',
        'keyword': keyword,
    }
    if params['category'] != 'Default':
        query_form['segmentId'] = mapping[params['category']]
    data = get_data(query_form)
    return data

def query_detail(params: dict):
    print(params)
    event_url = 'https://app.ticketmaster.com/discovery/v2/events/{0}.json?apikey={1}'
    venue_url = 'https://app.ticketmaster.com/discovery/v2/venues/{0}.json?apikey={1}'
    event_response = rqs.get(event_url.format(params['eid'], TICKET_API_KEY));
    print(venue_url.format(params['vid'], TICKET_API_KEY))
    venue_response = rqs.get(venue_url.format(params['vid'], TICKET_API_KEY));
    json_conbine = f"[{event_response.text}, {venue_response.text}]"
    return json_conbine