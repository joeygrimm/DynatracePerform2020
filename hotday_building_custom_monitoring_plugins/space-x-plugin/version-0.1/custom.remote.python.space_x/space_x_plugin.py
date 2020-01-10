import logging
from ruxit.api.base_plugin import RemoteBasePlugin

logger = logging.getLogger(__name__)

class SpaceXPlugin(RemoteBasePlugin):
        
    def query(self, **kwargs):
        self.base_url = "http://localhost:5000"
        logger.info('requesting data from %s' % self.base_url)
        ship_count = 1
        
        ship_type = 'custom ship type'
        group_identifier = ship_type
        group_name = ship_type
        group = self.topology_builder.create_group(group_identifier, group_name)

        ship_id = 'custom_ship_id'
        ship_name = 'My Ship'
        device = group.create_device(ship_id, ship_name)
        device.absolute(key = 'fuel', value = 100.0)

        logger.info('%d ships found' % ship_count)