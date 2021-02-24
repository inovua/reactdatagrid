/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import DragHelper from '../../packages/drag-helper';

const emptyFn = () => {};

export default function(
  {
    region,
    headerRegion,
    constrainTo,
    columnHeaderNodes,
    columns,
    rtl,
    index,
    firstFlexIndex,
    shareSpace,
    shareSpaceOnResize,
    initialSize,
    nextColumnSize,
    extraOffset,
    groupColumns,
  },
  {
    onResizeDragInit = emptyFn,
    onResizeDragStart = emptyFn,
    onResizeDrag = emptyFn,
    onResizeDrop = emptyFn,
  },
  event
) {
  const column = columns[index];
  const nextColumn = columns[index + 1];

  const initialPosition = rtl
    ? headerRegion.right - region.right
    : region.left - headerRegion.left;

  const isContrained = dragRegion => {
    const constrained =
      dragRegion.left <= constrainTo.left ||
      dragRegion.right >= constrainTo.right;

    return constrained;
  };

  DragHelper(event, {
    constrainTo,
    region,
    onDragInit: onResizeDragInit.bind(this, {
      offset: initialPosition,
      region,
      initialPosition,
      constrained: isContrained(region),
    }),
    onDragStart(e, config) {
      const constrained = isContrained(config.dragRegion);

      onResizeDragStart({
        initialPosition,
        offset: initialPosition,
        constrained,
        resizing: true,
        region,
        column,
      });
    },
    onDrag(e, config) {
      const diff = config.diff.left;

      const offset = initialPosition + (rtl ? -1 : 1) * diff;
      const constrained = isContrained(config.dragRegion);

      e.preventDefault();

      onResizeDrag({
        constrained,
        initialPosition,
        diff,
        offset,
        region,
        column,
      });
    },
    onDrop(e, config) {
      const diff = (rtl ? -1 : 1) * Math.round(config.diff.left);
      const offset = initialPosition + diff;
      const constrained = isContrained(config.dragRegion);
      const size = initialSize + diff;

      const doShare = shareSpace;
      let nextColSize;
      if (doShare) {
        nextColSize = nextColumnSize - diff;
      }
      onResizeDrop({
        index,
        constrained,
        initialPosition,
        region,
        diff,
        offset,
        size,
        shareSpaceOnResize,
        groupColumns,
        initialSize,
        firstFlexIndex,
        shareSpace: doShare,
        column,
        nextColumn,
        nextColumnSize: nextColSize,
      });
    },
  });
}
