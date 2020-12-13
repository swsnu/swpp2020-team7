
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
        bulk_list = []
        for idx, region in enumerate(Region.objects.all()):
            for region_range in range(1, 5):
                neighborhood_ids = list(get_nearest_places_ids_from_region(
                    region.id, max_distance=region_range))
                if region.id not in neighborhood_ids:
                    neighborhood_ids.append(region.id)
                new_neighbors = [NeighborhoodRegion(from_region=region, neighborhood_id=nid, region_range=region_range)
                                 for nid in neighborhood_ids]
                bulk_list += new_neighbors
                print(region, 'has', len(new_neighbors),
                      'neighborhood for', region_range, 'range')
            if (idx + 1) % 30 == 0:
                NeighborhoodRegion.objects.bulk_create(bulk_list)
                bulk_list = []
