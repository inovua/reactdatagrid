/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default function(func) {
  const self = this;
  return function() {
    return func.call(self);
  };
}
