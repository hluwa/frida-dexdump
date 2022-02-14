/*
* Author: hluwa <hluwa888@gmail.com>
* HomePage: https://github.com/hluwa
* CreateTime: 2021/6/2
* */

import {searchDex} from "./search";

rpc.exports = {
    memorydump: function (address, size) {
        return new NativePointer(address).readByteArray(size);
    },
    searchdex: function (enableDeepSearch: boolean) {
        return searchDex(enableDeepSearch);
    },
    stopthreads: function(){
        Process.enumerateThreads().forEach(function (thread) {

        })
    }
};