/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// import { useMemo, useState } from "react";

import columnResize from '../utils/columnResize';
import useColumnInfo from '../normalizeColumns/useColumnInfo';
import getColumnRenderCount from '../getColumnRenderCount';

import {
  TypeDataGridProps,
  TypeSortInfo,
  TypeColumn,
  TypeComputedColumn,
  TypeComputedColumnsMap,
  TypeComputedProps,
  TypeGroupBy,
  TypeGetColumnByParam,
  TypeFilterValue,
  TypeSingleFilterValue,
} from '../types';
import { useState, MutableRefObject, Dispatch, SetStateAction } from 'react';

import batchUpdate from '../utils/batchUpdate';
import useProperty from './useProperty';
import { TypeColumnGroup } from '../types/TypeColumn';
import { TypePivotUniqueValuesDescriptor } from '../types/TypeDataGridProps';
import useNamedState from './useNamedState';

type TypeNumberMap = { [key: string]: number };
const setColumnSizes = (
  newColumnSizes: TypeNumberMap,
  columnFlexes: TypeNumberMap,
  reservedViewportWidth: number,
  {
    columnSizes,
    getColumnBy,
    setColumnFlexes,
    setColumnSizes,
    onBatchColumnResize,
    onColumnResize,
  }: {
    columnSizes: TypeNumberMap;
    getColumnBy: (
      idOrName: TypeGetColumnByParam,
      { initial }: { initial: boolean }
    ) => TypeColumn;
    setColumnFlexes: Dispatch<SetStateAction<any>>;
    setColumnSizes: Dispatch<SetStateAction<any>>;
    onBatchColumnResize?: (...args: any[]) => void;
    onColumnResize?: (...args: any[]) => void;
  }
) => {
  const reservedViewportWidthWrapper = { reservedViewportWidth };

  const batchColumns:
    | { column: TypeColumn; width?: number; flex?: number; size?: number }[]
    | null = onBatchColumnResize ? [] : null;

  Object.keys(newColumnSizes).forEach(colId => {
    const size = newColumnSizes[colId];
    const column = getColumnBy(colId, { initial: true }) as TypeColumn;

    if (column != null) {
      if (batchColumns) {
        batchColumns.push({ column, width: size, flex: undefined });
      }
      if (onColumnResize) {
        onColumnResize(
          { column, width: size, flex: undefined },
          reservedViewportWidthWrapper
        );
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
        onColumnResize(
          { column, size, width: undefined, flex: size },
          reservedViewportWidthWrapper
        );
      }
    }
  });

  if (onBatchColumnResize) {
    onBatchColumnResize(batchColumns, reservedViewportWidthWrapper);
  }

  setColumnSizes(Object.assign({}, columnSizes, newColumnSizes));
  setColumnFlexes(columnFlexes);
};

const getColumnBy = (
  propColumns: TypeColumn[],
  visibleColumns: TypeComputedColumn[],
  columnsMap: TypeComputedColumnsMap
) => (
  idNameOrIndex: TypeGetColumnByParam,
  config?: { initial: boolean } | undefined
) => {
  let column: TypeColumn | TypeComputedColumn;
  if (typeof idNameOrIndex === 'object') {
    idNameOrIndex =
      idNameOrIndex.id == null ? idNameOrIndex.name : idNameOrIndex.id;
  }
  if (typeof idNameOrIndex === 'number') {
    column = visibleColumns[idNameOrIndex];
  } else {
    column = columnsMap[idNameOrIndex];
  }

  if (
    !config ||
    !config.initial ||
    (column && (column as TypeComputedColumn).pivotColumn)
  ) {
    return column;
  }

  return propColumns.filter(c => c.id === column.id || c.name === column.id)[0];
};

export default (
  props: TypeDataGridProps,
  {
    maxAvailableWidthForColumns,
    lockedColumnsState,
    computedPivotUniqueValuesPerColumn,
    computedGroups,
    computedSortInfo,
    computedFilterValueMap,
    computedGroupBy,
    computedFilterable,
    columnFlexes,
    columnSizes,
    maybeAddColumns,
  }: {
    maxAvailableWidthForColumns: number;
    computedPivotUniqueValuesPerColumn: TypePivotUniqueValuesDescriptor;
    computedGroups?: TypeColumnGroup[];
    computedSortInfo: TypeSortInfo;
    computedGroupBy: TypeGroupBy;
    columnFlexes: TypeNumberMap;
    computedFilterable: boolean;
    computedFilterValueMap: null | { [key: string]: TypeSingleFilterValue };
    lockedColumnsState: { [key: string]: 'start' | 'end' | false };
    maybeAddColumns: any;
    columnSizes: TypeNumberMap;
  },
  computedPropsRef: MutableRefObject<TypeComputedProps>
) => {
  const [columnOrder, setColumnOrder] = useProperty<string[] | undefined>(
    props,
    'columnOrder'
  );

  const [
    stateColumnVisibilityMap,
    setStateColumnVisibilityMap,
  ] = useNamedState<{
    [key: string]: boolean;
  }>(
    props.columns.reduce(
      (acc, col) => {
        if (col.defaultVisible === false || col.visible === false) {
          acc[(col.id || col.name)!] = false;
        }
        return acc;
      },
      {} as {
        [key: string]: boolean;
      }
    ),
    props.context!,
    'stateColumnVisibilityMap'
  );

  const {
    groupColumnSummaryReducers,
    pivotColumnSummaryReducers,
    visibleColumns,
    lockedStartColumns,
    lockedEndColumns,
    unlockedColumns,
    columnWidthPrefixSums,
    columnsMap,
    columnVisibilityMap,
    allColumns,
    computedEnableRowspan,
    totalComputedWidth,
    totalLockedStartWidth,
    totalFlexColumnCount,
    totalLockedEndWidth,
    totalUnlockedWidth,
    minColumnsSize,
    computedHasColSpan,
  } = useColumnInfo({
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

  let virtualizeColumns =
    props.virtualizeColumns !== undefined
      ? props.virtualizeColumns
      : visibleColumns.length >= props.virtualizeColumnsThreshold;

  if (typeof props.rowHeight !== 'number') {
    virtualizeColumns = false;
  }

  const columnRenderCount = getColumnRenderCount({
    availableWidth: maxAvailableWidthForColumns,
    visibleColumns,
    lockedStartColumns,
    lockedEndColumns,
    virtualizeColumns,
  });

  const hasLockedStart: boolean = !!lockedStartColumns.length;
  const hasLockedEnd: boolean = !!lockedEndColumns.length;
  const hasUnlocked: boolean = !!unlockedColumns.length;

  const firstUnlockedIndex: number = hasUnlocked
    ? unlockedColumns[0].computedVisibleIndex
    : -1;
  const firstLockedStartIndex: number = hasLockedStart
    ? lockedStartColumns[0].computedVisibleIndex
    : -1;
  const firstLockedEndIndex: number = hasLockedEnd
    ? lockedEndColumns[0].computedVisibleIndex
    : -1;

  const lastLockedEndIndex: number = hasLockedEnd
    ? lockedEndColumns[lockedEndColumns.length - 1].computedVisibleIndex
    : -1;
  const lastLockedStartIndex: number = hasLockedStart
    ? lockedStartColumns[lockedStartColumns.length - 1].computedVisibleIndex
    : -1;

  const lastUnlockedIndex: number = hasUnlocked
    ? unlockedColumns[unlockedColumns.length - 1].computedVisibleIndex
    : -1;

  const computedOnColumnResize = ({
    index,
    groupColumns,
    diff,
  }: {
    index: number;
    diff: number;
    groupColumns: TypeComputedColumn[];
  }) => {
    const computedProps: TypeComputedProps | null = computedPropsRef.current;
    if (computedProps == null) {
      return;
    }

    const {
      maxAvailableWidthForColumns,
      shareSpaceOnResize,
      totalComputedWidth,
    } = computedProps;

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
        const computedProps: TypeComputedProps | null =
          computedPropsRef.current;
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
      let newReservedViewportWidth: number =
        computedProps.reservedViewportWidth;
      if (
        typeof result.maxAvailableWidthForColumns == 'number' &&
        result.maxAvailableWidthForColumns !== maxAvailableWidthForColumns
      ) {
        const widthDiff =
          result.maxAvailableWidthForColumns - maxAvailableWidthForColumns;

        newReservedViewportWidth =
          computedProps.reservedViewportWidth - widthDiff;

        computedProps.setReservedViewportWidth(newReservedViewportWidth);
      }

      setColumnSizes(
        result.newColumnSizes || {},
        result.newColumnFlexes,
        newReservedViewportWidth,
        {
          getColumnBy: computedProps.getColumnBy,
          onColumnResize: computedProps.initialProps.onColumnResize,
          onBatchColumnResize: computedProps.initialProps.onBatchColumnResize,
          columnSizes: computedProps.columnSizes,
          setColumnSizes: computedProps.setColumnSizes,
          setColumnFlexes: computedProps.setColumnFlexes,
        }
      );
    });
  };

  const getColumn = getColumnBy(props.columns, visibleColumns, columnsMap);

  const setColumnVisible = (
    indexOrColumn: TypeGetColumnByParam,
    visible: boolean
  ) => {
    const column: TypeComputedColumn = getColumn(
      indexOrColumn
    ) as TypeComputedColumn;

    if (!column) {
      return;
    }

    if (isColumnVisible(column) === visible) {
      return;
    }

    const col = getColumn(column, { initial: true }) as TypeColumn;

    const { current: computedProps } = computedPropsRef;

    if (!computedProps) {
      return;
    }

    if (
      typeof computedProps.initialProps.onColumnVisibleChange === 'function'
    ) {
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
    } else if (
      computedProps.showWarnings &&
      !computedProps.initialProps.onColumnVisibleChange
    ) {
      console.warn(
        `Column "${column.id}" has controlled visible prop set to "${column.visible}" but you have no "onColumnVisibleChange" callback prop to update column.visible prop. Use uncontrolled "defaultVisible" instead.`
      );
    }
  };

  const isColumnVisible = (nameOrId: TypeGetColumnByParam): boolean => {
    const column = getColumn(nameOrId) as TypeComputedColumn;

    if (!column) {
      return false;
    }

    return column.computedVisible === true;
  };

  const setColumnLocked = (
    indexOrColumn: TypeGetColumnByParam,
    locked: 'start' | 'end' | true | false | null
  ) => {
    const column: TypeComputedColumn = getColumn(
      indexOrColumn
    ) as TypeComputedColumn;
    if (locked === null) {
      locked = false;
    }

    locked = locked === true ? 'start' : locked;

    if (column.lockable === false) {
      if (props.showWarnings) {
        console.error(
          `You are trying to lock the "${column.id}" column, but it is lockable===false, so it cannot be locked.`
        );
      }
      return;
    }

    const initialColumn: TypeColumn = getColumn(column, {
      initial: true,
    }) as TypeColumn;

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

    const computedProps: TypeComputedProps | null = computedPropsRef.current;
    if (computedProps == null) {
      return;
    }

    const { setLockedColumnsState, lockedColumnsState } = computedProps;

    setLockedColumnsState({ ...lockedColumnsState, [column.id]: locked });
  };

  const getColumnsInOrder = (): TypeComputedColumn[] => {
    const { current: computedProps } = computedPropsRef;

    if (!computedProps) {
      return [];
    }

    const { computedColumnOrder } = computedProps;

    if (!computedColumnOrder || !computedColumnOrder.length) {
      return computedProps.initialProps.columns.map(
        cId => computedProps.getColumnBy(cId) as TypeComputedColumn
      );
    }
    return computedColumnOrder.map(
      cId => computedProps.getColumnBy(cId) as TypeComputedColumn
    );
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
    totalFlexColumnCount,

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
