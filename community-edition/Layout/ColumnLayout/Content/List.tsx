/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import assignDefined from '../../../packages/assign-defined';
import VirtualList, {
  propTypes as virtualListPropTypes,
  getScrollbarWidth,
} from '../../../packages/react-virtual-list-pro/src';
import ScrollContainerNative from '../../../packages/react-virtual-list-native';
import equal from '../../../packages/shallowequal';

import renderRows from './renderRows';

import shouldComponentUpdate from '../../../packages/shouldComponentUpdate';
import searchClosestSmallerValue from '../../../utils/searchClosestSmallerValue';

import renderEmptyContent from '../../../renderEmptyContent';

import { IS_IE, IS_EDGE } from '../../../detect-ua';

const EMPTY_OBJECT = {};
const returnTrue = () => true;

const CHUNKS_SIZE = 1;

const raf = global.requestAnimationFrame;

const DEFAULT_SCROLL_POS = {
  scrollLeft: 0,
  scrollTop: 0,
};

let initialSkip: number = 0;
let timeout: boolean = false;

const VirtualListClassName = 'InovuaReactDataGrid__virtual-list';

export type TypeScrollPos = { scrollTop: number; scrollLeft: number };
type ListProps = {
  virtualized: boolean;
  onContainerScroll?: (
    scrollPos: TypeScrollPos,
    prevScrollPos?: TypeScrollPos
  ) => void;
};

export default class InovuaDataGridList extends Component<ListProps> {
  scrollingDirection?: 'horizontal' | 'vertical' | 'none';
  lastScrollTimestamp: number = 0;
  constructor(props) {
    super(props);

    this.refVirtualList = vl => {
      this.virtualList = vl;
    };
    this._scrollLeft = 0;
    this._scrollTop = 0;

    this.startIndex = 0;
    this.endIndex = CHUNKS_SIZE;

    this.state = { columnRenderCount: 0 };

    this.rows = [];
    this.scrollbars = {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.shouldComponentUpdate) {
      return shouldComponentUpdate(this, nextProps, nextState);
    }

    const equalProps = equal(this.props, nextProps);
    if (!equalProps) {
      return true;
    }

    return !equal(nextState, this.state);
  }

  componentWillUnmount() {
    this.__willUnmount = true;
  }

  isRowFullyVisible = index => {
    return this.virtualList.isRowVisible(index);
  };

  computeRows = (
    props,
    {
      from,
      to,
      rowHeight,
      renderIndex,
      empty,
      setRowSpan,
      sticky,
    } = EMPTY_OBJECT
  ) => {
    const { columnRenderCount } = props;

    return renderRows(
      {
        empty,
        renderIndex,
        setRowSpan,
        sticky,
        from: from || this.startIndex || 0,
        to: to || this.endIndex || CHUNKS_SIZE,
        rowHeight,
        columnRenderStartIndex: this.columnRenderStartIndex,
        columnRenderCount,
        onEditStop: this.onEditStop,
        onEditStart: this.onEditStart,
        onEditValueChange: this.onEditValueChange,
        getScrollLeftMax: this.props.getScrollLeftMax,
        tryNextRowEdit: this.tryRowEdit,
        editValue: this.editValue,
        editRowIndex: this.editRowIndex,
        editColumnIndex: this.editColumnIndex,
        editColumnId: this.editColumnId,
      },
      props
    );
  };

  tryRowEdit = (nextEditRowIndex, dir, columnIndex, isEnterNavigation) => {
    const columnEditIndex = columnIndex;

    const row = this.getRowAt(nextEditRowIndex);
    if (!row) {
      return;
    }
    const setActiveIndex = () => this.props.setActiveIndex(nextEditRowIndex);

    if (this.props.livePagination) {
      const skip = this.props.computedSkip;

      if (skip !== initialSkip) {
        initialSkip = skip;
        timeout = true;
      }

      timeout ? setTimeout(() => setActiveIndex(), 50) : setActiveIndex();
    } else {
      setActiveIndex();
    }

    row.tryRowCellEdit(columnEditIndex, dir, isEnterNavigation);
  };

  isEditing = () => {
    return !!this.editColumnId;
  };

  isLazyEditing() {
    return !!this.lazyEditColumnId;
  }

  onEditStop = args => {
    if (
      this.editColumnIndex !== args.columnIndex ||
      this.editRowIndex !== args.rowIndex
    ) {
      // trying to stop an edit which is not the current edit

      return;
    }

    if (this.props.onEditStop) {
      this.props.onEditStop(args);
    }

    this.updateEditing({
      value: undefined,
      rowIndex: undefined,
      columnIndex: undefined,
    });
  };

  onEditValueChange = args => {
    if (this.props.onEditValueChange) {
      this.props.onEditValueChange(args);
    }

    this.updateEditing(args);
  };

  onEditStart = args => {
    if (this.props.onEditStart) {
      this.props.onEditStart(args);
    }

    this.updateEditing(args);
  };

  updateEditing = ({ value, rowIndex, columnId, columnIndex }) => {
    const oldEditRowIndex = this.editRowIndex;
    const oldEditValue = this.editValue;
    const oldEditColumnIndex = this.editColumnIndex;

    this.editValue = value;
    this.editRowIndex = rowIndex;
    this.editColumnIndex = columnIndex;
    this.editColumnId = columnId;

    if (this.editTimeoutId) {
      clearTimeout(this.editTimeoutId);
    }

    this.lazyEditColumnId = this.editColumnId || this.lazyEditColumnId;
    this.editTimeoutId = setTimeout(() => {
      delete this.editTimeoutId;
      this.lazyEditColumnId = this.editColumnId;
    }, 50);

    if (
      oldEditRowIndex === rowIndex &&
      oldEditColumnIndex === columnIndex &&
      oldEditValue !== value
    ) {
      // we do some short-circuiting around the virtual list
      // so only the rendeRow for the specific row gets called
      // so only the editing row is being re-rendered by the update
      this.virtualList.getRows().forEach(r => {
        const row = r.getInstance();
        if (row && row.props.rowIndex === rowIndex) {
          r.update();
        }
      });
      return;
    }

    this.forceUpdate();
  };

  onScrollHorizontal = (scrollLeft, _, __, scrollLeftMax) => {
    this.onContainerScrollHorizontal(scrollLeft, undefined, scrollLeftMax);
  };

  renderRowContainer = props => {
    return (
      <div {...props}>
        {props.children}
        {this.props.renderActiveRowIndicator &&
          this.props.renderActiveRowIndicator(
            this.setupActiveRowIndicatorHandle
          )}
      </div>
    );
  };

  renderBrowserRowContainer = ({ children }: { children: any[] }) => {
    let activeRowIndicator;
    if (this.props.renderActiveRowIndicator) {
      activeRowIndicator = this.props.renderActiveRowIndicator(
        this.setupActiveRowIndicatorHandle
      );
    }
    return [...children, activeRowIndicator];
  };

  setupActiveRowIndicatorHandle = (
    activeRowHandle: (
      handleProps: {
        setScrollLeft: (scrollLeft: number) => void;
      } | null
    ) => void
  ) => {
    this.activeRowIndicatorHandle = activeRowHandle;
  };

  render() {
    const thisProps = this.props;

    const maybeProps = assignDefined(
      {},
      {
        minRowHeight: thisProps.minRowHeight,
        rowHeight: thisProps.rowHeight,
      }
    );

    const pureRows = !!this.fromState;
    const shouldUpdate = returnTrue;

    let scrollProps = thisProps.scrollProps;

    if (scrollProps && scrollProps.onContainerScrollHorizontal) {
      scrollProps = { ...scrollProps };
      scrollProps.onContainerScrollHorizontal = this.onScrollHorizontal;
    }

    const minRowWidth =
      Math.max(this.props.availableWidth, this.props.minRowWidth) || 0;

    const { naturalRowHeight } = thisProps;

    let renderRow = this.renderRow;

    if (naturalRowHeight) {
      if (this.__data !== thisProps.data || !this.__minRowWidth) {
        renderRow = renderRow.bind(this);
      }

      this.__minRowWidth = minRowWidth;
      this.__data = thisProps.data;
    }

    const commonProps = {
      rowHeight: null,
      extraRows: naturalRowHeight ? 1 : 0,
      style: thisProps.style,
      theme: this.props.theme,
      checkResizeDelay: thisProps.checkResizeDelay,
      rowContain: thisProps.rowContain,
      contain: thisProps.contain,
      rtl: thisProps.rtl,
      recycleCoveredRows: false,
      enableRowSpan: thisProps.computedEnableRowspan,
      ...maybeProps,
      rowHeightManager: thisProps.rowHeightManager,
      showEmptyRows: thisProps.computedShowEmptyRows,
      onResize: this.onResize,
      virtualized: thisProps.virtualized,
      naturalRowHeight: naturalRowHeight,
      useTransformRowPosition: this.props.useTransformRowPosition,
      useTransformPosition: this.props.useTransformPosition,
      ref: this.refVirtualList,
      count: thisProps.data.length || 0,
      pureRows: pureRows,
      minRowWidth: minRowWidth,
      shouldComponentUpdate: shouldUpdate,
      renderRow: renderRow,
      onScrollStop: this.onScrollStop,
    };

    if (thisProps.browserScroll) {
      return (
        <ScrollContainerNative
          {...commonProps}
          renderBrowserRowContainer={this.renderBrowserRowContainer}
        />
      );
    }

    return (
      <VirtualList
        {...commonProps}
        stickyOffset={thisProps.rtlOffset}
        stickyRows={thisProps.computedStickyRows}
        onStickyRowUpdate={this.onStickyRowUpdate}
        className={VirtualListClassName}
        renderRowContainer={this.renderRowContainer}
        overscrollBehavior="auto"
        before={thisProps.before}
        after={thisProps.after}
        scrollProps={scrollProps}
        emptyScrollOffset={this.getEmptyScrollOffset()}
        nativeScroll={thisProps.nativeScroll}
        renderScroller={this.renderScroller}
        renderScrollerSpacer={this.renderScrollerSpacer}
        renderSizer={this.renderSizer}
        renderView={this.renderView}
        onContainerScrollHorizontal={this.onScrollHorizontal}
        onContainerScroll={this.onContainerScroll}
        onScrollbarsChange={this.onScrollbarsChange}
        onContainerScrollVertical={this.props.onContainerScrollVertical}
        shouldFocusNextRow={this.shouldFocusNextRow}
      />
    );
  }

  onStickyRowUpdate = () => {
    this.updateOnScrollLeft(undefined, true);
  };

  shouldFocusNextRow({ index, nextIndex, dir }) {
    const shouldFocus = !this.isLazyEditing();

    return shouldFocus;
  }

  renderEmptyContent = () => {
    const SCROLLBAR_WIDTH = getScrollbarWidth();
    const { i18n, data, computedLoading: loading, nativeScroll } = this.props;
    let { emptyText } = this.props;

    const { length } = data;

    emptyText = i18n(emptyText, emptyText);

    if (!length && !loading) {
      return renderEmptyContent(emptyText, 'empty', {
        right: nativeScroll ? 0 : -SCROLLBAR_WIDTH,
        bottom: nativeScroll ? 0 : -SCROLLBAR_WIDTH,
      });
    }
  };

  renderView = viewProps => {
    const { data, loading } = this.props;

    const scrollbarOffset = this.getEmptyScrollOffset();

    const { length } = data;

    if (!length && !loading) {
      viewProps.children = React.Children.toArray(viewProps.children);

      viewProps.children.push(this.renderEmptyContent());
      if (IS_EDGE) {
        // avoid unnecessary vertical scrollbar
        viewProps.style.minHeight = '99%';
      }
    }

    const hasScrollbars =
      this.scrollbars && this.scrollbars.vertical && this.scrollbars.horizontal;

    if (!!this.props.renderRowDetails || !!this.props.renderDetailsGrid) {
      if (this.props.rtl && !getScrollbarWidth() && !this.props.nativeScroll) {
        viewProps.style.transform = `translateX(${-(hasScrollbars ? 2 : 1) *
          scrollbarOffset}px)`;
      }
    } else {
      if (this.props.rtl && !getScrollbarWidth() && !this.props.nativeScroll) {
        viewProps.style.transform = `translateX(${-scrollbarOffset}px)`;
      }
    }

    let result;

    if (this.props.renderView) {
      result = this.props.renderView(viewProps);
    }
    if (result === undefined) {
      result = <div {...viewProps} />;
    }

    return result;
  };

  getEmptyScrollOffset() {
    return this.props.emptyScrollOffset || getScrollbarWidth() || 17;
  }

  renderSizer = (props, scrollHeight) => {
    if (!this.props.nativeScroll) {
      return;
    }
    if (!this.props.virtualized) {
      return null;
    }
    const minWidth =
      Math.max(this.props.availableWidth || 0, this.props.minRowWidth || 0) ||
      0;

    const SCROLLBAR_WIDTH = getScrollbarWidth();

    const sizerStyle = {
      ...props.style,
      minWidth,
      minHeight: props.style
        ? (props.style.minHeight || 0) -
          (!SCROLLBAR_WIDTH ? this.getEmptyScrollOffset() : 0)
        : 0,
    };

    if (this.props.naturalRowHeight) {
      sizerStyle.height = scrollHeight;
    }

    return (
      <div key="grid-sizer" data-name="sizer" {...props} style={sizerStyle} />
    );
  };

  renderScrollerSpacer = spacerProps => {
    if (!this.props.totalFlexColumnCount) {
      // if there are no flex cols, do this
      spacerProps.style.width = this.props.minRowWidth || 0;
    }
  };

  renderScroller = scrollerProps => {
    const {
      data,
      loading,
      virtualized,
      maxVisibleRows,
      nativeScroll,
      availableWidth,
      minRowWidth,
    } = this.props;

    const { length } = data;

    // this is useful here to keep the horizontal sizing
    // at all times - this fixed #tickets/129
    scrollerProps.children.push(
      <div
        key="empty-spacer"
        data-name="empty-spacer"
        style={{
          position: IS_IE && nativeScroll ? 'static' : 'absolute',
          contain: 'strict',
          [this.props.rtl ? 'right' : 'left']: 0,
          height: 1,
          top: 0,
          pointerEvents: 'none',
          minWidth: Math.max(availableWidth, minRowWidth) || 0,
        }}
      >
        {IS_IE && nativeScroll ? this.renderEmptyContent() : null}
      </div>
    );

    if (!virtualized && length < maxVisibleRows) {
      scrollerProps.style = scrollerProps.style || {};
      scrollerProps.style.overflow = 'hidden';
    }

    const hasHorizontalScrollbar =
      this.scrollbars && this.scrollbars.horizontal;

    if (!this.props.renderRowDetails || !this.props.renderDetailsGrid) {
      if (!getScrollbarWidth() && !nativeScroll && hasHorizontalScrollbar) {
        scrollerProps.style.right = 0;
      }
    }

    let result;

    if (this.props.renderScroller) {
      result = this.props.renderScroller(scrollerProps);
    }
    if (result === undefined) {
      result = <div {...scrollerProps} />;
    }

    return result;
  };

  getRowAt = index => {
    return this.getRows().filter(r => r.props.rowIndex === index)[0];
  };

  startEdit = ({ rowIndex, columnIndex, value }) => {
    const row = this.getRowAt(rowIndex);

    if (row) {
      const cell = row.getCellAt(columnIndex);

      if (cell) {
        return cell.startEdit(value);
      }
    }
    return Promise.reject(null);
  };

  tryStartEdit({ rowIndex, columnIndex, dir }) {
    const row = this.getRowAt(rowIndex);

    if (row) {
      return row.tryRowCellEdit(columnIndex, dir);
    }
    return Promise.reject(null);
  }

  completeEdit = ({ rowIndex, columnIndex, value }) => {
    const row = this.getRowAt(rowIndex);

    if (row) {
      const cell = row.getCellAt(columnIndex);

      if (cell) {
        cell.completeEdit(value);
      }
    }
  };

  cancelEdit = ({ rowIndex, columnIndex }) => {
    const row = this.getRowAt(rowIndex);

    if (row) {
      const cell = row.getCellAt(columnIndex);

      if (cell) {
        cell.cancelEdit();
      }
    }
  };

  onContainerScroll = (
    scrollPos: TypeScrollPos,
    prevScrollPos: TypeScrollPos = DEFAULT_SCROLL_POS
  ) => {
    if (this.props.onContainerScroll) {
      this.props.onContainerScroll(scrollPos, prevScrollPos);
    }
    const oldScrollingDirection = this.scrollingDirection;
    if (
      scrollPos.scrollTop === prevScrollPos.scrollTop &&
      scrollPos.scrollLeft === prevScrollPos.scrollLeft
    ) {
      return;
    }
    this.scrollingDirection =
      scrollPos.scrollLeft === prevScrollPos.scrollLeft
        ? 'vertical'
        : 'horizontal';

    if (this.scrollingDirection === oldScrollingDirection) {
      return;
    }

    if (this.props.virtualized) {
      this.getDOMNode()?.classList?.add(`${VirtualListClassName}--scrolling`);
      requestAnimationFrame(() => {
        this.getRows().forEach(r =>
          r ? r.setScrolling(this.scrollingDirection) : null
        );
      });
    }
  };

  onScrollStop = () => {
    this.scrollingDirection = 'none';
    if (this.props.virtualized) {
      this.getDOMNode()?.classList?.remove(
        `${VirtualListClassName}--scrolling`
      );
      this.getRows().forEach(r => {
        if (!r) {
          return;
        }

        r.setScrolling(false);
      });
    }

    if (this.props.onScrollStop) {
      this.props.onScrollStop();
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.columnRenderCount != this.props.columnRenderCount) {
      raf(() => {
        this.updateOnScrollLeft(undefined, true, this.props);
      });
    }

    const { lockedStartColumns, lockedEndColumns } = this.props;
    const hasLocked =
      (lockedStartColumns && lockedStartColumns.length) ||
      (lockedEndColumns && lockedEndColumns.length);

    if (hasLocked) {
      // make sure everything is still in place when
      // toggling between locked/unlocked mode
      this.onContainerScrollHorizontal(this._scrollLeft);
    }
  }

  setColumnRenderStartIndex = (columnRenderStartIndex, force) => {
    if (this.__willUnmount) {
      return;
    }
    if (this.resizing && !force) {
      return;
    }
    if (columnRenderStartIndex === this.columnRenderStartIndex && !force) {
      return;
    }
    if (!this.virtualList) {
      return;
    }

    if (this.props.onColumnRenderStartIndexChange) {
      this.props.onColumnRenderStartIndexChange(columnRenderStartIndex);
    }
    this.columnRenderStartIndex = columnRenderStartIndex;

    const rows = this.virtualList.getRows();

    rows.forEach(row => {
      const rowInstance = row.getInstance();
      if (rowInstance) {
        requestAnimationFrame(() => {
          rowInstance.setColumnRenderStartIndex(columnRenderStartIndex);
        });
      }
    });
  };

  getRows = () => {
    if (!this.virtualList) {
      return [];
    }
    return this.virtualList.getRows().map(row => row.getInstance());
  };

  getScrollLeftMax() {
    return this.virtualList ? this.virtualList.scrollLeftMax : 0;
  }

  onScrollbarsChange = scrollbars => {
    this.scrollbars = scrollbars;

    if (!scrollbars.horizontal) {
      // we need to do this on raf because of onResize being called lazily
      raf(() => {
        this.onContainerScrollHorizontal(0);
      });
    }

    if (this.props.onScrollbarsChange) {
      this.props.onScrollbarsChange(scrollbars);
    }
    if (this.props.scrollProps && this.props.scrollProps.onScrollbarsChange) {
      this.props.scrollProps.onScrollbarsChange(scrollbars);
    }
  };

  onResize = (...args) => {
    if (this.props.onResize) {
      this.props.onResize(...args);
    }

    this.visibleCount = this.getVisibleCount();
    this.resizing = true;

    raf(() => {
      this.resizing = false;
      let force;
      this.updateOnScrollLeft(undefined, (force = true));
    });
  };

  onContainerScrollHorizontal = (scrollLeft, force) => {
    if (scrollLeft < 0) {
      // protect against SAFARI inertial scroling reporting negative values when bouncing
      scrollLeft = 0;
    }
    scrollLeft = Math.round(scrollLeft);
    this._scrollLeft = scrollLeft;

    if (this.__willUnmount) {
      return;
    }
    if (this.props.onContainerScrollHorizontal) {
      this.props.onContainerScrollHorizontal(scrollLeft);
    }
    if (
      this.props.scrollProps &&
      this.props.scrollProps.onContainerScrollHorizontal
    ) {
      this.props.scrollProps.onContainerScrollHorizontal(scrollLeft);
    }

    scrollLeft = this._scrollLeft;

    this.updateOnScrollLeft(scrollLeft);
  };

  updateOnScrollLeft = (
    scrollLeft = this._scrollLeft,
    force = false,
    props = this.props
  ) => {
    if (this.__willUnmount) {
      return;
    }
    let columnRenderStartIndex;
    if (props.virtualizeColumns) {
      const { lockedStartColumns, columnWidthPrefixSums } = props;

      if (!columnRenderStartIndex) {
        const lockedOffset =
          lockedStartColumns.length &&
          columnWidthPrefixSums[lockedStartColumns.length]
            ? columnWidthPrefixSums[lockedStartColumns.length]
            : 0;
        columnRenderStartIndex = searchClosestSmallerValue(
          props.columnWidthPrefixSums,
          scrollLeft + lockedOffset
        );
      }

      this.setColumnRenderStartIndex(columnRenderStartIndex, force);
    }

    if (this.activeRowIndicatorHandle) {
      this.activeRowIndicatorHandle.setScrollLeft(scrollLeft);
    }

    if (this.props.updateLockedWrapperPositions) {
      this.props.updateLockedWrapperPositions.call(
        this,
        this.props,
        scrollLeft
      );
    }
  };

  getDOMNode = () => {
    return this.node || (this.node = this.virtualList.getDOMNode());
  };

  renderRow = args => {
    const { rowHeight, index, renderIndex, empty, sticky } = args;

    const setRowSpan = rowSpan => {
      args.rowSpan = rowSpan;
    };
    const result = this.computeRows(this.props, {
      empty,
      from: index,
      sticky,
      to: index + 1,
      renderIndex,
      rowHeight,
      setRowSpan,
    })[0];

    return result;
  };

  getVisibleCount = () => {
    return this.virtualList ? this.virtualList.getVisibleCount() : -1;
  };
}

const propTypes = Object.assign({}, virtualListPropTypes, {
  count: PropTypes.number,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      computedWidth: PropTypes.number,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      render: PropTypes.func,
    })
  ),
  data: PropTypes.array,
  from: PropTypes.number,
  updateLockedWrapperPositions: PropTypes.any,
  // true if there is at least one locked column, false otherwise
  idProperty: PropTypes.string,
  maxWidth: PropTypes.number,
  minRowHeight: PropTypes.number,
  minWidth: PropTypes.number,
  onColumnRenderStartIndexChange: PropTypes.func,
  rowHeight: PropTypes.number,
  renderScroller: PropTypes.func,
  renderScrollerSpacer: PropTypes.func,
  renderActiveRowIndicator: PropTypes.func,
  showWarnings: PropTypes.bool,
  to: PropTypes.number,
  virtualizeColumns: PropTypes.bool,
  browserScroll: PropTypes.bool,
});

delete propTypes.renderRow;

InovuaDataGridList.propTypes = propTypes;

InovuaDataGridList.defaultProps = {
  showWarnings: false,
};
