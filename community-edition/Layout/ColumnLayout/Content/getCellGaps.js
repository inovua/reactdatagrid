/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getColumnRenderRange from './getColumnRenderRange';

export const getCellIndex = cell => cell.getProps().index;
export const sortCells = cells =>
  cells.sort((cell1, cell2) => getCellIndex(cell1) - getCellIndex(cell2));

export default function(columnRenderStartIndex, props = this.props, range) {
  columnRenderStartIndex =
    columnRenderStartIndex === undefined
      ? props.columnRenderStartIndex
      : columnRenderStartIndex;

  range =
    range || getColumnRenderRange.call(this, columnRenderStartIndex, props);
  const endIndex = range.end;
  let startIndex = range.start;

  const sortedCells = sortCells(this.cells);

  const visibleCellPositions = {};

  sortedCells.forEach(cell => {
    visibleCellPositions[getCellIndex(cell)] = true;
  });

  const gaps = [];

  for (; startIndex <= endIndex; startIndex++) {
    if (!visibleCellPositions[startIndex]) {
      gaps.push(startIndex);
    }
  }

  return { gaps, range };
}
