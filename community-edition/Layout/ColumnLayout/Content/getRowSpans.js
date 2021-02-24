/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export default (rowProps) => {
    const rowSpans = {};
    const { data, realIndex: rowIndex, remoteRowIndex, columns, empty, dataSourceArray, } = rowProps;
    columns.forEach((column) => {
        const name = column.name;
        const rowspan = column.rowspan;
        const value = data && name ? data[name] : null;
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
