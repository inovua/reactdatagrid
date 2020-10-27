/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import setColumnId from '../setColumnId';

import computeFlexWidths from '../utils/flex/computeFlexWidths';
import mapColumns from '../mapColumns';

import { id as checkboxColumnId } from './defaultCheckColumnId';
import { id as rowExpandColumnId } from './defaultRowExpandColumnId';
import { id as rowIndexColumnId } from './defaultRowIndexColumnId';
import { id as groupColumnId } from './defaultGroupColumnId';
import { id as reorderColumnId } from './defaultRowReorderColumnId';

import {
  TypeSortInfo,
  TypeComputedColumnsMap,
  TypeSingleFilterValue,
  TypePivotColumnSummaryReducer,
  TypePivotItem,
  TypeRowReorderFn,
} from '../types';
import { TypeColumn, TypeComputedColumn, TypeColumnWithId } from './types';
import setComputedColumnWidths from './setComputedColumnWidths';
import {
  TypeSummaryReducer,
  IColumn,
  TypeColumnGroup,
} from '../types/TypeColumn';
import { TypePivotUniqueValuesDescriptor } from '../types/TypeDataGridProps';

const DEFAULT_COLUMN_PROPS = {
  isColumn: true,
  keepFlex: true,
};

const defaultPivotGrandSummaryColumn: Partial<IColumn> = {
  sortable: false,
  draggable: false,
  filterable: false,
};

const defaultPivotSummaryColumn: Partial<IColumn> = defaultPivotGrandSummaryColumn;

export type TypeParam = {
  sortInfo?: TypeSortInfo;
  rtl: boolean;
  computedPivotUniqueValuesPerColumn?: TypePivotUniqueValuesDescriptor;
  computedGroups?: TypeColumnGroup[];
  editable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  lockable?: boolean;
  availableWidth?: number;
  generatedColumnsLength?: number;
  filterValueMap: null | { [key: string]: TypeSingleFilterValue };
  pivot?: TypePivotItem[];
  columns: TypeColumn[];
  groups?: TypeColumnGroup[];
  columnMinWidth?: number;
  columnMaxWidth?: number;
  columnDefaultWidth?: number;
  columnWidth?: number;
  columnOrder?: string[];
  columnSizes?: { [key: string]: number };
  columnVisibilityMap?: { [key: string]: boolean };
  columnFlexes?: { [key: string]: number };
  lockedColumnsState?: { [key: string]: any };
  checkboxColumn?: boolean | IColumn;
  rowIndexColumn?: boolean | IColumn;
  pivotGrandSummaryColumn?: boolean | IColumn;
  groupColumn?: boolean | IColumn;
  filter?: ((c: TypeColumn) => boolean) | null;
  filterValue?: TypeFilterValue;
  showPivotSummaryColumns?: boolean;
  onRowReorder?: TypeRowReorderFn | boolean;
};

type TypeFilterValue = {
  name: string;
}[];

const emptyArray: TypeColumnWithId[] = [];
const emptyObject = Object.freeze ? Object.freeze({}) : {};

export default ({
  generatedColumnsLength = 0,
  columns,
  columnMinWidth,
  columnMaxWidth,
  columnDefaultWidth,
  columnWidth,
  columnSizes = emptyObject,
  columnVisibilityMap = emptyObject,
  columnFlexes = emptyObject,
  lockedColumnsState = emptyObject,
  columnOrder,
  computedPivotUniqueValuesPerColumn,
  editable,
  pivot,
  sortable,
  filterable,
  resizable,
  pivotGrandSummaryColumn,
  lockable,
  checkboxColumn,
  rowIndexColumn,
  filter,
  rtl,
  filterValueMap,
  sortInfo,
  showPivotSummaryColumns,
  availableWidth = 0,
  onRowReorder,
}: TypeParam) => {
  if (columnVisibilityMap) {
    columnVisibilityMap = { ...columnVisibilityMap };
  }
  const groupColumnSummaryReducers: {
    [key: string]: TypeSummaryReducer;
  } = {};
  const pivotColumnSummaryReducers: {
    [key: string]: TypePivotColumnSummaryReducer;
  } = {};

  const addSortInfo = (col: TypeComputedColumn) => {
    col.computedSortable =
      (typeof col.sortable === 'boolean' ? col.sortable : sortable) || false;

    col.computedSortInfo = null;

    if (col.computedSortable && sortInfo) {
      col.computedSortInfo = Array.isArray(sortInfo)
        ? sortInfo.filter(
            info =>
              info.name === col.id ||
              info.id === col.id ||
              info.name === col.sortName
          )[0]
        : sortInfo.name === col.id ||
          sortInfo.id === col.id ||
          sortInfo.name === col.sortName
        ? sortInfo
        : null;
    }
  };

  const addFilterValue = (col: TypeComputedColumn) => {
    col.computedFilterable =
      (typeof col.filterable === 'boolean' ? col.filterable : filterable) ||
      undefined;

    col.computedFilterValue = null;

    if (col.computedFilterable && filterValueMap) {
      col.computedFilterValue = filterValueMap[col.id];
    }

    if (col.computedFilterable === undefined && col.computedFilterValue) {
      col.computedFilterable = true;
    }

    col.computedFilterable = !!col.computedFilterable;
  };

  let hasLockedStart = false;
  let hasLockedEnd = false;

  let rowExpandColumn: TypeComputedColumn | undefined;

  const setComputedColumnWidthsParam = {
    columnFlexes,
    columnSizes,
    columnDefaultWidth,
    columnWidth,
    columnMinWidth,
    columnMaxWidth,
  };
  let normalizedColumns: TypeComputedColumn[] = columns
    .map(column => {
      return { ...DEFAULT_COLUMN_PROPS, ...column };
    })
    .map(setColumnId)
    .map((col: TypeComputedColumn, i) => {
      col.computedInitialIndex = i - generatedColumnsLength;
      setComputedColumnWidths(col, setComputedColumnWidthsParam);

      col.computedVisible =
        col.visible !== undefined
          ? !!col.visible
          : columnVisibilityMap[col.id] === false
          ? false
          : true;

      if (
        col.computedVisible &&
        pivot &&
        !col.groupSummaryReducer &&
        col.id !== groupColumnId
      ) {
        col.computedVisible = false;
      }

      if (col.computedVisible === false) {
        columnVisibilityMap[col.id] = false;
      } else {
        delete columnVisibilityMap[col.id];
      }

      col.computedHeader =
        col.header === undefined ? col.name || '' : col.header;
      col.computedLocked = col.locked;

      if (
        col.computedLocked === undefined &&
        lockedColumnsState[col.id] !== undefined
      ) {
        col.computedLocked = lockedColumnsState[col.id];
      }
      if (col.computedLocked === undefined && col.defaultLocked !== undefined) {
        col.computedLocked = col.defaultLocked;
      }

      if (!filter || filter(col)) {
        if (col.computedLocked === true || col.computedLocked === 'start') {
          col.computedLocked = 'start';
          hasLockedStart = true;
        }
        if (col.computedLocked === 'end') {
          hasLockedEnd = true;
        }
      }
      col.computedLocked = col.computedLocked || false;

      if (col.id === rowExpandColumnId) {
        rowExpandColumn = col;
      }

      return col;
    });

  if (hasLockedStart) {
    // if there are locked start columns
    // make sure to set the row expand column and the checkbox column and the row index column as locked start as well
    if (rowExpandColumn != null) {
      rowExpandColumn.computedLocked = 'start';
    }
    if (checkboxColumn) {
      const normalizedCheckboxColumn = normalizedColumns.filter(
        c => c.checkboxColumn && c.id == checkboxColumnId
      )[0];

      if (normalizedCheckboxColumn) {
        // make the checkbox column locked start if there are some
        // locked start columns already
        normalizedCheckboxColumn.computedLocked = 'start';
      }
    }

    const autoLockColumns = normalizedColumns.filter(c => !!c.autoLock);

    if (autoLockColumns.length) {
      autoLockColumns.forEach(c => {
        c.computedLocked = 'start';
      });
    }

    if (
      onRowReorder &&
      (typeof onRowReorder === 'function' || typeof onRowReorder === 'boolean')
    ) {
      const normalizedRowReorderColumn = normalizedColumns.filter(
        c => c.id === reorderColumnId
      )[0];

      if (normalizedRowReorderColumn) {
        normalizedRowReorderColumn.computedLocked = 'start';
      }
    }
  }

  let computedEnableRowspan = false;

  normalizedColumns.forEach((col, index) => {
    col.computedAbsoluteIndex = index;
    addSortInfo(col);
    addFilterValue(col);

    if (typeof col.rowspan === 'function') {
      computedEnableRowspan = true;
    }
    col.computedResizable =
      (typeof col.resizable !== 'boolean' ? resizable : col.resizable) || false;
    col.computedLockable =
      (typeof col.lockable !== 'boolean' ? lockable : col.lockable) || false;
  });

  let columnsMap = mapColumns(normalizedColumns, {
    showWarnings: true,
  }) as TypeComputedColumnsMap;

  // now only filter visible columns
  let visibleColumns = normalizedColumns.filter(
    c => c.computedVisible !== false
  );

  if (columnOrder) {
    if (checkboxColumn) {
      // make sure the checkbox column is always at the start in the
      // column order

      const checkboxColumnIndex = columnOrder.indexOf(checkboxColumnId);
      if (checkboxColumnIndex == -1) {
        columnOrder = [checkboxColumnId, ...columnOrder];
      }
    }
  }

  // enforce rowExpandColumn to be first
  if (rowExpandColumn) {
    if (!columnOrder) {
      columnOrder = visibleColumns.map(c => c.id);
    }
    const rowExpandColumnIndex = columnOrder.indexOf(rowExpandColumnId);
    if (rowExpandColumnIndex !== 0) {
      columnOrder = [
        rowExpandColumnId,
        ...columnOrder.filter(id => id != rowExpandColumnId),
      ];
    }
  }

  // enforce draggable column to be first
  if (
    onRowReorder &&
    (typeof onRowReorder === 'function' || typeof onRowReorder === 'boolean')
  ) {
    if (!columnOrder) {
      columnOrder = visibleColumns.map(c => c.id);
    }

    const rowReorderColumnIndex = columnOrder.indexOf(reorderColumnId);
    if (rowReorderColumnIndex !== 0) {
      columnOrder = [
        reorderColumnId,
        ...columnOrder.filter(id => id !== reorderColumnId),
      ];
    }
  }

  if (rowIndexColumn) {
    if (!columnOrder) {
      columnOrder = visibleColumns.map(c => c.id);
    }
    //enforce row index column to be first after groupSpacerColumns

    // make sure the checkbox column is always at the start in the
    // column order
    const rowIndexColumnIndex = columnOrder.indexOf(rowIndexColumnId);
    if (rowIndexColumnIndex != 0) {
      columnOrder = [
        ...columnOrder.filter(id => {
          const col = columnsMap[id];
          return col && col.groupSpacerColumn;
        }),
        rowIndexColumnId,
        ...columnOrder.filter(id => {
          const col = columnsMap[id];
          if (!col) {
            return false;
          }
          return id != rowIndexColumnId && !col.groupSpacerColumn;
        }),
      ];
    }
  }

  if (generatedColumnsLength) {
    if (!columnOrder) {
      columnOrder = visibleColumns.map(c => c.id);
    }
    const generatedColumns = visibleColumns.filter(c => c.groupSpacerColumn);

    const generatedColumnIds = generatedColumns.reduce(
      (acc: any, col: any) => {
        acc[col.id] = true;
        return acc;
      },
      {} as {
        [key: string]: string;
      }
    );
    columnOrder = [
      ...generatedColumns.map(c => c.id),
      ...columnOrder.filter(id => !generatedColumnIds[id]),
    ];
  }
  if (columnOrder) {
    const groupSpacerColumns = visibleColumns.filter(
      col => col.groupSpacerColumn
    );
    const groupColumns = visibleColumns.filter(
      col => col.groupColumn && !col.groupSpacerColumn
    );
    const ungroupColumns = visibleColumns.filter(
      col => !col.groupColumn && !col.groupSpacerColumn
    );

    visibleColumns = columnOrder
      .map((colId: string) => {
        return ungroupColumns.find(col => col.id == colId);
      })
      .filter((x: any) => !!x) as TypeComputedColumn[];

    visibleColumns = [
      ...groupSpacerColumns,
      ...groupColumns,
      ...visibleColumns,
    ];
  }

  if (typeof filter == 'function') {
    visibleColumns = visibleColumns.filter(filter);
  }

  // iterate over not just the visible columns,
  // since the group column might be hidden, however, you
  // want to compute the summary for it as well
  normalizedColumns.forEach(col => {
    if (col.groupSummaryReducer) {
      groupColumnSummaryReducers[col.id] = col.groupSummaryReducer;

      if (!col.groupSummaryReducer.reducer && col.groupSummaryReducer.reduce) {
        groupColumnSummaryReducers[col.id].reducer =
          col.groupSummaryReducer.reduce;
      }
    }
  });

  const groupColumn = visibleColumns.filter(col => !!col.groupColumn)[0];

  if (pivot && computedPivotUniqueValuesPerColumn && groupColumn) {
    const aggregateColumns = visibleColumns.filter(
      col => !!col.groupSummaryReducer
    );

    const newColumns = [
      groupColumn,
      ...getPivotColumns(
        aggregateColumns,
        computedPivotUniqueValuesPerColumn,
        columnSizes,
        pivot,
        pivotGrandSummaryColumn,
        showPivotSummaryColumns
      ),
    ].map(col => {
      setComputedColumnWidths(col, setComputedColumnWidthsParam);
      col.computedResizable =
        (typeof col.resizable !== 'boolean' ? resizable : col.resizable) ||
        false;
      return col;
    });

    visibleColumns = newColumns;

    columnsMap = {
      ...columnsMap,
      ...mapColumns(newColumns, {
        showWarnings: true,
      }),
    } as TypeComputedColumnsMap;
  }

  const flexes: number[] = [];
  const maxWidths: (number | null | undefined)[] = [];
  const minWidths: (number | null | undefined)[] = [];
  let minColumnsSize = 0;

  let availableWidthForFlex = availableWidth;
  // for all visible columns, substract the width of fixed columns
  // from the available flex size
  visibleColumns.forEach(col => {
    if (col.computedFlex == null) {
      availableWidthForFlex -=
        col.computedWidth ||
        col.computedDefaultWidth ||
        col.computedMinWidth ||
        0;
    }

    flexes.push(col.computedFlex || 0);
    maxWidths.push(col.computedMaxWidth || null);
    minWidths.push(col.computedMinWidth || null);
  });

  availableWidthForFlex = Math.max(availableWidthForFlex, 0);
  const flexWidths = computeFlexWidths({
    flexes,
    availableSize: availableWidthForFlex,
    maxWidths,

    minWidths,
  });

  visibleColumns.forEach((col, index) => {
    if (col.computedFlex != null) {
      col.computedWidth = flexWidths[index] || 0;
      minColumnsSize += col.minWidth || 0;
    } else {
      minColumnsSize += col.computedWidth || 0;
    }
  });

  let unlockedColumns = visibleColumns;
  let lockedStartColumns: any[] = [];
  let lockedEndColumns: any[] = [];

  // now put locked-left columns first and locked-right columns last
  if (hasLockedStart || hasLockedEnd) {
    unlockedColumns =
      groupColumn && hasLockedStart
        ? visibleColumns.filter(col => !col.computedLocked && !col.groupColumn)
        : visibleColumns.filter(col => !col.computedLocked);

    lockedStartColumns = hasLockedStart
      ? visibleColumns.filter(
          col => col.computedLocked === 'start' || col.groupColumn
        )
      : emptyArray;

    lockedEndColumns = hasLockedEnd
      ? groupColumn && hasLockedStart
        ? visibleColumns.filter(
            col => col.computedLocked === 'end' && !col.groupColumn
          )
        : visibleColumns.filter(col => col.computedLocked === 'end')
      : emptyArray;

    visibleColumns = [
      ...lockedStartColumns,
      ...unlockedColumns,
      ...lockedEndColumns,
    ];
  }

  const visibleColumnsMap = mapColumns(visibleColumns as TypeComputedColumn[], {
    showWarnings: true,
  }) as TypeComputedColumnsMap;

  let sumPrefixWidth = 0;
  var totalLockedStartWidth = 0;
  var totalLockedEndWidth = 0;
  var totalUnlockedWidth = 0;

  const columnWidthPrefixSums: number[] = [];

  let computedHasColSpan = false;
  visibleColumns.forEach((col, index, arr) => {
    col.computedVisibleIndex = index;
    col.computedVisibleCount = arr.length;

    if (col.colspan) {
      computedHasColSpan = true;
    }

    col.computedOffset = sumPrefixWidth;
    const { computedLocked, computedWidth } = col;

    if (computedLocked === 'start') {
      totalLockedStartWidth += computedWidth || 0;
    } else if (computedLocked === 'end') {
      totalLockedEndWidth += computedWidth || 0;
    } else {
      totalUnlockedWidth += computedWidth || 0;
    }

    addSortInfo(col);

    if (editable && col.editable === undefined) {
      col.computedEditable = true;
    }
    if (col.editable !== undefined) {
      col.computedEditable = col.editable;
    }
    columnWidthPrefixSums.push(col.computedOffset || 0);

    sumPrefixWidth += computedWidth || 0;
  });

  if (pivot) {
    pivot.forEach((pivotCol: TypePivotItem) => {
      if (typeof pivotCol !== 'string' && pivotCol.summaryReducer) {
        pivotColumnSummaryReducers[pivotCol.name] = pivotCol.summaryReducer;
      }
    });
  }

  return {
    pivotColumnSummaryReducers,
    minColumnsSize,

    groupColumnSummaryReducers: Object.keys(groupColumnSummaryReducers).length
      ? groupColumnSummaryReducers
      : undefined,

    totalComputedWidth: sumPrefixWidth,
    totalLockedStartWidth,
    totalLockedEndWidth,
    totalUnlockedWidth,

    lockedStartColumns: lockedStartColumns as TypeComputedColumn[],
    lockedEndColumns: lockedEndColumns as TypeComputedColumn[],
    unlockedColumns: unlockedColumns as TypeComputedColumn[],

    columnWidthPrefixSums,
    columnVisibilityMap,

    computedEnableRowspan,
    computedHasColSpan,
    visibleColumns: visibleColumns as TypeComputedColumn[],
    allColumns: normalizedColumns as TypeComputedColumn[],
    columnsMap,
    visibleColumnsMap,
  };
};

const getPivotGroupColumnForPath = (
  columnConfig: { pivotSummaryPath: { field: string; value: string }[] } & any,
  {
    pivot,
    pivotGrandSummaryColumn,
  }: { pivot: TypePivotItem[]; pivotGrandSummaryColumn?: boolean | IColumn }
) => {
  const pivotMap = pivot.reduce((acc, p) => {
    if (!p.summaryReducer) {
      return acc;
    }
    let col = p ? (p as any).summaryColumn || {} : {};
    acc[(p as any).name || p] = col;
    return acc;
  }, {} as { [key: string]: any });

  if (pivotGrandSummaryColumn === true) {
    pivotGrandSummaryColumn = {};
  }

  if (pivotGrandSummaryColumn) {
    (pivotGrandSummaryColumn as any).pivotGrandSummaryColumn = true;

    pivotGrandSummaryColumn = {
      ...defaultPivotGrandSummaryColumn,
      ...pivotGrandSummaryColumn,
    };
  }

  columnConfig = { ...defaultPivotSummaryColumn, ...columnConfig };

  const { pivotSummaryPath } = columnConfig;
  const lastItem = pivotSummaryPath[pivotSummaryPath.length - 1];
  const name = lastItem ? lastItem.field : null;

  let col = !lastItem ? pivotGrandSummaryColumn : pivotMap[name] || {};
  let result = columnConfig;

  if (lastItem) {
    columnConfig.header = `Summary for ${lastItem.field} ${lastItem.value}`;
  }

  if (!pivotGrandSummaryColumn && !pivotMap[name]) {
    return null;
  }
  if (col) {
    if (typeof col === 'function') {
      result = { ...columnConfig, ...col(columnConfig) };
    } else {
      result = {
        ...columnConfig,
        ...col,
      };
    }
  }

  return result;
};
const getPivotColumns = (
  aggregateColumns: TypeComputedColumn[],
  uniqueValuesRoot: TypePivotUniqueValuesDescriptor,
  columnSizes: { [key: string]: number },
  pivot: TypePivotItem[],
  pivotGrandSummaryColumn?: boolean | IColumn,
  showPivotSummaryColumns?: boolean,
  parentGroups: { name: string; pivotPath?: string[]; depth: number }[] = [],
  pivotColumnPath?: any[]
): any[] => {
  const newColumns = [];
  const { field, values } = uniqueValuesRoot;

  const parentGroup = parentGroups[parentGroups.length - 1];
  if (field && values) {
    Object.keys(values).forEach(value => {
      const groupId = `${
        parentGroup ? parentGroup.name + '_' : ''
      }${field}:${value}`;

      const group: {
        name: string;
        header: string;
        group?: string;

        pivotPath: any[];
      } = {
        name: groupId,
        header: `${field}-${value}`,
        pivotPath: [{ value, field }],
      };

      if (parentGroup) {
        group.group = parentGroup.name;
        group.pivotPath = [
          ...(parentGroup.pivotPath || []),
          ...group.pivotPath,
        ];
      }

      const nextRoot = values[value];

      pivotColumnPath = pivotColumnPath || [];
      newColumns.push(
        ...getPivotColumns(
          aggregateColumns,
          nextRoot,
          columnSizes,
          pivot,
          pivotGrandSummaryColumn,
          showPivotSummaryColumns,
          [
            ...parentGroups,
            {
              name: groupId,
              pivotPath: group.pivotPath,
              depth: parentGroup ? parentGroup.depth + 1 : 0,
            },
          ],
          [...pivotColumnPath, value]
        )
      );

      if (!parentGroup && showPivotSummaryColumns) {
        const summaryCol = getPivotGroupColumnForPath(
          {
            header: `Summary for ${group.header}`,
            id: `__summary_${group.name}`,
            pivotSummaryColumn: true,
            pivotSummaryPath: group.pivotPath,
          },
          { pivot }
        );
        if (summaryCol) {
          newColumns.push(summaryCol);
        }
      }
    });
  } else {
    newColumns.push(
      ...aggregateColumns.map((col: TypeComputedColumn) => {
        const result = {
          ...col,
          sortable: false,
          showInContextMenu: false,
          draggable: false,
          pivotColumn: true,

          pivotColumnPath: [
            ...(pivotColumnPath || []),
            col.pivotName || col.name || col.id,
          ],
          id: `${parentGroup.name}-${col.id}`,
          group: parentGroup.name,
        } as TypeComputedColumn;

        if (columnSizes[result.id]) {
          result.computedWidth = columnSizes[result.id];
        }
        return result;
      })
    );

    const prevParentGroup = parentGroups[parentGroups.length - 2];

    if (showPivotSummaryColumns && prevParentGroup) {
      const summaryCol = getPivotGroupColumnForPath(
        {
          group: prevParentGroup ? prevParentGroup.name : undefined,
          header: `Summary for ${parentGroup.name} - ${
            prevParentGroup ? prevParentGroup.name : ''
          }`,
          id: `__summary__${parentGroup.name}`,
          pivotSummaryPath: parentGroup.pivotPath,
          pivotSummaryColumn: true,
        },
        { pivot }
      );
      if (summaryCol) {
        newColumns.push(summaryCol);
      }
    }
  }

  if (!parentGroup && pivotGrandSummaryColumn && showPivotSummaryColumns) {
    newColumns.push(
      getPivotGroupColumnForPath(
        {
          header: `Grand summary`,

          id: `__summary__grand`,
          pivotSummaryColumn: true,
          pivotSummaryPath: [],
        },
        { pivot, pivotGrandSummaryColumn }
      )
    );
  }

  return newColumns;
};
