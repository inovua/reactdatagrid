/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const random = () => {
    return Date.now
        ? `${Date.now()}${Math.random()}`
        : `${new Date().getTime()}` + Math.random();
};
export default (col) => {
    col.id = col.id == null ? col.name || random() : col.id;
    return col;
};
