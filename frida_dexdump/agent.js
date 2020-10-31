/*
* Author: hluwa <hluwa888@gmail.com>
* HomePage: https://github.com/hluwa
* CreatedTime: 2020/1/7 20:44
* */


var enable_deep_search = false;

function verify_by_maps(dexptr, mapsptr) {
    var maps_offset = dexptr.add(0x34).readUInt();
    var maps_size = mapsptr.readUInt();
    for (var i = 0; i < maps_size; i++) {
        var item_type = mapsptr.add(4 + i * 0xC).readU16();
        if (item_type === 4096) {
            var map_offset = mapsptr.add(4 + i * 0xC + 8).readUInt();
            if (maps_offset === map_offset) {
                return true;
            }
        }
    }
    return false;
}


function get_dex_real_size(dexptr, range_base, range_end) {
    var dex_size = dexptr.add(0x20).readUInt();

    var maps_address = get_maps_address(dexptr, range_base, range_end);
    if (!maps_address) {
        return dex_size;
    }

    var maps_end = get_maps_end(maps_address, range_base, range_end);
    if (!maps_end) {
        return dex_size;
    }

    return maps_end - dexptr
}

function get_maps_address(dexptr, range_base, range_end) {
    var maps_offset = dexptr.add(0x34).readUInt();
    if (maps_offset === 0) {
        return null;
    }

    var maps_address = dexptr.add(maps_offset);
    if (maps_address < range_base || maps_address > range_end) {
        return null;
    }

    return maps_address;
}

function get_maps_end(maps, range_base, range_end) {
    var maps_size = maps.readUInt();
    if (maps_size < 2 || maps_size > 50) {
        return null;
    }
    var maps_end = maps.add(maps_size * 0xC + 4);
    if (maps_end < range_base || maps_end > range_end) {
        return null;
    }

    return maps_end;
}


function verify(dexptr, range, enable_verify_maps) {

    if (range != null) {
        var range_end = range.base.add(range.size);
        // verify header_size
        if (dexptr.add(0x70) > range_end) {
            return false;
        }

        // In runtime, the fileSize is can to be clean, so it's not trust.
        // verify file_size
        // var dex_size = dexptr.add(0x20).readUInt();
        // if (dexptr.add(dex_size) > range_end) {
        //     return false;
        // }

        if (enable_verify_maps) {

            var maps_address = get_maps_address(dexptr, range.base, range_end);
            if (!maps_address) {
                return false;
            }

            var maps_end = get_maps_end(maps_address, range.base, range_end);
            if (!maps_end) {
                return false;
            }
            return verify_by_maps(dexptr, maps_address)
        } else {
            return dexptr.add(0x3C).readUInt() === 0x70;
        }
    }

    return false;


}

rpc.exports = {
    memorydump: function memorydump(address, size) {
        return new NativePointer(address).readByteArray(size);
    },
    switchmode: function switchmode(bool) {
        enable_deep_search = bool;
    },
    scandex: function scandex() {
        var result = [];
        Process.enumerateRanges('r--').forEach(function (range) {
            try {
                Memory.scanSync(range.base, range.size, "64 65 78 0a 30 ?? ?? 00").forEach(function (match) {

                    if (range.file && range.file.path
                        && (// range.file.path.startsWith("/data/app/") ||
                            range.file.path.startsWith("/data/dalvik-cache/") ||
                            range.file.path.startsWith("/system/"))) {
                        return;
                    }

                    if (verify(match.address, range, false)) {
                        var dex_size = get_dex_real_size(match.address, range.base, range.base.add(range.size));
                        result.push({
                            "addr": match.address,
                            "size": dex_size
                        });

                        var max_size = range.size - match.address.sub(range.base);
                        if (enable_deep_search && max_size != dex_size) {
                            result.push({
                                "addr": match.address,
                                "size": max_size
                            });
                        }
                    }
                });

                if (enable_deep_search) {
                    Memory.scanSync(range.base, range.size, "70 00 00 00").forEach(function (match) {
                        var dex_base = match.address.sub(0x3C);
                        if (dex_base < range.base) {
                            return
                        }
                        if (dex_base.readCString(4) != "dex\n" && verify(dex_base, range, true)) {
                            var real_dex_size = get_dex_real_size(dex_base, range.base, range.base.add(range.size));
                            result.push({
                                "addr": dex_base,
                                "size": real_dex_size
                            });
                            var max_size = range.size - dex_base.sub(range.base);
                            if (max_size != real_dex_size) {
                                result.push({
                                    "addr": match.address,
                                    "size": max_size
                                });
                            }
                        }
                    })
                } else {
                    if (range.base.readCString(4) != "dex\n" && verify(range.base, range, true)) {
                        var real_dex_size = get_dex_real_size(range.base, range.base, range.base.add(range.size));
                        result.push({
                            "addr": range.base,
                            "size": real_dex_size
                        });
                    }
                }

            } catch (e) {
            }
        });

        return result;
    }
};
