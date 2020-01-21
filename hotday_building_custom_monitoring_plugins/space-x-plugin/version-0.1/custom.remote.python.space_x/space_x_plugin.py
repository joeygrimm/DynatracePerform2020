import logging
from ruxit.api.base_plugin import RemoteBasePlugin

logger = logging.getLogger(__name__)

class SpaceXPlugin(RemoteBasePlugin):
        
    def query(self, **kwargs):
        # create a technology group for the 'ship type' using the topology builder
        # for simplicity the unique identifier of the group and its name can be the same
        group = self.topology_builder.create_group(...)

        # create a custom device for the ship
        device = group.create_device(...)

        # report a metric for this custom device
        # take a look into plugin.json in order to find out what
        # metric key to use
        device.absolute(key = ..., value = 100.0)
        
        # it's always a good idea to log out at least one line
        # during development
        logger.info('%d ships found' % 1)