/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const emptyObject = {};

type TypeArg = {
  id: string;
  name?: string;
  groupByName?: string;
  groupBy?: string;
};

export default (
  columns: TypeArg[],
  { showWarnings }: { showWarnings?: boolean } = emptyObject
) =>
  columns.reduce((acc: { [key: string]: any }, col) => {
    if (col.id) {
      if (showWarnings && acc[col.id]) {
        console.error(`Duplicate column with id "${col.id}" found!`);
      }
      acc[col.id] = col;
    }
    if (col.name && col.name != col.id) {
      if (showWarnings && !col.id && acc[col.name]) {
        console.error(`Duplicate column with name "${col.name}" found!`);
      }
      if (!col.id) {
        acc[col.name] = col;
      }
    }
    if (typeof col.groupBy == 'string' || col.groupByName) {
      const key = (col.groupBy || col.groupByName) as string;
      acc[key] = col;
    }
    return acc;
  }, {});
