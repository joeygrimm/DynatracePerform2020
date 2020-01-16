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
                if 'speed_kn' in ship:
                    speed = ship['speed_kn']
                    if speed is not None:
                        device.absolute(key = 'speed', value = speed)
                if 'thrust' in ship:
                    thrust = ship['thrust']
                    for thrust_entry in thrust:
                        engine = thrust_entry['engine']
                        power = thrust_entry['power']
                        device.absolute(key='thrust', value=power, dimensions = { 'engine': engine })
                
                if 'home_port' in ship:
                    home_port = ship['home_port']
                    if home_port is not None:
                        device.report_property('Home Port', home_port)
                if 'url' in ship:
                    url = ship['url']
                    if url is not None:
                        device.report_property('URL', url)

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