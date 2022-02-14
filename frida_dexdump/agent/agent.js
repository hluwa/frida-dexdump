(function () {
    function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) {
                    var c = "function" == typeof require && require;
                    if (!f && c) return c(i, !0);
                    if (u) return u(i, !0);
                    var a = new Error("Cannot find module '" + i + "'");
                    throw a.code = "MODULE_NOT_FOUND", a
                }
                var p = n[i] = {exports: {}};
                e[i][0].call(p.exports, function (r) {
                    var n = e[i][1][r];
                    return o(n || r)
                }, p, p.exports, r, e, n, t)
            }
            return n[i].exports
        }

        for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
        return o
    }

    return r
})()({
    1: [function (require, module, exports) {
        module.exports = require("core-js/library/fn/object/define-property");
    }, {"core-js/library/fn/object/define-property": 3}],
    2: [function (require, module, exports) {
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                "default": obj
            };
        }

        module.exports = _interopRequireDefault;
    }, {}],
    3: [function (require, module, exports) {
        require('../../modules/es6.object.define-property');
        var $Object = require('../../modules/_core').Object;
        module.exports = function defineProperty(it, key, desc) {
            return $Object.defineProperty(it, key, desc);
        };

    }, {"../../modules/_core": 6, "../../modules/es6.object.define-property": 20}],
    4: [function (require, module, exports) {
        module.exports = function (it) {
            if (typeof it != 'function') throw TypeError(it + ' is not a function!');
            return it;
        };

    }, {}],
    5: [function (require, module, exports) {
        var isObject = require('./_is-object');
        module.exports = function (it) {
            if (!isObject(it)) throw TypeError(it + ' is not an object!');
            return it;
        };

    }, {"./_is-object": 16}],
    6: [function (require, module, exports) {
        var core = module.exports = {version: '2.6.11'};
        if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

    }, {}],
    7: [function (require, module, exports) {
// optional / simple context binding
        var aFunction = require('./_a-function');
        module.exports = function (fn, that, length) {
            aFunction(fn);
            if (that === undefined) return fn;
            switch (length) {
                case 1:
                    return function (a) {
                        return fn.call(that, a);
                    };
                case 2:
                    return function (a, b) {
                        return fn.call(that, a, b);
                    };
                case 3:
                    return function (a, b, c) {
                        return fn.call(that, a, b, c);
                    };
            }
            return function (/* ...args */) {
                return fn.apply(that, arguments);
            };
        };

    }, {"./_a-function": 4}],
    8: [function (require, module, exports) {
// Thank's IE8 for his funny defineProperty
        module.exports = !require('./_fails')(function () {
            return Object.defineProperty({}, 'a', {
                get: function () {
                    return 7;
                }
            }).a != 7;
        });

    }, {"./_fails": 11}],
    9: [function (require, module, exports) {
        var isObject = require('./_is-object');
        var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
        var is = isObject(document) && isObject(document.createElement);
        module.exports = function (it) {
            return is ? document.createElement(it) : {};
        };

    }, {"./_global": 12, "./_is-object": 16}],
    10: [function (require, module, exports) {
        var global = require('./_global');
        var core = require('./_core');
        var ctx = require('./_ctx');
        var hide = require('./_hide');
        var has = require('./_has');
        var PROTOTYPE = 'prototype';

        var $export = function (type, name, source) {
            var IS_FORCED = type & $export.F;
            var IS_GLOBAL = type & $export.G;
            var IS_STATIC = type & $export.S;
            var IS_PROTO = type & $export.P;
            var IS_BIND = type & $export.B;
            var IS_WRAP = type & $export.W;
            var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
            var expProto = exports[PROTOTYPE];
            var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
            var key, own, out;
            if (IS_GLOBAL) source = name;
            for (key in source) {
                // contains in native
                own = !IS_FORCED && target && target[key] !== undefined;
                if (own && has(exports, key)) continue;
                // export native or passed
                out = own ? target[key] : source[key];
                // prevent global pollution for namespaces
                exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
                    // bind timers to global for call from export context
                    : IS_BIND && own ? ctx(out, global)
                        // wrap global constructors for prevent change them in library
                        : IS_WRAP && target[key] == out ? (function (C) {
                            var F = function (a, b, c) {
                                if (this instanceof C) {
                                    switch (arguments.length) {
                                        case 0:
                                            return new C();
                                        case 1:
                                            return new C(a);
                                        case 2:
                                            return new C(a, b);
                                    }
                                    return new C(a, b, c);
                                }
                                return C.apply(this, arguments);
                            };
                            F[PROTOTYPE] = C[PROTOTYPE];
                            return F;
                            // make static versions for prototype methods
                        })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
                // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
                if (IS_PROTO) {
                    (exports.virtual || (exports.virtual = {}))[key] = out;
                    // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
                    if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
                }
            }
        };
// type bitmap
        $export.F = 1;   // forced
        $export.G = 2;   // global
        $export.S = 4;   // static
        $export.P = 8;   // proto
        $export.B = 16;  // bind
        $export.W = 32;  // wrap
        $export.U = 64;  // safe
        $export.R = 128; // real proto method for `library`
        module.exports = $export;

    }, {"./_core": 6, "./_ctx": 7, "./_global": 12, "./_has": 13, "./_hide": 14}],
    11: [function (require, module, exports) {
        module.exports = function (exec) {
            try {
                return !!exec();
            } catch (e) {
                return true;
            }
        };

    }, {}],
    12: [function (require, module, exports) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
        var global = module.exports = typeof window != 'undefined' && window.Math == Math
            ? window : typeof self != 'undefined' && self.Math == Math ? self
                // eslint-disable-next-line no-new-func
                : Function('return this')();
        if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

    }, {}],
    13: [function (require, module, exports) {
        var hasOwnProperty = {}.hasOwnProperty;
        module.exports = function (it, key) {
            return hasOwnProperty.call(it, key);
        };

    }, {}],
    14: [function (require, module, exports) {
        var dP = require('./_object-dp');
        var createDesc = require('./_property-desc');
        module.exports = require('./_descriptors') ? function (object, key, value) {
            return dP.f(object, key, createDesc(1, value));
        } : function (object, key, value) {
            object[key] = value;
            return object;
        };

    }, {"./_descriptors": 8, "./_object-dp": 17, "./_property-desc": 18}],
    15: [function (require, module, exports) {
        module.exports = !require('./_descriptors') && !require('./_fails')(function () {
            return Object.defineProperty(require('./_dom-create')('div'), 'a', {
                get: function () {
                    return 7;
                }
            }).a != 7;
        });

    }, {"./_descriptors": 8, "./_dom-create": 9, "./_fails": 11}],
    16: [function (require, module, exports) {
        module.exports = function (it) {
            return typeof it === 'object' ? it !== null : typeof it === 'function';
        };

    }, {}],
    17: [function (require, module, exports) {
        var anObject = require('./_an-object');
        var IE8_DOM_DEFINE = require('./_ie8-dom-define');
        var toPrimitive = require('./_to-primitive');
        var dP = Object.defineProperty;

        exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
            anObject(O);
            P = toPrimitive(P, true);
            anObject(Attributes);
            if (IE8_DOM_DEFINE) try {
                return dP(O, P, Attributes);
            } catch (e) { /* empty */
            }
            if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
            if ('value' in Attributes) O[P] = Attributes.value;
            return O;
        };

    }, {"./_an-object": 5, "./_descriptors": 8, "./_ie8-dom-define": 15, "./_to-primitive": 19}],
    18: [function (require, module, exports) {
        module.exports = function (bitmap, value) {
            return {
                enumerable: !(bitmap & 1),
                configurable: !(bitmap & 2),
                writable: !(bitmap & 4),
                value: value
            };
        };

    }, {}],
    19: [function (require, module, exports) {
// 7.1.1 ToPrimitive(input [, PreferredType])
        var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
        module.exports = function (it, S) {
            if (!isObject(it)) return it;
            var fn, val;
            if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
            if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
            if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
            throw TypeError("Can't convert object to primitive value");
        };

    }, {"./_is-object": 16}],
    20: [function (require, module, exports) {
        var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
        $export($export.S + $export.F * !require('./_descriptors'), 'Object', {defineProperty: require('./_object-dp').f});

    }, {"./_descriptors": 8, "./_export": 10, "./_object-dp": 17}],
    21: [function (require, module, exports) {
        "use strict";
        /*
        * Author: hluwa <hluwa888@gmail.com>
        * HomePage: https://github.com/hluwa
        * CreateTime: 2021/6/2
        * */

        var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

        var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/define-property"));

        (0, _defineProperty["default"])(exports, "__esModule", {
            value: true
        });

        var search_1 = require("./search");

        function setReadPermission(base, size) {
            var end = base.add(size);
            Process.enumerateRanges("---").forEach(function (range) {
                var range_end = range.base.add(range.size);

                if (range.base < base || range_end > end) {
                    return;
                }

                if (!range.protection.startsWith("r")) {
                    console.log("Set read permission for memory range: " + base + "-" + range_end);
                    Memory.protect(range.base, range.size, "r" + range.protection.substr(1, 2));
                }
            });
        }

        rpc.exports = {
            memorydump: function memorydump(address, size) {
                var ptr = new NativePointer(address);
                setReadPermission(ptr, size);
                return ptr.readByteArray(size);
            },
            searchdex: function searchdex(enableDeepSearch) {
                return search_1.searchDex(enableDeepSearch);
            },
            stopthreads: function stopthreads() {
                Process.enumerateThreads().forEach(function (thread) {
                });
            }
        };

    }, {
        "./search": 22,
        "@babel/runtime-corejs2/core-js/object/define-property": 1,
        "@babel/runtime-corejs2/helpers/interopRequireDefault": 2
    }],
    22: [function (require, module, exports) {
        "use strict";
        /*
        * Author: hluwa <hluwa888@gmail.com>
        * HomePage: https://github.com/hluwa
        * CreateTime: 2021/6/3
        * */

        var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

        var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/define-property"));

        (0, _defineProperty["default"])(exports, "__esModule", {
            value: true
        });

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

            return maps_end.sub(dexptr).toInt32();
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
                var range_end = range.base.add(range.size); // verify header_size

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

                    return verify_by_maps(dexptr, maps_address);
                } else {
                    return dexptr.add(0x3C).readUInt() === 0x70;
                }
            }

            return false;
        }

        function verify_ids_off(dexptr, dex_size) {
            var string_ids_off = dexptr.add(0x3C).readUInt();
            var type_ids_off = dexptr.add(0x44).readUInt();
            var proto_ids_off = dexptr.add(0x4C).readUInt();
            var field_ids_off = dexptr.add(0x54).readUInt();
            var method_ids_off = dexptr.add(0x5C).readUInt();
            return string_ids_off < dex_size && string_ids_off >= 0x70 && type_ids_off < dex_size && type_ids_off >= 0x70 && proto_ids_off < dex_size && proto_ids_off >= 0x70 && field_ids_off < dex_size && field_ids_off >= 0x70 && method_ids_off < dex_size && method_ids_off >= 0x70;
        }

        function searchDex(deepSearch) {
            var result = [];
            Process.enumerateRanges('r--').forEach(function (range) {
                try {
                    Memory.scanSync(range.base, range.size, "64 65 78 0a 30 ?? ?? 00").forEach(function (match) {
                        if (range.file && range.file.path && (range.file.path.startsWith("/data/dalvik-cache/") || range.file.path.startsWith("/system/"))) {
                            return;
                        }

                        if (verify(match.address, range, false)) {
                            var dex_size = get_dex_real_size(match.address, range.base, range.base.add(range.size));
                            result.push({
                                "addr": match.address,
                                "size": dex_size
                            });
                            var max_size = range.size - match.address.sub(range.base).toInt32();

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
                            var dex_base = match.address.sub(0x3C);

                            if (dex_base < range.base) {
                                return;
                            }

                            if (dex_base.readCString(4) != "dex\n" && verify(dex_base, range, true)) {
                                var real_dex_size = get_dex_real_size(dex_base, range.base, range.base.add(range.size));

                                if (!verify_ids_off(dex_base, real_dex_size)) {
                                    return;
                                }

                                result.push({
                                    "addr": dex_base,
                                    "size": real_dex_size
                                });
                                var max_size = range.size - dex_base.sub(range.base).toInt32();

                                if (max_size != real_dex_size) {
                                    result.push({
                                        "addr": dex_base,
                                        "size": max_size
                                    });
                                }
                            }
                        });
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

        exports.searchDex = searchDex;

    }, {
        "@babel/runtime-corejs2/core-js/object/define-property": 1,
        "@babel/runtime-corejs2/helpers/interopRequireDefault": 2
    }]
}, {}, [21])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUtY29yZWpzMi9jb3JlLWpzL29iamVjdC9kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUtY29yZWpzMi9oZWxwZXJzL2ludGVyb3BSZXF1aXJlRGVmYXVsdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2RlZmluZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYS1mdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb3JlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jdHguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19leHBvcnQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2ZhaWxzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2hhcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faGlkZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faWU4LWRvbS1kZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lzLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1wcmltaXRpdmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5kZWZpbmUtcHJvcGVydHkuanMiLCJzcmMvaW5kZXgudHMiLCJzcmMvc2VhcmNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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O0FBeUJBLFVBQUksVUFBSixFQUFnQjtBQUNaLFFBQUEsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsS0FBSyxDQUFDLElBQXRCLEVBQTRCLEtBQUssQ0FBQyxJQUFsQyxFQUF3QyxhQUF4QyxFQUF1RCxPQUF2RCxDQUErRCxVQUFVLEtBQVYsRUFBZTtBQUMxRSxjQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTixDQUFjLEdBQWQsQ0FBa0IsSUFBbEIsQ0FBakI7O0FBQ0EsY0FBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLElBQXJCLEVBQTJCO0FBQ3ZCO0FBQ0g7O0FBQ0QsY0FBSSxRQUFRLENBQUMsV0FBVCxDQUFxQixDQUFyQixLQUEyQixPQUEzQixJQUFzQyxNQUFNLENBQUMsUUFBRCxFQUFXLEtBQVgsRUFBa0IsSUFBbEIsQ0FBaEQsRUFBeUU7QUFDckUsZ0JBQU0sYUFBYSxHQUFHLGlCQUFpQixDQUFDLFFBQUQsRUFBVyxLQUFLLENBQUMsSUFBakIsRUFBdUIsS0FBSyxDQUFDLElBQU4sQ0FBVyxHQUFYLENBQWUsS0FBSyxDQUFDLElBQXJCLENBQXZCLENBQXZDOztBQUNBLGdCQUFJLENBQUMsY0FBYyxDQUFDLFFBQUQsRUFBVyxhQUFYLENBQW5CLEVBQThDO0FBQzFDO0FBQ0g7O0FBQ0QsWUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZO0FBQ1Isc0JBQVEsUUFEQTtBQUVSLHNCQUFRO0FBRkEsYUFBWjtBQUlBLGdCQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsSUFBTixHQUFhLFFBQVEsQ0FBQyxHQUFULENBQWEsS0FBSyxDQUFDLElBQW5CLEVBQXlCLE9BQXpCLEVBQTlCOztBQUNBLGdCQUFJLFFBQVEsSUFBSSxhQUFoQixFQUErQjtBQUMzQixjQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVk7QUFDUix3QkFBUSxRQURBO0FBRVIsd0JBQVE7QUFGQSxlQUFaO0FBSUg7QUFDSjtBQUNKLFNBdEJEO0FBdUJILE9BeEJELE1Bd0JPO0FBQ0gsWUFBSSxLQUFLLENBQUMsSUFBTixDQUFXLFdBQVgsQ0FBdUIsQ0FBdkIsS0FBNkIsT0FBN0IsSUFBd0MsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFQLEVBQWEsS0FBYixFQUFvQixJQUFwQixDQUFsRCxFQUE2RTtBQUN6RSxjQUFNLGFBQWEsR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsSUFBUCxFQUFhLEtBQUssQ0FBQyxJQUFuQixFQUF5QixLQUFLLENBQUMsSUFBTixDQUFXLEdBQVgsQ0FBZSxLQUFLLENBQUMsSUFBckIsQ0FBekIsQ0FBdkM7QUFDQSxVQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVk7QUFDUixvQkFBUSxLQUFLLENBQUMsSUFETjtBQUVSLG9CQUFRO0FBRkEsV0FBWjtBQUlIO0FBQ0o7QUFFSixLQTVERCxDQTRERSxPQUFPLENBQVAsRUFBVSxDQUNYO0FBQ0osR0EvREQ7QUFpRUEsU0FBTyxNQUFQO0FBQ0g7O0FBcEVELE9BQUEsQ0FBQSxTQUFBLEdBQUEsU0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIn0=
