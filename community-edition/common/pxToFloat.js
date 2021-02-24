/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function pxToFloat(str) {
  if (typeof str !== 'string') {
    return null;
  }
  return parseFloat(str.replace('px', ''));
}

export default pxToFloat;
