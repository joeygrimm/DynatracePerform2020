import requests
import json
import logging
from ruxit.api.base_plugin import RemoteBasePlugin

logger = logging.getLogger(__name__)

class SpaceXPlugin(RemoteBasePlugin):

    def initialize(self, **kwargs):
        self.config = kwargs['config']
        self.base_url = self.config["url"]
        
    def query(self, **kwargs):
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
                if 'sattelite_latency' in ship:
                    speed = ship['sattelite_latency']
                    if speed is not None:
                        logger.info('sattelite_latency %s' % speed)
                        device.absolute(key = 'sattelite_latency', value = speed)
                if 'thrust' in ship:
                    thrust = ship['thrust']
                    for thrust_entry in thrust:
                        engine = thrust_entry['engine']
                        power = thrust_entry['power']
                        device.absolute(key='thrust', value=power, dimensions = { 'engine': engine })
                # report the weather this ship is sailing in
                # Hint: device.state_metric(....)

                # tell dynatrace the IP address of the custom device
                # Hint: the parameter for the port of an endpoint is optional
                device.add_endpoint(ship['ship_ip'])
                
                if 'home_port' in ship:
                    home_port = ship['home_port']
                    if home_port is not None:
                        device.report_property('Home Port', home_port)
                if 'url' in ship:
                    url = ship['url']
                    if url is not None:
                        device.report_property('URL', url)                        

        logger.info('%d ships found' % ship_count)

    # loads a list of ships via HTTP    
    def load_ships(self):
        logger.info('requesting data from %s/v3/ships' % self.base_url)
        results = {}
        resp = requests.get(self.base_url + "/v3/ships")
        records = resp.json()
        for ship in records:
            ship_type = ship['ship_type']
            ships_for_type = []
            if ship_type in results:
                ships_for_type = results[ship_type] 
            ships_for_type.append(ship)
            results[ship_type] = ships_for_type
        return results