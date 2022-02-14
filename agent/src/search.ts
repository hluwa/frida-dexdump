/*
* Author: hluwa <hluwa888@gmail.com>
* HomePage: https://github.com/hluwa
* CreateTime: 2021/6/3
* */


function verify_by_maps(dexptr: NativePointer, mapsptr: NativePointer): boolean {
    const maps_offset = dexptr.add(0x34).readUInt();
    const maps_size = mapsptr.readUInt();
    for (let i = 0; i < maps_size; i++) {
        const item_type = mapsptr.add(4 + i * 0xC).readU16();
        if (item_type === 4096) {
            const map_offset = mapsptr.add(4 + i * 0xC + 8).readUInt();
            if (maps_offset === map_offset) {
                return true;
            }
        }
    }
    return false;
}


function get_dex_real_size(dexptr: NativePointer, range_base: NativePointer, range_end: NativePointer): Number {
    const dex_size = dexptr.add(0x20).readUInt();

    const maps_address = get_maps_address(dexptr, range_base, range_end);
    if (!maps_address) {
        return dex_size;
    }

    const maps_end = get_maps_end(maps_address, range_base, range_end);
    if (!maps_end) {
        return dex_size;
    }

    return maps_end.sub(dexptr).toInt32();
}

function get_maps_address(dexptr: NativePointer, range_base: NativePointer, range_end: NativePointer): NativePointer | null {
    const maps_offset = dexptr.add(0x34).readUInt();
    if (maps_offset === 0) {
        return null;
    }

    const maps_address = dexptr.add(maps_offset);
    if (maps_address < range_base || maps_address > range_end) {
        return null;
    }

    return maps_address;
}

function get_maps_end(maps: NativePointer, range_base: NativePointer, range_end: NativePointer): NativePointer | null {
    const maps_size = maps.readUInt();
    if (maps_size < 2 || maps_size > 50) {
        return null;
    }
    const maps_end = maps.add(maps_size * 0xC + 4);
    if (maps_end < range_base || maps_end > range_end) {
        return null;
    }

    return maps_end;
}

function verify(dexptr: NativePointer, range: RangeDetails, enable_verify_maps: boolean): boolean {

    if (range != null) {
        var range_end = range.base.add(range.size);
        // verify header_size
        if (dexptr.add(0x70) > range_end) {
            return false;
        }

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

function verify_ids_off(dexptr: NativePointer, dex_size: Number) {
    const string_ids_off = dexptr.add(0x3C).readUInt();
    const type_ids_off = dexptr.add(0x44).readUInt();
    const proto_ids_off = dexptr.add(0x4C).readUInt();
    const field_ids_off = dexptr.add(0x54).readUInt();
    const method_ids_off = dexptr.add(0x5C).readUInt();
    return string_ids_off < dex_size && string_ids_off >= 0x70
        && type_ids_off < dex_size && type_ids_off >= 0x70
        && proto_ids_off < dex_size && proto_ids_off >= 0x70
        && field_ids_off < dex_size && field_ids_off >= 0x70
        && method_ids_off < dex_size && method_ids_off >= 0x70;

}

export function searchDex(deepSearch: boolean) {
    const result: any = [];
    Process.enumerateRanges('r--').forEach(function (range: RangeDetails) {
        try {
            Memory.scanSync(range.base, range.size, "64 65 78 0a 30 ?? ?? 00").forEach(function (match) {

                if (range.file && range.file.path
                    && (range.file.path.startsWith("/data/dalvik-cache/") ||
                        range.file.path.startsWith("/system/"))) {
                    return;
                }

                if (verify(match.address, range, false)) {
                    const dex_size = get_dex_real_size(match.address, range.base, range.base.add(range.size));
                    result.push({
                        "addr": match.address,
                        "size": dex_size
                    });

                    const max_size = range.size - match.address.sub(range.base).toInt32();
                    if (deepSearch && max_size != dex_size) {
                        result.push({
                            "addr": match.address,
                            "size": max_size
                        });
                    }
                }
            });

            if (deepSearch) {
                Memory.scanSync(range.base, range.size, "70 00 00 00").forEach(function (match) {
                    const dex_base = match.address.sub(0x3C);
                    if (dex_base < range.base) {
                        return;
                    }
                    if (dex_base.readCString(4) != "dex\n" && verify(dex_base, range, true)) {
                        const real_dex_size = get_dex_real_size(dex_base, range.base, range.base.add(range.size));
                        if (!verify_ids_off(dex_base, real_dex_size)) {
                            return;
                        }
                        result.push({
                            "addr": dex_base,
                            "size": real_dex_size
                        });
                        const max_size = range.size - dex_base.sub(range.base).toInt32();
                        if (max_size != real_dex_size) {
                            result.push({
                                "addr": dex_base,
                                "size": max_size
                            });
                        }
                    }
                })
            } else {
                if (range.base.readCString(4) != "dex\n" && verify(range.base, range, true)) {
                    const real_dex_size = get_dex_real_size(range.base, range.base, range.base.add(range.size));
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