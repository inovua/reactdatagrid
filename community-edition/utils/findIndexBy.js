/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export default (data, fn) => {
    let index = false;
    for (let i = 0, len = data.length; i < len; i++) {
        if (fn(data[i]) === true) {
            // we found our id
            index = i;
            break;
        }
    }
    return index;
};
