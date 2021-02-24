/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import positionsMap from './positionsMap';

function createEmptyArray(length, fn) {
  return Array.apply(null, Array(length)).map(fn);
}

function handleNumericOffset(offset, offsetCorrection) {
  const normalizedOffset = {
    x: offset * offsetCorrection.x,
    y: offset * offsetCorrection.y,
  };

  if (offsetCorrection.resetNumeric) {
    normalizedOffset[offsetCorrection.resetNumeric] = 0;
  }

  return normalizedOffset;
}

function handleObjectOffset(offset, offsetCorrection) {
  const normalizedOffset = {
    x: offset.x === undefined ? 0 : offset.x * offsetCorrection.x,
    y: offset.y === undefined ? 0 : offset.y * offsetCorrection.y,
  };

  return normalizedOffset;
}

/**
 * If offset is a number|object, returns an array of given length
 * with this number.
 * If is an array, and are not the same length, it will fill the array
 * with the last item the difference
 * @param {Number|Object|Number[]|Object[]} offset          [description]
 * @param {Number} positionsLength
 */
function normalizeOffset(offset, positionsLength) {
  let normalizedOffsets = null;

  if (
    typeof offset === 'number' ||
    (!Array.isArray(offset) && typeof offset === 'object')
  ) {
    normalizedOffsets = createEmptyArray(positionsLength, () => offset);
  } else if (Array.isArray(offset)) {
    if (offset.length < positionsLength) {
      const lastOffsetItem = offset[offset.length - 1];
      const extraOffsets = createEmptyArray(
        positionsLength - offset.length,
        () => lastOffsetItem
      );
      normalizedOffsets = [...offset, ...extraOffsets];
    } else {
      normalizedOffsets = offset;
    }
  }

  return normalizedOffsets;
}

/**
 * Corrects offset so it is applied relative to its position.
 *
 * Numeric.
 * When it is numeric it should position itself oposite to it's target position.
 * Offset 10.
 * Position top. y axis is affected
 * Position top left. both y and x are affected
 *
 * Object.
 * Offset is corrected using positionMap offset correction.
 * For example.
 * offset { x, y }
 * x is used as it is, but y is multiplied with -1, so tooltip
 * will be 10 px above the target.
 *
 * @param {[type]} offset           [description]
 * @param {[type]} offsetCorrection [description]
 */
function getPositionOffsets(positions, offset) {
  const normalizedOffsets = normalizeOffset(offset, positions.length);
  const positionOffsets = normalizedOffsets.map((normalizedOffset, index) => {
    const position = positions[index];
    const positionMap = positionsMap[position];
    const offsetCorrection = positionMap
      ? positionMap.offset
      : position.offset || { x: 0, y: 0 };

    if (typeof normalizedOffset === 'number') {
      return handleNumericOffset(normalizedOffset, offsetCorrection);
    }

    return handleObjectOffset(normalizedOffset, offsetCorrection);
  });

  return positionOffsets;
}

export default getPositionOffsets;
