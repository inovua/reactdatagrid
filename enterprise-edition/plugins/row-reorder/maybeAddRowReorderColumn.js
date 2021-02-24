/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import DEFAULT_REORDER_COLUMN from './defaultRowReorderColumn';
export default (columns, props) => {
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
