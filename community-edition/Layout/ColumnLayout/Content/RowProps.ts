/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TypeComputedColumn } from '../../../types/TypeColumn';
import { CellProps } from '../Cell/CellProps';
import { CSSProperties } from 'react';
import Renderable from '../../../types/TypeRenderable';
import { TypeDataGridProps } from '../../../types/TypeDataGridProps';

type func = (...args: any[]) => any;

export type RowEditCancelInfo = {
  data: any;
  rowId: string | number;
  columnId: string | number;
  columnIndex: number;
  rowIndex: number;
  cellProps: CellProps;
};
export type RowEditInfo = RowEditCancelInfo & {
  value: any;
};

export type RowProps = {
  rowActive?: boolean;
  edition: 'community' | 'enterprise';
  computedLicenseValid: boolean;
  onTransitionEnd?: (e: MouseEvent, cellProps: CellProps) => void;

  lastLockedStartIndex?: number;
  lastLockedEndIndex?: number;
  lastUnlockedIndex?: number;
  onGroupToggle?: (group?: any) => void;
  computedActiveCell?: [number, number] | null;
  columns: TypeComputedColumn[];
  lockedStartColumns: TypeComputedColumn[];
  lockedEndColumns: TypeComputedColumn[];
  virtualizeColumns: boolean;

  rowSelected: boolean;
  availableWidth: number;
  computedGroupBy?: any[];
  expandGroupTitle?: boolean;
  expandColumn?: TypeDataGridProps['expandColumn'];
  getCellSelectionKey?: func;
  depth?: number;

  columnsMap?: any;
  active: boolean;
  style?: CSSProperties;

  cellFactory?: func;
  computedCellMultiSelectionEnabled?: boolean;
  computedCellSelection?: any;
  columnRenderCount: number;
  columnRenderStartIndex?: number;
  columnUserSelect?: boolean;
  deselectAll?: func;
  empty?: boolean;
  even?: boolean;
  firstLockedEndIndex: number;
  firstLockedStartIndex: number;
  firstUnlockedIndex: number;
  flex?: number;
  groupCount: number;
  groupNestingSize: number;
  treeNestingSize?: number;
  groupProps?: any;
  summaryProps?: any;
  hasLockedEnd?: boolean;
  hasLockedStart?: boolean;
  indexInGroup?: number;
  last?: boolean;
  lastCellInRange?: any;
  lastNonEmpty?: boolean;
  lastRowInGroup?: boolean;

  maxWidth?: number;
  id?: string | number;
  data?: any;
  className?: string;
  maxRowHeight?: number;
  minRowHeight?: number;
  maxVisibleRows?: number;
  minWidth?: number;
  width?: number;
  multiSelect?: boolean;
  odd?: boolean;
  onArrowDown?: func;
  onArrowUp?: func;
  onCellClick?: func;
  onCellEnter?: func;
  onCellMouseDown?: func;
  onCellSelectionDraggerMouseDown?: func;
  onRowContextMenu?: func;
  passedProps?: any;
  realIndex?: number;
  renderIndex?: number;
  renderRow?: func;
  onRenderRow?: func;
  rowHeight: number;
  rowExpandHeight?: number;
  initialRowHeight: number;
  defaultRowHeight?: number;
  rowIndex: number;
  remoteRowIndex?: number;
  rowIndexInGroup: boolean;
  rowStyle?: any | func;
  rowClassName?: string | func;
  scrollLeft?: number;
  selectAll?: func;
  selected?: boolean;
  expanded?: boolean;
  selection?: any;
  computedRowExpandEnabled?: boolean;
  computedTreeEnabled?: boolean;
  computedRenderRowDetails?: func;
  isRowExpandableAt: (rowIndex: number) => void;
  setRowSelected?: func;
  setRowExpanded: (rowIndex: number, expanded: boolean) => void;
  toggleRowExpand: (index: number) => void;
  toggleNodeExpand: (index: number) => void;
  loadNodeAsync: (data: any) => void;
  showAllGroupCells?: boolean;
  computedShowCellBorders?: string | boolean;
  showHorizontalCellBorders?: boolean;
  showVerticalCellBorders?: boolean;
  totalColumnCount?: number;
  totalComputedWidth?: number;
  totalDataCount?: number;
  totalLockedEndWidth?: number;
  totalLockedStartWidth?: number;
  totalUnlockedWidth?: number;
  unlockedColumns?: any[];

  nativeScroll?: boolean;
  shouldRenderCollapsedRowDetails?: boolean;
  rowDetailsStyle?: func | any;

  dataSourceArray: any[];
  getItemId: (data: any) => string | number;

  editable?: boolean;
  editing?: boolean;
  editValue?: any;
  editRowIndex?: number;
  editColumnIndex?: number;
  editColumnId?: any;
  emptyScrollOffset?: number;

  naturalRowHeight?: boolean;
  renderDetailsGrid?: func;

  scrollToColumn?: func;
  scrollToIndexIfNeeded?: (
    index: number,
    config?: { direction: 'top' | 'bottom' },
    callback?: VoidFunction
  ) => void;
  renderNodeTool?: func;
  computedEnableRowspan?: boolean;
  setRowSpan?: func;
  treeColumn?: string;
  scrollbars?: {
    horizontal?: boolean;
    vertical?: boolean;
  };

  rtl?: boolean;
  computedPivot?: any[];
  groupColumnSummaries?: any;
  groupSummary?: any;
  groupColumn?: any;
  computedShowZebraRows?: boolean;
  computedRowspans?: any;
  editStartEvent?: string;
  computedHasColSpan?: boolean;

  onEditStop?: (editInfo: RowEditInfo) => void;
  onEditStart?: (editInfo: RowEditInfo) => void;
  onEditCancel?: (editInfo: RowEditCancelInfo) => void;
  onEditValueChange?: (editInfo: RowEditInfo) => void;
  onEditComplete?: (editInfo: RowEditInfo) => void;

  onFilterValueChange?: func;
  tryNextRowEdit?: func;
  getScrollLeftMax?: func;
  activeRowRef?: any;
  sticky?: boolean;
  onClick?: func;
  onMouseEnter?: func;
  onMouseLeave?: func;
  onMouseDown?: func;
  parentGroupDataArray?: any;
  rowDetailsWidth?:
    | 'max-viewport-width'
    | 'min-viewport-width'
    | 'viewport-width';
  onRowReorder?: (dragRowIndex: number, insertRowIndex: number) => void;
  onDragRowMouseDown: func;
  theme: string;
  onContextMenu?: () => void;
  setActiveIndex?: func;
  renderTreeCollapseTool?: ({
    domProps,
    size,
  }: {
    domProps: any;
    size: number;
  }) => void;
  renderTreeExpandTool?: ({
    domProps,
    size,
  }: {
    domProps: any;
    size: number;
  }) => void;
  renderTreeLoadingTool?: ({
    domProps,
    className,
    size,
  }: {
    domProps: any;
    className: string;
    size: number;
  }) => void;
  expandOnMouseDown?: boolean;
};

export type EnhancedRowProps = RowProps & {
  onClick: func;
  onContextMenu: func;
  style: CSSProperties;
  children: Renderable[];
};
