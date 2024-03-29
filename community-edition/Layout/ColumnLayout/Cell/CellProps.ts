/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { FunctionNotifier } from '../../../utils/notifier';
import { ReactNode, CSSProperties } from 'react';
import { TypeGroupTool } from '../../../types';

type func = (...args: any[]) => any;
export type CellProps = {
  timestamp: number;
  dataSourceChange?: boolean;
  columnsChange?: boolean;
  onTransitionEnd?: (e: any) => void;
  inEdit?: boolean;
  cellRef?: any;
  left?: number;
  colspan?: any;
  rowspan?: any;
  computedColspanToStart?: boolean;
  computedColspanedBy?: any;
  computedAbsoluteIndex?: number;
  checkboxTabIndex?: number | null;
  expandColumnIndex?: number;
  expandColumn?: boolean;
  cellActive?: boolean;
  cellClassName?: string;
  cellDefaultClassName?: string;
  cellDOMProps?: object | ((...args: any[]) => any);
  computedCellMultiSelectionEnabled?: boolean;
  cellSelectable?: boolean;
  cellSelected?: boolean;
  checkboxColumn?: any;
  collapsed?: boolean;
  computedColspan?: number;
  computedRowspan?: number;
  columnIndex?: number;
  columnResizeHandleWidth?: number | string;
  computedLocked?: false | 'start' | 'end';
  computedWidth?: number;
  notifyColumnFilterVisibleStateChange: FunctionNotifier<boolean>;
  data?: any | any[];
  defaultWidth?: number | string;
  depth?: number;
  deselectAll?: func;
  domProps?: object;
  empty?: boolean;
  first?: boolean;
  firstInSection?: boolean;
  computedFlex?: number;
  flex?: number;
  group?: string;
  computedGroupBy?: any;
  groupCell?: boolean;
  groupSpacerColumn?: boolean;
  groupNestingSize?: number;
  groupProps?: {
    depth?: number;
    collapsed?: boolean;
    renderGroupTool?: {
      render: any;
      rtl: boolean | undefined;
      collapsed: boolean | undefined;
      toggleGroup: (event: any) => void;
      style?: any;
      size: number;
    };
  };
  renderGroupCollapseTool?: TypeGroupTool;
  renderGroupExpandTool?: TypeGroupTool;
  hasBottomSelectedSibling?: boolean;
  hasLeftSelectedSibling?: boolean;
  hasLockedStart?: boolean;
  hasRightSelectedSibling?: boolean;
  hasTopSelectedSibling?: boolean;
  header?: any;
  headerAlign?: 'start' | 'center' | 'end';
  headerCell?: boolean;
  headerCellDefaultClassName?: string;
  headerClassName?: string;
  headerDOMProps?: object;
  headerEllipsis?: boolean;
  headerHeight?: number;
  headerProps?: any;
  headerUserSelect?: true | false | 'text' | 'none';
  headerVerticalAlign?:
    | 'top'
    | 'middle'
    | 'center'
    | 'bottom'
    | 'start'
    | 'end';
  headerWrapperClassName?: string;
  hidden?: boolean;
  hideIntermediateState?: boolean;
  hideTransitionDuration?: number;
  hiding?: boolean;
  id?: number | string;
  inHideTransition?: boolean;
  inShowTransition?: boolean;
  inTransition?: boolean | number;
  index?: number;
  initialIndex?: number;
  isColumn?: boolean;
  last?: boolean;
  lastInRange?: boolean;
  lastInSection?: boolean;
  lastRowInGroup?: boolean;
  lastUnlocked?: boolean;
  locked?: boolean | string;
  maxWidth?: number | string;
  computedMaxWidth?: number | string;
  minWidth?: number | string;
  computedMinWidth?: number | string;
  minRowHeight?: number | string;
  multiSelect?: boolean;
  name?: string;
  nativeScroll?: boolean;
  nextBorderLeft?: boolean;
  noBackground?: boolean;
  onCellClick?: func;
  onCellEnter?: func;
  onCellMouseDown?: func;
  preventSortOnClick?: func;
  onCellSelectionDraggerMouseDown?: (
    event: MouseEvent,
    cellProps: CellProps
  ) => void;
  onCellBulkUpdateMouseDown?: (event: MouseEvent, cellProps: CellProps) => void;
  onCellBulkUpdateMouseUp?: (event: MouseEvent, cellProps: CellProps) => void;
  bulkUpdateMouseDown?: boolean;
  onGroupToggle?: func;
  onMount?: func;
  onRender?: func;
  onResizeMouseDown?: func;
  onResizeTouchStart?: func;
  onSortClick?: func;
  onUnmount?: (cellProps: CellProps, cell: any) => void;
  prevBorderRight?: boolean;
  render?: func;
  renderCheckbox?: func;
  renderGroupTitle?: func;
  renderHeader?: func;
  renderSortTool?: (direction: -1 | null | 1, extraProps: CellProps) => void;
  computedResizable?: boolean;
  lockable?: boolean;
  resizeProxyStyle?: object;
  rowActive?: boolean;
  rowHeight?: number;
  initialRowHeight?: number;
  rowIndex?: number;
  rowIndexInGroup?: number;
  rowRenderIndex?: number;
  rowSelected?: boolean;
  scrollbarWidth?: number;
  indexInHeaderGroup?: number;
  parentGroups?: any[];
  summaryProps?: any;
  selectAll?: func;
  selectedCount?: number;
  selection?: any;
  setRowSelected?: func;
  setRowExpanded?: func;
  toggleRowExpand?: func;
  toggleNodeExpand?: func;
  shouldComponentUpdate?: func;
  showBorderBottom?: boolean | number;
  showBorderLeft?: boolean | number;
  showBorderRight?: boolean | number;
  showBorderTop?: boolean | number;
  showColumnContextMenu?: func;
  showColumnMenuSortOptions?: boolean;
  showColumnMenuFilterOptions?: boolean;
  showColumnMenuLockOptions?: boolean;
  showColumnMenuGroupOptions?: boolean;
  showTransitionDuration?: number;
  sort?: any;
  sortDelay?: number;
  computedSortInfo?: any;
  computedSortable?: boolean;
  textAlign?: 'start' | 'center' | 'end';
  textEllipsis?: boolean;
  textVerticalAlign?: 'top' | 'middle' | 'center' | 'bottom' | 'start' | 'end';
  titleClassName?: string;
  tryRowCellEdit?: func;
  totalCount?: number;
  totalDataCount?: number;
  unselectedCount?: number;
  userSelect?: true | false | 'text' | 'none';
  value?: any;
  virtualizeColumns?: boolean;
  visibilityTransitionDuration?: boolean | number;
  computedVisible?: boolean;
  computedVisibleCount?: number;
  computedVisibleIndex?: number;
  indexInColumns?: number;
  width?: number | string;

  editable?: boolean | func;

  onEditStop?: func;
  onEditStart?: func;
  onEditCancel?: func;
  onEditValueChange?: func;
  onEditComplete?: func;

  onEditStopForRow?: func;
  onEditStartForRow?: func;
  onEditCancelForRow?: func;
  onEditValueChangeForRow?: func;
  onEditCompleteForRow?: func;

  isRowExpandable?: func;

  editorProps?: any;
  editValue?: any;
  Editor?: func;
  renderEditor?: func;
  zIndex?: number;

  computedOffset?: number;
  groupTitleCell?: boolean;
  groupExpandCell?: boolean;

  rendersInlineEditor?:
    | boolean
    | ((cellRenderObject: CellRenderObject) => boolean);

  groupColumn?: boolean;
  treeColumn?: boolean;
  renderNodeTool?: func;

  showInContextMenu?: boolean;
  naturalRowHeight?: boolean;

  rtl?: boolean;
  computedFilterable?: boolean;
  computedEditable?:
    | boolean
    | ((editValue?: string, cellProps?: CellProps) => void);
  groupColumnVisible?: boolean;
  filterTypes?: any;
  filterDelay?: boolean | number;
  getFilterValue?: func;
  onFilterValueChange?: func;
  getEditStartValue?: func;
  getEditCompleteValue?: func;
  editStartEvent?: string;
  onDragRowMouseDown?: func;
  theme?: string;
  onContextMenu?: (event: MouseEvent, props: CellProps) => void;
  showContextMenu?: (menuTool: any, onHide: any) => void;
  setActiveIndex?: func;
  renderColumnReorderProxy?: (props: any) => void;
  columnHoverClassName?: string;
  computedEnableColumnHover?: boolean;
  renderRowDetailsMoreIcon?: () => void;
  renderRowDetailsExpandIcon?: () => void;
  renderRowDetailsCollapsedIcon?: () => void;
  isRowDetailsCell?: boolean;
  isCheckboxColumn?: boolean;
  onColumnMouseEnter?: (props: CellProps) => void;
  onColumnMouseLeave?: (props: CellProps) => void;
  showColumnFilterContextMenu?: (node: ReactNode, props: CellProps) => void;
  hideColumnFilterContextMenu?: (node?: ReactNode) => void;
  onDoubleClick?: (event: MouseEvent, props: CellProps) => void;
  onFocus?: (event: MouseEvent, props: CellProps) => void;
  editor?: any;
  tryNextRowEdit?: (
    dir: number,
    columnIndex: number,
    isEnterNavigation?: boolean
  ) => void;
  style?: CSSProperties | ((props: CellProps) => void);
  computedPivot?: boolean;
  columnIndexHovered?: number;
  className?: string | ((props: CellProps) => void);
  computedLockable?: boolean;
  lastInGroup?: boolean;
  onCellLeave?: (event: MouseEvent, props: CellProps) => void;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onMouseDown?: (props: CellProps, event: MouseEvent) => void;
  onTouchStart?: (props: CellProps, event: TouchEvent) => void;
  onCellTouchStart?: (event: TouchEvent, props: CellProps) => void;
  children?: any;
  hideColumnContextMenu?: () => void;
  onClick?: (event: MouseEvent, props: CellProps) => void;
  loadNodeAsync?: () => void;
  remoteRowIndex?: number;
  rowExpanded?: boolean;
  renderSummary?: any;
  cellProps?: CellProps;
  nodeLoading?: boolean;
  nodeCollapsed?: boolean;
  leafNode?: boolean;
  renderTreeCollapseTool?: ({
    domProps,
    size,
  }: {
    domProps: any;
    size?: number;
  }) => void;
  renderTreeExpandTool?: ({
    domProps,
    size,
  }: {
    domProps: any;
    size?: number;
  }) => void;
  renderTreeLoadingTool?: ({
    domProps,
    size,
    className,
  }: {
    domProps: any;
    size?: number;
    className: string;
  }) => void;
  size?: number;
  node?: ReactNode;
  nodeProps?: any;
  treeNestingSize?: number;
  nodeExpanded?: boolean;
  onUpdate?: (props: CellProps, instance?: any) => void;
  startEdit?: (
    editValue?: string,
    errBack?: (...args: any[]) => any
  ) => Promise<void> | Promise<boolean | undefined>;
};

export type EnhancedCellProps = CellProps & {
  editProps?: {
    inEdit?: boolean;
    startEdit: func;
    value: any;
    gotoNext: () => void;
    gotoPrev: () => void;
    onTabNavigation: (complete: boolean, dir: number) => void;
    onClick?: (event: MouseEvent, props: CellProps) => void;
    onChange?: (event: MouseEvent) => void;
    onComplete?: () => void;
    onCancel?: () => void;
    onEnterNavigation?: (complete: boolean, dir: number) => void;
  };
  className?: string;
};

export type CellRenderObject = {
  empty?: boolean;
  value: any;
  data: any;
  cellProps: EnhancedCellProps;
  columnIndex?: number;
  treeColumn?: boolean;
  rowIndex?: number;
  remoteRowIndex?: number;
  rowIndexInGroup?: number;
  rowSelected?: boolean;
  rowExpanded?: boolean;
  nodeProps: any;
  setRowSelected: any;
  setRowExpanded: any;
  toggleGroup: (event: any) => void;
  toggleRowExpand: any;
  toggleNodeExpand: any;
  loadNodeAsync?: () => void;
  isRowExpandable?: (rowInfo: {
    id: string | number;
    data: object;
    rowIndex: number;
  }) => boolean;
  totalDataCount?: number;
  rendersInlineEditor?:
    | boolean
    | ((cellRenderObject: CellRenderObject) => boolean);
  renderRowDetailsExpandIcon?: () => void;
  renderRowDetailsCollapsedIcon?: () => void;
  renderRowDetailsMoreIcon?: () => void;
};

export type TypeState = {
  right?: number;
  left?: number;
  top?: number;
  props?: CellProps;
  dragging?: boolean;
  height?: number;
  width?: number;
};

export type CellInstance = {
  showContextMenu: (domRef: ReactNode, onHide: () => void) => void;
  getProps: () => CellProps;
  setLeft: (left: number) => void;
  setRight: (right: number) => void;
  setTop: (top: number) => void;
  setHeight: (height: number) => void;
  setWidth: (width: number) => void;
  setDragging: (dragging: boolean, callback?: Function) => void;
  setStateProps: (stateProps: CellProps) => void;
  updateState: (newState: TypeState, callback?: Function) => void;
  updateProps: (props: CellProps, callback?: any) => void;
  getDOMNode: () => void;
  onUpdate: () => void;
  getInitialIndex: () => void;
  getcomputedVisibleIndex: () => void;
  getInitialDOMProps: () => void;
  isInEdit: () => void;
  getEditable: (
    editValue: string,
    thisProps?: CellProps
  ) => Promise<void> | Promise<boolean | undefined>;
  onEditorTabLeave: (direction: -1 | null | 1) => void;
  gotoNextEditor: () => void;
  gotoPrevEditor: () => void;
  onEditorEnterNavigation: (complete: boolean, dir: number) => void;
  onEditorTabNavigation: (complete: boolean, dir: number) => void;
  onEditorClick: (event: MouseEvent) => void;
  onEditorCancel: () => void;
  startEdit: (
    editValue?: any,
    errBack?: (...args: any[]) => any
  ) => Promise<void> | Promise<boolean | undefined>;
  stopEdit: () => void;
  cancelEdit: () => void;
  onEditorComplete: () => void;
  getEditCompleteValue: () => void;
  completeEdit: () => void;
  getCurrentEditValue: () => void;
  onFilterValueChange: (filterValue: string) => void;
  onEditValueChange: (event: MouseEvent) => void;
  onHeaderCellFocus: (event: MouseEvent) => void;
  onColumnHoverMouseEnter: (props: CellProps) => void;
  onColumnHoverMouseLeave: (props: CellProps) => void;
  onCellEnterHandle: (event: MouseEvent) => void;
  onCellLeave: (event: MouseEvent) => void;
  onCellSelectionDraggerMouseDown: (event: MouseEvent) => void;
  prepareHeaderCellProps: (props: EnhancedCellProps) => void;
  onMouseDown: (event: MouseEvent) => void;
  onContextMenu: (event: MouseEvent & { nativeEvent: any }) => void;
  onTouchStart: (event: TouchEvent) => void;
  onResizeMouseDown: (cellProps: EnhancedCellProps, event: MouseEvent) => void;
  onResizeTouchStart: (cellProps: EnhancedCellProps, event: TouchEvent) => void;
  onClick: (event: MouseEvent) => void;
  onDoubleClick: (event: MouseEvent) => void;
  getEditStartValue: () => void;
  onSortClick: () => void;
  getSortTools: (
    direction: 1 | -1 | null | undefined,
    cellProps: EnhancedCellProps
  ) => void | JSX.Element | null;
  showFilterContextMenu: (node: ReactNode) => void;
  hideFilterContextMenu: (node: ReactNode) => void;
  getProxyRegion: () => void;
  renderGroupTool: () => void;
  toggleGroup: (event: any) => void;
  domRef: any;
  props: CellProps;
};
