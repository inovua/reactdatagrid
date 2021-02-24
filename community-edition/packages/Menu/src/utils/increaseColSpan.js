/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function increaseColSpan(column) {
  let newColumn = column;
  if (typeof newColumn === 'string') {
    newColumn = {
      name: newColumn,
      colSpan: 2,
    };
  } else {
    newColumn = {
      ...column,
      colSpan: newColumn.colSpan ? newColumn.colSpan + 1 : 2,
    };
  }
  return newColumn;
}

function increaseLastColumnColSpan(columns) {
  return [
    ...columns.slice(0, -1),
    increaseColSpan(columns[columns.length - 1]),
  ];
}

function increaseFirstColumnColSpan(columns) {
  return [increaseColSpan(columns[0]), ...columns.slice(1)];
}

export default increaseColSpan;

export { increaseLastColumnColSpan, increaseFirstColumnColSpan };
