/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import DEFAULT_CHECK_COLUMN from './defaultCheckColumn';
export default function(columns, props, state) {
  const checkboxColumn = props.checkboxColumn || state.checkboxColumn;
  if (checkboxColumn) {
    const checkCol = {
      ...DEFAULT_CHECK_COLUMN,
      showTransitionDuration: props.columnShowVisibilityTransitionDuration,
      hideTransitionDuration: props.columnHideVisibilityTransitionDuration,
      visibilityTransitionDuration: props.columnVisibilityTransitionDuration,
      ...checkboxColumn,
      id: DEFAULT_CHECK_COLUMN.id,
    };
    if (checkCol.visible === false && state.checkboxColumn) {
      checkCol.visible = true;
    }
    if (columns[0] && columns[0].group && props.groups && props.groups.length) {
      // show border for next column if there are stacked columns
      delete checkCol.nextBorderLeft;
    }
    columns = [checkCol].concat(columns);
  }
  return columns;
}
