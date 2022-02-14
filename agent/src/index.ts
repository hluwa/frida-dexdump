/*
* Author: hluwa <hluwa888@gmail.com>
* HomePage: https://github.com/hluwa
* CreateTime: 2021/6/2
* */

import {searchDex} from "./search";

function setReadPermission(base: NativePointer, size: number) {
    const end = base.add(size);
    Process.enumerateRanges("---").forEach(function (range) {
        const range_end = range.base.add(range.size)
        if (range.base < base || range_end > end) {
            return
        }
        if (!range.protection.startsWith("r")) {
            console.log("Set read permission for memory range: " + base + "-" + range_end)
            Memory.protect(range.base, range.size, "r" + range.protection.substr(1, 2))
        }

    })
}


rpc.exports = {
    memorydump: function (address, size) {
        const ptr = new NativePointer(address);
        setReadPermission(ptr, size);
        return ptr.readByteArray(size);
    },
    searchdex: function (enableDeepSearch: boolean) {
        return searchDex(enableDeepSearch);
    },
    stopthreads: function () {
        Process.enumerateThreads().forEach(function (thread) {

        })
    }
};