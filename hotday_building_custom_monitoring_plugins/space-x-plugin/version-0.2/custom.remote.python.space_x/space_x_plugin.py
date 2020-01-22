import requests
import json
import logging
from ruxit.api.base_plugin import RemoteBasePlugin

logger = logging.getLogger(__name__)

class SpaceXPlugin(RemoteBasePlugin):
        
    def query(self, **kwargs):
        self.base_url = "http://35.161.232.230"
        ships = self.load_ships()


        ship_count = 0
        for ship_type, ships in ships.items():
            # create a technology group for each ship type
            # you reuse the ship_type for both, the name and
            # the unique identifier of the group
            for ship in ships:
                # create a custom device for every ship
                # using the technology group for the previously
                # created ship type
                ship_id = ...
                ship_name = ...
                device = group.create_device(ship_id, ship_name)
                
                if 'fuel' in ship:
                    fuel = ...
                    if fuel is not None:
                        # report the available fuel on the ship as a metric

        logger.info('%d ships found' % ship_count)

    # loads a list of ships via HTTP    
    def load_ships(self):
        logger.info('requesting data from %s/v3/ships' % self.base_url)
        results = {}
        resp = requests.get(self.base_url + "/v3/ships")
        records = resp.json
        for ship in records:
            ship_type = ship['ship_type']
            ships_for_type = []
            if ship_type in results:
                ships_for_type = results[ship_type] 
            ships_for_type.append(ship)
            results[ship_type] = ships_for_type
        return results