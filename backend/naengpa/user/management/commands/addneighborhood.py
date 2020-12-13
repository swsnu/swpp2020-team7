
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from utils.gis_utils import get_nearest_places_ids_from_region
from user.models import Region, NeighborhoodRegion

User = get_user_model()


class Command(BaseCommand):
    """makes up Neighborhood database"""

    def handle(self, *args, **options):
        """makes up Neighborhood db table"""

        print('[start]')
        for region in Region.objects.all():
            for region_range in range(1, 5):
                neighborhood_ids = [region.id] + list(get_nearest_places_ids_from_region(
                    region.id, max_distance=region_range))
                bulk_list = [NeighborhoodRegion(from_region=region, neighborhood_id=nid)
                             for nid in neighborhood_ids]
                NeighborhoodRegion.objects.bulk_create(bulk_list)
                print(region, 'has', region.neighborhood.count(),
                      'neighborhood for', region_range, 'range')
