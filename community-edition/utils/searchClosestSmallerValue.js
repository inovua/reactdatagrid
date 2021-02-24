/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default (array, value, low = 0, high = array.length - 1) => {
  let mid;
  let midValue;

  let midNextIndex;
  let midNextValue;
  while (low <= high) {
    mid = low + ((high - low) >> 1);
    midValue = array[mid];

    midNextIndex = mid + 1;
    midNextValue = array[midNextIndex];
    if (midValue <= value) {
      if (midNextValue === undefined || midNextValue > value) {
        return mid;
      }
      // search again in the second half
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return -1;
};
