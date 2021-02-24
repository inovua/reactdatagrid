/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const notEmpty = x => !!x && x !== true;
export default function(...args) {
  if (args.length == 1 && Array.isArray(args[0])) {
    args = args[0];
  }
  return [...args].filter(notEmpty).join(' ');
}
