# Author: hluwa <hluwa888@gmail.com>
# HomePage: https://github.com/hluwa
# CreateTime: 2021/6/3
__version__ = "2.0.1"

import argparse
import hashlib
import logging
import os.path
import time

from frida_tools.application import ConsoleApplication
from wallbreaker.connection import Connection

from frida_dexdump.agent import DexDumpAgent
from frida_dexdump.banner import show_banner

logger = logging.getLogger("frida-dexdump")
md5 = lambda bs: hashlib.md5(bs).hexdigest()


class SessionConnection(Connection):

    def __init__(self, device, session):
        self.device = device
        self.session = session
        self.process = str(self.session)


def _fixup_version(parser: argparse.ArgumentParser):
    if not hasattr(parser, "_actions"): return

    for action in parser._actions:
        if "--version" in action.option_strings \
                and action.dest == "version":
            action.version = __version__


class DexDumpApplication(ConsoleApplication):
    agent = None

    def _needs_target(self):
        return True

    def _usage(self):
        return "Usage see: frida-dexdump -h"

    def _add_options(self, parser):
        # fixup frida-tools#75 47d020ad1e51a1a5037c630e2de7136b867e86aa
        if not hasattr(parser, "add_argument") and hasattr(parser, "add_option"):
            setattr(parser, "add_argument", getattr(parser, "add_option"))

        _fixup_version(parser)

        parser.add_argument("-o", "--output", help="Output folder path, default is './<appname>/'.",
                            type=str, action='store')
        parser.add_argument("-d", "--deep-search", help="Enable deep search mode.",
                            action='store_true', dest="enable_deep", default=False)
        parser.add_argument("--sleep", help="Waiting times for start, spawn mode default is 5s.",
                            type=int, action='store', default=None)

    def _initialize(self, parser, options, args):
        show_banner()
        self.mds = set()
        self.output = options.output
        self.enable_deep = options.enable_deep
        self.sleep = options.sleep
        # spawn mode
        if self.sleep is None and self._target[0] == "file":
            self.sleep = 5

    def _start(self):
        self.connection = SessionConnection(self._device, self._session)
        self.agent = DexDumpAgent(self.connection)
        self.package_name = self.get_package_name()
        if not self.output:
            self.output = os.path.join(os.getcwd(), self.package_name.replace(":", "-"))
            os.makedirs(self.output, exist_ok=True)
        self._resume()
        if self.sleep:
            logger.info("Waiting {}s...".format(self.sleep))
            time.sleep(self.sleep)
        self.dump()
        self._exit(0)

    def dump(self):
        logger.info("[+] Searching...")
        st = time.time()
        ranges = self.agent.search_dex(enable_deep_search=self.enable_deep)
        et = time.time()
        logger.info("[*] Successful found {} dex, used {} time.".format(len(ranges), int(et - st)))
        logger.info("[+] Starting dump to '{}'...".format(self.output))
        idx = 1
        for dex in ranges:
            try:
                bs = self.agent.memory_dump(dex['addr'], dex['size'])
                md = md5(bs)
                if md in self.mds:
                    continue
                self.mds.add(md)
                bs = fix_header(bs)
                out_path = os.path.join(self.output, "classes{}.dex".format('%d' % idx if idx != 1 else ''))
                with open(out_path, 'wb') as out:
                    out.write(bs)
                logger.info("[+] DexMd5={}, SavePath={}, DexSize={}"
                            .format(md, out_path, hex(dex['size'])))
                idx += 1
            except Exception as e:
                logger.exception("[-] {}: {}".format(e, dex))
        logger.info("[*] All done...")

    def get_package_name(self):
        try:
            pid = self._session._impl.pid
            for process in self._device.enumerate_processes():
                if process.pid == pid:
                    return process.name
            return "dexdump.unnamed.{}".format(pid)
        except:
            return "dexdump.unnamed"


def fix_header(dex_bytes):
    import struct
    dex_size = len(dex_bytes)

    if dex_bytes[:4] != b"dex\n":
        dex_bytes = b"dex\n035\x00" + dex_bytes[8:]

    if dex_size >= 0x24:
        dex_bytes = dex_bytes[:0x20] + struct.Struct("<I").pack(dex_size) + dex_bytes[0x24:]

    if dex_size >= 0x28:
        dex_bytes = dex_bytes[:0x24] + struct.Struct("<I").pack(0x70) + dex_bytes[0x28:]

    if dex_size >= 0x2C and dex_bytes[0x28:0x2C] not in [b'\x78\x56\x34\x12', b'\x12\x34\x56\x78']:
        dex_bytes = dex_bytes[:0x28] + b'\x78\x56\x34\x12' + dex_bytes[0x2C:]

    return dex_bytes


def main():
    logging.basicConfig(level=logging.INFO)
    DexDumpApplication().run()


if __name__ == "__main__":
    main()
