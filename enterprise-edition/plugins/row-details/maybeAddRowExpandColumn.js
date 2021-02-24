/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import DEFAULT_ROW_EXPAND_COLUMN from './defaultRowExpandColumn';
import { isRowExpandEnabled_FromProps } from '@inovua/reactdatagrid-community/utils/isRowExpandEnabled_FromProps';
export default function (columns, props) {
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
