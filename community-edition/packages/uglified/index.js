/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function myFunction(abc) {
  /* this is a simple comment */
}

module.exports =
  myFunction.toString() !=
  'function myFunction(abc) { /* this is a simple comment */ }';
