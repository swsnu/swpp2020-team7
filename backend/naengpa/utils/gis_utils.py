"""utility functions for gis lat-long distance operations"""
from user.models import Region
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.measure import D
from django.db.models.functions import Round


def get_nearest_places_from_region(region_id, topn=10, max_distance=5):
    """
    region_id: id of base region to calculate distances
    topn: max number of regions to return
    returns list of regions in the descending order of distances
    """
    base_region = Region.objects.get(pk=region_id)
    return get_nearest_places_from_lat_lng(base_region.latitude, base_region.longitude, topn + 1, max_distance)[1:]


def get_nearest_places_from_lat_lng(lat, lng, topn=10, max_distance=5):
    """
    lat: latitude of base location to calculate distances
    lng: longitude of base location to calculate distances
    topn: max number of regions to return
    max_distance: maximum distance in km
    returns list of regions in the descending order of distances
    """
    base_point = Point(lng, lat)

    nearest_regions = Region.objects.filter(
        location__distance_lt=(base_point, D(km=max_distance))
    ).annotate(
        distance=Round(Distance('location', base_point))
    ).order_by('distance')[:topn]

    return [{
        "id": region.id,
        "name": region.name,
        "location": {
            "latitude": region.latitude,
            "longitude": region.longitude,
        },
        "distance": region.distance.km,
    } for region in nearest_regions]