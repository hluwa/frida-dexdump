# Author: hluwa <hluwa888@gmail.com>
# HomePage: https://github.com/hluwa
# CreatedTime: 2020/3/5 19:14

def in_objection():
    try:
        import objection
        return objection.state.connection.state_connection.get_api()
    except:
        return False


if in_objection():
    __description__ = "a objection plugin to fast search and dump dex on memory."

    from .main import *
    from objection.state.connection import state_connection
    from objection.utils.plugin import Plugin


    class DEXDump(Plugin):

        def __init__(self, ns):
            """
                Creates a new instance of the plugin
                :param ns:
            """

            self.script_path = os.path.join(os.path.dirname(__file__), "agent.js")

            implementation = {
                'meta': 'fast search and dump dex on memory.',
                'commands': {
                    'search': {
                        'meta': 'search all dex',
                        'exec': self.search
                    },
                    'dump': {
                        'meta': 'dump all dex',
                        'exec': self.dump
                    }
                }
            }

            super().__init__(__file__, ns, implementation)

            self.inject()

        def search(self, args=None):
            main.search(self.api)

        def dump(self, args=None):
            """
            """
            main.dump(state_connection.gadget_name, self.api)


    namespace = 'dexdump'
    plugin = DEXDump
