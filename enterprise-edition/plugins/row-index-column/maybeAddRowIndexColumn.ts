/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import DEFAULT_ROW_INDEX_COLUMN from './defaultRowIndexColumn';

import { IColumn } from '@inovua/reactdatagrid-community/types/TypeColumn';

export default function(
  columns: any[],
  props: {
    rowIndexColumn?: IColumn | boolean;
  }
): any[] {
  if (props.rowIndexColumn) {
    const col = {
      ...DEFAULT_ROW_INDEX_COLUMN,
      ...(props.rowIndexColumn && typeof props.rowIndexColumn === 'object'
        ? props.rowIndexColumn
        : null),
      id: DEFAULT_ROW_INDEX_COLUMN.id,
    };
    columns = [col].concat(columns);
  }

  return columns;
}
