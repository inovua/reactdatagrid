/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default (columns, oldColumnsMap) => {
  const showingColumnsMap = {};

  // only after initial render can we have showing transition
  if (Object.keys(oldColumnsMap).length) {
    columns.forEach(c => {
      const id = c.id || c.name;
      if (c.visibilityTransitionDuration || c.showTransitionDuration) {
        if (
          !oldColumnsMap[id] ||
          (oldColumnsMap[id].visible === false &&
            c.visible !== false &&
            !oldColumnsMap[id].inTransition)
        ) {
          if (c.id) {
            showingColumnsMap[c.id] = c;
          }
          if (c.name) {
            showingColumnsMap[c.name] = c;
          }
        }
      }
    });
  }

  return showingColumnsMap;
};
