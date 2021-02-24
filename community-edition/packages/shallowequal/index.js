/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var keyList = Object.keys;
var EMPTY_OBJECT = {};
export default function equal(a, b, except = EMPTY_OBJECT) {
    if (a === b)
        return true;
    if (!(a instanceof Object) || !(b instanceof Object))
        return false;
    var keys = keyList(a);
    var length = keys.length;
    var key;
    for (var i = 0; i < length; i++) {
        key = keys[i];
        if (except[key]) {
            continue;
        }
        if (!(key in b))
            return false;
    }
    for (var i = 0; i < length; i++) {
        key = keys[i];
        if (except[key]) {
            continue;
        }
        if (a[key] !== b[key])
            return false;
    }
    return length === keyList(b).length;
}
export function equalReturnKey(a, b, except = EMPTY_OBJECT) {
    if (a === b)
        return { result: true, key: undefined };
    if (!(a instanceof Object) || !(b instanceof Object))
        return { result: false, key: undefined };
    var keys = keyList(a);
    var length = keys.length;
    var key;
    for (var i = 0; i < length; i++) {
        key = keys[i];
        if (except[key]) {
            continue;
        }
        if (!(key in b))
            return {
                result: false,
                key,
            };
    }
    for (var i = 0; i < length; i++) {
        key = keys[i];
        if (except[key]) {
            continue;
        }
        if (a[key] !== b[key])
            return {
                result: false,
                key,
            };
    }
    return { result: length === keyList(b).length, key: undefined };
}
