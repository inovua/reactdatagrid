/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// import { useMemo, useState } from "react";
import columnResize from '../utils/columnResize';
import useColumnInfo from '../normalizeColumns/useColumnInfo';
import getColumnRenderCount from '../getColumnRenderCount';
import batchUpdate from '../utils/batchUpdate';
import useProperty from './useProperty';
import useNamedState from './useNamedState';
const setColumnSizes = (newColumnSizes, columnFlexes, reservedViewportWidth, { columnSizes, getColumnBy, setColumnFlexes, setColumnSizes, onBatchColumnResize, onColumnResize, }) => {
    const reservedViewportWidthWrapper = { reservedViewportWidth };
    const batchColumns = onBatchColumnResize ? [] : null;
    Object.keys(newColumnSizes).forEach(colId => {
        const size = newColumnSizes[colId];
        const column = getColumnBy(colId, { initial: true });
        if (column != null) {
            if (batchColumns) {
                batchColumns.push({ column, width: size, flex: undefined });
            }
            if (onColumnResize) {
                onColumnResize({ column, width: size, flex: undefined }, reservedViewportWidthWrapper);
            }
        }
    });
    // also fire onColumnResize for flex columns
    Object.keys(columnFlexes || {}).forEach(colId => {
        const size = columnFlexes[colId];
        const column = getColumnBy(colId, { initial: true });
        if (column) {
            if (batchColumns) {
                batchColumns.push({ column, size, width: undefined, flex: size });
            }
            if (onColumnResize) {
                onColumnResize({ column, size, width: undefined, flex: size }, reservedViewportWidthWrapper);
            }
        }
    });
    if (onBatchColumnResize) {
        onBatchColumnResize(batchColumns, reservedViewportWidthWrapper);
    }
    setColumnSizes(Object.assign({}, columnSizes, newColumnSizes));
    setColumnFlexes(columnFlexes);
};
const getColumnBy = (propColumns, visibleColumns, columnsMap) => (idNameOrIndex, config) => {
    let column;
    if (typeof idNameOrIndex === 'object') {
        idNameOrIndex =
            idNameOrIndex.id == null ? idNameOrIndex.name : idNameOrIndex.id;
    }
    if (typeof idNameOrIndex === 'number') {
        column = visibleColumns[idNameOrIndex];
    }
    else {
        column = columnsMap[idNameOrIndex];
    }
    if (!config ||
        !config.initial ||
        (column && column.pivotColumn)) {
        return column;
    }
    return propColumns.filter(c => c.id === column.id || c.name === column.id)[0];
};
export default (props, { maxAvailableWidthForColumns, lockedColumnsState, computedPivotUniqueValuesPerColumn, computedGroups, computedSortInfo, computedFilterValueMap, computedGroupBy, computedFilterable, columnFlexes, columnSizes, maybeAddColumns, }, computedPropsRef) => {
    const [columnOrder, setColumnOrder] = useProperty(props, 'columnOrder');
    const [stateColumnVisibilityMap, setStateColumnVisibilityMap,] = useNamedState(props.columns.reduce((acc, col) => {
        if (col.defaultVisible === false || col.visible === false) {
            acc[(col.id || col.name)] = false;
        }
        return acc;
    }, {}), props.context, 'stateColumnVisibilityMap');
    const { groupColumnSummaryReducers, pivotColumnSummaryReducers, visibleColumns, lockedStartColumns, lockedEndColumns, unlockedColumns, columnWidthPrefixSums, columnsMap, columnVisibilityMap, allColumns, computedEnableRowspan, totalComputedWidth, totalLockedStartWidth, totalLockedEndWidth, totalUnlockedWidth, minColumnsSize, computedHasColSpan, } = useColumnInfo({
        showPivotSummaryColumns: props.showPivotSummaryColumns,
        lockedColumnsState,
        columnOrder,
        columnFlexes,
        columnSizes,
        pivotGrandSummaryColumn: props.pivotGrandSummaryColumn,
        columnVisibilityMap: stateColumnVisibilityMap,
        columnMinWidth: props.columnMinWidth,
        columnMaxWidth: props.columnMaxWidth,
        resizable: props.resizable,
        pivot: props.pivot,
        computedGroups,
        filterable: computedFilterable,
        filterValueMap: computedFilterValueMap,
        groupBy: computedGroupBy,
        groupColumn: props.groupColumn,
        rowIndexColumn: props.rowIndexColumn,
        checkboxColumn: props.checkboxColumn,
        computedPivotUniqueValuesPerColumn,
        editable: props.editable,
        sortable: props.sortable,
        columns: props.columns,
        rtl: props.rtl,
        sortInfo: computedSortInfo,
        availableWidth: maxAvailableWidthForColumns,
        columnDefaultWidth: props.columnDefaultWidth,
        inTransition: false,
        hideGroupByColumns: props.hideGroupByColumns,
        groupNestingSize: props.groupNestingSize,
        groupForGroupColumns: props.groupForGroupColumns || '__',
        enableRowExpand: props.enableRowExpand,
        expandedRows: props.expandedRows,
        defaultExpandedRows: props.defaultExpandedRows,
        renderRowDetails: props.renderRowDetails,
        renderDetailsGrid: props.renderDetailsGrid,
        maybeAddColumns,
        rowExpandColumn: props.rowExpandColumn,
        onRowReorder: props.onRowReorder,
        rowReorderColumn: props.rowReorderColumn,
    });
    const virtualizeColumns = props.virtualizeColumns !== undefined
        ? props.virtualizeColumns
        : visibleColumns.length >= props.virtualizeColumnsThreshold;
    const columnRenderCount = getColumnRenderCount({
        availableWidth: maxAvailableWidthForColumns,
        visibleColumns,
        lockedStartColumns,
        lockedEndColumns,
        virtualizeColumns,
    });
    const hasLockedStart = !!lockedStartColumns.length;
    const hasLockedEnd = !!lockedEndColumns.length;
    const hasUnlocked = !!unlockedColumns.length;
    const firstUnlockedIndex = hasUnlocked
        ? unlockedColumns[0].computedVisibleIndex
        : -1;
    const firstLockedStartIndex = hasLockedStart
        ? lockedStartColumns[0].computedVisibleIndex
        : -1;
    const firstLockedEndIndex = hasLockedEnd
        ? lockedEndColumns[0].computedVisibleIndex
        : -1;
    const lastLockedEndIndex = hasLockedEnd
        ? lockedEndColumns[lockedEndColumns.length - 1].computedVisibleIndex
        : -1;
    const lastLockedStartIndex = hasLockedStart
        ? lockedStartColumns[lockedStartColumns.length - 1].computedVisibleIndex
        : -1;
    const lastUnlockedIndex = hasUnlocked
        ? unlockedColumns[unlockedColumns.length - 1].computedVisibleIndex
        : -1;
    const computedOnColumnResize = ({ index, groupColumns, diff, }) => {
        const computedProps = computedPropsRef.current;
        if (computedProps == null) {
            return;
        }
        const { maxAvailableWidthForColumns, shareSpaceOnResize, totalComputedWidth, } = computedProps;
        const result = columnResize({
            columns: computedProps.visibleColumns,
            groupColumns,
            maxAvailableWidthForColumns,
            shareSpaceOnResize,
            totalComputedWidth,
            index,
            diff,
        });
        if (computedProps.rtl && diff) {
            const totalComputedWidth = computedProps.totalComputedWidth;
            const oldScrollLeft = computedProps.getScrollLeft();
            // on next render, we need to scroll the grid, so we avoid flickering
            computedProps.onNextRender(() => {
                const computedProps = computedPropsRef.current;
                if (computedProps == null) {
                    return;
                }
                if (computedProps.totalComputedWidth === totalComputedWidth + diff) {
                    const newScrollLeft = oldScrollLeft + diff;
                    // todo improve this, as we still have a bit of a flicker when diff > 0
                    computedProps.setScrollLeft(newScrollLeft);
                }
            });
        }
        batchUpdate().commit(() => {
            let newReservedViewportWidth = computedProps.reservedViewportWidth;
            if (typeof result.maxAvailableWidthForColumns == 'number' &&
                result.maxAvailableWidthForColumns !== maxAvailableWidthForColumns) {
                const widthDiff = result.maxAvailableWidthForColumns - maxAvailableWidthForColumns;
                newReservedViewportWidth =
                    computedProps.reservedViewportWidth - widthDiff;
                computedProps.setReservedViewportWidth(newReservedViewportWidth);
            }
            setColumnSizes(result.newColumnSizes || {}, result.newColumnFlexes, newReservedViewportWidth, {
                getColumnBy: computedProps.getColumnBy,
                onColumnResize: computedProps.initialProps.onColumnResize,
                onBatchColumnResize: computedProps.initialProps.onBatchColumnResize,
                columnSizes: computedProps.columnSizes,
                setColumnSizes: computedProps.setColumnSizes,
                setColumnFlexes: computedProps.setColumnFlexes,
            });
        });
    };
    const getColumn = getColumnBy(props.columns, visibleColumns, columnsMap);
    const setColumnVisible = (indexOrColumn, visible) => {
        const column = getColumn(indexOrColumn);
        if (!column) {
            return;
        }
        if (isColumnVisible(column) === visible) {
            return;
        }
        const col = getColumn(column, { initial: true });
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        if (typeof computedProps.initialProps.onColumnVisibleChange === 'function') {
            computedProps.initialProps.onColumnVisibleChange({
                column: col,
                visible,
            });
        }
        if (col.visible === undefined) {
            setStateColumnVisibilityMap({
                ...stateColumnVisibilityMap,
                [column.id]: !!visible,
            });
        }
        else if (computedProps.showWarnings &&
            !computedProps.initialProps.onColumnVisibleChange) {
            console.warn(`Column "${column.id}" has controlled visible prop set to "${column.visible}" but you have no "onColumnVisibleChange" callback prop to update column.visible prop. Use uncontrolled "defaultVisible" instead.`);
        }
    };
    const isColumnVisible = (nameOrId) => {
        const column = getColumn(nameOrId);
        if (!column) {
            return false;
        }
        return column.computedVisible === true;
    };
    const setColumnLocked = (indexOrColumn, locked) => {
        const column = getColumn(indexOrColumn);
        if (locked === null) {
            locked = false;
        }
        locked = locked === true ? 'start' : locked;
        if (column.lockable === false) {
            if (props.showWarnings) {
                console.error(`You are trying to lock the "${column.id}" column, but it is lockable===false, so it cannot be locked.`);
            }
            return;
        }
        const initialColumn = getColumn(column, {
            initial: true,
        });
        if (props.onColumnLockedChange) {
            props.onColumnLockedChange({
                column: initialColumn,
                locked,
            });
        }
        if (initialColumn.locked !== undefined) {
            // it's controlled locked, so no point in updating the state anymore
            return;
        }
        const computedProps = computedPropsRef.current;
        if (computedProps == null) {
            return;
        }
        const { setLockedColumnsState, lockedColumnsState } = computedProps;
        setLockedColumnsState({ ...lockedColumnsState, [column.id]: locked });
    };
    const getColumnsInOrder = () => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return [];
        }
        const { computedColumnOrder } = computedProps;
        if (!computedColumnOrder || !computedColumnOrder.length) {
            return computedProps.initialProps.columns.map(cId => computedProps.getColumnBy(cId));
        }
        return computedColumnOrder.map(cId => computedProps.getColumnBy(cId));
    };
    return {
        getColumnsInOrder,
        groupColumnSummaryReducers,
        pivotColumnSummaryReducers,
        groupColumn: props.pivot ? props.groupColumn || true : props.groupColumn,
        firstLockedStartIndex,
        firstLockedEndIndex,
        firstUnlockedIndex,
        lastLockedStartIndex,
        lastUnlockedIndex,
        lastLockedEndIndex,
        visibleColumns,
        columnWidthPrefixSums,
        lockedStartColumns,
        lockedEndColumns,
        unlockedColumns,
        columnVisibilityMap,
        computedHasColSpan,
        setColumnLocked,
        computedColumnOrder: columnOrder,
        setColumnOrder,
        setColumnVisible,
        computedPivot: props.pivot,
        showColumnMenuTool: props.pivot ? false : props.showColumnMenuTool,
        columnsMap,
        allColumns,
        totalComputedWidth,
        totalLockedStartWidth,
        totalLockedEndWidth,
        totalUnlockedWidth,
        minColumnsSize,
        hasLockedStart,
        hasLockedEnd,
        hasUnlocked,
        computedEnableRowspan,
        columnRenderCount,
        virtualizeColumns,
        computedOnColumnResize,
        getColumnBy: getColumn,
        isColumnVisible,
    };
};
