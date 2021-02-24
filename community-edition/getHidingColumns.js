/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import assign from 'object-assign';

export default (columns, newColumnsMap, oldColumnsMap) => {
  const hidingColumns = [];

  const visited = {};

  Object.keys(oldColumnsMap).forEach(k => {
    let c = oldColumnsMap[k];
    const id = c.id || c.name;

    if (visited[id]) {
      return;
    }
    visited[id] = true;

    if (c.visibilityTransitionDuration || c.hideTransitionDuration) {
      if (
        (!newColumnsMap[id] &&
          oldColumnsMap[id] &&
          !oldColumnsMap[id].inTransition) ||
        (newColumnsMap[id] &&
          newColumnsMap[id].visible === false &&
          oldColumnsMap[id] &&
          oldColumnsMap[id].visible !== false &&
          !oldColumnsMap[id].inTransition)
      ) {
        c = assign({}, c, {
          visible: true,
          initialIndex: oldColumnsMap[id].initialIndex,
        });
        hidingColumns.push(c);
      }
    }
  });

  return hidingColumns;
};
