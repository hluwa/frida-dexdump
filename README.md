# FRIDA-DEXDump

Fast search and dump dex on memory.

[![asciicast](screenshot.png)](https://asciinema.org/a/352528)

## Features
1. support fuzzy search no-magic dex.
2. auto fill magic into dex-header.
3. compatible with all android version(frida supported).
4. support python 2 and 3.
5. support loading as objection plugin~


## Requires

- [frida](https://www.github.com/frida/frida): `pip install frida`
- [optional] [click](https://pypi.org/project/click/) `pip install click`

## Usage

- Run `python main.py` to attach current frontmost application and dump dexs.

- Or, use command arguments:  
    ```
    -n: [Optional] Specify target process name, when spawn mode, it requires an application package name. If not specified, use frontmost application.
    -p: [Optional] Specify pid when multiprocess. If not specified, dump all.
    -f: [Optional] Use spawn mode, default is disable.
    -s: [Optional] When spawn mode, start dump work after sleep few seconds. default is 10s.
    -d: [Optional] Enable deep search maybe detected more dex, but speed will be slower.
    -h: show help.
    ```
    
- Or, loading as objection plugin

    1. clone this repo to your plugins folder, eg:
        > git clone https://github.com/hluwa/FRIDA-DEXDump ~/.objection/plugins/dexdump
    2. start objection with `-P` or `--plugin-folder` your plugins folder, eg:
        > objection -g com.app.name explore -P ~/.objection/plugins
    3. run command:
        1. ` plugin dexdump search ` to search and print all dex
        2. ` plugin dexdump dump ` to dump all found dex.
