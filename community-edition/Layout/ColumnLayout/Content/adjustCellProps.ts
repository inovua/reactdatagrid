/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import renderGroupTitle from './renderGroupTitle';

/**
 * This function MUTATES cellProps.
 *
 * Since it is called when we have `groupBy` on the grid, for all group rows, it needs to be very
 * performant and return as soon as possible.
 */
export default (cellProps: any, rowProps: any) => {
  const {
    groupProps,
    totalLockedStartWidth,
    totalLockedEndWidth,
    totalUnlockedWidth,
    totalComputedWidth,
    totalColumnCount,
    firstLockedEndIndex,
    firstUnlockedIndex,
    groupColumn,
    hasLockedEnd,
    hasLockedStart,
  } = rowProps;

  const { computedVisibleIndex, computedLocked, expandColumnIndex } = cellProps;
  const expandColumn = computedVisibleIndex === expandColumnIndex;

  let { expandGroupTitle } = rowProps;

  if (!hasLockedStart && !hasLockedEnd) {
    expandGroupTitle = true;
  }

  const { data } = rowProps;

  const lockedStart = computedLocked === 'start';
  const lockedEnd = computedLocked === 'end';

  if (
    (groupProps && computedVisibleIndex < groupProps.depth) ||
    (expandColumnIndex != null && computedVisibleIndex < expandColumnIndex)
  ) {
    // when we have a group, all cells before the group collapse tool (>)
    // should be empty
    cellProps.value = null;
    cellProps.noBackground = true;

    return cellProps;
  }

  if (computedVisibleIndex === groupProps?.depth) {
    // this is the cell that should contain the collapse tool (>)
    cellProps.value = null;
    cellProps.collapsed = groupProps.collapsed;
    // make it textAlign center so it looks nice
    cellProps.textAlign = 'center';
    cellProps.noBackground = false;
    cellProps.firstInSection = true;
    return cellProps;
  }

  if (computedVisibleIndex === groupProps?.depth + 1 || expandColumn) {
    // this is the cell with the group title
    let remainingWidth = lockedStart
      ? totalLockedStartWidth
      : totalComputedWidth - totalLockedEndWidth;

    if (expandGroupTitle || expandColumn) {
      remainingWidth = totalComputedWidth;
      cellProps.last = true;
      cellProps.computedColspan = Math.max(
        totalColumnCount - computedVisibleIndex,
        1
      );
    } else {
      cellProps.computedColspan = Math.max(
        lockedStart
          ? firstUnlockedIndex - computedVisibleIndex
          : lockedEnd
          ? totalColumnCount - computedVisibleIndex
          : firstLockedEndIndex - computedVisibleIndex,
        1
      );
    }

    // make it fill all available space
    cellProps.lastInSection = true;
    cellProps.noBackground = false;
    cellProps.computedWidth = remainingWidth - cellProps.computedOffset;
    // only override  for groups, not for expandColumn
    if (!expandColumn) {
      cellProps.value = renderGroupTitle({ cellProps, rowProps, groupProps });
    }
    cellProps.zIndex = 1;
    cellProps.textAlign = 'start';
    if (cellProps.render) {
      if (!expandColumn) {
        // only override  for groups, not for expandColumn
        cellProps.render = () => cellProps.value;
      }
    }

    return cellProps;
  }

  // all other cells that come after the cell with the group title
  if (lockedStart) {
    // if it's a locked start column, hide it, since the group title cell should expand
    // to occupy all available space
    cellProps.hidden = true;
  } else {
    const fakeHidden = lockedEnd
      ? computedVisibleIndex !== firstLockedEndIndex
      : computedVisibleIndex !== firstUnlockedIndex;

    if (!cellProps.hidden) {
      cellProps.textAlign = 'start';
      cellProps.value = fakeHidden
        ? null
        : renderGroupTitle({ cellProps, rowProps, groupProps });
      if (cellProps.render) {
        cellProps.render = () => cellProps.value;
      }
      cellProps.computedWidth = lockedEnd
        ? totalLockedEndWidth
        : totalUnlockedWidth;

      if (!lockedEnd && computedVisibleIndex >= firstUnlockedIndex + 1) {
        // only one unlocked cell is displayed - all other cells should be hidden
        cellProps.hidden = true;
      }
      cellProps.firstInSection = true;
      cellProps.last = hasLockedEnd ? lockedEnd : true;
      cellProps.lastInSection = true;
      cellProps.computedColspan = Math.max(
        lockedEnd
          ? totalColumnCount - computedVisibleIndex
          : firstLockedEndIndex - computedVisibleIndex,
        1
      );
    }
  }

  return cellProps;
};
