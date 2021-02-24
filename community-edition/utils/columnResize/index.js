/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import clamp from '../clamp';
const normalize = (result) => {
    let { newColumnFlexes, newColumnSizes, maxAvailableWidthForColumns } = result;
    if (newColumnFlexes && !Object.keys(newColumnFlexes).length) {
        newColumnFlexes = undefined;
    }
    if (newColumnSizes && !Object.keys(newColumnSizes).length) {
        newColumnSizes = undefined;
    }
    return {
        ...result,
        newColumnFlexes,
        newColumnSizes,
        maxAvailableWidthForColumns,
    };
};
const assignFlexes = (columns) => {
    return columns.reduce((flexes, col) => {
        if (col.computedFlex) {
            flexes[col.id] = col.computedWidth;
        }
        return flexes;
    }, {});
};
const clampColSize = (size, col) => {
    return clamp(size, col.computedMinWidth, col.computedMaxWidth);
};
const resizeGroupColumns = (arg, config) => {
    let { diff: totalDiff, maxAvailableWidthForColumns, shareSpaceOnResize, index, groupColumns, columns, } = arg;
    columns = columns.map(c => ({ ...c }));
    let newColumnSizes = config.newColumnSizes || {};
    const columnsMap = columns.reduce((map, col) => {
        map[col.id] = col;
        return map;
    }, {});
    let newColumnFlexes = {
        ...assignFlexes(groupColumns.map((colId) => columnsMap[colId])),
        ...config.newColumnFlexes,
    };
    while (Math.abs(totalDiff) > 0) {
        groupColumns.forEach((colId, idx) => {
            const col = columnsMap[colId];
            if (col.computedResizable === false) {
                return;
            }
            const totalGroupResizableWidth = groupColumns
                .slice(idx)
                .reduce((total, colId) => {
                const col = columnsMap[colId];
                if (col.computedResizable === false) {
                    return total;
                }
                if (totalDiff > 0 &&
                    col.computedMaxWidth &&
                    col.computedWidth >= col.computedMaxWidth) {
                    return total;
                }
                if (totalDiff < 0 &&
                    col.computedMinWidth &&
                    col.computedWidth <= col.computedMinWidth) {
                    return total;
                }
                return total + col.computedWidth;
            }, 0);
            const diff = totalGroupResizableWidth
                ? Math.round((col.computedWidth / totalGroupResizableWidth) * totalDiff)
                : 0;
            let adjustment = 0;
            if (!col.computedFlex) {
                newColumnSizes[col.id] = col.computedWidth = col.computedWidth + diff;
            }
            else {
                delete newColumnSizes[col.id];
                newColumnFlexes[col.id] = col.computedWidth = col.computedWidth + diff;
            }
            if (newColumnSizes[col.id] !== undefined) {
                let size = newColumnSizes[col.id];
                let clampedSize = clamp(size, col.computedMinWidth, col.computedMaxWidth);
                if (clampedSize !== size) {
                    adjustment = size - clampedSize;
                    newColumnSizes[col.id] = clampedSize;
                }
            }
            else if (newColumnFlexes[col.id] !== undefined) {
                let size = newColumnFlexes[col.id];
                let clampedSize = clamp(size, col.computedMinWidth, col.computedMaxWidth);
                if (clampedSize !== size) {
                    adjustment = size - clampedSize;
                    newColumnFlexes[col.id] = col.computedWidth = clampedSize;
                }
            }
            if (diff === 0) {
                totalDiff = 0;
            }
            else {
                totalDiff = totalDiff - diff + adjustment;
            }
        });
    }
    return normalize({
        ...config,
        newColumnSizes,
        newColumnFlexes,
    });
};
export default (arg) => {
    const { shareSpaceOnResize, groupColumns } = arg;
    const result = shareSpaceOnResize
        ? resizeShareSpace(arg)
        : resizeNoShareSpace(arg);
    if (groupColumns) {
        return resizeGroupColumns(arg, result);
    }
    return result;
};
const resizeShareSpace = (arg) => {
    const { columns, index, diff } = arg;
    let { maxAvailableWidthForColumns } = arg;
    const colLeft = columns[index];
    const colsToRight = columns.slice(index + 1);
    const colRight = colsToRight[0];
    if (!colRight || colRight.computedResizable === false) {
        // we're resizing the last column or the next column is not resizable
        return resizeNoShareSpace(arg);
    }
    if (!colLeft.computedFlex && !colRight.computedFlex) {
        let newColLeftSize = colLeft.computedWidth + diff;
        let newColRightSize = clampColSize(colRight.computedWidth - diff, colRight);
        let remainingDiff = newColRightSize - (colRight.computedWidth - diff);
        const newColumnSizes = {
            [colLeft.id]: newColLeftSize + remainingDiff,
            [colRight.id]: newColRightSize,
        };
        return normalize({
            newColumnSizes,
            maxAvailableWidthForColumns,
        });
    }
    if (colLeft.computedFlex && colRight.computedFlex) {
        let newColumnFlexes = assignFlexes(columns);
        newColumnFlexes[colLeft.id] = colLeft.computedWidth + diff;
        newColumnFlexes[colRight.id] = colRight.computedWidth - diff;
        return normalize({
            newColumnFlexes,
            maxAvailableWidthForColumns,
        });
    }
    if (!colLeft.computedFlex) {
        let newColumnFlexes = assignFlexes(columns);
        let newColumnSizes = {
            [colLeft.id]: colLeft.computedWidth + diff,
        };
        newColumnFlexes[colRight.id] = colRight.computedWidth - diff;
        return normalize({
            newColumnFlexes,
            newColumnSizes,
            maxAvailableWidthForColumns,
        });
    }
    if (!colRight.computedFlex) {
        const flexCount = columns.reduce((count, col) => {
            return count + (col.computedFlex ? 1 : 0);
        }, 0);
        let newColumnFlexes = assignFlexes(columns);
        let newColumnSizes = {
            [colRight.id]: colRight.computedWidth - diff,
        };
        newColumnFlexes[colLeft.id] = colLeft.computedWidth + diff;
        if (flexCount === 1 && colLeft.computedFlex) {
            newColumnFlexes = {};
        }
        return normalize({
            newColumnFlexes,
            newColumnSizes,
            maxAvailableWidthForColumns,
        });
    }
};
const resizeNoShareSpace = (arg) => {
    const { columns, index, diff, totalComputedWidth } = arg;
    let { maxAvailableWidthForColumns } = arg;
    const colLeft = columns[index];
    const colsToRight = columns.slice(index + 1);
    const colRight = colsToRight[0];
    let newColumnSizes;
    let newColumnFlexes;
    const flexCount = columns.reduce((count, col) => {
        return count + (col.computedFlex ? 1 : 0);
    }, 0);
    if (!colLeft.computedFlex) {
        if (!flexCount) {
            // the current column is not a flex column
            newColumnSizes = {};
            if (colLeft.computedResizable !== false) {
                newColumnSizes[colLeft.id] = clampColSize(colLeft.computedWidth + diff, colLeft);
            }
            return normalize({
                newColumnSizes,
                newColumnFlexes: undefined,
                maxAvailableWidthForColumns,
            });
        }
        // there are other flexible columns
        newColumnSizes = {};
        newColumnSizes[colLeft.id] = clampColSize(colLeft.computedWidth + diff, colLeft);
        return normalize({
            newColumnSizes,
            newColumnFlexes: assignFlexes(columns),
            maxAvailableWidthForColumns: totalComputedWidth + diff,
        });
    }
    // this column is flexible
    newColumnFlexes = assignFlexes(columns);
    newColumnFlexes[colLeft.id] = colLeft.computedWidth + diff;
    if (flexCount === 1) {
        // this is the only flex column, so we have to make it sized
        // OR reduce the maxAvailableWidthForColumns
        if (!colLeft.keepFlex) {
            delete newColumnFlexes[colLeft.id];
            newColumnSizes = {};
            newColumnSizes[colLeft.id] = clampColSize(colLeft.computedWidth + diff, colLeft);
        }
        else {
            // keep the same flex
            newColumnFlexes = {};
            // but adjust the maxAvailableWidthForColumns
            maxAvailableWidthForColumns = totalComputedWidth + diff;
        }
    }
    else {
        // there are other flexible columns as well
        // so we can make the current column fixed or
        //if it has keepFlex, we'll keep it flexible
        if (!colLeft.keepFlex) {
            delete newColumnFlexes[colLeft.id];
            newColumnSizes = {};
            newColumnSizes[colLeft.id] = clampColSize(colLeft.computedWidth + diff, colLeft);
            maxAvailableWidthForColumns = totalComputedWidth + diff;
        }
        else {
            // keep the same flex
            newColumnFlexes[colLeft.id] = colLeft.computedWidth + diff;
            // but adjust the maxAvailableWidthForColumns
            maxAvailableWidthForColumns = totalComputedWidth + diff;
        }
    }
    return normalize({
        newColumnFlexes,
        newColumnSizes,
        maxAvailableWidthForColumns,
    });
};
