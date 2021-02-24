/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import range from '../../../../common/range';

function prepareAlignOffset(alignOffset, positionsLength) {
  // if number normalize to { x, y }
  let offset;
  if (Array.isArray(alignOffset)) {
    offset = alignOffset.map(alignOffsetItem => {
      // make sure it is in object
      if (typeof alignOffsetItem === 'number') {
        return {
          x: alignOffsetItem,
          y: alignOffsetItem,
        };
      } else {
        return alignOffsetItem;
      }
    });
  }

  if (typeof alignOffset === 'number') {
    offset = {
      x: alignOffset,
      y: alignOffset,
    };
  }

  if (typeof alignOffset === 'object') {
    offset = alignOffset;
  }

  // have to be the same number of offsets as positions
  if (!Array.isArray(offset) && positionsLength) {
    offset = range(0, positionsLength).map(() => offset);
  }

  return offset;
}

export default prepareAlignOffset;
