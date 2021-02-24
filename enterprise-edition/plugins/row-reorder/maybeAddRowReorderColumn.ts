/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import DEFAULT_REORDER_COLUMN from './defaultRowReorderColumn';
import { TypeRowReorder } from '@inovua/reactdatagrid-community/types/TypeDataGridProps';
import { IColumn } from '@inovua/reactdatagrid-community/types/TypeColumn';

export default (
  columns: any[],
  props: {
    onRowReorder?: TypeRowReorder;
    rowReorderColumn?: IColumn;
  }
) => {
  const onRowReorder = props.onRowReorder;
  const rowReorderColumn = props.rowReorderColumn;

  if (onRowReorder || !!rowReorderColumn) {
    const reorderColumn = {
      ...DEFAULT_REORDER_COLUMN,
      ...(props.rowReorderColumn ? props.rowReorderColumn : null),
      id: DEFAULT_REORDER_COLUMN.id,
    };

    columns = [reorderColumn].concat(columns);
  }

  return columns;
};
