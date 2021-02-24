/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default {
  ArrowUp: -7,
  ArrowDown: 7,
  ArrowLeft: -1,
  ArrowRight: 1,

  PageUp(mom) {
    return mom.add(-1, 'month');
  },
  PageDown(mom) {
    return mom.add(1, 'month');
  },
  Home(mom) {
    return mom.startOf('month');
  },
  End(mom) {
    return mom.endOf('month');
  },
};
