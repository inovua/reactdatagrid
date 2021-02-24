/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const bottomPositions = {
  'tl-br': true,
  'tc-bc': true,
  'tl-bl': true,
  'tr-br': true,
  'tr-bl': true,
};

/**
 * Returns true whether the overlay is posiitoned at the bottom of the target.
 *
 * @param  {String}  position
 * @return {Boolean}
 */
function isPositionBottom(position) {
  return !!bottomPositions[position];
}

export default isPositionBottom;
