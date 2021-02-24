/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default range => {
  if (range[1] && range[0].isAfter(range[1])) {
    range = [range[1], range[0]];
  }

  return range;
};
