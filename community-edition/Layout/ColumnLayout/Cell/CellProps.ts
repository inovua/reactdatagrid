/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

type func = (...args: any[]) => any;
export type CellProps = {
  onTransitionEnd?: (e: any) => void;
  inEdit?: boolean;
  cellRef?: any;
  colspan?: any;
  rowspan?: any;
  computedColspanToStart?: boolean;
  computedColspanedBy?: any;
  computedAbsoluteIndex?: number;
  checkboxTabIndex?: number;
  expandColumnIndex?: number;
  expandColumn: boolean;
  cellActive: boolean;
  cellClassName?: string;
  cellDefaultClassName?: string;
  cellDOMProps?: object | ((...args: any[]) => any);
  computedCellMultiSelectionEnabled?: boolean;
  cellSelectable: boolean;
  cellSelected: boolean;
  checkboxColumn?: any;
  collapsed?: boolean;
  computedColspan?: number;
  computedRowspan?: number;
  columnIndex: number;
  columnResizeHandleWidth?: number | string;
  computedLocked?: false | 'start' | 'end';
  computedWidth: number;
  data: any | any[];
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
    depth: number;
    collapsed?: boolean;
  };
  hasBottomSelectedSibling?: boolean;
  hasLeftSelectedSibling?: boolean;
  hasLockedStart?: boolean;
  hasRightSelectedSibling?: boolean;
  hasTopSelectedSibling?: boolean;
  header?: any;
  headerAlign?: 'start' | 'center' | 'end';
  headerCell: boolean;
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
  id: number | string;
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
  onCellSelectionDraggerMouseDown?: func;
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
  renderSortTool?: func;
  computedResizable?: boolean;
  lockable?: boolean;
  resizeProxyStyle?: object;
  rowActive?: boolean;
  rowHeight?: number;
  initialRowHeight?: number;
  rowIndex: number;
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
  value: any;
  virtualizeColumns: boolean;
  visibilityTransitionDuration?: boolean | number;
  computedVisible: boolean;
  computedVisibleCount: number;
  computedVisibleIndex: number;
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
  theme: string;
  onContextMenu?: () => void;
  showContextMenu?: (menuTool: any, onHide: any) => void;
  setActiveIndex?: func;
  renderColumnReorderProxy?: (props: any) => void;
};

export type EnhancedCellProps = CellProps & {
  editProps?: {
    inEdit: boolean;
    startEdit: func;
    value: any;
    gotoNext: () => void;
    gotoPrev: () => void;
    onTabNavigation: () => void;
  };
  className?: string;
};

export type CellRenderObject = {
  empty: boolean;
  value: any;
  data: any;
  cellProps: EnhancedCellProps;
  columnIndex: number;
  treeColumn: boolean;
  rowIndex: number;
  remoteRowIndex: number;
  rowIndexInGroup: number;
  rowSelected: boolean;
  rowExpanded: boolean;
  nodeProps: any;
  setRowSelected: any;
  setRowExpanded: any;
  toggleGroup: (event: any) => void;
  toggleRowExpand: any;
  toggleNodeExpand: any;
  loadNodeAsync?: () => void;
  isRowExpandable: (rowInfo: {
    id: string | number;
    data: object;
    rowIndex: number;
  }) => boolean;
  totalDataCount: number;
  rendersInlineEditor: boolean;
};
