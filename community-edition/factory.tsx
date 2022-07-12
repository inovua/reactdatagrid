/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  ReactNode,
  useContext,
  Dispatch,
  SetStateAction,
  ReactPortal,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import NotifyResize from './packages/react-notify-resize/src';
import uglified from './packages/uglified';
import useProperty from './hooks/useProperty';

import getScrollbarWidth from './packages/getScrollbarWidth';

import clamp from './utils/clamp';
import isMobile from './packages/isMobile';

import Layout from './Layout';
import LoadMask from './LoadMask';

import filterTypes from './filterTypes';
import useColumns from './hooks/useColumns';
import useSize from './hooks/useSize';

import useNamedState from './hooks/useNamedState';
import useHeader from './hooks/useHeader';
import useEditable from './hooks/useEditable';
import useDataSource from './hooks/useDataSource';
import useScrollProps from './hooks/useScrollProps';
import useColumnsSizing from './hooks/useColumnsSizing';

import useGroups from './hooks/useGroups';
import useSelection from './hooks/useSelection';
import useRow from './hooks/useRow';

import RowHeightManager from './packages/react-virtual-list-pro/src/RowHeightManager';

import { IS_MS_BROWSER, IS_FF } from './common/ua';

import {
  TypeDataGridProps,
  TypeComputedProps,
  TypeShowCellBorders,
  TypePlugin,
  TypeComputedColumn,
} from './types';

import prepareClassName from './utils/prepareClassName';

import { Provider } from './context';
import Cover from './Cover';

import useActiveIndex from './hooks/useActiveIndex';
import batchUpdate from './utils/batchUpdate';
import emptyPlugins from './plugins/empty';
import ActiveRowIndicator from './ActiveRowIndicator';

import { communityFeatureWarn } from './warn';
import { TypeBuildColumnsProps } from './types/TypeDataGridProps';
import { TypeColumns } from './types/TypeColumn';
import InovuaDataGridLayout from './Layout';
import { StickyRowsContainerClassName } from './packages/react-virtual-list-pro/src/StickyRowsContainer';
import { getGlobal } from './getGlobal';
import useColumnHover from './hooks/useColumnHover';

let GRID_ID = 0;
export type Props = {
  plugins?: Array<TypePlugin>;
};

const globalObject = getGlobal();

const DEFAULT_I18N = {
  // pagination toolbar
  pageText: 'Page ',
  ofText: ' of ',
  perPageText: 'Results per page',
  showingText: 'Showing ',

  clearAll: 'Clear all',
  clear: 'Clear',
  showFilteringRow: 'Show filtering row',
  hideFilteringRow: 'Hide filtering row',

  enable: 'Enable',
  disable: 'Disable',

  sortAsc: 'Sort ascending',
  sortDesc: 'Sort descending',
  unsort: 'Unsort',
  group: 'Group',
  ungroup: 'Ungroup',
  lockStart: 'Lock start',
  lockEnd: 'Lock end',
  unlock: 'Unlock',
  columns: 'Columns',
  autoresizeThisColumn: 'Autoresize this column',
  autoresizeAllColumns: 'Autoresize all columns',
  autoSizeToFit: 'Autosize to fit',

  // operators,
  contains: 'Contains',
  startsWith: 'Starts with',
  endsWith: 'Ends with',
  notContains: 'Does not contain',
  inlist: 'In list',
  notinlist: 'Not in list',
  neq: 'Does not equal',
  inrange: 'In range',
  notinrange: 'Not in range',
  eq: 'Equals',
  notEmpty: 'Not empty',
  empty: 'Empty',
  lt: 'Less than',
  lte: 'Less than or equal',
  gt: 'Greater than',
  gte: 'Greater than or equal',
  before: 'Before',
  beforeOrOn: 'Before or on',
  afterOrOn: 'After or on',
  after: 'After',
  start: 'Start',
  end: 'End',

  dragHeaderToGroup: 'Drag header to group',
  noRecords: 'No records available',

  // calendar
  'calendar.todayButtonText': 'Today',
  'calendar.clearButtonText': 'Clear',
  'calendar.okButtonText': 'OK',
  'calendar.cancelButtonText': 'Cancel',
};

const renderLoadMask = (props: {
  loadingText?: ReactNode | (() => ReactNode);
  theme?: string;
  computedLoading: boolean;
  computedLivePagination: boolean;
  renderLoadMask?: (loasMaskProps: {
    visible: boolean;
    livePagination: boolean;
    loadingText: ReactNode | (() => ReactNode);
    zIndex: number;
  }) => ReactNode | null;
}): ReactNode | null => {
  const loadMaskProps = {
    visible: props.computedLoading,
    livePagination: props.computedLivePagination,
    loadingText: props.loadingText || 'Loading',
    zIndex: 10000,
    theme: props.theme,
  };

  let loadMask;
  if (props.renderLoadMask) {
    loadMask = props.renderLoadMask(loadMaskProps);
  }

  if (loadMask !== undefined) {
    return loadMask;
  }

  return <LoadMask {...loadMaskProps} />;
};

type TypePluginsMap = { [key: string]: TypePlugin };

const reducePlugins = (
  acc: { [key: string]: TypePlugin },
  plugin: TypePlugin
) => {
  if (!plugin.name || typeof plugin.hook !== 'function') {
    return acc;
  }
  acc[plugin.name] = plugin;
  return acc;
};

const GridFactory = (
  { plugins }: Props = {},
  edition: 'community' | 'enterprise' = 'community'
) => {
  plugins = plugins || [];

  var maybeAddColumns: (
    columns: TypeColumns,
    props: TypeBuildColumnsProps
  ) => TypeColumns;

  const defaultSize = {
    width: 0,
    height: 0,
  };

  const emptyCoverHandle = {
    setActive: () => {},
    setCursor: () => {},
  };

  plugins = [...emptyPlugins, ...plugins];

  const pluginsMap = plugins.reduce(reducePlugins, {} as TypePluginsMap);

  const Grid = React.memo((props: TypeDataGridProps) => {
    const [computedFocused, computedSetFocused] = useState<boolean>(false);

    const computedPropsRef = useRef<TypeComputedProps | null>(null);
    const warnRef = useMemo(() => ({}), []);
    const context = useContext(props.context);

    useEffect(() => {
      if (computedFocused && props.activateRowOnFocus) {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
          return;
        }
        const { count } = computedProps;

        if (!count) {
          return;
        }
        const activeItem = computedProps.getActiveItem();

        if (!activeItem) {
          const index =
            computedProps.computedLastActiveIndex ||
            computedProps.getFirstVisibleIndex();
          computedProps.setActiveIndex(index);
        }
      }
    }, [computedFocused]);

    const bodyRef = useRef<InovuaDataGridLayout>(null);
    const domRef = useRef<HTMLDivElement>(null);
    const portalRef = useRef<HTMLDivElement>(null);

    const getDOMNode = (): HTMLDivElement | null => {
      return domRef.current;
    };

    const getBodyDOMNode = (): HTMLDivElement | null => {
      return bodyRef?.current?.getDOMNode();
    };

    const getVirtualList = () =>
      bodyRef.current != null ? bodyRef.current.getVirtualList() : null;
    const getColumnLayout = () =>
      bodyRef.current != null ? bodyRef.current.columnLayout : null;

    const getDefaultSize = () => {
      if (props.viewportSize) {
        return props.viewportSize;
      }

      return defaultSize;
    };

    const [computedLoading, doSetLoading] = useProperty<boolean>(
      props,
      'loading'
    );

    const loadingTimeoutIdRef = useRef<any>();

    const setLoading = (loading: boolean | ((loading: boolean) => boolean)) => {
      const computedProps = computedPropsRef.current;
      let isLoading: boolean =
        loading instanceof Function
          ? loading(computedProps ? computedProps.computedLoading : false)
          : loading;

      if (!computedProps) {
        doSetLoading(isLoading);
        return;
      }

      if (loadingTimeoutIdRef.current) {
        clearTimeout(loadingTimeoutIdRef.current);
      }

      if (
        computedProps.computedLivePagination &&
        !isLoading &&
        computedProps.livePaginationLoadMaskHideDelay
      ) {
        // wait when taking the mask off, since it might be needed really soon

        loadingTimeoutIdRef.current = setTimeout(() => {
          doSetLoading(isLoading);
          loadingTimeoutIdRef.current = null;
        }, computedProps.livePaginationLoadMaskHideDelay);
      } else {
        doSetLoading(isLoading);
      }
    };

    const [columnSizes, setColumnSizes] = useNamedState<any>(
      {},
      props.context!,
      'columnSizes'
    );
    const [columnFlexes, setColumnFlexes] = useNamedState<any>(
      {},
      props.context!,
      'columnFlexes'
    );
    const [lockedColumnsState, setLockedColumnsState] = useState<any>({});

    const [scrollbars, setScrollbars] = useState<{
      vertical: boolean;
      horizontal: boolean;
    }>({ vertical: false, horizontal: false });

    const [reservedViewportWidth, setReservedViewportWidth] = useProperty<
      number
    >(props, 'reservedViewportWidth', 0);
    const [size, setSize] = useSize(getDefaultSize());
    const [viewportAvailableWidth, setViewportAvailableWidth] = useState<
      number
    >(0);

    useEffect(() => {
      if (props.viewportSize) {
        setSize(props.viewportSize);
      }
    }, [props.viewportSize]);

    const onResize = (size: { width: number; height: number }) => {
      batchUpdate().commit(() => {
        if (IS_MS_BROWSER || IS_FF) {
          // FF and Edge display the horizontal scrollbar when not needed,
          // due to an offsetWidth misreporting - 2px - probably the left/right borders
          size.width -= 2;
        }
        setSize(size);
        updateViewportAvailableWidth(size.width);

        if (props.rowHeight) {
          setMaxVisibleRows(Math.ceil(size.height / props.rowHeight));
        }
      });
    };

    const updateViewportAvailableWidth = (
      newViewportAvailableWidth: number,
      scrolls: { vertical: boolean } = scrollbars
    ): void => {
      if (props.nativeScroll && scrolls.vertical) {
        newViewportAvailableWidth -= getScrollbarWidth();
      }

      setViewportAvailableWidth(Math.round(newViewportAvailableWidth));
    };

    const [
      { virtualListBorderLeft, virtualListBorderRight, virtualListExtraWidth },
      setVirtualListState,
    ] = useState<{
      virtualListBorderLeft: number;
      virtualListBorderRight: number;
      virtualListExtraWidth: number;
    }>({
      virtualListBorderLeft: 0,
      virtualListBorderRight: 0,
      virtualListExtraWidth: 0,
    });

    const onScrollbarsChange = (scrollbars: {
      vertical: boolean;
      horizontal: boolean;
    }) => {
      const onChange = () => {
        const computedStyle = globalObject.getComputedStyle(
          getVirtualList().getDOMNode()
        );
        const virtualListBorderLeft = parseInt(
          computedStyle.borderLeftWidth,
          10
        );
        const virtualListBorderRight = parseInt(
          computedStyle.borderRightWidth,
          10
        );
        const virtualListExtraWidth =
          virtualListBorderLeft + virtualListBorderRight;

        batchUpdate().commit(() => {
          setScrollbars(scrollbars);

          if (size.width) {
            updateViewportAvailableWidth(size.width, scrollbars);
          }
          setVirtualListState({
            virtualListBorderLeft,
            virtualListBorderRight,
            virtualListExtraWidth,
          });
        });
      };
      if (!bodyRef.current) {
        requestAnimationFrame(onChange);
      } else {
        onChange();
      }
    };

    const [computedShowCellBorders, setShowCellBorders] = useProperty<
      TypeShowCellBorders
    >(props, 'showCellBorders');

    const showHorizontalCellBorders =
      computedShowCellBorders === true ||
      computedShowCellBorders === 'horizontal';
    const showVerticalCellBorders =
      computedShowCellBorders === true ||
      computedShowCellBorders === 'vertical';

    const [listenOnCellEnter, updateListenOnCellEnter] = useState<boolean>(
      false
    );
    const [selectionFixedCell, setSelectionFixedCell] = useState<
      [number, number] | null
    >(null);

    const setListenOnCellEnter = (
      value: boolean,
      callback: (...args: any[]) => void
    ) => {
      if (value) {
        globalObject.addEventListener('mouseup', callback);
      } else {
        globalObject.removeEventListener('mouseup', callback);
      }

      updateListenOnCellEnter(value);
    };

    const renderCallbacks = useRef<((...args: any[]) => void)[]>([]);

    const onNextRender = (fn: (...args: any[]) => void) => {
      renderCallbacks.current.push(fn);
    };

    useEffect(() => {
      renderCallbacks.current.forEach(fn => fn());
      renderCallbacks.current.length = 0;
    });

    const [lastCellInRange, setLastCellInRange] = useState<string>('');
    const [lastSelectedCell, setLastSelectedCell] = useState<
      [number, number] | null
    >(null);

    const renderInPortal = useMemo(() => {
      return (
        props.renderInPortal ||
        ((el: ReactNode): ReactPortal | null =>
          portalRef.current ? createPortal(el, portalRef.current) : null)
      );
    }, [props.renderInPortal]);

    let cProps = {
      ...props,
      initialProps: props,
      selectionFixedCell,
      setSelectionFixedCell,
      bodyRef,
      domRef,
      portalRef,
      renderInPortal,

      listenOnCellEnter,
      setListenOnCellEnter,

      lastCellInRange,
      setLastCellInRange,
      setLastSelectedCell,
      lastSelectedCell,

      onScrollbarsChange,
      virtualListBorderLeft,
      virtualListBorderRight,
      virtualListExtraWidth,
      scrollbars,
      reservedViewportWidth,
      setReservedViewportWidth,
      getColumnLayout,
      getDOMNode,
      computedLoading,
      computedFocused,
      computedSetFocused,
      columnFlexes,
      columnSizes,
      setColumnFlexes,
      setColumnSizes,
      lockedColumnsState,
      setLockedColumnsState,
      setLoading,
      isLoading: () => computedProps.computedLoading,
      size,
      setSize,
      viewportAvailableWidth,

      availableWidth: viewportAvailableWidth,
      maxAvailableWidthForColumns:
        viewportAvailableWidth - reservedViewportWidth,
      showHorizontalCellBorders,
      showVerticalCellBorders,
      shareSpaceOnResize: props.shareSpaceOnResize || false,
      onNextRender,
      computedEnableColumnHover: props.enableColumnHover || undefined,
    };

    cProps.i18n = (key, defaultLabel) => {
      return props.i18n[key] || DEFAULT_I18N[key] || defaultLabel;
    };

    Object.assign(cProps, useActiveIndex(props, cProps, computedPropsRef));

    Object.assign(
      cProps,
      pluginsMap['sortable-columns'].hook!(
        props,
        (cProps as unknown) as TypeComputedProps,
        computedPropsRef
      )
    );

    if (pluginsMap['group-and-pivot'] && pluginsMap['group-and-pivot'].hook) {
      Object.assign(
        cProps,
        pluginsMap['group-and-pivot'].hook!(props, cProps, computedPropsRef)
      );
    }

    Object.assign(cProps, useGroups(props, cProps, computedPropsRef));
    if (pluginsMap.tree && pluginsMap.tree.hook) {
      Object.assign(
        cProps,
        pluginsMap.tree.hook!(props, cProps, computedPropsRef)
      );
    }

    if (pluginsMap.filters && pluginsMap.filters.hook) {
      Object.assign(
        cProps,
        pluginsMap.filters.hook!(props, cProps, computedPropsRef)
      );
    }

    Object.assign(cProps, useEditable(props, cProps, computedPropsRef));

    cProps.maybeAddColumns = maybeAddColumns;
    const columnInfo = useColumns(props, cProps, computedPropsRef);
    Object.assign(cProps, columnInfo);

    if (edition === 'enterprise') {
      const columnsSizing = useColumnsSizing(props, cProps, computedPropsRef);
      Object.assign(cProps, columnsSizing);
    }

    Object.assign(cProps, useColumnHover(props, cProps, computedPropsRef));

    cProps.wasMountedRef = useRef(false);
    cProps.wasUnmountedRef = useRef(false);
    const dataInfo = useDataSource(props, cProps, computedPropsRef);

    Object.assign(
      cProps,
      pluginsMap['live-pagination'].hook!(props, cProps, computedPropsRef)
    );

    const rowHeightManager = useMemo(() => {
      return new RowHeightManager(
        {
          rowHeight: props.rowHeight || props.minRowHeight,
          minRowHeight: props.minRowHeight,
        },
        {},
        { cache: !!props.rowHeight }
      );
    }, []);

    const i18nFn = useCallback(
      (key: string, defaultLabel?: string): string | ReactNode => {
        if (!props.i18n) {
          return defaultLabel;
        }
        return props.i18n[key] || (DEFAULT_I18N as any)[key] || defaultLabel;
      },
      [props.i18n]
    );
    const getItemId = useCallback((item: any) => {
      if (item.__group && Array.isArray(item.keyPath)) {
        return item.keyPath.join(props.groupPathSeparator);
      }
      const itemId = computeIdProperty()
        ? compoundItemId(item)
        : simpleItemId(item);

      return itemId;
    }, []);

    const simpleItemId = useCallback((item: any) => {
      return item[props.idProperty];
    }, []);

    const compoundItemId = useCallback((item: any) => {
      const parts = props.idProperty.split(props.idPropertySeparator);
      return parts.reduce((itemObj, id) => {
        if (itemObj) {
          return itemObj[id] ? itemObj[id] : itemObj;
        }
      }, item);
    }, []);

    const getItemIndexBy = (fn: (...args: any[]) => boolean): number => {
      const data = computedProps.data;

      if (!data || typeof fn != 'function') {
        return -1;
      }

      if (data.findIndex) {
        return data.findIndex(fn);
      }

      for (let i = 0, len = data.length; i < len; i++) {
        if (fn(data[i]) === true) {
          return i;
        }
      }

      return -1;
    };
    const getItemAt = (index: number) => {
      if (!computedPropsRef.current) {
        return undefined;
      }
      const item = computedPropsRef.current.data[index];
      if (!item) {
        return;
      }

      return getItemWithCache(item);
    };
    const getItemWithCache = (item: any) => {
      if (
        item &&
        computedPropsRef.current &&
        computedPropsRef.current.computedDataSourceCache
      ) {
        const itemId = getItemId(item);
        const cachedItem =
          computedPropsRef.current.computedDataSourceCache[itemId];

        if (cachedItem) {
          item = { ...item, ...cachedItem };
        }
      }

      return item;
    };

    const getItemIndex = (item: any): number => {
      const { current: computedProps } = computedPropsRef;
      if (!computedProps) {
        return -1;
      }

      const data = computedProps.data;
      const itemId = getItemId(item);

      for (let i = 0; i < data.length; i++) {
        const dataItem = data[i];
        const dataItemId = getItemId(dataItem);

        if (dataItemId === itemId) {
          return i;
        }
      }

      return -1;
    };

    const getItemIdAt = (index: number) => {
      return getItemId(getItemAt(index));
    };
    const isRowExpandedById = () => false;
    const isCellVisible = ({
      rowIndex,
      columnIndex,
    }: {
      rowIndex: number;
      columnIndex: number;
    }):
      | boolean
      | {
          topDiff: number;
          bottomDiff: number;
          leftDiff: number;
          rightDiff: number;
        } => {
      const { current: computedProps } = computedPropsRef;
      if (!computedProps) {
        return false;
      }
      const column = computedProps.visibleColumns[columnIndex];
      if (!computedProps.rowHeightManager) {
        throw 'You need fixed row height for this method to work';
      }

      const columnStart = column.computedOffset;
      const columnEnd = columnStart + column.computedWidth;

      const rowStart = computedProps.rowHeightManager.getRowOffset(rowIndex);
      const rowEnd =
        rowStart + computedProps.rowHeightManager.getRowHeight(rowIndex);

      const virtualList = getVirtualList();

      const visibleTop = virtualList.scrollTop;
      const visibleBottom = visibleTop + computedProps.size.height;
      const visibleLeft = virtualList.scrollLeft;
      const visibleRight = visibleLeft + computedProps.size.width;

      const leftDiff = columnStart - visibleLeft;
      const rightDiff = visibleRight - columnEnd;

      const topDiff = rowStart - visibleTop;
      const bottomDiff = visibleBottom - rowEnd;

      if (topDiff >= 0 && bottomDiff >= 0 && leftDiff >= 0 && rightDiff >= 0) {
        return true;
      }

      return { topDiff, bottomDiff, leftDiff, rightDiff };
    };

    const setScrollTop = (scrollTop: number) => {
      const virtualList = getVirtualList();
      if (virtualList) {
        virtualList.scrollTop = scrollTop;
      }
    };
    const incrementScrollTop = (increment: number) => {
      const virtualList = getVirtualList();
      if (virtualList) {
        virtualList.scrollTop += increment;
      }
    };
    const getScrollTop = (): number => {
      const body = bodyRef.current;
      if (body && body.columnLayout) {
        return body.columnLayout.scrollTop || 0;
      }
      return 0;
    };
    const getScrollLeft = (): number => {
      const body = bodyRef.current;
      if (body && body.columnLayout) {
        return body.columnLayout.scrollLeft || 0;
      }
      return 0;
    };
    const getScrollLeftMax = (): number => {
      const virtualList = getVirtualList();
      if (virtualList) {
        return virtualList.scrollLeftMax || 0;
      }
      return 0;
    };
    const setScrollLeft = (scrollLeft: number) => {
      const virtualList = getVirtualList();
      if (virtualList) {
        virtualList.scrollLeft = scrollLeft;
      }
    };

    const incrementScrollLeft = (increment: number) => {
      const virtualList = getVirtualList();
      if (virtualList) {
        virtualList.scrollLeft += increment;
      }
    };

    const getRows = () => {
      const vl = getVirtualList();
      return vl.getRows();
    };

    const getHeader = () => {
      const body = bodyRef.current;
      const columnLayout = body && body.getColumnLayout();
      const header = columnLayout.getHeader();

      return header;
    };

    const scrollToId = (
      id: string | number,
      config?: any,
      callback?: (...args: any[]) => any
    ): void => {
      const index = computedProps.getRowIndexById(id);

      scrollToIndex(index, config, callback);
    };

    const scrollToIndex = (
      index: number,
      config?: {
        top?: boolean;
        direction?: 'top' | 'bottom';
        force?: boolean;
        duration?: number;
        offset?: number;
      },
      callback?: (...args: any[]) => any
    ): void => {
      const { current: computedProps } = computedPropsRef;
      if (!computedProps) {
        return;
      }
      index = clamp(index, 0, computedProps.data.length - 1);

      config = config || {};

      let top: boolean = config!.top;
      let force: boolean | undefined = config!.force;
      let direction: 'top' | 'bottom' | undefined = config!.direction;
      let duration: number | undefined = config!.duration;
      let offset: number | undefined = config!.offset;

      top = !!top;
      force = !!force;
      direction = direction || (top ? 'top' : 'bottom');

      getVirtualList().scrollToIndex(
        index,
        {
          direction,
          force,
          duration,
          offset,
        },
        callback
      );
    };

    const scrollToCell = (
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
      } = {}
    ) => {
      const { current: computedProps } = computedPropsRef;
      if (!computedProps) {
        return;
      }
      if (offset === undefined) {
        offset = (computedProps.rowHeight || 50) / 2;
      }
      const columnDirection =
        left === true
          ? 'left'
          : left === false || right === true
          ? 'right'
          : undefined;

      const col = computedProps.visibleColumns[columnIndex];

      const scrollToRow = () => {
        computedProps.scrollToIndex(
          clamp(rowIndex + (top ? -0 : 0), 0, computedProps.count - 1),
          { top, offset: 0 }
        );
      };

      if (!col) {
        return;
      }
      if (col.computedLocked) {
        scrollToRow();
        return;
      }

      computedProps.scrollToColumn(
        columnIndex,
        { offset, direction: columnDirection },
        () => {
          scrollToRow();
        }
      );
    };

    const smoothScrollTo = useCallback((value: number, config: any) => {
      const virtualList = getVirtualList();

      virtualList.smoothScrollTo(value, config);
    }, []);

    const scrollToColumn = useCallback(
      (
        index: number,
        config?: {
          offset?: number;
          duration?: number;
          force?: boolean;
          direction?: 'left' | 'right' | null;
        },
        callback?: (...args: any[]) => void
      ) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
          return;
        }
        if (!computedProps.size.width) {
          // there's no width yet, so we can't accurately scroll to the specified
          // column - therefore we defer this to a later frame
          return requestAnimationFrame(() => {
            scrollToColumn(index, config, callback);
          });
        }
        config = config || {};

        let { direction, force, duration, offset } = config;

        if (offset === undefined) {
          offset = (computedProps.rowHeight || 50) / 2;
        }

        const col = computedProps.getColumnBy(index) as TypeComputedColumn;

        if (col.computedLocked) {
          if (callback) {
            callback();
          }
          return;
        }

        const virtualList = getVirtualList();
        const scrollLeft = virtualList.scrollLeft;
        const scrollWidth = computedProps.size.width;

        if (direction) {
          if (direction != 'left' && direction != 'right') {
            direction = null;
          }
        }
        if (force && !direction) {
          force = false;
        }

        if (typeof callback != 'function') {
          callback = () => {};
        }

        const getColumnOffset = () => {
          return direction === 'left' || !direction
            ? col.computedOffset
            : col.computedOffset + col.computedWidth;
        };

        const getLeftDiff = () =>
          getColumnOffset() -
          scrollLeft -
          (computedProps.totalLockedStartWidth || 0);

        const getRightDiff = () =>
          scrollLeft +
          scrollWidth -
          getColumnOffset() -
          (computedProps.totalLockedEndWidth || 0);

        let leftDiff = getLeftDiff();

        let rightDiff = getRightDiff();

        const toLeft = leftDiff < 0;
        const toRight = rightDiff < 0;

        const visible = !toLeft && !toRight;

        if (!visible) {
          if (!direction) {
            // determine direction based on the row position in the current view
            direction = leftDiff < 0 ? 'left' : 'right';
            force = true;

            leftDiff = getLeftDiff();
            rightDiff = getRightDiff();
          }
        }

        if (!visible || (direction && force)) {
          let newScrollLeft;
          // the row is either not fully visible, or we have direction
          if (direction == 'left' || leftDiff < 0) {
            newScrollLeft = scrollLeft + leftDiff - offset;
          } else if (direction == 'right' || rightDiff < 0) {
            newScrollLeft = scrollLeft - rightDiff + offset;
          }

          if (newScrollLeft != null) {
            if (duration) {
              virtualList.smoothScrollTo(
                newScrollLeft,
                { duration, orientation: 'horizontal' },
                callback
              );
              return;
            }
            virtualList.scrollLeft = newScrollLeft;
          }
        }

        callback();
      },
      []
    );

    const getStickyContainerHeight = () => {
      const stickyContainer = getDOMNode()?.querySelector(
        `.${StickyRowsContainerClassName}`
      );
      const stickyContainerHeight = stickyContainer?.scrollHeight ?? 0;
      return stickyContainerHeight;
    };

    const scrollToIndexIfNeeded = useCallback(
      (
        index: number,
        config?: {
          top?: boolean;
          direction?: 'top' | 'bottom';
          force?: boolean;
          duration?: number;
          offset?: number;
        },
        callback?: (...args: any) => any
      ): boolean => {
        let needed = !isRowFullyVisible(index);

        if (!needed) {
          const { current: computedProps } = computedPropsRef;

          if (computedProps?.computedStickyRows) {
            if (computedProps.computedStickyRows[index]) {
              needed = false;
            } else {
              const stickyContainerHeight = getStickyContainerHeight();

              const scrollTop = getScrollTop();
              const relativeScrollTop = scrollTop + stickyContainerHeight;
              const rowOffset = computedProps.rowHeightManager.getRowOffset(
                index
              );

              if (relativeScrollTop > rowOffset) {
                needed = true;
                config = config || {
                  direction: 'top',
                };

                config.offset =
                  relativeScrollTop -
                  rowOffset +
                  rowHeightManager.getRowHeight(index);
              }
            }
          }
        } else {
          if (computedProps?.computedStickyRows) {
            config = config || {
              direction: 'top',
            };
            config.offset = config.offset || 0;
            if (config.direction === 'top' || config.top) {
              config.offset += getStickyContainerHeight();
            }
          }
        }
        if (needed) {
          scrollToIndex(index, config, callback);
        } else {
          if (callback) {
            callback();
          }
        }

        return needed;
      },
      []
    );

    const isRowFullyVisible = (rowIndex: number) => {
      const list = getVirtualList();
      if (!list) {
        return false;
      }
      return list.isRowVisible(rowIndex);
    };

    const getRenderRange = (): { from: number; to: number } =>
      bodyRef.current != null
        ? bodyRef.current.getRenderRange()
        : { from: 0, to: 0 };

    const isRowRendered = (index: number): boolean => {
      const { from, to } = getRenderRange();

      return index >= from && index < to;
    };

    const focus = () => {
      const virtualList = getVirtualList();
      if (!virtualList) {
        return;
      }
      const scrollContainer = virtualList.scrollContainer;
      if (!scrollContainer) {
        return;
      }

      scrollContainer.focus();
    };

    const blur = () => {
      const virtualList = getVirtualList();
      if (!virtualList) {
        return;
      }
      const scrollContainer = virtualList.scrollContainer;
      if (!scrollContainer) {
        return;
      }

      scrollContainer.blur();
    };

    const computeIdProperty = useCallback(() => {
      const idProperty = props.idProperty;
      if (idProperty.includes(props.idPropertySeparator)) {
        return true;
      }
      return false;
    }, []);

    const computedProps: TypeComputedProps = {
      ...cProps,
      gridId: useMemo(() => ++GRID_ID, []),
      isRowFullyVisible,
      bodyRef,
      getMenuPortalContainer: getDOMNode,
      scrollToIndexIfNeeded,
      scrollToIndex,
      scrollToId,
      scrollToColumn,
      scrollToCell,
      setScrollTop,
      setScrollLeft,
      smoothScrollTo,
      incrementScrollLeft,
      incrementScrollTop,
      getScrollTop,
      getScrollLeft,
      getScrollLeftMax,
      getHeader,
      isCellVisible,
      naturalRowHeight: typeof props.rowHeight !== 'number',

      isRowRendered,
      getRenderRange,

      computedShowCellBorders,
      setShowCellBorders,
      groupCounts: [],
      computedLoading,
      setLoading,
      ...dataInfo,
      ...columnInfo,
      rowHeightManager,
      isRowExpandedById,
      getItemId,
      getRowId: getItemIdAt,
      getItemIndexBy,
      getItemIndex,

      getItemAt,
      getItemIdAt,
      getRows,
      focus,
      blur,
      computedShowHeaderBorderRight:
        columnInfo.totalComputedWidth < viewportAvailableWidth ||
        (props.nativeScroll && getScrollbarWidth() && scrollbars.vertical),
      i18n: i18nFn,
      totalColumnCount: columnInfo.allColumns.length,
      totalComputedWidth: columnInfo.totalComputedWidth,
      minRowWidth: columnInfo.totalComputedWidth,
      columnResizeHandleWidth: clamp(props.columnResizeHandleWidth, 2, 25),
      compoundIdProperty: computeIdProperty(),
    };

    computedProps.rtlOffset = props.rtl
      ? Math.min(computedProps.size.width - computedProps.totalComputedWidth, 0)
      : 0;

    computedPropsRef.current = computedProps;

    const menusRef = useRef<any[]>([]);

    computedProps.menusRef = menusRef;
    computedProps.updateMenuPositions = () => {
      menusRef.current.forEach(menu => {
        if (menu && menu.updatePosition) {
          menu.updatePosition();
        }
      });
    };

    computedProps.updateMainMenuPosition = (alignTo: any) => {
      menusRef.current.forEach(menu => {
        if (menu && menu.updatePosition && !menu.props.subMenu) {
          menu.updateAlignment(alignTo);
        }
      });
    };

    computedProps.onScroll = () => {
      if (computedProps.initialProps.onScroll) {
        computedProps.initialProps.onScroll();
      }
      if (computedProps.updateMenuPositionOnScroll) {
        computedProps.updateMenuPositions();
      }
    };

    if (pluginsMap['row-details'] && pluginsMap['row-details'].hook) {
      Object.assign(
        computedProps,
        pluginsMap['row-details'].hook!(props, computedProps, computedPropsRef)
      );
    }

    computedProps.useCellSelection = pluginsMap['cell-selection'].hook;
    Object.assign(
      computedProps,
      useSelection(props, computedProps, computedPropsRef)
    );

    Object.assign(computedProps, useHeader(props, computedProps));

    computedProps.scrollProps = useScrollProps(props, computedProps);

    const [maxVisibleRows, setMaxVisibleRows] = useState<number>(0);
    const [computedShowZebraRows, setShowZebraRows] = useProperty<boolean>(
      props,
      'showZebraRows'
    );
    const [computedShowHoverRows, setShowHoverRows] = useProperty<boolean>(
      props,
      'showHoverRows'
    );
    const [computedShowEmptyRows, setShowEmptyRows] = useProperty<boolean>(
      props,
      'showEmptyRows'
    );

    computedProps.getVirtualList = getVirtualList;
    computedProps.computedShowZebraRows = computedShowZebraRows;
    computedProps.computedShowHoverRows = computedShowHoverRows;
    computedProps.computedShowEmptyRows = computedShowEmptyRows;
    computedProps.setShowZebraRows = setShowZebraRows;
    computedProps.setShowHoverRows = setShowHoverRows;
    computedProps.setShowEmptyRows = setShowEmptyRows;
    computedProps.maxVisibleRows = maxVisibleRows;
    const className = prepareClassName(computedProps);

    const {
      computedOnKeyDown: onKeyDown,
      computedOnFocus: onFocus,
      computedOnBlur: onBlur,
      ...useRowProps
    } = useRow(props, computedProps, computedPropsRef);

    if (pluginsMap['locked-rows'] && pluginsMap['locked-rows'].hook) {
      Object.assign(
        computedProps,
        pluginsMap['locked-rows'].hook!(props, computedProps, computedPropsRef)
      );
    }

    if (pluginsMap['locked-columns'] && pluginsMap['locked-columns'].hook) {
      Object.assign(
        computedProps,
        pluginsMap['locked-columns'].hook!(
          props,
          computedProps,
          computedPropsRef
        )
      );
    } else if (
      (computedProps.lockedEndColumns &&
        computedProps.lockedEndColumns.length) ||
      (computedProps.lockedStartColumns &&
        computedProps.lockedStartColumns.length)
    ) {
      communityFeatureWarn(`Locked columns`, warnRef);
    }
    if (pluginsMap['footer-rows'] && pluginsMap['footer-rows'].hook) {
      Object.assign(
        computedProps,
        pluginsMap['footer-rows'].hook!(props, computedProps, computedPropsRef)
      );
    }

    if (
      (props.renderRowDetails ||
        props.expandedRows ||
        props.defaultExpandedRows) &&
      !pluginsMap['row-details']
    ) {
      communityFeatureWarn(`Row Details and Master Details`, warnRef);
    }

    if (props.lockedRows && !pluginsMap['locked-rows']) {
      communityFeatureWarn(`Locked rows`, warnRef);
    }

    if (props.footerRows && !pluginsMap['footer-rows']) {
      communityFeatureWarn(`Footer rows`, warnRef);
    }

    Object.assign(computedProps, useRowProps);

    Object.assign(
      computedProps,
      pluginsMap['menus'].hook!(props, computedProps, computedPropsRef)
    );

    const computedWillReceiveFocusRef = useRef<boolean>(false);

    computedProps.getState = (): any => {
      return context!.state!;
    };
    computedProps.setStateProperty = (name: string, value: any): void => {
      context.state[name] = value;
    };

    computedProps.computedWillReceiveFocusRef = computedWillReceiveFocusRef;

    delete computedProps.style;

    const getScrollingElement = (): HTMLElement => {
      let scrollingElement = getVirtualList().getScrollingElement();

      if (!scrollingElement.scrollerNode) {
        scrollingElement = scrollingElement.scroller;
      }
      return scrollingElement.scrollerNode;
    };

    computedProps.getScrollingElement = getScrollingElement;

    const onGridScrollIntoView = event => {
      const gridNode = getBodyDOMNode()!;

      const eventTarget = event.target;
      if (event.target != gridNode) {
        return;
      }

      const { scrollLeft, scrollTop } = gridNode;

      if (scrollLeft) {
        gridNode.scrollLeft = computedProps.rtl ? getScrollLeftMax() : 0;

        requestAnimationFrame(() => {
          if (computedProps.wasUnmountedRef.current) {
            return;
          }
          incrementScrollLeft(scrollLeft);
        });
      }
      if (scrollTop && eventTarget) {
        eventTarget.scrollTop = 0;
        globalObject.requestAnimationFrame(() => {
          if (computedProps.wasUnmountedRef.current) {
            return;
          }
          incrementScrollTop(scrollTop);
        });
      }
    };

    const setupPassiveScrollListener = (node: HTMLElement) => {
      node.addEventListener('scroll', onGridScrollIntoView, {
        passive: true,
      });
    };

    const removePassiveScrollListener = (node: HTMLElement) => {
      if (node) {
        node.removeEventListener('scroll', onGridScrollIntoView, {
          passive: true,
        });
      }
    };

    useEffect(() => {
      computedProps.wasMountedRef.current = true;

      if (props.onDidMount) {
        props.onDidMount(computedPropsRef);
      }

      const { initialScrollLeft, initialScrollTop } = props;

      if (props.skipLoadOnMount) {
        if (initialScrollTop) {
          setScrollTop(initialScrollTop);
        }
        if (initialScrollLeft) {
          setScrollLeft(initialScrollLeft);
        }
      }

      const bodyNode = getBodyDOMNode();
      setupPassiveScrollListener(bodyNode!);

      return () => {
        removePassiveScrollListener(bodyNode!);
        if (props.onWillUnmount) {
          props.onWillUnmount(computedPropsRef);
        }
        computedProps.wasUnmountedRef.current = true;
      };
    }, []);

    useEffect(() => {
      if (props.handle) {
        props.handle(computedPropsRef);
      }

      return () => {
        if (props.handle) {
          props.handle(null);
        }
      };
    }, [props.handle]);

    useEffect(() => {
      if (props.onReady && size.width) {
        props.onReady(computedPropsRef);
      }
    }, [size.width !== 0]);

    computedProps.cellNavigationRef = useRef<any>(null);

    Object.assign(
      computedProps,
      pluginsMap['row-index-column'].hook!(
        props,
        computedProps,
        computedPropsRef
      )
    );

    computedProps.coverHandleRef = useRef<{
      setActive: Dispatch<SetStateAction<boolean>>;
      setCursor: Dispatch<SetStateAction<string>>;
    }>(emptyCoverHandle);

    computedProps.rowResizeIndexRef = useRef<number | null>(null);

    const coverHandle = ({
      setActive,
      setCursor,
    }: {
      setActive: Dispatch<SetStateAction<boolean>>;
      setCursor: Dispatch<SetStateAction<string>>;
    }) => {
      computedPropsRef.current!.coverHandleRef.current = {
        setActive,
        setCursor,
      };
    };

    const activeItem = getItemAt(computedProps.computedActiveIndex);

    const activeRowHeight =
      computedProps.computedRowHeights && activeItem
        ? computedProps.computedRowHeights[getItemId(activeItem)]
        : computedProps.rowHeight == null
        ? rowHeightManager.getRowHeight(computedProps.computedActiveIndex)
        : computedPropsRef.rowHeight;
    computedProps.activeRowHeight = activeRowHeight || computedProps.rowHeight;

    const emptyData = computedProps.data && computedProps.data.length;

    if (computedFocused && computedProps.showActiveRowIndicator && emptyData) {
      computedProps.renderActiveRowIndicator = (
        handle: (
          handleProps: {
            setScrollLeft: (scrollLeft: number) => void;
          } | null
        ) => void
      ) => {
        return (
          <ActiveRowIndicator
            handle={handle}
            rtl={computedProps.rtl}
            rtlOffset={computedProps.rtlOffset}
            getDOMNode={computedProps.getDOMNode}
            dataSourceCount={computedProps.data.length}
            width={computedProps.minRowWidth || 0}
            computedRowHeights={computedProps.computedRowHeights}
            computedExpandedRows={computedProps.computedExpandedRows}
            computedExpandedNodes={computedProps.computedExpandedNodes}
            activeRowHeight={computedProps.activeRowHeight}
            activeIndex={computedProps.computedActiveIndex}
            activeRowRef={computedProps.activeRowRef}
            activeRowIndicatorClassName={
              computedProps.activeRowIndicatorClassName
            }
          />
        );
      };
    }

    computedProps.computedLicenseValid = false;

    if (pluginsMap.license && pluginsMap.license.hook) {
      Object.assign(
        computedProps,
        pluginsMap.license.hook!(props, computedProps, computedPropsRef)
      );
    }

    Object.assign(
      computedProps,
      pluginsMap['clipboard'].hook!(props, computedProps, computedPropsRef)
    );

    if (edition !== 'enterprise') {
      if (props.rowIndexColumn) {
        communityFeatureWarn('Row resize (row index column)', warnRef);
      }
      if (props.livePagination) {
        communityFeatureWarn('Live pagination', warnRef);
      }
      if (props.onRowReorder != null || props.rowReorderColumn != null) {
        communityFeatureWarn('Row reorder', warnRef);
      }
      if (props.enableClipboard) {
        communityFeatureWarn('Clipboard', warnRef);
      }
    }

    delete computedProps.renderLockedStartCells;
    delete computedProps.renderLockedEndCells;
    if (pluginsMap['locked-columns']) {
      computedProps.renderLockedStartCells =
        pluginsMap['locked-columns'].renderLockedStartCells;
      computedProps.renderLockedEndCells =
        pluginsMap['locked-columns'].renderLockedEndCells;
    }

    Object.defineProperty(computedProps, 'scrollTop', {
      get() {
        return getScrollTop();
      },
      set(newValue) {
        setScrollTop(newValue);
      },
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(computedProps, 'scrollLeft', {
      get() {
        return getScrollLeft();
      },
      set(newValue) {
        setScrollLeft(newValue);
      },
      enumerable: true,
      configurable: true,
    });
    computedProps.edition = edition;

    globalThis.computedProps = computedProps;
    // globalThis.bodyRef = bodyRef;

    return (
      <div
        style={props.style}
        className={className}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        ref={domRef}
      >
        <Provider value={computedProps}>
          {pluginsMap['row-index-column'].renderRowResizeIndicator!(
            computedProps,
            computedPropsRef
          )}

          <Layout
            Footer={
              pluginsMap['footer-rows']
                ? pluginsMap['footer-rows'].Footer
                : null
            }
            ref={bodyRef}
            renderInPortal={renderInPortal}
          />
          <Cover handle={coverHandle} />
        </Provider>
        {computedProps.computedLicenseValid === false &&
        edition === 'enterprise'
          ? pluginsMap['license'].renderLicenseNotice!(
              computedProps,
              computedPropsRef
            )
          : null}
        <NotifyResize onResize={onResize} notifyOnMount />
        {renderLoadMask(computedProps)}
        {typeof pluginsMap['menus'].renderColumnContextMenu === 'function'
          ? pluginsMap['menus'].renderColumnContextMenu!(
              computedProps,
              computedPropsRef
            )
          : null}
        {typeof pluginsMap['menus'].renderRowContextMenu === 'function'
          ? pluginsMap['menus'].renderRowContextMenu!(
              computedProps,
              computedPropsRef
            )
          : null}
        {typeof pluginsMap['filters'].renderColumnFilterContextMenu ===
        'function'
          ? pluginsMap['filters'].renderColumnFilterContextMenu!(
              computedProps,
              computedPropsRef
            )
          : null}
        <div ref={portalRef} className="InovuaReactDataGrid__portal-host" />
      </div>
    );
  });

  const defaultProps = {
    idProperty: 'id',
    rowHeight: 40,
    headerHeight: 40,
    filterRowHeight: 40,
    minRowHeight: 20,
    nativeScroll: false,
    autoCheckboxColumn: false,
    activateRowOnFocus: true,
    checkboxOnlyRowSelect: false,
    checkboxSelectEnableShiftKey: false,
    renderScroller: domProps => {
      domProps.tabIndex = 0;
    },

    enableKeyboardNavigation: true,
    scrollTopOnFilter: true,
    scrollTopOnSort: true,
    scrollTopOnGroupBy: true,
    defaultShowHeader: true,
    defaultShowEmptyRows: false,
    defaultShowHoverRows: true,
    defaultShowZebraRows: true,
    defaultShowCellBorders: true,

    cellSelectionByIndex: false,

    columnResizeHandleWidth: isMobile ? 15 : 5,

    columnResizeProxyWidth: 5,
    virtualizeColumnsThreshold: 15,
    shareSpaceOnResize: false,

    enableColumnFilterContextMenu: true,

    resizable: true,
    virtualized: true,
    allowUnsort: true,
    rtl: false,
    theme: 'default-light',
    filterTypes,
    keyPageStep: 10,
    expandGroupTitle: true,
    allowGroupSplitOnReorder: true,
    defaultCollapsedGroups: {},
    groupPathSeparator: '/',
    nodePathSeparator: '/',
    idPropertySeparator: '.',
    groupNestingSize: 22,
    treeNestingSize: 22,
    columnMinWidth: 40,
    enableTreeRowReorderNestingChange: true,
    enableTreeRowReorderParentChange: true,
    columnReorderScrollByAmount: 20,
    rowReorderScrollByAmount: 20,
    rowReorderAutoScroll: false,
    rowReorderAutoScrollSpeed: 40,
    allowRowReoderBetweenGroups: false,
    reorderProxySize: 3,
    expandOnMouseDown: false,
    columnMaxWidth: null,
    editStartEvent: 'dblclick',
    hideGroupByColumns: true,
    defaultColumnOrder: undefined,
    columnUserSelect: false,
    columnHeaderUserSelect: false,
    stickyGroupRows: false,
    showWarnings: !uglified,
    toggleRowSelectOnClick: false,
    toggleCellSelectOnClick: true,
    clearNodeCacheOnDataSourceChange: true,
    clearDataSourceCacheOnChange: true,
    preventDefaultTextSelectionOnShiftMouseDown: true,
    preventRowSelectionOnClickWithMouseMove: true,
    showColumnMenuSortOptions: true,
    showColumnMenuLockOptions: true,
    showColumnMenuFilterOptions: true,
    showColumnMenuGroupOptions: true,
    autoFocusOnEditComplete: true,
    autoFocusOnEditEscape: true,
    showActiveRowIndicator: true,

    showPivotSummaryColumns: true,
    showColumnMenuToolOnHover: !isMobile,
    columnFilterContextMenuConstrainTo: true,
    columnFilterContextMenuPosition: 'absolute',
    generateIdFromPath: true,
    collapseChildrenOnAsyncNodeCollapse: true,
    collapseChildrenRecursive: true,
    selectNodesRecursive: true,
    isExpandKeyPressed: ({ event }) => {
      return event.key === 'ArrowRight' && event.altKey;
    },

    isCollapseKeyPressed: ({ event }) => {
      return event.key === 'ArrowLeft' && event.altKey;
    },

    isStartEditKeyPressed: ({ event }) => {
      return event.key === 'e' && event.ctrlKey;
    },
    rowExpandHeight: 80,
    growExpandHeightWithDetails: true,
    livePaginationLoadNextDelay: true,
    livePaginationLoadMaskHideDelay: 50,
    checkResizeDelay: 0,
    multiRowExpand: true,
    useNativeFlex: false,

    disableGroupByToolbar: false,
    updateMenuPositionOnScroll: true,
    updateMenuPositionOnColumnsChange: true,
    useRowHeightForLockedRows: true,
    nodesProperty: 'nodes',
    rowDetailsWidth: 'max-viewport-width',
    contain: 'style layout',
    rowContain: 'style layout',
    groupToString: (obj: any): string => {
      const type = typeof obj;
      return type == 'string' || type === 'number' || type === 'boolean'
        ? `${obj}`
        : JSON.stringify(obj);
    },
    scrollProps: {
      autoHide: true,
      scrollThumbMargin: 4,
      scrollThumbWidth: 6,
      scrollThumbOverWidth: 8,
    },
    detailsGridCacheKey: true,
    sortFunctions: {
      date: (v1, v2, column) => {
        if (window.moment && column.dateFormat) {
          return (
            window.moment(v1, column.dateFormat) -
            window.moment(v2, column.dateFormat)
          );
        }

        return v1 - v2;
      },
    },
    i18n: DEFAULT_I18N,

    emptyText: 'noRecords',

    isBinaryOperator: operator => {
      return operator === 'inrange' || operator === 'notinrange';
    },

    skipHeaderOnAutoSize: false,
    enableColumnAutosize: true,
  };

  const maybeAddCols: any[] = [];

  plugins.forEach((plugin: TypePlugin) => {
    if (!plugin.name) {
      // plugin is not valid
      return;
    }

    if (typeof plugin.defaultProps === 'function') {
      const result: any = plugin.defaultProps(Grid.defaultProps);
      if (result != null) {
        Grid.defaultProps = {
          ...Grid.defaultProps,
          ...result,
        };
      }
    }

    if (typeof plugin.maybeAddColumns === 'function') {
      maybeAddCols.push(plugin.maybeAddColumns);
    }
  });

  if (maybeAddCols.length) {
    maybeAddColumns = (columns: TypeColumns, props: TypeBuildColumnsProps) => {
      let result = columns;
      maybeAddCols.forEach(fn => {
        result = fn(result, props);
      });

      return result;
    };
  }

  const TheGrid = (props: TypeDataGridProps) => {
    const contextValue = useMemo(() => {
      return {
        state: props.initialState || {},
      };
    }, []);
    const Context = useMemo(() => React.createContext(contextValue), []);

    return (
      <Context.Provider value={contextValue}>
        <Grid {...props} context={Context} />
      </Context.Provider>
    );
  };

  TheGrid.defaultProps = defaultProps;

  return TheGrid;
};
export default GridFactory;
export { filterTypes };
