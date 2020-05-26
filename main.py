# Author: hluwa <hluwa888@gmail.com>
# HomePage: https://github.com/hluwa
# CreatedTime: 2020/1/7 20:57

import os
import random
import sys

import click
import frida
import logging
import traceback

logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s %(levelname)s %(message)s",
                    datefmt='%m-%d/%H:%M:%S')

banner = """
----------------------------------------------------------------------------------------
  ____________ ___________  ___        ______ _______   _______                         
  |  ___| ___ \_   _|  _  \/ _ \       |  _  \  ___\ \ / /  _  \                        
  | |_  | |_/ / | | | | | / /_\ \______| | | | |__  \ V /| | | |_   _ _ __ ___  _ __    
  |  _| |    /  | | | | | |  _  |______| | | |  __| /   \| | | | | | | '_ ` _ \| '_ \   
  | |   | |\ \ _| |_| |/ /| | | |      | |/ /| |___/ /^\ \ |/ /| |_| | | | | | | |_) |  
  \_|   \_| \_|\___/|___/ \_| |_/      |___/ \____/\/   \/___/  \__,_|_| |_| |_| .__/   
                                                                               | |      
                                                                               |_|      
                      https://github.com/hluwa/FRIDA-DEXDump                            
----------------------------------------------------------------------------------------
"""


def show_banner():
    try:
        if os.get_terminal_size().columns >= len(banner.splitlines()[1]):
            for line in banner.splitlines():
                click.secho(line, fg=random.choice(['bright_red', 'bright_green', 'bright_blue', 'cyan', 'magenta']))
    except:
        pass


def get_all_process(device, pkgname):
    return [process for process in device.enumerate_processes() if pkgname in process.name]


def search(api, args=None):
    """
    """

    matches = api.scandex()
    for info in matches:
        click.secho("[DEXDump] Found: DexAddr={}, DexSize={}"
                    .format(info['addr'], hex(info['size'])), fg='green')
    return matches


def dump(pkg_name, api):
    """
    """
    matches = api.scandex()
    for info in matches:
        try:
            bs = api.memorydump(info['addr'], info['size'])
            if not os.path.exists("./" + pkg_name + "/"):
                os.mkdir("./" + pkg_name + "/")
            if bs[:4] != "dex\n":
                bs = b"dex\n035\x00" + bs[8:]
            with open(pkg_name + "/" + info['addr'] + ".dex", 'wb') as out:
                out.write(bs)
            click.secho("[DEXDump]: DexSize={}, SavePath={}/{}/{}.dex"
                        .format(hex(info['size']), os.getcwd(), pkg_name, info['addr']), fg='green')
        except Exception as e:
            click.secho("[Except] - {}: {}".format(e, info), bg='yellow')


def stop_other(pid, pkg_name):
    processes = get_all_process(device, pkg_name)
    if len(processes) > 1:
        try:
            for index in range(len(processes)):
                if index == pid:
                    os.system("adb shell \"su -c 'kill -18 {}'\"".format(processes[index].pid))
                else:
                    os.system("adb shell \"su -c 'kill -19 {}'\"".format(processes[index].pid))
        except:
            pass


def choose(pid=None, pkg=None, spawn=False, device=None):
    if pid is None and pkg is None:
        target = device.get_frontmost_application()
        return target.pid, target.identifier

    for process in device.enumerate_processes():
        if (pid and process.pid == pid) or (pkg and process.name == pkg):
            if not spawn:
                return process.pid, process.name
            else:
                pkg = process.name
                break

    if pkg and spawn and device:
        pid = device.spawn(pkg)
        device.resume(pid)
        return pid, pkg
    raise Exception("Cannot found <{}> process".format(pid))


if __name__ == "__main__":
    show_banner()

    try:
        device = frida.get_usb_device()
    except:
        device = frida.get_remote_device()

    if not device:
        click.secho("[Except] - Unable to connect to device.", bg='red')
        exit()

    pid = None
    pname = ""
    try:
        pid, pname = choose()
    except Exception as e:
        click.secho("[Except] - Unable to inject into process: {} in \n{}".format(e, traceback.format_tb(
            sys.exc_info()[2])[-1]), bg='red')
    if not pid:
        exit()
    logging.info("[DEXDump]: found target [{}] {}".format(pid, pname))
    session = device.attach(pid)
    path = os.path.dirname(sys.argv[0])
    path = path if path else "."
    script = session.create_script(open(path + "/agent.js").read())
    script.load()

    dump(pname, script.exports)
