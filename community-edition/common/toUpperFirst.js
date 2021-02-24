/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = function(str) {
  if (!str) {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.substring(1);
};
