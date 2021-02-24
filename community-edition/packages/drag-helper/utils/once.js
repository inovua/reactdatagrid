/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default function once(fn, scope) {
  var called;
  var result;

  return function() {
    if (called) {
      return result;
    }

    called = true;

    return (result = fn.apply(scope || this, arguments));
  };
}
