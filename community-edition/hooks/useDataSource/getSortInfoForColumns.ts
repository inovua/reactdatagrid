/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TypeSortInfo, TypeComputedColumnsMap, IColumn } from '../../types';

const getCol = (name: string, columnsMap: IColumn) => {
  let col = columnsMap[name as keyof IColumn];

  if (!col) {
    Object.keys(columnsMap).forEach(colId => {
      if (col) {
        return;
      }
      const theCol = columnsMap[colId as keyof IColumn];

      if (theCol.sortName === name) {
        col = theCol;
      }
    });
  }

  return col;
};

const getSortInfoForColumns = (
  sortInfo: TypeSortInfo,
  columnsMap: TypeComputedColumnsMap
) => {
  if (!columnsMap) {
    return sortInfo;
  }

  if (!Array.isArray(sortInfo)) {
    if (sortInfo && sortInfo.name) {
      const col = getCol(sortInfo.name, columnsMap);
      sortInfo = { ...sortInfo };
      if (col) {
        if (typeof col.sortName === 'string') {
          sortInfo.name = col.sortName;
        }

        if (col.type) {
          sortInfo.type = col.type;
        }
        if (col.sort) {
          sortInfo.fn = (
            one: any,
            two: any,
            data1: any,
            data2: any,
            sortInfo: any
          ) => (col.sort ? col.sort(one, two, col, data1, data2, sortInfo) : 0);
        }
      }
    }

    return sortInfo;
  } else {
    return sortInfo.map(sortInfo => {
      const col = getCol(sortInfo.name, columnsMap);
      sortInfo = { ...sortInfo };
      if (col && typeof col.sortName === 'string') {
        sortInfo.name = col.sortName;
      }
      if (col.type) {
        sortInfo.type = col.type;
      }
      if (col.sort) {
        sortInfo.fn = (
          one: any,
          two: any,
          data1: any,
          data2: any,
          sortInfo: any
        ) => (col.sort ? col.sort(one, two, col, data1, data2, sortInfo) : 0);
      }

      return sortInfo;
    });
  }
};
export default getSortInfoForColumns;
