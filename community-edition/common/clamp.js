/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function clamp(value, min, max) {
  if (isNaN(value)) {
    return value;
  }

  const minUndefined = typeof min === 'undefined';
  const maxUndefined = typeof max === 'undefined';
  if (minUndefined && maxUndefined) {
    return value;
  }
  if (minUndefined) {
    if (!maxUndefined) {
      return value > max ? max : value;
    }
  }
  if (maxUndefined) {
    if (!minUndefined) {
      return value < min ? min : value;
    }
  }
  if (min > max) {
    return clamp(value, max, min);
  }
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }

  return value;
}

export default clamp;
