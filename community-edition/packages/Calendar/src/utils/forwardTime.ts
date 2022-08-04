/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default (from: any, to: any) => {
  if (from) {
    ['hour', 'minute', 'second', 'millisecond'].forEach((part: any) => {
      to.set(part, from.get ? from.get(part) : from[part]);
    });
  }

  return to;
};
