# Author: hluwa <hluwa888@gmail.com>
# HomePage: https://github.com/hluwa
# CreatedTime: 2020/1/7 20:57

import os
import sys
import frida

device = frida.get_usb_device()
target = device.get_frontmost_application()
pkg_name = target.identifier
print("[DEXDump]: found target [{}] {}".format(target.pid, pkg_name))

session = device.attach(target.pid)
script = session.create_script(open(os.path.dirname(sys.argv[0]) + "/agent.js").read())
script.load()

matches = script.exports.scandex()
for dex in matches:
    bs = script.exports.memorydump(dex['addr'], dex['size'])
    if not os.path.exists("./" + pkg_name + "/"):
        os.mkdir("./" + pkg_name + "/")
    open(pkg_name + "/" + dex['addr'] + ".dex", 'wb').write(bs)
    print("[DEXDump]: DexSize=" + hex(dex['size']) + ", SavePath=./" + pkg_name + "/" + dex['addr'] + ".dex")
