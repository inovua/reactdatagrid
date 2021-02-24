/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default columns => {
  return columns.reduce(
    (acc, col) => {
      if (col.draggable !== false) {
        acc.stop = true;
      }
      if (col.draggable === false && !acc.stop) {
        acc.count++;
      }
      return acc;
    },
    { count: 0 }
  ).count;
};
