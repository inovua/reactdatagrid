/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Returns the first index that is non disabled
 * if all items are disabled then null is returned
 * @param  {Object[]} items
 * @return {Number} index
 */
function getFirstNonDisabledItem(items) {
  let fistNonDisabledItemIndex = null;
  if (!items || (items && !items.length)) {
    return null;
  }
  for (let i = 0, len = items.length; i < len; i++) {
    const item = items[i];
    if (item && !item.disabled && !item.isTitle) {
      fistNonDisabledItemIndex = i;
      break;
    }
  }

  return fistNonDisabledItemIndex;
}

export default getFirstNonDisabledItem;
