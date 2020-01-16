import requests
import json
import logging
from ruxit.api.base_plugin import RemoteBasePlugin

logger = logging.getLogger(__name__)

class SpaceXPlugin(RemoteBasePlugin):
        
    def query(self, **kwargs):
        self.base_url = "http://localhost:5000"
        logger.info('requesting data from %s' % self.base_url)
        ships = self.load_ships()
        ship_count = 0
        for ship_type, ships in ships.items():
            group_identifier = ship_type
            group_name = ship_type
            group = self.topology_builder.create_group(group_identifier, group_name)
            for ship in ships:
                ship_count += 1
                ship_id = ship['ship_id']
                ship_name = ship['ship_name']
                device = group.create_device(ship_id, ship_name)
                if 'fuel' in ship:
                    fuel = ship['fuel']
                    if fuel is not None:
                        device.absolute(key = 'fuel', value = fuel)
        logger.info('%d ships found' % ship_count)

    def load_ships(self):
        results = {}
        resp = requests.get(self.base_url + "/v3/ships")
        records = json.loads(resp.content)
        for ship in records:
            ship_type = ship['ship_type']
            ships_for_type = []
            if ship_type in results:
                ships_for_type = results[ship_type] 
            ships_for_type.append(ship)
            results[ship_type] = ships_for_type
        return results