/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default function(columnRenderStartIndex, props) {
  if (!props.virtualizeColumns) {
    return null;
  }

  if (props.columnRenderCount != null) {
    const columnRenderEndIndex =
      columnRenderStartIndex + props.columnRenderCount;

    return { start: columnRenderStartIndex, end: columnRenderEndIndex };
  }

  return null;
}
