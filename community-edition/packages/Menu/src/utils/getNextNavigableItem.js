/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Returns next non null item.
 * Used to navigate over disabled items.
 * @param  {Object[]} items
 * @param  {Number} [startFrom=0] Index of the current item
 * @param  {Number} [direction=1] In which direction should search for the next item
 * @return {Number}               Index of the next item
 */
function getNextNavigableItem(items, startFrom = 0, direction = 1) {
  let nextNavigableItem = null;
  if (!items || (items && !items.length)) {
    return null;
  }

  if (startFrom === null) {
    return null;
  }

  if (direction === 1) {
    for (let i = startFrom + 1, len = items.length; i < len; i++) {
      const item = items[i];
      const isDisabled = item && item.disabled;
      const isSeparator = item === '-';
      const isTitle = item.isTitle;

      if (!isSeparator && !isDisabled && !isTitle) {
        nextNavigableItem = i;
        break;
      }
    }
  } else {
    for (let i = startFrom - 1; i >= 0; i--) {
      const item = items[i];
      const isDisabled = item && item.disabled;
      const isSeparator = item === '-';
      const isTitle = item.isTitle;

      if (!isSeparator && !isDisabled && !isTitle) {
        nextNavigableItem = i;
        break;
      }
    }
  }

  return nextNavigableItem;
}

export default getNextNavigableItem;
