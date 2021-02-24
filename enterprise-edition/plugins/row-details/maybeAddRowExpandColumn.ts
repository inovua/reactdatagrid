/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import DEFAULT_ROW_EXPAND_COLUMN from './defaultRowExpandColumn';

import { IColumn } from '../../types';

import { TypeExpandedRows } from '../../types';
import { isRowExpandEnabled_FromProps } from '@inovua/reactdatagrid-community/utils/isRowExpandEnabled_FromProps';

export default function(
  columns: any[],
  props: {
    enableRowExpand?: boolean;
    expandedRows?: TypeExpandedRows;
    defaultExpandedRows?: TypeExpandedRows;
    renderRowDetails?: (...args: any[]) => any;
    renderDetailsGrid?: (...args: any[]) => any;
    rowExpandColumn: IColumn | boolean;
  }
): any[] {
  if (isRowExpandEnabled_FromProps(props)) {
    const col = {
      ...DEFAULT_ROW_EXPAND_COLUMN,
      ...(props.rowExpandColumn && typeof props.rowExpandColumn === 'object'
        ? props.rowExpandColumn
        : null),
      id: DEFAULT_ROW_EXPAND_COLUMN.id,
    };
    if (props.rowExpandColumn !== false) {
      columns = [col].concat(columns);
    }
  }

  return columns;
}
