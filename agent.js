/*
* Author: hluwa <hluwa888@gmail.com>
* HomePage: https://github.com/hluwa
* CreatedTime: 2020/1/7 20:44
* */

rpc.exports = {
    memorydump: function memorydump(address, size) {
        return new NativePointer(address).readByteArray(size);
    },
    scandex: function scandex() {
        var result = [];
        Process.enumerateRanges('r--').forEach(function (range) {
            try{
                // @TODO improve fuzz
                if (
                    range.size >= 0x60
                    && range.base.readCString(4) != "dex\n"
                    && range.base.add(0x20).readInt() <= range.size //file_size
                    // && range.base.add(0x24).readInt() == 112 //header_size
                    && range.base.add(0x34).readInt() < range.size
                    && range.base.add(0x3C).readInt() == 112 //string_id_off
                ) {
                    result.push({
                        "addr": range.base,
                        "size": range.base.add(0x20).readInt()
                    });
                }
            } catch(e){
                
            }
            try {
                Memory.scanSync(range.base, range.size, "64 65 78 0a 30 33 35 00").forEach(function (match) {
                    var range = Process.findRangeByAddress(match.address);

                    if (range != null && range.size < match.address.toInt32() + 0x24 - range.base.toInt32()) {
                        return;
                    }

                    var dex_size = match.address.add("0x20").readInt();

                    if (range != null) {

                        if (range.file && range.file.path
                            && (// range.file.path.startsWith("/data/app/")
                                range.file.path.startsWith("/data/dalvik-cache/")
                                || range.file.path.startsWith("/system/"))) {
                            return;
                        }

                        if (match.address.toInt32() + dex_size > range.base.toInt32() + range.size) {
                            return;
                        }
                    }

                    result.push({
                        "addr": match.address,
                        "size": dex_size
                    });
                });
            } catch (e) {
            }
        });
        return result;
    }
};
