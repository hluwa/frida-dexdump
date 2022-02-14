# Author: hluwa <hluwa888@gmail.com>
# HomePage: https://github.com/hluwa
# CreateTime: 2021/6/3
import os

from wallbreaker.agent import Agent


class DexDumpAgent(Agent):

    def __init__(self, connection=None):
        super().__init__(connection=connection, script_file=os.path.join(os.path.dirname(__file__), "agent.js"))

    def on_message(self, message, data):
        if message['type'] == 'send':
            print("[*] {0}".format(message))
        else:
            print(message)

    def search_dex(self, enable_deep_search=True):
        return self._rpc.searchdex(enable_deep_search)

    def memory_dump(self, base, size):
        return self._rpc.memorydump(base, size)

    def read_code(self, buffer_size, class_name, method_name, *overload):
        return self._rpc.readcode(buffer_size, class_name, method_name, *overload)
