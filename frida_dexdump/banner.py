# Author: hluwa <hluwa888@gmail.com>
# HomePage: https://github.com/hluwa
# CreateTime: 2021/6/3
import logging
import random

try:
    from shutil import get_terminal_size as get_terminal_size
except:
    try:
        from backports.shutil_get_terminal_size import get_terminal_size as get_terminal_size
    except:
        pass
try:
    import click
except:
    class click:
        @staticmethod
        def secho(message=None, **kwargs):
            print(message)

        @staticmethod
        def style(**kwargs):
            raise Exception("unsupported style")

banner = """
---------------------------------------------------------------------------
   __      _     _                 _              _                       
  / _|_ __(_) __| | __ _        __| | _____  ____| |_   _ _ __ ___  _ __   
 | |_| '__| |/ _` |/ _` |_____ / _` |/ _ \ \/ / _` | | | | '_ ` _ \| '_ \  
 |  _| |  | | (_| | (_| |_____| (_| |  __/>  < (_| | |_| | | | | | | |_) | 
 |_| |_|  |_|\__,_|\__,_|      \__,_|\___/_/\_\__,_|\__,_|_| |_| |_| .__/  
                                                                   |_|     
                   https://github.com/hluwa/frida-dexdump                  
---------------------------------------------------------------------------\n
"""


def show_banner():
    colors = ['bright_red', 'bright_green', 'bright_blue', 'cyan', 'magenta']
    try:
        click.style('color test', fg='bright_red')
    except:
        colors = ['red', 'green', 'blue', 'cyan', 'magenta']
    try:
        columns = get_terminal_size().columns
        if columns >= len(banner.splitlines()[1]):
            for line in banner.splitlines():
                if line:
                    fill = int((columns - len(line)) / 2 - 1)
                    line = line[0] * fill + line
                    line += line[-1] * fill
                click.secho(line, fg=random.choice(colors))
    except:
        logging.exception("")
