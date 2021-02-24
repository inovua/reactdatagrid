/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default ({
  visibleColumns,
  availableWidth,
  lockedStartColumns,
  lockedEndColumns,
  virtualizeColumns,
}) => {
  if (virtualizeColumns === false) {
    return visibleColumns.length;
  }

  // sort cols to have those with lower computedWidth at the beginning of the array
  const columns = [...visibleColumns].sort((a, b) => {
    return a.computedWidth - b.computedWidth;
  });

  const columnWidthPrefixSums = [];
  let widthSum = 0;

  let accumulateWidth = 0;
  let columnRenderCount = 0;

  columns.forEach(col => {
    columnWidthPrefixSums.push(widthSum);
    widthSum += col.computedWidth;
    if (accumulateWidth <= availableWidth) {
      columnRenderCount++;
      accumulateWidth += col.computedWidth;
    }
  });

  columnRenderCount += 1;

  if (lockedStartColumns && lockedStartColumns.length) {
    columnRenderCount -= lockedStartColumns.length;
  }
  if (lockedEndColumns && lockedEndColumns.length) {
    columnRenderCount -= lockedEndColumns.length;
  }

  return columnRenderCount;
};
