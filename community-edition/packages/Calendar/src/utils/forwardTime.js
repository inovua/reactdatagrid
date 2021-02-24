/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default (from, to) => {
  if (from) {
    ['hour', 'minute', 'second', 'millisecond'].forEach(part => {
      to.set(part, from.get ? from.get(part) : from[part]);
    });
  }

  return to;
};
