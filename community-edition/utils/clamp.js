/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export default (value, min, max) => {
    if (min == null) {
        min = value;
    }
    return value < min ? min : max != null && value > max ? max : value;
};
