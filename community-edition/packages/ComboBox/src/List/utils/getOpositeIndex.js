/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Returns the reverse index. It is used when the list
 * is rendered in top position, first item should be at the bottom
 * at last item at the top, so index must be fliped.
 * For index 0, and length 20, oposite index should be 19
 * @param  {Number} index
 * @param  {Number} length
 * @return {Number} oposite index
 */
function getOpositeIndex(index, length) {
  return length - 1 - index;
}

export default getOpositeIndex;
