/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default (data, by, id) => {
  let index = -1;

  for (let i = 0, len = data.length; i < len; i++) {
    if (data[i][by] === id) {
      // we found our id
      index = i;
      break;
    }
  }

  return index;
};
