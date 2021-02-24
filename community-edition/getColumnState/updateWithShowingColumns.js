/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import assign from 'object-assign';

import getShowingColumns from '../getShowingColumns';

export default (columns, props, state, context) => {
  context = context || {};
  const showingColumnsMap = assign(
    context.showingColumnsMap,
    getShowingColumns(columns, state.columnsMap)
  );

  const showingKeys = Object.keys(showingColumnsMap);

  if (showingKeys.length) {
    const showingColumn = showingColumnsMap[showingKeys[0]];
    const duration =
      showingColumn.showTransitionDuration !== undefined
        ? showingColumn.showTransitionDuration
        : showingColumn.visibilityTransitionDuration;

    columns = columns.map(c => {
      const id = c.id || c.name;

      c.inTransition = !!context.inTransition;
      if (c.inTransition) {
        c.inShowTransition = true;
      }

      if (!c.inTransition && showingColumnsMap[id]) {
        c.width = 0;
        c.minWidth = 0;
        c.maxWidth = 0;
      }

      c.showTransitionDuration = duration;
      c.visibilityTransitionDuration = duration;
      return c;
    });
  }

  return columns;
};
