/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
function signedCRCTable() {
    let c = 0;
    let table = [...new Array(256)];
    for (let n = 0; n != 256; ++n) {
        c = n;
        c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
        c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
        c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
        c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
        c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
        c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
        c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
        c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
        table[n] = c;
    }
    return typeof Int32Array !== 'undefined' ? new Int32Array(table) : table;
}
let T = signedCRCTable();
export default function (str, seed) {
    var C = seed ^ -1;
    for (var i = 0, L = str.length, c, d; i < L;) {
        c = str.charCodeAt(i++);
        if (c < 0x80) {
            C = (C >>> 8) ^ T[(C ^ c) & 0xff];
        }
        else if (c < 0x800) {
            C = (C >>> 8) ^ T[(C ^ (192 | ((c >> 6) & 31))) & 0xff];
            C = (C >>> 8) ^ T[(C ^ (128 | (c & 63))) & 0xff];
        }
        else if (c >= 0xd800 && c < 0xe000) {
            c = (c & 1023) + 64;
            d = str.charCodeAt(i++) & 1023;
            C = (C >>> 8) ^ T[(C ^ (240 | ((c >> 8) & 7))) & 0xff];
            C = (C >>> 8) ^ T[(C ^ (128 | ((c >> 2) & 63))) & 0xff];
            C = (C >>> 8) ^ T[(C ^ (128 | ((d >> 6) & 15) | ((c & 3) << 4))) & 0xff];
            C = (C >>> 8) ^ T[(C ^ (128 | (d & 63))) & 0xff];
        }
        else {
            C = (C >>> 8) ^ T[(C ^ (224 | ((c >> 12) & 15))) & 0xff];
            C = (C >>> 8) ^ T[(C ^ (128 | ((c >> 6) & 63))) & 0xff];
            C = (C >>> 8) ^ T[(C ^ (128 | (c & 63))) & 0xff];
        }
    }
    return C ^ -1;
}
