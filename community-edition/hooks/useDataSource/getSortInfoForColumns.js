/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const getCol = (name, columnsMap) => {
    let col = columnsMap[name];
    if (!col) {
        Object.keys(columnsMap).forEach(colId => {
            if (col) {
                return;
            }
            const theCol = columnsMap[colId];
            if (theCol.sortName === name) {
                col = theCol;
            }
        });
    }
    return col;
};
const getSortInfoForColumns = (sortInfo, columnsMap) => {
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
                    sortInfo.fn = (one, two, data1, data2, sortInfo) => (col.sort ? col.sort(one, two, col, data1, data2, sortInfo) : 0);
                }
            }
        }
        return sortInfo;
    }
    else {
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
                sortInfo.fn = (one, two, data1, data2, sortInfo) => (col.sort ? col.sort(one, two, col, data1, data2, sortInfo) : 0);
            }
            return sortInfo;
        });
    }
};
export default getSortInfoForColumns;
