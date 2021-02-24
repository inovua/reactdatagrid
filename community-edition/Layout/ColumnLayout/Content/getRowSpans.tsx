/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TypeComputedColumn, TypeRowProps } from '../../../types';

export default (rowProps: TypeRowProps): { [key: string]: number } => {
  const rowSpans: { [key: string]: number } = {};

  const {
    data,
    realIndex: rowIndex,
    remoteRowIndex,
    columns,
    empty,
    dataSourceArray,
  } = rowProps;

  columns.forEach((column: TypeComputedColumn) => {
    const name: string | undefined = column.name;
    const rowspan = column.rowspan;

    const value: any = data && name ? data[name] : null;

    let computedRowspan = 1;

    if (typeof rowspan === 'function') {
      computedRowspan = rowspan({
        dataSourceArray,
        data,
        value,
        remoteRowIndex,
        rowIndex,
        column,
        columns,
        empty,
      });

      rowSpans[column.id] = computedRowspan;
    }
  });

  return rowSpans;
};
