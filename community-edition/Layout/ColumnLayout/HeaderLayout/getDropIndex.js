/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default ({
  dragTarget,
  dropTarget,
  dragMinIndex,
  dragMaxIndex,
  dragRange,
  ranges,
  rtl,
  dir,
  validDropPositions,
}) => {
  ranges = ranges || [];

  const { index: dragIndex } = dragRange;

  const draggingLocked = dragRange.computedLocked;
  let locked = draggingLocked;

  const isValid = i => {
    if (i === undefined) {
      return false;
    }

    const validDropIndex =
      dropTarget === 'group' || !validDropPositions || validDropPositions[i];

    if (
      (dragMinIndex !== undefined && i < dragMinIndex) ||
      (dragMaxIndex !== undefined && i > dragMaxIndex) ||
      !validDropIndex ||
      i > ranges.length
    ) {
      return false;
    }

    return true;
  };

  const searchInRanges =
    dragTarget != dropTarget
      ? ranges
      : dir == 1
      ? ranges.slice(dragIndex)
      : ranges.slice(0, dragIndex);

  let currentRange;
  let halfSize;
  let thisDir;
  let index;

  let foundIndex;

  for (let i = 0, len = searchInRanges.length; i < len; i++) {
    currentRange = searchInRanges[i];
    if (!currentRange) {
      // TODO improve this - we should not need this protection. reproduce this by dragging a second col to group
      continue;
    }
    index = currentRange.index;
    thisDir = index <= dragIndex || dragTarget !== dropTarget ? -1 : 1;

    halfSize = (currentRange.right - currentRange.left) / 2;

    if (thisDir > 0) {
      if (
        isValid(index + 1) &&
        (rtl
          ? dragRange.left <= currentRange.right - halfSize
          : dragRange.right >= currentRange.left + halfSize)
      ) {
        foundIndex = index + 1;
      }
    } else {
      if (
        isValid(index) &&
        (rtl
          ? dragRange.right > currentRange.right - halfSize
          : dragRange.left < currentRange.left + halfSize)
      ) {
        foundIndex = index;
        if (dropTarget !== dragTarget || dir === -1) {
          break;
        }
      }
    }
  }

  if (dragTarget === dropTarget) {
    if (foundIndex === dragIndex + 1) {
      foundIndex++;
    } else if (foundIndex === undefined) {
      foundIndex =
        dragIndex === ranges.length - 1 || dragIndex === 0
          ? dragIndex
          : dir > 1
          ? ranges.length
          : undefined;
    }
  } else if (foundIndex === undefined) {
    foundIndex = ranges.length;
  }

  if (!isValid(foundIndex)) {
    foundIndex = undefined;
  }

  if (dragMinIndex !== undefined && foundIndex < dragMinIndex) {
    foundIndex = dragMinIndex;
  }

  if (dragMaxIndex !== undefined && foundIndex > dragMaxIndex) {
    foundIndex = dragMaxIndex;
  }

  if (!isValid(foundIndex)) {
    foundIndex = dragIndex;
  }

  if (!isValid(foundIndex)) {
    foundIndex = undefined;
  }

  if (isValid(foundIndex) && ranges[foundIndex]) {
    locked = ranges[foundIndex].computedLocked;
  }

  const initialLocked = locked;

  if (dir === 1) {
    const targetRange = ranges[foundIndex];
    const beforeTargetRange = ranges[foundIndex - 1];
    const afterTargetRange = ranges[foundIndex + 1];

    if (targetRange && !targetRange.computedLocked) {
      if (rtl) {
        if (dragRange.left < targetRange.right) {
          locked = targetRange.computedLocked;
        } else {
          locked = beforeTargetRange
            ? beforeTargetRange.computedLocked
            : initialLocked;
        }
      } else {
        if (dragRange.right > targetRange.left) {
          locked = targetRange.computedLocked;
        } else {
          locked = beforeTargetRange
            ? beforeTargetRange.computedLocked
            : initialLocked;
        }
      }
    } else if (targetRange && targetRange.computedLocked === 'end') {
      if (rtl) {
        locked =
          dragRange.left < targetRange.right
            ? 'end'
            : beforeTargetRange
            ? beforeTargetRange.computedLocked
            : initialLocked;
      } else {
        locked =
          dragRange.right > targetRange.left
            ? 'end'
            : beforeTargetRange
            ? beforeTargetRange.computedLocked
            : initialLocked;
      }
    } else if (
      afterTargetRange &&
      !afterTargetRange.computedLocked &&
      (rtl
        ? dragRange.left > afterTargetRange.right
        : dragRange.right > afterTargetRange.left)
    ) {
      locked = null;
    } else if (
      beforeTargetRange &&
      beforeTargetRange.computedLocked === 'end'
    ) {
      locked = 'end';
    }
  }
  if (dir === -1) {
    const targetRange = ranges[foundIndex];
    const beforeTargetRange = ranges[foundIndex - 1];
    if (
      beforeTargetRange &&
      !beforeTargetRange.computedLocked &&
      (rtl
        ? dragRange.right > beforeTargetRange.left
        : dragRange.left < beforeTargetRange.right)
    ) {
      locked = null;
    } else if (
      beforeTargetRange &&
      beforeTargetRange.computedLocked === 'start' &&
      (rtl
        ? dragRange.right > beforeTargetRange.left
        : dragRange.left < beforeTargetRange.right)
    ) {
      locked = 'start';
    } else if (
      targetRange &&
      targetRange.computedLocked === 'end' &&
      (rtl
        ? dragRange.right > targetRange.left
        : dragRange.left < targetRange.right)
    ) {
      locked = 'end';
    }
  }

  if (
    draggingLocked === 'start' &&
    ranges[foundIndex] &&
    ranges[foundIndex].computedLocked === 'start' &&
    locked == null
  ) {
    foundIndex++;
  }

  return { index: foundIndex, locked };
};
