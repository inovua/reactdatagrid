/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

module.exports = {
  string: function(a, b) {
    a += '';
    b += '';

    return a.localeCompare(b);
  },

  number: function(a, b) {
    return a - b;
  },
};
