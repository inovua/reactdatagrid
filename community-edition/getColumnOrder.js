/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const sameColumns = (cols1, cols2) => {
  return cols1.reduce((acc, col1, index) => {
    const col2 = cols2[index];

    return acc && col1.id === col2.id && col1.name === col2.name;
  }, true);
};
export default (newProps, currentProps, state) => {
  let newColumnOrder =
    newProps.columnOrder == null ? state.columnOrder : newProps.columnOrder;

  if (
    newProps.columns &&
    (newProps.columns.length !== currentProps.columns.length ||
      !sameColumns(newProps.columns, currentProps.columns)) &&
    newProps.columnOrder == null
  ) {
    // columns have changed and columnOrder was set from initial state
    // we need to make sure we update the column order to reflect the new columns
    newColumnOrder = null;
  }

  if (!Array.isArray(newColumnOrder)) {
    newColumnOrder = null;
  }

  return newColumnOrder;
};
