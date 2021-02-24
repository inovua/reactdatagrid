/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function sum(a, b) {
  return a + b;
}

/**
 * Returns an object with the keys:
 * getGroupedItems([30], [30], [40], dropdownButtonSize)
 * {
 *   visibleIndexes: Number[], - a list of indexes that are visible
 *   overflowItem: Number[], - a list of indexes that don't fit
 * }
 * @param  {Number[]} boxes              a list of box sizes to fit into maxSize
 * @param  {Number} overflowControlSize the size of the overflow control
 * @return {{
 *   visibleIndexes: [],
 *   overflowIndexes: [],
 * }}|null - an object with visible and overflow indexes, or null if it doesn't oveflow
 */
function getGroupedItems({ boxes, maxSize, overflowControlSize = 0 }) {
  // check if they fit
  const boxesSize = boxes.reduce(sum);
  if (boxesSize <= maxSize) {
    return false;
  }

  let availableSize = maxSize - overflowControlSize;

  const groups = boxes.reduce(
    (acc, box, index) => {
      if (availableSize - box >= 0) {
        // then it fits
        acc.visibleIndexes.push(index);
        availableSize -= box;
      } else {
        availableSize = 0;
        acc.overflowIndexes.push(index);
      }

      return acc;
    },
    { visibleIndexes: [], overflowIndexes: [] }
  );

  return groups;
}

export default getGroupedItems;
