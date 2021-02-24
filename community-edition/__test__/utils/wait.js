/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default (ms = 100) =>
  new Promise(resolve => {
    if (typeof ms == 'function') {
      console.error(
        'wait fn accepts a number as a first arg, but you specified a function!'
      );
    }
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
