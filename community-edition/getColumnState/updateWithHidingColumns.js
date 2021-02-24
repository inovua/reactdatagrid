/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import mapColumns from '../mapColumns';
import getHidingColumns from '../getHidingColumns';

export default (columns, props, state, context) => {
  const tempNewColumnsMap = mapColumns(columns, props);
  const hidingColumns = context.hidingColumns;

  if (!hidingColumns.length) {
    const hiding = getHidingColumns(
      columns,
      tempNewColumnsMap,
      state.columnsMap
    );
    hidingColumns.push(...hiding);
  }

  context.hidingColumnsMap = mapColumns(hidingColumns, props);

  if (hidingColumns.length) {
    hidingColumns.forEach(c => {
      const id = c.id || c.name;
      // only insert the column if not already there
      const column = tempNewColumnsMap[id] || c;

      if (context.inTransition) {
        column.width = 0;
        column.minWidth = 0;
        column.maxWidth = 0;
      }
      column.visible = true;

      if (!tempNewColumnsMap[id]) {
        columns.splice(c.initialIndex, 0, c);
      }
    });
  }

  if (hidingColumns.length) {
    // make sure we clone all columns
    // and set visibilityTransitionDuration on all of them, since they all need to transition
    // their transform position or their width/min-width
    const hidingColumn = hidingColumns[0];

    const duration =
      hidingColumn.hideTransitionDuration !== undefined
        ? hidingColumn.hideTransitionDuration
        : hidingColumn.visibilityTransitionDuration;

    columns = columns.map(c => {
      c.inTransition = true;
      c.inHideTransition = true;
      c.visibilityTransitionDuration = duration;
      c.hideTransitionDuration = duration;
      return c;
    });
  }

  return columns;
};
