import requests
import math

# Replace with your actual API key
API_KEY = '668bd33e15297016737098smeaceea1'

def get_coordinates(address):
    base_url = f'https://geocode.maps.co/search?q={address}&api_key={API_KEY}'
    response = requests.get(base_url)
    if response.status_code == 200:
        data = response.json()
        if data:
            location = data[0]  # Assuming the first result is the most relevant
            return location['lat'], location['lon']
    return None, None

def get_address(lat, lon):
    base_url = f'https://geocode.maps.co/reverse?lat={lat}&lon={lon}&api_key={API_KEY}'
    response = requests.get(base_url)
    if response.status_code == 200:
        data = response.json()
        if data:
            return data['display_name']  # This field usually contains the human-readable address
    return None

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in kilometers
    dlat = math.radians(float(lat2) - float(lat1))
    dlon = math.radians(float(lon2) - float(lon1))
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(float(lat1))) * math.cos(math.radians(float(lat2))) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c
    return distance
