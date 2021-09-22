/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TypeSortInfo } from './TypeSortInfo';
import { TypeLockedRow, TypeComputedProps, TypeFooterRow } from '.';
import { FC, Component, ReactNode } from 'react';
import { CellProps } from '../Layout/ColumnLayout/Cell/CellProps';

export type TypeSummaryReducer = {
  initialValue: any;
  name?: string;
  complete?: (
    value: any,
    data: any[],
    computedProps?: TypeComputedProps
  ) => any;
  reducer: (accumulator: any, value: any, data: any | TypeComputedProps) => any;

  //also allow as reduce instead of reducer
  reduce?: (accumulator: any, value: any, data: any | TypeComputedProps) => any;
};
export interface IColumn {
  name?: string;
  id?: string;

  readonly checkboxColumn?: boolean;
  readonly groupSpacerColumn?: boolean;

  // size related
  readonly width?: number;
  readonly defaultWidth?: number;
  readonly minWidth?: number;
  readonly maxWidth?: number;
  readonly flex?: number | null;
  readonly defaultFlex?: number | null;

  readonly group?: string;
  readonly groupColumn?: boolean;
  readonly textAlign?: 'start' | 'end' | 'left' | 'right' | 'center';
  readonly headerAlign?: 'start' | 'end' | 'left' | 'right' | 'center';

  // bool flags
  readonly showInContextMenu?: boolean;
  readonly visible?: boolean;
  readonly defaultVisible?: boolean;
  readonly floating?: boolean;
  readonly resizable?: boolean;
  readonly draggable?: boolean;
  readonly lockable?: boolean;
  readonly editable?: boolean;
  readonly dateFormat?: string;
  readonly hideable?: boolean;
  readonly filterable?: boolean;
  readonly style?: any;
  readonly sortable?: boolean;
  readonly sortName?: string;
  readonly pivotName?: string;
  readonly type?: string;
  readonly keepFlex?: boolean;
  readonly cellSelectable?: boolean;
  readonly autoLock?: boolean;
  readonly filterType?: string;
  readonly filterName?: string;
  readonly filterEditor?: typeof Component | FC;
  readonly filterEditorProps?: any;
  readonly groupBy?: boolean;
  readonly groupByName?: string;
  readonly sort?: (...args: any[]) => any;
  readonly colspan?: (...args: any[]) => number;
  readonly rowspan?: (...args: any[]) => number;

  readonly header?: any;
  readonly groupToString?: (...args: any[]) => string;
  readonly pivotToString?: (...args: any[]) => string;
  readonly getFilterValue?: Function;

  // locking
  readonly locked?: 'start' | 'end' | true | false;
  readonly defaultLocked?: 'start' | 'end' | true | false;

  readonly lockedRowCellRender?: (
    value: any,
    args: {
      row: TypeLockedRow;
      rowIndex: number;
      columnIndex: number;
      computedProps: TypeComputedProps;
      column: TypeComputedColumn;
    }
  ) => ReactNode;
  readonly footerRowCellRender?: (
    value: any,
    args: {
      row: TypeFooterRow;
      rowIndex: number;
      columnIndex: number;
      computedProps: TypeComputedProps;
      column: TypeComputedColumn;
    }
  ) => ReactNode;

  readonly renderGroupTitle?: (...args: any[]) => ReactNode;
  readonly renderGroupValue?: (...args: any[]) => ReactNode;
  readonly render?: (...args: any[]) => ReactNode;
  readonly renderSummary?: (...args: any[]) => ReactNode;
  readonly groupSummaryReducer?: TypeSummaryReducer;
}

export interface TypeColWithNameProperty extends IColumn {
  name?: string;
}
export interface TypeColWithIdProperty extends IColumn {
  id?: string;
}

export type TypeColumn = TypeColWithNameProperty | TypeColWithIdProperty;

export type TypeColumnWithId = TypeColumn & { id: string };

export type TypeComputedColumn = TypeColumn &
  TypeColWithIdProperty & {
    id: string;
    pivotColumn?: boolean;
    pivotGrandSummaryColumn?: boolean;
    pivotColumnPath?: string[];
    computedInitialIndex?: number;
    computedAbsoluteIndex?: number;
    computedFilterValue?: any;
    computedDefaultWidth?: number;
    computedWidth: number;
    computedMinWidth?: number;
    computedMaxWidth?: number;
    computedSortInfo?: TypeSortInfo;
    computedOffset: number;
    computedSortable?: boolean;
    computedEditable?:
      | boolean
      | ((editValue?: string, cellProps?: CellProps) => void);
    computedFilterable?: boolean;
    computedVisibleIndex: number;
    computedVisibleCount?: number;
    computedVisible?: boolean;
    computedFlex?: number | null;
    computedLocked?: 'start' | 'end' | true | false;
    computedLockable?: boolean;
    computedResizable?: boolean;
    computedHeader?: any;
    prevBorderRight?: boolean;
    nextBorderLeft?: boolean;
  };
export type TypeColumns = TypeColumn[];

export type TypeColumnGroup = {
  name: string;
  header?: ReactNode;
  group?: string;
  computedDepth?: number;
};

export type TypeComputedColumnsMap = {
  [key: string]: TypeComputedColumn;
};
