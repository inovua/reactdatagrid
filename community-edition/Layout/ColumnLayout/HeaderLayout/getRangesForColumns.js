/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default (
  columns,
  {
    headerRegion,
    initialOffset,
    availableWidth,
    totalLockedEndWidth,
    initialScrollLeft,
    rtlOffset,
    rtl,
  }
) => {
  let lockedEndOffset = 0;

  const result = columns.map((c, i) => {
    const computedLocked = c.computedLocked;
    let offset = rtl
      ? initialOffset - (initialScrollLeft || 0) - c.computedOffset
      : c.computedOffset + (initialOffset - (initialScrollLeft || 0));

    if (rtl) {
      offset += rtlOffset;
    }

    if (computedLocked === 'end') {
      offset = !rtl
        ? availableWidth - totalLockedEndWidth + lockedEndOffset + initialOffset
        : initialOffset -
          availableWidth +
          totalLockedEndWidth -
          lockedEndOffset;
      lockedEndOffset += c.computedWidth;
    }
    if (computedLocked === 'start') {
      offset = c.computedOffset + (initialOffset || 0);
    }

    const result = {
      [rtl ? 'right' : 'left']: offset,
      [rtl ? 'left' : 'right']: rtl
        ? offset - c.computedWidth
        : offset + c.computedWidth,
      width: c.computedWidth,
      computedLocked,
      index: i,
    };

    return result;
  });

  return result;
};
