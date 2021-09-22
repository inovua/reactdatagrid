/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TypeComputedColumn } from '../../../types';

const emptyObject = Object.freeze ? Object.freeze({}) : null;

const addTransitionDuration = (cols, style) => {
  const firstCol = cols[0];

  if (firstCol.inTransition) {
    let duration = firstCol.inShowTransition
      ? firstCol.showTransitionDuration
      : firstCol.hideTransitionDuration;

    duration = duration || firstCol.visibilityTransitionDuration;
    style.transitionDuration =
      typeof duration == 'number' ? `${duration}ms` : duration;
    return true;
  }

  return false;
};

export default (
  initialCells,
  {
    renderLockedStartCells,
    renderLockedEndCells,

    lockedStartColumns,
    lockedEndColumns,
    availableWidth,
    virtualizeColumns,
    sticky,
    rowHeight,
    columns,
    depth,
    data,
    initialRowHeight,
    groupNestingSize,
    nativeScroll,
    scrollbarWidth,
    groupProps,
    expandGroupTitle,
    computedRowExpandEnabled,
    expanded,
    shouldRenderCollapsedRowDetails,
    virtualListBorderLeft,
    virtualListBorderRight,
    getScrollLeftMax,
    rtl,
  }: any,
  scrollLeft,
  {
    lockedStartContent,
    lockedEndContent,
    unlockedContent,
    isHeader,
  } = emptyObject,
  style?: any
) => {
  const lockedStartCount = lockedStartColumns ? lockedStartColumns.length : 0;
  const lockedEndCount = lockedEndColumns ? lockedEndColumns.length : 0;
  const lockedEndStartIndex = initialCells.length - lockedEndCount;

  const groupDepth = data && data.__group ? data.depth - 1 : depth || 0;

  let lockedStartCells = null;
  let lockedEndCells = null;
  let unlockedCells = null;

  const hasRowDetails =
    computedRowExpandEnabled && (expanded || shouldRenderCollapsedRowDetails);

  const lockedStartEndArgs = {
    lockedStartCount,
    isHeader,
    virtualListBorderLeft,
    lockedStartColumns,

    style,
    virtualizeColumns,
    rtl,
    getScrollLeftMax,
    addTransitionDuration,
    lockedStartContent,
    initialCells,
    sticky,
    scrollLeft,
    rowHeight,

    groupProps,
    expandGroupTitle,
    lockedEndColumns,

    nativeScroll,
    scrollbarWidth,

    virtualListBorderRight,

    lockedEndContent,

    hasRowDetails,
    initialRowHeight,
    lockedEndStartIndex,
    availableWidth,
  };
  if (lockedStartCount && renderLockedStartCells) {
    lockedStartCells = renderLockedStartCells(lockedStartEndArgs);
  }

  if (lockedEndCount && renderLockedEndCells) {
    lockedEndCells = renderLockedEndCells(lockedStartEndArgs);
  }

  unlockedCells =
    unlockedContent ||
    initialCells.slice(lockedStartCount, lockedEndStartIndex);

  if (lockedStartCount || lockedEndCount) {
    return [lockedStartCells, unlockedCells, lockedEndCells];
  }

  return initialCells;
};
