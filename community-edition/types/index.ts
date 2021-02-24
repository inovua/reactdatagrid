/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import TypeDataGridProps, {
  TypeComputedProps,
  TypeRowReorderFn,
  TypeBuildColumnsProps,
} from './TypeDataGridProps';

import { TypeComputedColumn, TypeColumn, TypeColumns } from './TypeColumn';
import { MutableRefObject, ReactNode, CSSProperties } from 'react';
export { TypeSortInfo, TypeSingleSortInfo } from './TypeSortInfo';
export { TypeGroupBy } from './TypeGroupBy';
export { TypeSize } from './TypeSize';
export { TypeDataSource } from './TypeDataSource';
export {
  TypeFilterValue,
  TypeSingleFilterValue,
  TypeFilterType,
  TypeFilterTypes,
  TypeFilterOperator,
} from './TypeFilterValue';
export {
  TypeDataGridProps,
  TypeComputeTreeData,
  TypeComputeTreeDataParam,
  TypeRowDetailsInfo,
  TypeComputedProps,
  TypePivotUniqueValuesDescriptor,
} from './TypeDataGridProps';
export {
  TypeRowSelection,
  TypeRowUnselected,
  TypeCellSelection,
} from './TypeSelected';
export {
  TypeColumn,
  TypeColumnGroup,
  TypeComputedColumn,
  TypeComputedColumnsMap,
  TypeColumnWithId,
  IColumn,
} from './TypeColumn';

export { TypeRowReorderFn };

export type TypePivotColumnSummaryReducer = {
  initialValue: any;
  reducer: (acc: any, currentValue: any, item: any) => any;
  complete?: (acc: any, arr: any[]) => any;
};

export type TypeGroup = {
  name: string;
  header?: ReactNode;
  headerAlign: 'start' | 'end' | 'center' | 'left' | 'right';
};
export type TypePivotItem =
  | {
      name: 'string';
      summaryReducer?: TypePivotColumnSummaryReducer;
      summaryColumn?: Partial<TypeColumn>;
      summaryGroup?: Partial<TypeGroup>;
    }
  | 'string';

export { TypePaginationProps } from './TypePaginationProps';

export type TypeStickyRows = { [key: number]: number } | null;

export type TypeEditInfo = {
  rowIndex: number;
  columnIndex: number;
  rowId: string;
  columnId: string;
  value?: any;
};

export type TypeWithId = {
  id: string;
};

export type TypePivotSummaryShape = {
  [groupName: string]: {
    array: any[];
    field: string;
    values: { [colId: string]: any };
    pivotColumnSummary: { [colId: string]: any };
    pivotSummary: TypePivotSummaryShape | null;
  };
};

export type TypeGroupDataItem = {
  __group: boolean;
  leaf: boolean;
  value: string;
  depth: number;
  keyPath: string[];
  fieldPath: string[];
  groupSummary: any;
  groupColumnSummary: { [colName: string]: any } | null;
  pivotSummary: TypePivotSummaryShape | null;
  index?: number;
};

export type TypeRowProps = {
  rowIndex: number;
  remoteRowIndex: number;
  realIndex?: number;
  groupProps?: any;
  data: any;
  empty?: boolean;
  columns?: TypeComputedColumn[];
  dataSourceArray?: any[];
};

export type TypeCollapsedRows = {
  [key: string]: boolean;
};
export type TypeExpandedRows = TypeCollapsedRows | true;
export type TypeExpandedNodes = {
  [key: string]: boolean;
};

export type TypeNodeCache = {
  [key: string]: any;
};
export type TypeDataSourceCache =
  | {
      [key: string]: any;
    }
  | undefined;

export type TypeNodeProps = {
  expanded: boolean;
  loading: boolean;
  depth: number;
  path: string;
  leafNode: boolean;
  asyncNode: boolean;
  childIndex: number;
  parentNodeId: string | number;
  groupSummary?: any;
  groupColumnSummary?: { [colName: string]: any } | null;
};
export type TypeCellProps = {
  rowIndex: number;
  columnIndex: number;
  computedVisibleIndex?: number;
  data?: any;
  name?: string;
  header?:
    | ReactNode
    | string
    | ((
        celProps: TypeCellProps,
        {
          cellProps,
          column,
          contextMenu,
        }: {
          cellProps: TypeCellProps;
          column: TypeComputedColumn;
          contextMenu: any;
        }
      ) => ReactNode);
};
export type TypeShowCellBorders = true | false | 'vertical' | 'horizontal';

export type TypeLockedRow = {
  position?: 'start' | 'end';
  cellStyle?:
    | CSSProperties
    | ((
        data: {
          row: TypeFooterRow;
          rowIndex: number;
          rowPosition: 'start' | 'end';
          column: TypeComputedColumn;
          columnIndex: number;
        },
        computedProps: TypeComputedProps
      ) => CSSProperties);
  cellClassName?:
    | string
    | ((
        data: {
          row: TypeFooterRow;
          rowIndex: number;
          rowPosition: 'start' | 'end';
          column: TypeComputedColumn;
          columnIndex: number;
        },
        computedProps: TypeComputedProps
      ) => string);
  render?:
    | {
        [key: string]: (
          {
            row,
            rowIndex,
            summary,
            render,
            rowPosition,
            column,
            columnIndex,
          }: {
            summary?: any;
            row: TypeFooterRow;
            rowIndex: number;
            render?: any;
            rowPosition: 'start' | 'end';
            column: TypeComputedColumn;
            columnIndex: number;
          },
          computedProps: TypeComputedProps
        ) => ReactNode;
      }
    | ((
        {
          row,
          rowIndex,
          rowPosition,
          column,
          columnIndex,
          summary,
        }: {
          summary?: any;
          row: TypeFooterRow;
          rowIndex: number;
          rowPosition: 'start' | 'end';
          column: TypeComputedColumn;
          columnIndex: number;
        },
        computedProps: TypeComputedProps
      ) => ReactNode)
    | { [key: string]: any };
  renderLockedStart?: (
    {
      columns,
      value,
      summary,
    }: {
      columns: TypeComputedColumn[];
      value: ReactNode;
      summary: any;
    },
    computedProps: TypeComputedProps
  ) => ReactNode;

  renderUnlocked?: (
    {
      columns,
      value,
      summary,
    }: {
      summary: any;
      columns: TypeComputedColumn[];
      value: ReactNode;
    },
    computedProps: TypeComputedProps
  ) => ReactNode;

  renderLockedEnd?: (
    {
      columns,
      value,
      summary,
    }: {
      summary: any;
      columns: TypeComputedColumn[];
      value: ReactNode;
    },
    computedProps: TypeComputedProps
  ) => ReactNode;

  colspan?:
    | { [key: string]: number }
    | ((
        {
          column,
          columnIndex,
          rowPosition,
          row,
          rowIndex,
        }: {
          column: TypeComputedColumn;
          columnIndex: number;
          rowPosition: 'start' | 'end';
          row: TypeFooterRow;
          rowIndex: number;
        },
        computedProps: TypeComputedProps
      ) => number | null);
};
export type TypeFooterRow = {
  position?: 'end';
  cellStyle?:
    | CSSProperties
    | ((
        data: {
          row: TypeFooterRow;
          rowIndex: number;
          column: TypeComputedColumn;
          columnIndex: number;
        },
        computedProps: TypeComputedProps
      ) => CSSProperties);
  cellClassName?:
    | string
    | ((
        data: {
          row: TypeFooterRow;
          rowIndex: number;
          column: TypeComputedColumn;
          columnIndex: number;
        },
        computedProps: TypeComputedProps
      ) => string);
  render?:
    | {
        [key: string]: (
          {
            row,
            rowIndex,
            summary,
            render,
            column,
            columnIndex,
          }: {
            summary?: any;
            row: TypeFooterRow;
            rowIndex: number;
            render?: any;
            column: TypeComputedColumn;
            columnIndex: number;
          },
          computedProps: TypeComputedProps
        ) => ReactNode;
      }
    | ((
        {
          row,
          rowIndex,
          column,
          columnIndex,
          summary,
        }: {
          summary?: any;
          row: TypeFooterRow;
          rowIndex: number;
          column: TypeComputedColumn;
          columnIndex: number;
        },
        computedProps: TypeComputedProps
      ) => ReactNode)
    | { [key: string]: any };
  renderLockedStart?: (
    {
      columns,
      value,
      summary,
    }: {
      columns: TypeComputedColumn[];
      value: ReactNode;
      summary: any;
    },
    computedProps: TypeComputedProps
  ) => ReactNode;

  renderUnlocked?: (
    {
      columns,
      value,
      summary,
    }: {
      summary: any;
      columns: TypeComputedColumn[];
      value: ReactNode;
    },
    computedProps: TypeComputedProps
  ) => ReactNode;

  renderLockedEnd?: (
    {
      columns,
      value,
      summary,
    }: {
      summary: any;
      columns: TypeComputedColumn[];
      value: ReactNode;
    },
    computedProps: TypeComputedProps
  ) => ReactNode;

  colspan?:
    | { [key: string]: number }
    | ((
        {
          column,
          columnIndex,
          row,
          rowIndex,
        }: {
          column: TypeComputedColumn;
          columnIndex: number;
          row: TypeFooterRow;
          rowIndex: number;
        },
        computedProps: TypeComputedProps
      ) => number | null);
};

export interface TypeBatchUpdateQueue {
  (fn: () => void): void;
  commit: (extraFn?: () => void) => void;
}

export type TypeShowGroupSummaryRow =
  | 'start'
  | 'end'
  | boolean
  | ((group: TypeGroupDataItem) => 'start' | 'end' | boolean);
export interface TypeSummaryReducer<T> {
  initialValue: T;
  reducer: (acc: T, currentValue: T, index: number, arr: any[]) => T;
  complete?: (acc: T, arr: any[]) => T;
}

export type TypeCollapsedGroups = true | { [key: string]: boolean };

export type TypeGetColumnByParam =
  | string
  | number
  | TypeComputedColumn
  | { id: string | number; name?: string | number }
  | { name: string | number; id?: string | number };

export type TypePlugin = {
  name: string;
  hook: (
    props: TypeDataGridProps,
    computedProps: TypeComputedProps,
    computedPropsRef: MutableRefObject<TypeComputedProps | null>
  ) => any;
  defaultProps?: (defaultProps: any) => any;
  maybeAddColumns?: (
    columns: TypeColumns,
    props: TypeBuildColumnsProps
  ) => TypeColumns;
};

export type TypeDetailsGridInfo = {
  __detailsPersisted?: boolean;
  masterDetailsInstances?: any;
  masterDetailsCache?: any;
  masterDetailsKeys?: any;
  unmountedDetails?: any;
  originalDetailsGrids?: any;
};

export type TypeDragHelper = {
  onDrag: Function;
  onDrop: Function;
};

export type TypeConstrainRegion = {
  0: number;
  1: number;
  bottom: number;
  left: number;
  right: number;
  top: number;
  _events: object;
  _eventsCount: number;
  _maxListeners: number;
  height: number;
  width: number;
  getHeight?: Function;
};

export type TypeDiff = {
  top: number;
  left: number;
};

export type TypeConfig = {
  diff: TypeDiff;
  didDrag: boolean;
};

export type RangeResultType = {
  height: number;
  top: number;
  bottom: number;
  index: number;
};
