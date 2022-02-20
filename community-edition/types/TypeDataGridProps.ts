/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  ReactNode,
  Dispatch,
  SetStateAction,
  MutableRefObject,
  ReactPortal,
  CSSProperties,
} from 'react';

import { TypeSortInfo } from './TypeSortInfo';
import { TypeGroupBy } from './TypeGroupBy';
import { TypeSize } from './TypeSize';
import {
  TypeColumn,
  TypeComputedColumn,
  TypeComputedColumnsMap,
  TypeSummaryReducer,
  IColumn,
  TypeColumnGroup,
  TypeColumns,
} from './TypeColumn';
import { TypeDataSource } from './TypeDataSource';
import {
  TypeComputeTreeData,
  TypeComputeTreeDataParam,
} from './TypeComputeTreeData';
import {
  TypeFilterValue,
  TypeFilterTypes,
  TypeSingleFilterValue,
} from './TypeFilterValue';
import { TypePaginationProps } from './TypePaginationProps';
import {
  TypeShowCellBorders,
  TypeRowProps,
  TypeLockedRow,
  TypeCollapsedGroups,
  TypeShowGroupSummaryRow,
  TypeBatchUpdateQueue,
  TypeCellProps,
  TypeGetColumnByParam,
  TypeExpandedRows,
  TypeCollapsedRows,
  TypeDetailsGridInfo,
  TypeExpandedNodes,
  TypeNodeCache,
  TypeNodeProps,
  TypeEditInfo,
  TypeDataSourceCache,
  TypeStickyRows,
  TypeFooterRow,
  TypePivotItem,
  TypePivotColumnSummaryReducer,
  TypeExpandedGroups,
} from '.';
import {
  TypeRowSelection,
  TypeCellSelection,
  TypeRowUnselected,
} from './TypeSelected';
import Renderable from './TypeRenderable';

export type TypeBuildColumnsProps = {
  groups: any;
  checkboxColumn: any;
  groupBy: any;
  groupColumn: any;
  rowIndexColumn: any;
  enableRowExpand: any;
  expandedRows: any;
  maybeAddColumns: any;
  defaultExpandedRows: any;
  renderRowDetails: any;
  renderDetailsGrid: any;
  rowExpandColumn: any;
  onRowReorder?: TypeRowReorder;
  rowReorderColumn?: IColumn;
};
type TypeI18n = { [key: string]: string | ReactNode };

type TypeNumberMap = { [key: string]: number };
type TypeBoolMap = { [key: string]: boolean };

export type TypeOnSelectionChangeArg = {
  selected: TypeRowSelection;
  data?: object;
  unselected?: TypeRowSelection;
};
export type TypeRowDetailsInfo = {
  id: string | number;
  data: object;
  rowSelected: boolean;
  rowActive: boolean;
  rowExpanded: boolean;
  rowId: any;
  dataSource: object[];
  rowIndex: number;
  toggleRowExpand: () => void;
};

type TypeRowReorderParam = {
  dragRowIndex?: number;
  insertRowIndex?: number;
};

type TypeRenderLockedCells = (arg: {
  rtl: boolean;
  scrollLeft: number;
  getLockedEndWrapperTranslate: any;
  groupProps: any;
  expandGroupTitle: any;
  lockedEndColumns: TypeColumn[];
  nativeScroll: boolean;
  scrollbarWidth: number;
  isHeader: boolean;
  virtualListBorderLeft: any;
  virtualListBorderRight: any;
  sticky: boolean;
  style: CSSProperties;
  addTransitionDuration: any;
  lockedEndContent: any;
  initialCells: any[];
  hasRowDetails: boolean;
  initialRowHeight?: number;
  lockedEndStartIndex: number;
  availableWidth: number;
  virtualizeColumns: number | boolean;
}) => Renderable;

export type TypeRowReorderFn = ({
  dragRowIndex,
  insertRowIndex,
}: TypeRowReorderParam) => void;

export type TypeRowReorder = TypeRowReorderFn | boolean;
export type TypeRowExpandHeightFunction = ({ data }: { data: any }) => number;

export type EnumRowDetailsWidth =
  | 'max-viewport-width'
  | 'min-viewport-width'
  | 'viewport-width';

type TypeGridPublicAPI = any;

type TypeDataGridPropsNoI18n = {
  filteredRowsCount?: (filteredRows: number) => void;
  renderRow?: (rowProps: {
    id?: string | number;
    data?: any;
    rowIndex: number;
    rowSelected: boolean;
    active: boolean;
  }) => React.ReactNode | undefined;
  filterable?: boolean;
  disableGroupByToolbar?: boolean;
  onReady?: (
    computedPropsRef: MutableRefObject<TypeComputedProps | null>
  ) => void;
  handle?: (gridApiRef: MutableRefObject<TypeComputedProps | null>) => void;
  isBinaryOperator: (operator: string) => boolean;
  sortFunctions: {
    [key: string]: (...args: any[]) => number | boolean;
  } | null;
  renderInPortal?: (el: ReactNode) => ReactPortal;
  editStartEvent: string;
  onSkipChange?: (skip: number) => void;
  onLimitChange?: (limit: number) => void;
  clearNodeCacheOnDataSourceChange: boolean;
  clearDataSourceCacheOnChange: boolean;
  allowGroupSplitOnReorder: boolean;
  isExpandKeyPressed: ({ event }: { event: any }) => boolean;
  generateIdFromPath: boolean;
  selectNodesRecursive: boolean;
  headerHeight?: number;
  renderRowContextMenu?: (
    menuProps: any,
    details: {
      rowProps: TypeRowProps;
      cellProps: TypeCellProps;
      grid: TypeGridPublicAPI;
      computedProps: TypeComputedProps;
      computedPropsRef: MutableRefObject<TypeComputedProps>;
    }
  ) => any;
  collapseChildrenOnAsyncNodeCollapse: boolean;
  collapseChildrenRecursive: boolean;
  isCollapseKeyPressed: ({ event }: { event: any }) => boolean;
  isStartEditKeyPressed: ({ event }: { event: any }) => boolean;
  columnContextMenuPosition?: string;
  columnContextMenuAlignPositions?: string[];
  rowExpandHeight: number | TypeRowExpandHeightFunction;
  columnUserSelect: true | false | 'text' | 'none';
  columnHeaderUserSelect: true | false | 'text' | 'none';
  multiRowExpand: boolean;
  growExpandHeightWithDetails: boolean;
  enableRowExpand?: boolean;
  stickyGroupRows?: boolean;
  stickyTreeNodes?: boolean;
  licenseKey?: string;
  updateMenuPositionOnScroll?: boolean;
  unexpandableRows?: { [key: string]: boolean };
  rowDetailsWidth: EnumRowDetailsWidth;
  onSortInfoChange?: (sortInfo: TypeSortInfo) => void;
  onEditStop?: (editInfo: TypeEditInfo) => void;
  onEditStart?: (editInfo: TypeEditInfo) => void;
  onEditComplete?: (editInfo: TypeEditInfo) => void;
  onEditCancel?: (editInfo: TypeEditInfo) => void;
  onEditValueChange?: (editInfo: TypeEditInfo) => void;
  initialState?: any;
  rtl: boolean;
  skipLoadOnMount?: boolean;
  initialScrollLeft?: number;
  initialScrollTop?: number;
  treeColumn?: string;
  treeNestingSize: number;
  treeEnabled?: boolean;
  contain?: string;
  rowContain?: string;
  onScroll?: () => void;
  onRowCollapse?: ({
    data,
    id,
    index,
  }: {
    data: object;
    id: string | number | null;
    index: number;
  }) => boolean;
  onRowExpand?: ({
    data,
    id,
    index,
  }: {
    data: object;
    id: string | number | null;
    index: number;
  }) => boolean;
  onRowExpandChange?: ({
    expandedRows,
    collapsedRows,
    data,
    id,
    index,
    rowExpanded,
  }: {
    rowExpanded: boolean;
    expandedRows: { [key: string]: boolean } | true | undefined;
    collapsedRows: { [key: string]: boolean } | true | undefined;
    data: object;
    id: string | number | null;
    index: number;
  }) => boolean;
  onExpandedRowsChange?: ({
    expandedRows,
    collapsedRows,
    data,
    id,
    index,
    rowExpanded,
  }: {
    rowExpanded: boolean;
    expandedRows: { [key: string]: boolean } | true | undefined;
    collapsedRows: { [key: string]: boolean } | true | undefined;
    data: object | null;
    id: string | number | null;
    index: number | undefined;
  }) => boolean;
  isRowExpandable?: (rowInfo: {
    id: string | number;
    data: object;
    rowIndex: number;
  }) => boolean;
  onDataSourceCacheChange?: (
    dataSourceCache: TypeDataSourceCache,
    info?: { itemId: string | number; item: object }
  ) => void;
  onColumnVisibleChange?: ({
    column,
    visible,
  }: {
    column: TypeColumn;
    visible: boolean;
  }) => void;
  emptyText?: ReactNode;
  groupForGroupColumns?: string;
  rowHeights?: { [key: string]: number };
  defaultRowHeights?: { [key: string]: number };
  onRowHeightsChange?: (rowHeights: { [key: string]: number }) => void;
  renderRowDetails?: (rowDetailsInfo: TypeRowDetailsInfo) => ReactNode;
  renderDetailsGrid?: (
    rowDetailsInfo: TypeRowDetailsInfo,
    detailsProps: any
  ) => ReactNode;
  renderColumnContextMenu?: (
    menuProps: any,
    other: {
      cellProps: TypeCellProps;
      grid: TypeGridPublicAPI;
      computedProps: TypeComputedProps;
      computedPropsRef: MutableRefObject<TypeComputedProps | null>;
    }
  ) => ReactNode | undefined;
  onNodeCollapse?: (args: {
    nodeProps: TypeNodeProps;
    node: any;
    data: any;
    index: number;
    id: string | number;
  }) => boolean | undefined;
  onNodeExpand?: (args: {
    nodeProps: TypeNodeProps;
    node: any;
    data: any;
    index: number;
    id: string | number;
  }) => boolean | undefined;
  onNodeExpandChange?: (args: {
    expandedNodes: TypeExpandedNodes | undefined;
    nodeProps: TypeNodeProps;
    nodeExpanded: boolean;
    node: any;
    data: any;
    index: number;
    id: string | number;
  }) => boolean | undefined;
  onExpandedNodesChange?: (args: {
    expandedNodes: { [key: string]: boolean } | undefined;
    nodeProps: TypeNodeProps;
    nodeExpanded: boolean;
    node: any;
    data: any;
    id: string | number;
    index: number;
  }) => void;

  isNodeExpandable?: (args: {
    id: string | number;
    data: any;
    rowIndex: number;
    nodeProps: TypeNodeProps;
    node: any;
  }) => boolean;
  isNodeAsync?: (args: { node: any; nodeProps: TypeNodeProps }) => boolean;
  isNodeLeaf?: (args: { node: any; nodeProps: TypeNodeProps }) => boolean;
  unexpandableNodes?: { [key: string]: boolean };
  cellSelectionByIndex: boolean;
  showFilteringMenuItems?: boolean;
  columnContextMenuConstrainTo?: any;
  rowContextMenuConstrainTo?: any;
  showColumnMenuSortOptions: boolean;
  showColumnMenuLockOptions: boolean;
  showColumnMenuFilterOptions: boolean;
  showColumnMenuGroupOptions: boolean;
  columnFilterContextMenuPosition: string;
  columnFilterContextMenuConstrainTo:
    | boolean
    | HTMLElement
    | string
    | ((...args: any[]) => HTMLElement);
  showColumnMenuTool?: boolean;
  showColumnMenuToolOnHover?: boolean;
  idProperty: string;
  showWarnings: boolean;
  livePaginationLoadNextDelay: boolean | number;
  livePaginationLoadMaskHideDelay: number;
  checkResizeDelay: number;
  checkboxSelectEnableShiftKey: boolean;
  preventDefaultTextSelectionOnShiftMouseDown: boolean;
  preventRowSelectionOnClickWithMouseMove: boolean;
  autoFocusOnEditComplete: boolean;
  autoFocusOnEditEscape?: boolean;
  groups?: TypeColumnGroup[];
  activateRowOnFocus: boolean;
  autoCheckboxColumn: boolean;
  hideGroupByColumns: boolean;
  expandGroupTitle: boolean;
  expandColumn?: ({ data }: { data: any }) => string | undefined;
  toggleRowSelectOnClick: boolean;
  toggleCellSelectOnClick: boolean;
  focusedClassName?: string;
  pivot?: TypePivotItem[];
  groupNestingSize: number;
  columnReorderScrollByAmount: number;
  rowReorderScrollByAmount: number;
  reorderProxySize: number;
  showGroupSummaryRow?: TypeShowGroupSummaryRow;
  groupToString?: (obj: any) => string;
  groupSummaryReducer?: TypeSummaryReducer;
  summaryReducer?: TypeSummaryReducer;

  renderGroupTitle?: (
    value: string,
    rowProps: {
      data: {
        keyPath: string[];
        fieldPath: string[];
        array: any[];
      };
    }
  ) => string | ReactNode;

  renderGroupTool?: (
    domProps: any,
    {
      collapsed,
      toggleGroup,
    }: { collapsed: boolean; toggleGroup: (group: any) => boolean }
  ) => string | ReactNode;
  groupPathSeparator: string;
  nodePathSeparator: string;
  nodesProperty: string;

  rowClassName?: string | ((...args: any[]) => string | undefined);
  lockedRowClassName?: string | ((...args: any[]) => string | undefined);
  lockedRowCellClassName?: string | ((...args: any[]) => string | undefined);
  footerRowClassName?: string | ((...args: any[]) => string | undefined);
  footerCellClassName?: string | ((...args: any[]) => string | undefined);
  className?: string;
  rowStyle?:
    | { [key: string]: string | number }
    | ((...args: any[]) => any | undefined);
  lockedRowStyle?:
    | { [key: string]: string | number }
    | ((...args: any[]) => any | undefined);
  footerRowStyle?:
    | { [key: string]: string | number }
    | ((...args: any[]) => any | undefined);
  lockedRowCellStyle?:
    | { [key: string]: string | number }
    | ((...args: any[]) => any | undefined);
  footerCellStyle?:
    | { [key: string]: string | number }
    | ((...args: any[]) => any | undefined);

  activeCell?: [number, number] | null;
  detailsGridCacheKey: any;
  defaultActiveCell?: [number, number] | null;
  onActiveCellChange?: (activeCell: [number, number] | null) => void;
  checkboxOnlyRowSelect: boolean;
  useRowHeightForLockedRows?: boolean;

  lockedRows?: TypeLockedRow[];
  footerRows?: TypeFooterRow[];
  columnMinWidth?: number;
  columnMaxWidth?: number;
  columnDefaultWidth?: number;
  context?: React.Context<{
    state: object;
  }>;

  onDidMount?: (
    computedPropsRef: MutableRefObject<TypeComputedProps | null>
  ) => void;
  onDetailsDidMount?: (
    computedPropsRef: MutableRefObject<TypeComputedProps | null>
  ) => void;
  onWillUnmount?: (
    computedPropsRef: MutableRefObject<TypeComputedProps | null>
  ) => void;
  onDetailsWillUnmount?: (
    computedPropsRef: MutableRefObject<TypeComputedProps | null>
  ) => void;
  __parentRowInfo?: any;

  onSelectionChange?: (config: TypeOnSelectionChangeArg) => void;
  onCellSelectionChange?: (value: { [key: string]: boolean }) => void;
  keyPageStep: number;
  activeIndex?: number;
  multiSelect?: boolean;
  defaultActiveIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onRowClick?: (rowProps: TypeRowProps, event: MouseEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  selected?: TypeRowSelection;
  collapsedGroups?: TypeCollapsedGroups;
  expandedGroups?: TypeExpandedGroups;
  defaultCollapsedGroups?: TypeCollapsedGroups;
  defaultExpandedGroups?: TypeExpandedGroups;
  rowProps?: any;
  defaultSelected?: TypeRowSelection;
  unselected?: TypeBoolMap;
  defaultUnselected?: TypeBoolMap;
  enableSelection?: boolean;
  enableKeyboardNavigation: boolean;
  virtualized: boolean;
  virtualizeColumns?: boolean;
  virtualizeColumnsThreshold: number;
  columnResizeHandleWidth: number;
  rowResizeHandleWidth?: number;
  columnResizeProxyWidth: number;
  rowHeight: number | ((rowIndex: number) => number);
  minRowHeight?: number;
  maxRowHeight?: number;
  checkboxColumn?: IColumn | boolean;
  rowExpandColumn?: IColumn | boolean;
  rowIndexColumn?:
    | (IColumn & {
        renderIndex?: (index: number) => ReactNode;
      })
    | boolean;
  groupColumn?: IColumn | boolean;
  pivotGrandSummaryColumn?: IColumn | boolean;
  cellSelection?: TypeCellSelection;
  defaultCellSelection?: TypeCellSelection;
  columns: TypeColumn[];
  showZebraRows?: boolean;
  showHoverRows?: boolean;
  showPivotSummaryColumns?: boolean;
  defaultShowZebraRows?: boolean;
  defaultShowHoverRows?: boolean;
  showEmptyRows?: boolean;
  defaultShowEmptyRows?: boolean;
  resizable?: boolean;
  showHeader?: boolean;
  allowUnsort: boolean;
  sortable?: boolean;
  editable?: boolean;
  showCellBorders?: TypeShowCellBorders;
  useNativeFlex?: boolean;
  updateLockedWrapperPositions?: (arg: any[]) => any;
  onColumnLockedChange?: ({
    column,
    locked,
  }: {
    column: TypeColumn;
    locked: 'start' | 'end' | false;
  }) => void;
  onBatchColumnResize?: (
    info: { column: TypeColumn; width?: number; flex?: number }[],
    { reservedViewportWidth }: { reservedViewportWidth: number }
  ) => void;
  onColumnResize?: (
    {
      column,
      width,
      flex,
    }: { column: TypeColumn; width?: number; flex?: number },
    { reservedViewportWidth }: { reservedViewportWidth: number }
  ) => void;
  onNodeCache?: (
    nodeCache: TypeNodeCache,
    info?: { nodeId: string | number; node: object }
  ) => void;
  loadNode?: ({
    node,
    nodeProps,
  }: {
    node: object;
    nodeProps: TypeNodeProps;
  }) => object[] | Promise<object[]>;
  loadNodeOnce?: ({
    node,
    nodeProps,
  }: {
    node: object;
    nodeProps: TypeNodeProps;
  }) => object[] | Promise<object[]>;
  onGroupByChange?: (groupBy: string[]) => void;
  skip?: number;
  defaultSkip?: number;
  limit?: number;
  defaultLimit?: number;
  theme?: string;
  style?: { [key: string]: string | number };
  scrollTopOnFilter?: boolean;
  scrollTopOnSort?: boolean;
  scrollTopOnGroupBy?: boolean;

  parentComputedProps?: TypeComputedProps;
  renderColumnFilterContextMenu?: (
    menuProps: any,
    {
      cellProps,
      grid,
      props,
    }: {
      cellProps: TypeCellProps;
      grid: MutableRefObject<TypeComputedProps | null>;
      props: TypeComputedProps;
    }
  ) => ReactNode;

  columnFilterContextMenuAlignPositions?: string[];

  sortInfo?: TypeSortInfo;
  defaultSortInfo?: TypeSortInfo;

  groupBy?: TypeGroupBy;
  defaultGroupBy?: TypeGroupBy;

  dataSource: TypeDataSource;
  pagination?: true | false | 'remote' | 'local';
  onUpdateRowHeights?: (
    heights: { [key: number]: number },
    computedProps: TypeComputedProps
  ) => void;
  expandedRows?: TypeExpandedRows | undefined;
  defaultExpandedRows?: TypeExpandedRows | undefined;
  expandedNodes?: TypeExpandedNodes | undefined;
  defaultExpandedNodes?: TypeExpandedNodes | undefined;
  nodeCache?: TypeNodeCache | undefined;
  defaultNodeCache?: TypeNodeCache | undefined;
  collapsedRows?: TypeCollapsedRows | undefined;
  defaultCollapsedRows?: TypeCollapsedRows | undefined;

  livePagination?: boolean;
  remoteSort?: boolean;
  remoteFilter?: boolean;
  remotePagination?: boolean;
  loading?: boolean;
  shareSpaceOnResize: boolean;
  nativeScroll: boolean;
  enableFiltering?: boolean;
  filterValue?: TypeFilterValue;
  defaultFilterValue?: TypeFilterValue;
  filterTypes?: TypeFilterTypes;
  renderLoadMask?: (loasMaskProps: {
    visible: boolean;
    livePagination: boolean;
    loadingText: ReactNode | (() => ReactNode);
    zIndex: number;
  }) => ReactNode | null;
  scrollProps?: any;
  loadingText?: ReactNode | (() => ReactNode);

  menuPortalContainer?: string | Element;

  onGroupCollapseChange?: (
    collapsedGroups: TypeCollapsedGroups,
    expandedGroups: TypeExpandedGroups
  ) => void;

  onColumnFilterValueChange?: (columnFilterValue: {
    filterValue: TypeSingleFilterValue;
    columnId: string;
    columnIndex: number;
    cellProps?: TypeCellProps;
  }) => void;
  onFilterValueChange?: (filterValue: TypeFilterValue) => void;

  sorty?: (sortInfo: TypeSortInfo, data: any[]) => void;

  rowReorderColumn?: IColumn | boolean;
  onRowReorder?: TypeRowReorder;
  allowRowReoderBetweenGroups?: boolean;
  renderRowReorderProxy?: ({
    data,
    dataSource,
    dragRowIndex,
  }: {
    data: any;
    dataSource: TypeDataSource;
    dragRowIndex: number;
  }) => void;
  isRowReorderValid?: ({
    dragRowIndex,
    dropRowIndex,
    dragRowData,
    dropRowData,
  }: {
    dragRowIndex: number;
    dropRowIndex: number;
    dragRowData: any;
    dropRowData: any;
  }) => void;
  updateMenuPositionOnColumnsChange?: boolean;
  reorderColumns?: boolean;
  renderColumnReorderProxy?: (props: any) => void;
  columnOrder?: string[];
  onColumnOrderChange?: (columnOrder: string[]) => void;
  renderMenuTool?: (props: {
    className: string;
    width: number;
    height: number;
  }) => Element | ReactNode;
  renderPaginationToolbar?: (props: TypePaginationProps) => Element | ReactNode;
  renderSortTool?: (direction: -1 | 0 | 1, extraProps: any) => void;
  enableClipboard?: boolean;
  onCopySelectedCellsChange?: (cells: any) => void;
  onPasteSelectedCellsChange?: (cells: any) => void;
  onCopyActiveRowChange?: (row: any) => void;
  onPasteActiveRowChange?: (row: any) => void;
  pageSizes?: number[];
  onCellClick?: (event: MouseEvent, cellProps: TypeCellProps) => void;
  enableTreeRowReorder?: boolean;
  enableTreeRowReorderNestingChange?: boolean;
  enableTreeRowReorderParentChange?: boolean;
  showActiveRowIndicator?: boolean;
  activeRowIndicatorClassName?: string;
  onTreeRowReorderEnd?: ({
    updatedTreeData,
  }: {
    updatedTreeData: any[];
  }) => void;
  enableColumnAutosize?: boolean;
  getRows?: () => void;
  getHeader?: () => void;
  skipHeaderOnAutoSize?: boolean;
  enableColumnHover?: boolean;
  viewportSize?: TypeSize;
  columnHoverClassName?: string;
  idPropertySeparator: string;
};
type TypeDataGridComputedClashingProps = {
  i18n?: TypeI18n;
};

export type TypeDataGridProps = TypeDataGridPropsNoI18n &
  TypeDataGridComputedClashingProps;

export type TypePivotUniqueValuesDescriptor = {
  field: string | null;
  values: { [key: string]: TypePivotUniqueValuesDescriptor } | null;
};
export type TypeComputedProps = TypeDataGridPropsNoI18n & {
  filteredRowsCount?: (filteredRows: number) => number;
  dataCountAfterFilter?: number;
  computedLastActiveIndex: number | null;
  doSetLastActiveIndex: (lastActiveIndex: number | null) => void;
  columnContextMenuInstanceProps?: any;
  rowReorderAutoScroll?: boolean;
  rowReorderArrowStyle?: CSSProperties;
  rowReorderAutoScrollSpeed?: number;
  computedPivotUniqueValuesPerColumn: TypePivotUniqueValuesDescriptor;
  computedLicenseValid?: boolean;
  initialProps: TypeDataGridProps;
  availableWidthForColumns: number;
  reservedViewportWidth: number;
  size: TypeSize;
  maxVisibleRows: number;
  visibleColumns: TypeComputedColumn[];
  allColumns: TypeComputedColumn[];
  totalColumnCount: number;
  totalComputedWidth: number;
  columnWidthPrefixSums: number[];
  totalLockedStartWidth: number;
  totalLockedEndWidth: number;
  totalUnlockedWidth: number;
  gridId: number;

  collapsedRows?: TypeCollapsedRows;
  defaultCollapsedRows?: TypeCollapsedRows;
  expandedRows?: TypeExpandedRows;
  defaultExpandedRows?: TypeExpandedRows;

  computedGroupBy?: TypeGroupBy;
  computedStickyRows?: TypeStickyRows;
  minColumnsSize: number;
  minRowWidth?: number;
  maxAvailableWidthForColumns: number;
  viewportAvailableWidth: number;

  data: any[];
  originalData: any[];
  skip?: number;
  computedSkip: number;
  limit?: number;
  computedLimit: number;
  setSkip?: (skip: number) => void;
  setLimit?: (limit: number) => void;
  columnsMap: TypeComputedColumnsMap;
  visibleColumnsMap: TypeComputedColumnsMap;
  getItemId: (item: object) => any;
  getItemAt: (index: number) => any;
  getItemIdAt: (index: number) => any;
  getItemIndex: (id: string | number) => number;
  i18n: (key: string, defaultValue?: string) => string | ReactNode;
  rowHeightManager: any;
  computedSortInfo: TypeSortInfo;
  setSortInfo: (sortInfo: TypeSortInfo) => void;
  groupCounts: [];
  computedShowEmptyRows: boolean;
  computedShowZebraRows: boolean;
  computedShowHoverRows: boolean;
  setShowEmptyRows: Dispatch<SetStateAction<boolean>>;
  setShowZebraRows: Dispatch<SetStateAction<boolean>>;
  setShowHoverRows: Dispatch<SetStateAction<boolean>>;
  showHorizontalCellBorders: boolean;
  showVerticalCellBorders: boolean;
  hasLockedStart: boolean;
  hasLockedEnd: boolean;
  hasUnlocked: boolean;
  firstLockedStartIndex: number;
  firstLockedEndIndex: number;
  firstUnlockedIndex: number;
  lastLockedStartIndex: number;
  lastUnlockedIndex: number;
  lastLockedEndIndex: number;
  computedOnColumnResize: ({
    index,
    groupColumns,
    diff,
  }: {
    index: number;
    groupColumns: any[];
    diff: number;
  }) => void;
  computedLoading: boolean;
  computedLivePagination: boolean;
  computedRemotePagination: boolean;
  computedRemoteFilter: boolean;
  remoteSort: boolean;
  computedLocalPagination: boolean;
  computedPagination: boolean;
  paginationProps?: TypePaginationProps;
  computedShowCellBorders: TypeShowCellBorders;
  setShowCellBorders: Dispatch<SetStateAction<boolean>>;
  computedShowHeader: boolean;
  computedIsMultiSort: boolean;
  computedRemoteData: boolean;
  toggleColumnSort: (colId: any) => void;
  setColumnSortInfo: (
    column:
      | string
      | number
      | { id: string | number; name?: string | number }
      | { name: string | number; id?: string | number },
    dir: 1 | 0 | -1
  ) => void;
  unsortColumn: (
    column:
      | string
      | number
      | { id: string | number; name?: string | number }
      | { name: string | number; id?: string | number }
  ) => void;
  setShowHeader: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  silentSetData: Dispatch<SetStateAction<any[]>>;
  setOriginalData: Dispatch<SetStateAction<any[]>>;
  loadNextPage?: () => void;
  computedFilterValue: TypeFilterValue;
  computedFilterValueMap: {
    [key: string]: TypeSingleFilterValue;
  } | null;
  loadDataTrigger: string[];
  computedActiveIndex: number;
  setColumnFlexes: Dispatch<SetStateAction<string[]>>;
  setColumnSizes: Dispatch<SetStateAction<string[]>>;
  onBatchColumnResize: (
    info: { column: TypeColumn; width?: number; flex?: number }[],
    { reservedViewportWidth }: { reservedViewportWidth: number }
  ) => void;
  setLoadDataTrigger: Dispatch<SetStateAction<string[]>>;
  setActiveIndex: (activeIndex: number) => void;
  incrementActiveIndex: (inc: number) => void;
  setReservedViewportWidth: Dispatch<SetStateAction<number>>;
  computedFilterable: boolean;
  computedHasRowNavigation: boolean;
  bodyRef: MutableRefObject<any>;
  columnFlexes: TypeNumberMap;
  columnSizes: TypeNumberMap;
  virtualizeColumns: boolean;
  domRef: MutableRefObject<HTMLElement>;
  computedShowHeaderBorderRight: boolean;
  setScrollLeft: (scrollLeft: number) => void;
  incrementScrollLeft: (scrollLeft: number) => void;
  getScrollLeft: () => number;
  getScrollLeftMax: () => number;
  setScrollTop: (scrollLeft: number) => void;
  incrementScrollTop: (scrollLeft: number) => void;
  getScrollTop: () => number;

  scrollToIndex: (
    index: number,
    config?: {
      top?: boolean;
      direction?: 'top' | 'bottom';
      force?: boolean;
      duration?: number;
      offset?: number;
    },
    callback?: (...args: any[]) => void
  ) => void;
  scrollToId: (
    id: string | number,
    config?: {
      top?: boolean;
      direction?: 'top' | 'bottom';
      force?: boolean;
      duration?: number;
      offset?: number;
    },
    callback?: (...args: any[]) => void
  ) => void;
  scrollToCell: (
    { rowIndex, columnIndex }: { rowIndex: number; columnIndex: number },
    {
      offset,
      left,
      right,
      top,
    }: {
      offset?: number;
      left?: boolean;
      right?: boolean;
      top?: boolean;
    }
  ) => void;
  scrollToColumn: (
    index: number,
    config: {
      offset?: number;
      duration?: number;
      force?: boolean;
      direction?: 'left' | 'right' | null;
    },
    callback?: (...args: any[]) => void
  ) => void;
  scrollToIndexIfNeeded: (
    index: number,
    config?: {
      top: boolean;
      direction?: 'top' | 'bottom';
      force?: boolean;
      duration?: number;
      offset?: number;
    },
    callback?: (...args: any) => any
  ) => boolean;
  getColumnBy: (
    idNameOrIndex:
      | string
      | number
      | TypeComputedColumn
      | { id: string | number; name?: string | number }
      | { name: string | number; id?: string | number },
    config?: { initial: boolean }
  ) => TypeComputedColumn | TypeColumn;
  computedFocused: boolean;

  computedSetFocused: Dispatch<SetStateAction<boolean>>;
  computedSelected: TypeRowSelection;
  computedUnselected: TypeRowUnselected;
  count: number;
  getActiveItem: () => any;
  getFirstVisibleIndex: () => number;
  isRowFullyVisible: (rowIndex: number) => boolean;
  isRowRendered: (rowIndex: number) => boolean;
  getRenderRange: () => { from: number; to: number };
  scrollbars: { vertical: boolean; horizontal: boolean };
  computedWillReceiveFocusRef: MutableRefObject<boolean>;
  computedOnKeyDown: (event: KeyboardEvent) => void;
  computedOnFocus: (event: FocusEvent) => void;
  computedOnRowClick: (event: MouseEvent, rowProps: TypeRowProps) => void;
  toggleActiveRowSelection: (event: KeyboardEvent) => void;
  computedRowSelectionEnabled: boolean;
  computedRowMultiSelectionEnabled: boolean;
  setSelected: (selected: TypeRowSelection, ...args: any[]) => void;
  setUnselected: Dispatch<SetStateAction<TypeRowUnselected>>;
  setGroupBy: (groupBy: TypeGroupBy) => void;
  setStickyGroupsIndexes?: (stickyGroupsIndexes: TypeStickyRows) => void;
  lastMouseDownEventPropsRef: MutableRefObject<any>;
  computedActiveCell?: [number, number] | null;

  computedCellSelection?: TypeCellSelection;
  setCellSelection: (cellSelection: TypeCellSelection) => void;
  computedCellSelectionEnabled: boolean;
  computedCellMultiSelectionEnabled: boolean;
  computedCellNavigationEnabled: boolean;

  isSelectionEmpty: () => boolean;
  getSelectedMap: () => { [key: string]: boolean };
  computedLockedRows: TypeLockedRow[];
  computedLockedStartRows: TypeLockedRow[];
  computedLockedEndRows: TypeLockedRow[];
  computedFooterRows: null | TypeFooterRow[];
  computedFooterLockedStartRows: TypeFooterRow[];
  computedFooterLockedEndRows: TypeFooterRow[];

  lockedStartColumns: TypeComputedColumn[];
  lockedEndColumns: TypeComputedColumn[];
  unlockedColumns: TypeComputedColumn[];
  computedCollapsedGroups: TypeCollapsedGroups;
  computedExpandedGroups: TypeExpandedGroups;
  isGroupCollapsed?: (group: any) => boolean;
  expandGroup?: (group: { keyPath: string[] } | string[]) => boolean;
  collapseGroup?: (group: { keyPath: string[] } | string[]) => boolean;
  setComputedGroupRelatedInfo: Dispatch<SetStateAction<any>>;
  computedColumnOrder: string[] | undefined;
  setColumnOrder: Dispatch<SetStateAction<string[] | undefined>>;
  computedIndexesInGroups?: any;

  computedGroupArray?: object[];
  computedGroupKeys?: { [key: string]: boolean };
  computedActiveItem: any;
  computedGroups?: TypeColumnGroup[];
  isGroup: (item: any) => boolean;
  toggleGroup: (group: any) => void;
  computedPivot?: string[];
  groupColumnSummaryReducers: {
    [key: string]: TypeSummaryReducer;
  };
  pivotColumnSummaryReducers: {
    [key: string]: TypePivotColumnSummaryReducer;
  };

  lockedColumnsState: { [key: string]: 'start' | 'end' | false };
  setLockedColumnsState: Dispatch<
    SetStateAction<{
      [key: string]: 'start' | 'end' | false;
    }>
  >;
  isRowSelected: (data: object | number) => boolean;
  paginationCount: number;
  computedUnselectedCount: number;
  computedSelectedCount: number;
  deselectAll: () => void;
  selectAll: () => void;
  getUnselectedCount: (unselected?: TypeRowUnselected) => number;
  getSelectedCount: (
    selected?: TypeRowSelection,
    unselected?: TypeRowUnselected
  ) => number;
  selectionIndexRef: MutableRefObject<number | null>;
  shiftKeyIndexRef: MutableRefObject<number | null>;
  dataMap: null | { [key: string]: any };
  setDataMap: (dataMap: null | { [key: string]: any }) => void;
  dataIndexMap: null | { [key: string]: number };
  setDataIndexMap: (dataMap: null | { [key: string]: number }) => void;
  setSelectedById: (
    id: string,
    selected: boolean,
    queue?: TypeBatchUpdateQueue
  ) => void;
  setSelectedAt: (
    index: number,
    selected: boolean,
    queue?: TypeBatchUpdateQueue
  ) => void;
  setRowSelected: (
    index: number,
    selected: boolean,
    event?: KeyboardEvent | MouseEvent
  ) => void;
  getDOMNode: () => HTMLDivElement;
  getMenuPortalContainer: () => HTMLDivElement | null;
  columnContextMenuProps: any;
  rowContextMenuProps: any;
  showColumnFilterContextMenu: (...args: any[]) => void;
  showColumnContextMenu: (...args: any[]) => void;
  showRowContextMenu: (...args: any[]) => void;
  hideColumnContextMenu: (...args: any[]) => void;
  hideRowContextMenu: (...args: any[]) => void;
  hideColumnFilterContextMenu: (...args: any[]) => void;
  setColumnContextMenuProps: (columnContextMenuProps: any) => void;
  setRowContextMenuProps: (rowContextMenuProps: any) => void;
  preventIEMenuCloseRef: MutableRefObject<boolean>;
  columnContextMenuInfoRef: MutableRefObject<{
    menuAlignTo: any;
    menuConstrainTo: any;
    menuOnHide: (...args: any[]) => void;
  }>;
  rowContextMenuInfoRef: MutableRefObject<{
    menuAlignTo: any;
    menuConstrainTo: any;
    menuOnHide: (...args: any[]) => void;
  }>;
  publicAPI: TypeGridPublicAPI;
  isColumnVisible: (nameOrId: TypeGetColumnByParam) => boolean;
  columnVisibilityMap: {
    [key: string]: boolean;
  };
  setColumnVisible: (
    indexOrColumn: TypeGetColumnByParam,
    visible: boolean
  ) => void;
  removeGroupByColumn: (column: TypeGetColumnByParam) => void;
  addGroupByColumn: (column: TypeGetColumnByParam) => void;
  getColumnsInOrder: () => TypeComputedColumn[];
  getMenuAvailableHeight: () => number;
  isFilterable: () => boolean;
  shouldShowFilteringMenuItems: () => boolean;
  setEnableFiltering: Dispatch<SetStateAction<boolean>>;
  setColumnLocked: (
    indexOrColumn: TypeGetColumnByParam,
    locked: 'start' | 'end' | true | false | null
  ) => void;
  getCellSelectionIdKey?: (
    rowIndex: number,
    columnIndex: number
  ) => string | number;
  getCellSelectionKey?: (
    cellProps: number | TypeCellProps | string,
    col?: TypeGetColumnByParam
  ) => string | number;
  setActiveCell: (
    activeCell: [number, number] | null,
    queue?: TypeBatchUpdateQueue
  ) => void;
  incrementActiveCell: (direction: [number, number]) => void;
  toggleActiveCellSelection: (fakeEvent?: {
    shiftKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
  }) => void;
  onCellClickAction: (
    event: { shiftKey?: boolean; metaKey?: boolean; ctrlKey?: boolean },
    cellProps: TypeCellProps
  ) => void;
  getCellSelectionBetween: (
    start?: [number, number] | null,
    end?: [number, number] | null
  ) => { [key: string]: boolean };
  getContinuousSelectedRangeFor: (
    selectionMap: { [key: string]: boolean },
    cell: any
  ) => [number, number][];
  lastCellInRange: string;
  setLastCellInRange: Dispatch<SetStateAction<string>>;
  lastSelectedCell: [number, number] | null;
  setLastSelectedCell: Dispatch<SetStateAction<[number, number] | null>>;
  listenOnCellEnter: boolean;
  setListenOnCellEnter: (
    value: boolean,
    callback: (...args: any[]) => void
  ) => void;
  cellDragStartRowIndex: number | null;
  setCellDragStartRowIndex: Dispatch<SetStateAction<number | null>>;
  isCellVisible: ({
    rowIndex,
    columnIndex,
  }: {
    rowIndex: number;
    columnIndex: number;
  }) =>
    | boolean
    | {
        topDiff: number;
        bottomDiff: number;
        leftDiff: number;
        rightDiff: number;
      };
  selectionFixedCell: [number, number] | null;
  setSelectionFixedCell: Dispatch<SetStateAction<[number, number] | null>>;
  onCellEnter:
    | ((
        event: any,
        { columnIndex, rowIndex }: { columnIndex: number; rowIndex: number }
      ) => void)
    | null;

  onCellSelectionDraggerMouseDown:
    | ((
        event: any,
        { columnIndex, rowIndex }: { columnIndex: number; rowIndex: number },
        selectionFixedCell?: [number, number] | null
      ) => void)
    | null;

  computedExpandedRows: TypeExpandedRows | undefined;
  computedExpandedNodes: TypeExpandedNodes | undefined;
  computedNodeCache: TypeNodeCache | undefined;
  computedCollapsedRows: TypeCollapsedRows | undefined;
  computedRowExpandEnabled: boolean;
  isRowExpandEnabled?: () => boolean;
  isRowExpandableAt?: (rowIndex: number) => boolean;
  isNodeExpandableAt?: (rowIndex: number) => boolean;
  isRowExpandableById?: (rowId: string | number) => boolean;
  getRowIndexById: (rowId: string | number, data?: any[]) => number;
  getItemIndexById: (rowId: string | number, data?: any[]) => number;
  getData: () => any[];
  getCollapsedMap: () => { [key: string]: boolean } | undefined;
  getExpandedMap: () => { [key: string]: boolean } | undefined;
  isRowExpanded: (data: object | number) => boolean;
  collapseAllRows?: () => void;
  expandAllRows?: () => void;
  isRowExpandedById?: (id: string | number) => boolean;
  setExpandedRows?: (expandedRows: TypeExpandedRows | undefined) => void;
  setCollapsedRows?: (collapsedRows: TypeCollapsedRows | undefined) => void;
  computedRowHeights?: { [key: string]: number };
  setRowHeights?: (rowHeights: { [key: string]: number }) => void;
  setLoadingNodes?: (loadingNodes: { [key: string]: boolean }) => void;
  setRowExpandedById?: (id: string | number, expanded: boolean) => void;
  setRowExpandedAt?: (index: number, expanded: boolean) => void;
  toggleRowExpand?: (dataOrIndex: string | number) => void;
  toggleRowExpandById?: (id: string | number) => void;
  setRowHeightById: (rowHeight: number | null, id: string | number) => void;
  getRowHeightById: (id: string | number) => number;
  detailsGridInfoRef: MutableRefObject<TypeDetailsGridInfo>;
  onDetailsUpdateRowHeights: (
    rowHeights: { [key: string]: number },
    childComputedProps: TypeComputedProps
  ) => void;
  useNativeFlex: boolean;
  getSelfRestoreProperties?: () => any;
  persistUnmountedDetails?: () => any;
  getState: () => any;
  setStateProperty: (name: string, value: any) => void;
  wasMountedRef: MutableRefObject<boolean>;
  wasUnmountedRef: MutableRefObject<boolean>;
  computedLoadingNodes?: { [key: string]: boolean };
  getNodeCache?: () => TypeNodeCache;
  appendCacheForNode?: (nodeId: string | number, node: object) => void;
  setNodeCache?: (
    nodeCache: TypeNodeCache,
    info?: { nodeId: string | number; node: object }
  ) => void;
  collapsingNodesRef: MutableRefObject<{ [key: string]: boolean }>;
  clearNodeChildrenCache: (
    nodeId: string | number,
    recursive: boolean,
    treeCache: TypeNodeCache | undefined,
    clearedMap?: { [key: string]: boolean },
    callback?: () => void
  ) => void;
  computedTreeEnabled: boolean;
  onGroupByChange?: (groupBy: TypeGroupBy) => void;
  onNextRender: (fn: (...args: any[]) => void) => void;
  rowResizeHandleRef: MutableRefObject<{
    setOffset: Dispatch<SetStateAction<number>>;
    setActive: Dispatch<SetStateAction<boolean>>;
    setHovered: Dispatch<SetStateAction<boolean>>;
    setConstrained: Dispatch<SetStateAction<boolean>>;
    setInitialWidth: Dispatch<SetStateAction<number>>;
  }>;
  coverHandleRef: MutableRefObject<{
    setActive: Dispatch<SetStateAction<boolean>>;
    setCursor: Dispatch<SetStateAction<string>>;
  }>;
  rowResizeIndexRef: MutableRefObject<number | null>;
  computedLoadNode?: ({
    node,
    nodeProps,
  }: {
    node: object;
    nodeProps: TypeNodeProps;
  }) => object[] | Promise<object[]>;
  toggleNodeExpand: (dataOrIndex: object | number) => void;
  computedOnColumnFilterValueChange?: (columnFilterValue: {
    filterValue: TypeSingleFilterValue;
    columnId: string;
    columnIndex: number;
    cellProps?: TypeCellProps;
  }) => void;
  isNodeExpanded?: (data: object | number) => boolean;
  setNodeExpandedAt?: (index: number, expanded: boolean) => void;
  setNodeExpandedById?: (id: string | number, expanded: boolean) => void;
  getColumnLayout: () => any;

  focus: () => void;
  blur: () => void;
  columnFilterContextMenuProps: any;
  columnFilterContextMenuAlignToRef: MutableRefObject<any>;
  clearAllFilters?: () => void;
  clearColumnFilter: (idNameOrIndex: TypeGetColumnByParam) => void;
  getColumnFilterValue: (
    idNameOrIndex: TypeGetColumnByParam
  ) => TypeSingleFilterValue;
  setColumnFilterValue: (column: TypeGetColumnByParam, value: any) => void;
  isColumnFiltered: (column: TypeGetColumnByParam) => boolean;
  computedFiltered?: boolean;
  getCurrentEditInfo?: () => TypeEditInfo | null;

  isLoading: () => boolean;
  computedDataSourceCache?: TypeDataSourceCache;
  setDataSourceCache: Dispatch<SetStateAction<TypeDataSourceCache | undefined>>;
  setItemPropertyAt: (index: number, property: string, value: any) => void;
  setItemPropertyForId: (
    id: string | number,
    property: string,
    value: any
  ) => void;
  setItemAt: (
    index: number,
    item: any,
    config?: {
      replace?: boolean;
      property?: string;
      value?: any;
      deepCloning?: boolean;
    }
  ) => void;
  setItemsAt: (items: any, config?: { replace?: boolean }) => void;
  activeRowRef: MutableRefObject<{ instance: any; node: HTMLElement } | null>;
  activeRowHeight: number;
  renderActiveRowIndicator: (handle: any) => ReactNode;
  renderInPortal: (el: ReactNode) => ReactPortal;
  reload: () => void;
  menusRef: MutableRefObject<any[]>;
  cellNavigationRef: MutableRefObject<any>;
  onScroll: () => void;
  updateMenuPositions: () => void;
  rtlOffset: number;
  getScrollingElement: () => HTMLElement;

  computedSummary: any;
  setSummary: Dispatch<SetStateAction<any>>;

  ungroupedData: any[];
  setUngroupedData: Dispatch<SetStateAction<any[]>>;
  getVirtualList: () => any;
  computedEnableRowspan: boolean;
  computeDataStep?: ({
    groupBy,
    config,
    computedProps,
    batchUpdateQueue,
    columnsMap,
  }: {
    groupBy: TypeGroupBy;
    config: any;
    columnsMap: TypeComputedColumnsMap;
    computedProps: TypeComputedProps;
    batchUpdateQueue: TypeBatchUpdateQueue;
  }) => any;

  useCellSelection: (
    props: TypeDataGridProps,
    arg: any,
    computedPropsRef: MutableRefObject<TypeComputedProps | null>
  ) => any;
  computeTreeData?: TypeComputeTreeData;
  edition: 'community' | 'enterprise';
  renderLockedStartCells: TypeRenderLockedCells;
  renderLockedEndCells: TypeRenderLockedCells;
  collapseAllGroups: () => void;
  expandAllGroups: () => void;
  maybeAddColumns?: (
    columns: TypeColumns,
    props: TypeBuildColumnsProps
  ) => TypeColumns;
  dataPromiseRef: MutableRefObject<Promise<any> | null>;
  hasNextPage: () => boolean;
  gotoNextPage: () => boolean;
  computedHasColSpan: boolean;
  updateMainMenuPosition?: (alignTo: any) => void;
  isInEdit?: any;
  availableWidth?: number;
  computedEnableColumnHover?: boolean;
  compoundIdProperty?: boolean;
};

export default TypeDataGridProps;

export { TypeComputeTreeData, TypeComputeTreeDataParam };
