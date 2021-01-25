/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import contains from '../../../packages/contains';

import cleanupProps from '../../../packages/react-clean-props';

import RO from 'resize-observer-polyfill';

import VirtualScrollContainer, {
  getScrollbarWidth,
  hasSticky,
  NativeScrollContainer,
} from '../../../packages/react-virtual-scroll-container-pro/src';

import uglified from '../../../packages/uglified';
import join from '../../../packages/join';
import binarySearch from '../../../packages/binary-search';

import RowHeightManager from './RowHeightManager';

import getFocusableElements from '../../getFocusableElements';
import renderRows from './renderRows';
import Row from './Row';
import shouldComponentUpdate from '../../../packages/shouldComponentUpdate';
import getVisibleRange from './getVisibleRange';

import StickyRowsContainer from './StickyRowsContainer';

import { TypeStickyRowInfo } from './TypeStickyRowInfo';
import throttle from 'lodash.throttle';

const sortAsc = (a: number, b: number): number => a - b;

const emptyFn = function() {};
const emptyObject = Object.freeze ? Object.freeze({}) : {};

const ua = global.navigator ? global.navigator.userAgent : '';
const IS_EDGE = ua.indexOf('Edge/') !== -1;
const IS_FF = ua.toLowerCase().indexOf('firefox') > -1;

const BASE_CLASS_NAME = 'inovua-react-virtual-list';

const ResizeObserver = global.ResizeObserver || RO;

const sum = (a: number, b: number): number => a + b;

const unique = (arr: number[]) => {
  if (Set) {
    return [...new Set(arr)];
  }

  return Object.keys(
    arr.reduce((acc, item) => {
      acc[item] = true;
      return acc;
    }, {})
  );
};

type TypeProps = {
  enableRowSpan: boolean;
  recycleCoveredRows: boolean;
  stickyRows: {
    [key: number]: number;
  };
};
export default class InovuaVirtualList extends Component<TypeProps> {
  private size: { width: number; height: number };
  private rows: Row[];
  private rowSpans: { [key: number]: number };
  private rowCoveredBy: { [key: number]: number };

  constructor(props: TypeProps) {
    super(props);

    this.initSizes(props);
    this.visibleCount = undefined;
    this.size = { height: 0, width: 0 };

    this.scrollTopPos = 0;
    this.scrollLeftPos = 0;
    this.prevScrollLeftPos = 0;
    this.prevScrollTopPos = 0;

    this.mapping = {};
    this.rowSpans = {};
    this.rowCoveredBy = {};
    this.rows = [];

    this.refScrollContainer = c => {
      this.scrollContainer = c;
    };

    this.refStickyContainer = c => {
      this.stickyRowsContainer = c;
    };

    this.refContainerNode = domNode => {
      this.containerNode = domNode;
    };

    this.updateRows = throttle(this.updateRows, 16);
  }

  renderScroller = props => {
    let offset = this.getEmptyScrollOffset() || 0;

    if (this.props.nativeScroll) {
      offset = 0;
    }

    const style = {
      ...props.style,
      overscrollBehavior: this.props.overscrollBehavior || 'none',
      backfaceVisibility: 'hidden',
      WebkitOverscrollBehavior: this.props.overscrollBehavior || 'none',
      right: -offset,
      bottom: -offset,
    };

    props.style = style;

    if (
      this.props.showEmptyRows &&
      this.props.count < this.strictVisibleCount
    ) {
      style.overflowY = 'hidden';
    }
    let result;
    if (this.props.renderScroller) {
      result = this.props.renderScroller(props);
    }
    if (result === undefined) {
      result = <div {...props} />;
    }
    return result;
  };

  renderScrollerSpacerOnNaturalRowHeight = (spacerProps: any) => {
    spacerProps.style.height = this.getScrollHeight();

    if (this.props.renderScrollerSpacer) {
      this.props.renderScrollerSpacer(spacerProps);
    }
  };

  renderView = (props: any) => {
    let offset = this.getEmptyScrollOffset() || 0;

    if (this.props.nativeScroll) {
      offset = 0;
    }

    const minHeight = offset ? `calc(100% - ${offset}px)` : '100%';
    let maxWidth = offset ? `calc(100% - ${offset}px)` : '100%';

    if (this.props.rtl && !this.props.nativeScroll) {
      maxWidth = '100%';
    }

    const style = {
      ...props.style,
      minHeight,
      maxWidth,
    };

    // to hide the native vertical scrollbar, which gets visible
    if (this.props.rtl && !getScrollbarWidth()) {
      style.transform = `translateX(${-offset}px)`;
    }

    const viewProps = {
      ...props,
      style,
      'data-name': 'view',
    };

    let result;
    if (this.props.renderView) {
      result = this.props.renderView(viewProps);
    }

    if (result === undefined) {
      result = <div {...viewProps} />;
    }

    return result;
  };

  getTotalRowHeight = (props = this.props) => {
    return props.rowHeightManager
      ? props.rowHeightManager.getTotalSize(props.count)
      : props.count * props.rowHeight;
  };

  getScrollHeight = () => {
    const SCROLLBAR_WIDTH = getScrollbarWidth();
    let offset = SCROLLBAR_WIDTH ? 0 : this.getEmptyScrollOffset() || 0;
    if (this.props.nativeScroll) {
      offset = 0;
    }
    const height = this.getTotalRowHeight();

    return height + offset;
  };

  getScrollSize = node => {
    const res = {
      width: node.scrollWidth,
      height: this.getScrollHeight(),
    };

    return res;
  };
  getClientSize = n => {
    const node = n.firstChild;
    const SCROLLBAR_WIDTH = getScrollbarWidth();
    let offset = SCROLLBAR_WIDTH ? 0 : this.getEmptyScrollOffset() || 0;
    if (this.props.nativeScroll) {
      offset = 0;
    }
    return {
      width: node.clientWidth + offset,
      height: node.clientHeight + offset,
    };
  };

  initSizes = (props = this.props) => {
    const { minRowHeight, rowHeightManager } = props;
    if (rowHeightManager) {
      return;
    }
    const count = this.getMaxRenderCount(props);

    const rowOffsets = [];

    let totalHeight = 0;

    const rowHeights = [...Array(count)].map(() => {
      rowOffsets.push(totalHeight);
      totalHeight += minRowHeight;
      return minRowHeight;
    });

    rowOffsets[count] = totalHeight;
    this.rowOffsets = rowOffsets;
    this.rowHeights = rowHeights;
  };
  /**
   * the indexes need to be successive numbers, in asc order
   */
  setHeightForRows = (indexes, heights) => {
    if (!indexes.length || !heights.length) {
      return 0;
    }

    if (this.props.showWarnings) {
      if (indexes.length != heights.length) {
        console.warn('setHeightForRows signature mismatch!!!');
        return 0;
      }

      indexes.forEach((_, i) => {
        if (i > 0) {
          const diff = indexes[i] - indexes[i - 1];
          if (diff !== 1) {
            console.warn(
              'setHeightForRows should be called with successive indexes!',
              indexes
            );
          }
        }
      });
    }

    const { rowHeights, rowOffsets } = this;
    const { count } = this.props;

    let diff = 0;

    indexes.forEach((index, i) => {
      const height = heights[i] || 0;
      const oldHeight = rowHeights[index] || 0;
      rowHeights[index] = height;
      rowOffsets[index] = diff + (rowOffsets[index] || 0);
      diff += height - oldHeight;
    });

    for (let i = indexes[indexes.length - 1] + 1; i <= count; i++) {
      rowOffsets[i] = diff + (rowOffsets[i] || 0);
    }

    return diff;
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shouldComponentUpdate(this, nextProps, nextState);
  }

  renderSizer = scrollHeight => {
    const {
      renderSizer,
      minRowWidth,
      emptyScrollOffset,
      rowHeightManager,
      showEmptyRows,
    } = this.props;

    const SCROLLBAR_WIDTH = getScrollbarWidth();
    const offset = SCROLLBAR_WIDTH ? 0 : emptyScrollOffset || 0;

    let minHeight = scrollHeight + offset;

    if (showEmptyRows) {
      minHeight = Math.max(
        minHeight,
        this.strictVisibleCount * rowHeightManager.getDefaultRowHeight()
      );
    }

    const style = {
      minHeight: isNaN(minHeight) ? '' : minHeight,
      minWidth: minRowWidth ? minRowWidth + offset : 0,
    };

    let result;
    if (renderSizer) {
      result = renderSizer({ style }, scrollHeight);
    }

    if (result === undefined) {
      result = <div key="sizer" data-name="sizer" style={style} />;
    }
    return result;
  };

  renderRowContainer = () => {
    const props = {
      key: 'rowContainer',
      className: `${BASE_CLASS_NAME}__row-container`,
      ref: this.refContainerNode,
      children: this.renderRows(),
    };
    let result;
    if (this.props.renderRowContainer) {
      result = this.props.renderRowContainer(props);
    }
    if (result === undefined) {
      result = <div {...props} />;
    }
    return result;
  };

  renderStickyRowsContainer() {
    return this.props.stickyRows ? (
      <StickyRowsContainer
        rtl={this.props.rtl}
        stickyOffset={this.props.stickyOffset}
        handle={this.refStickyContainer}
        rowHeightManager={this.props.rowHeightManager}
      />
    ) : null;
  }

  render() {
    const { props } = this;
    const {
      naturalRowHeight,
      scrollProps,
      theme,
      minRowHeight,
      rowHeightManager,
      count,
    } = props;

    const style = { position: 'relative', ...this.props.style };
    const className = join(
      props.className,
      BASE_CLASS_NAME,
      theme && `${BASE_CLASS_NAME}--theme-${theme}`,
      `${BASE_CLASS_NAME}--virtual-scroll`
    );

    const scrollHeight = rowHeightManager
      ? rowHeightManager.getTotalSize(count)
      : this.scrollHeight || minRowHeight * count;

    const rowContainer = this.renderRowContainer();
    const sizer = this.renderSizer(scrollHeight);
    const stickyRowsContainer = this.renderStickyRowsContainer();

    let children;

    if (hasSticky()) {
      children = React.Fragment ? (
        <React.Fragment>
          {rowContainer}
          {sizer}
        </React.Fragment>
      ) : (
        [rowContainer, sizer]
      );
    } else {
      children = (
        <div>
          {rowContainer}
          {sizer}
        </div>
      );
    }

    const Factory = this.props.nativeScroll
      ? NativeScrollContainer
      : VirtualScrollContainer;

    let renderScrollerSpacer = this.props.renderScrollerSpacer;

    if (naturalRowHeight) {
      renderScrollerSpacer = this.renderScrollerSpacerOnNaturalRowHeight;
    }

    return (
      <Factory
        contain={this.props.contain}
        ResizeObserver={
          this.props.ResizeObserver !== undefined
            ? this.props.ResizeObserver
            : ResizeObserver
        }
        extraChildren={stickyRowsContainer}
        useTransformToScroll={this.props.useTransformPosition}
        {...cleanupProps(props, InovuaVirtualList.propTypes)}
        {...scrollProps}
        rtl={this.props.rtl}
        nativeScroll={this.props.nativeScroll}
        ref={this.refScrollContainer}
        onScrollbarsChange={this.onScrollbarsChange}
        style={style}
        theme={theme}
        className={className}
        onScrollStart={this.onScrollStart}
        onScrollStop={this.onScrollStop}
        applyScrollStyle={this.applyScrollStyle}
        onResize={this.onResize}
        onViewResize={this.onViewResize}
        renderScroller={this.renderScroller}
        renderScrollerSpacer={renderScrollerSpacer}
        renderView={this.renderView}
        getClientSize={this.getClientSize}
        getScrollSize={this.getScrollSize}
        children={children}
      />
    );
  }

  onViewResize = () => {
    requestAnimationFrame(() => {
      this.rafSync();
    });
  };

  onScrollbarsChange = ({ vertical, horizontal }) => {
    if (
      (!vertical && this.scrollTopPos) ||
      (!horizontal && this.scrollLeftPos)
    ) {
      this.applyScrollStyle({
        scrollTop: !vertical ? 0 : this.scrollTopPos,
        scrollLeft: !horizontal ? 0 : this.scrollLeftPos,
      });
    }

    if (this.props.onScrollbarsChange) {
      this.props.onScrollbarsChange({ vertical, horizontal });
    }
  };

  onRowUnmount = row => {
    // protect against lazy row unmounting
    if (!this.rows) {
      return;
    }
    const currentRowIndex = row.getIndex();

    const isFound = this.mapping[currentRowIndex];
    if (!isFound) {
      return;
    }

    delete this.mapping[currentRowIndex];

    const index = this.rows.indexOf(row);
    if (index != -1) {
      this.rows.splice(index, /* delete count */ 1);
    }
  };

  rowRef = r => {
    if (!r) {
      return;
    }
    this.mapping[r.props.index] = r;
    this.rows[r.props.index] = r;
  };

  onScrollStart = (...args) => {
    this.scrolling = true;

    if (this.props.scrollOneDirectionOnly) {
      const [scrollPos, prevScrollPos] = args;

      const absTop = Math.abs(scrollPos.scrollTop - prevScrollPos.scrollTop);
      const absLeft = Math.abs(scrollPos.scrollLeft - prevScrollPos.scrollLeft);

      const scrollerNode = this.getScrollerNode();

      if (absTop != absLeft) {
        this.disableScrollPropName =
          absTop > absLeft ? 'overflowX' : 'overflowY';
        this.disableScrollOtherPropName =
          absTop > absLeft ? 'overflowY' : 'overflowX';

        this.disableScrollPropValue =
          scrollerNode.style[this.disableScrollPropName];

        scrollerNode.style[this.disableScrollOtherPropName] = 'scroll';
        scrollerNode.style[this.disableScrollPropName] = 'hidden';
      }
    }

    if (this.props.onScrollStart) {
      this.props.onScrollStart(...args);
    }
  };

  getScrollerNode = () => {
    return this.scrollContainer.scrollerNode;
  };

  onScrollStop = (...args) => {
    this.scrolling = false;

    if (this.props.scrollOneDirectionOnly) {
      const scrollerNode = this.getScrollerNode();

      scrollerNode.style[
        this.disableScrollPropName
      ] = this.disableScrollPropValue;
      scrollerNode.style.overflow = 'scroll';
    }

    if (this.props.onScrollStop) {
      this.props.onScrollStop(...args);
    }
  };

  getRows = () => {
    const rows = [];

    this.forEachRow(row => {
      if (row) {
        rows.push(row);
      }
    });

    return rows;
  };

  forEachRow = (fn, onlyVisible = true) => {
    const rows = this.rows;
    const visibleCount = this.getVisibleCount();
    let i = -1;
    for (let initialIndex in rows) {
      if (
        rows.hasOwnProperty(initialIndex) &&
        (!onlyVisible || (onlyVisible && initialIndex < visibleCount))
      ) {
        i++;
        fn(rows[initialIndex], i);
      }
    }
  };

  sortRows = rows => {
    return rows.slice().sort((row1, row2) => row1.getIndex() - row2.getIndex());
  };

  getRowAt = index => {
    let row = this.mapping[index];

    if (row && row.getIndex() != index) {
      row = null;
    }

    return row;
  };

  getVisibleCount = (props = this.props) => {
    const { virtualized, enableRowSpan } = props;
    const extraRows = enableRowSpan ? 2 : 0;

    if (this.visibleCount === undefined) {
      return 0;
    }

    if (!virtualized) {
      return (
        (props.showEmptyRows
          ? Math.max(this.visibleCount || 0, props.count || 0)
          : props.count) + extraRows
      );
    }

    return (
      (props.showEmptyRows
        ? this.visibleCount || props.count
        : Math.min(this.visibleCount || props.count, props.count)) + extraRows
    );
  };

  setRowIndex = (row: Row, index: number, callback?: () => void) => {
    const existingRow = this.mapping[index];
    if (existingRow) {
      // there was already a row with that index
      // so keep that, and set the index again on it
      existingRow.setIndex(index, callback);

      // and also make the specified row invisible, if it's a different row
      if (existingRow !== row) {
        row.setVisible(false);
      }
      return;
    }

    const oldIndex = row.getIndex();
    row.setIndex(index, callback);
    delete this.mapping[oldIndex];
    this.mapping[index] = row;
  };

  getSortedRows = (rows = this.getRows()) => {
    return this.sortRows(rows);
  };

  onRowsUpdated = (newIndexes, range, updateScroll) => {
    newIndexes.sort((i1, i2) => i1 - i2);

    const start = newIndexes[0];
    const end = this.props.showEmptyRows
      ? newIndexes[newIndexes.length - 1]
      : Math.min(newIndexes[newIndexes.length - 1], this.props.count - 1);

    const { minRowHeight } = this.props;

    const rowIndexes = [];
    const rowHeights = [];
    const rows = [];

    for (let row, rowHeight, i = start; i <= end; i++) {
      row = this.mapping[i];
      rowHeight = row ? row.getInfo().height : minRowHeight;
      if (row) {
        rows.push(row);
      }
      rowIndexes.push(i);
      rowHeights.push(rowHeight);
    }

    let newToTopHeight = 0;
    let oldTop;

    if (this.oldRowIndexes) {
      oldTop = this.oldRowIndexes[0];
      rowIndexes.forEach((rowIndex, i) => {
        let diff;
        if (rowIndex < oldTop) {
          diff = rowHeights[i] - this.rowHeights[rowIndex];
          newToTopHeight += diff;
        }
      });
    }

    if (rowIndexes.length) {
      this.setHeightForRows(rowIndexes, rowHeights);
    }

    rows.forEach(row => {
      const index = row.getIndex();
      const offset = this.rowOffsets[index];
      row.setOffset(offset);
    });

    this.oldRowIndexes = rowIndexes;
    let newScrollTop;

    if (newToTopHeight) {
      newScrollTop = this.scrollTopPos + newToTopHeight;
      updateScroll(newScrollTop);
      this.forceScrollTop = newScrollTop;
      this.scrollTop = newScrollTop;
    } else {
      updateScroll();
    }
  };

  getVisibleRange = args => {
    return getVisibleRange(args);
  };

  getCurrentVisibleRange = () => {
    const {
      count,
      rowHeightManager,
      rowHeight,
      naturalRowHeight,
      showEmptyRows,
    } = this.props;

    return this.getVisibleRange({
      scrollTop: this.scrollTopPos,
      size: this.size,
      count,
      naturalRowHeight,
      rowHeightManager,
      rowHeight,
      showEmptyRows,
    });
  };

  applyScrollStyle = ({ scrollTop, scrollLeft, force, reorder }, domNode) => {
    // protect against safari inertial scrolling overscroll
    // that can give negative scroll positions
    // which results in weird behaviour
    if (scrollTop < 0) {
      scrollTop = 0;
    }
    if (!this.props.rtl) {
      if (scrollLeft < 0) {
        scrollLeft = 0;
      }
    } else {
      if (scrollLeft > 0) {
        scrollLeft = 0;
      }
    }

    if (this.forceScrollTop !== undefined) {
      scrollTop = this.forceScrollTop;
      this.forceScrollTop = undefined;
      return;
    }

    if (this.props.applyScrollLeft && scrollLeft !== undefined) {
      scrollLeft = 0;
      this.props.applyScrollLeft(scrollLeft, domNode);
    }

    if (scrollTop === undefined) {
      scrollTop = this.prevScrollTopPos;
    }
    if (scrollLeft === undefined) {
      scrollLeft = this.prevScrollLeftPos;
    }

    this.scrollTopPos = scrollTop;
    this.scrollLeftPos = scrollLeft;

    const {
      count,
      useTransformPosition,
      rowHeightManager,
      naturalRowHeight,
      virtualized,
      showEmptyRows,
    } = this.props;

    const range = this.getVisibleRange({
      scrollTop,
      size: this.size,
      count,
      naturalRowHeight,
      rowHeightManager,
      showEmptyRows,
    });
    const startRowIndex = range.start;

    const prevStartRowIndex = this.prevStartRowIndex;

    this.prevScrollTopPos = scrollTop;
    this.prevScrollLeftPos = scrollLeft;

    this.prevStartRowIndex = startRowIndex;

    this.updateStickyRows(scrollTop, range.start, { force: false });

    const updateScroll = (top = scrollTop) => {
      const parentNodeStyle = this.containerNode.parentNode.style;
      const scrollLeftTranslateValue = -scrollLeft;

      if (useTransformPosition) {
        parentNodeStyle.transform = `translate3d(${scrollLeftTranslateValue}px, ${-top}px, 0px)`;
      } else {
        parentNodeStyle.left = `${scrollLeftTranslateValue}px`;
        parentNodeStyle.top = `${-top}px`;
      }
    };

    if (rowHeightManager == null) {
      force = true;
    }

    if ((startRowIndex == prevStartRowIndex && !force) || !virtualized) {
      updateScroll();
      return;
    }

    updateScroll();

    this.updateRows(range, reorder, emptyFn);
  };

  updateRows(
    range: { start: number; end: number },
    reorder: boolean,
    updateScroll
  ) {
    const { rowHeightManager } = this.props;
    const startRowIndex = range.start;
    const endRowIndex = range.end;

    if (this.props.onRenderRangeChange) {
      this.props.onRenderRangeChange(startRowIndex, endRowIndex);
    }

    const rows = this.getSortedRows();
    const gaps = this.getGapsFor(startRowIndex, endRowIndex, rows);

    const newIndexes: number[] = [];

    const { recycleCoveredRows, enableRowSpan } = this.props;

    const visited: { [key: number]: boolean } = {};
    rows.forEach((row: Row, i: number) => {
      const rowIndex = row.getIndex();

      if (reorder) {
        const newRowIndex = startRowIndex + i;
        this.setRowIndex(row, newRowIndex);

        if (rowHeightManager == null) {
          newIndexes.push(newRowIndex);
        }
        return;
      }

      const extraRows = enableRowSpan ? row.getRowSpan() - 1 : 0;

      const outOfView =
        rowIndex + extraRows < startRowIndex ||
        rowIndex > endRowIndex ||
        visited[rowIndex] ||
        (enableRowSpan &&
          recycleCoveredRows &&
          this.rowCoveredBy[rowIndex] !== undefined);

      visited[rowIndex] = true;

      if (rowHeightManager == null) {
        if (outOfView) {
          if (gaps.length) {
            // there are still gaps to be covered
            const newIndex = gaps.pop();
            newIndexes.push(newIndex);
            // so assign one to this row
            this.setRowIndex(row, newIndex);
          } else {
            // no more gaps, so just set the row as invisible
            row.setVisible(false);
          }
        } else {
          // row in view,
          // so make sure it's visible
          row.setVisible(true);
          newIndexes.push(row.getIndex());
        }
        return;
      }

      if (outOfView && gaps.length) {
        const newIndex = gaps.pop();
        this.setRowIndex(row, newIndex);
      }
    });

    if (newIndexes.length && rowHeightManager == null) {
      if (this.updateRafHandle) {
        global.cancelAnimationFrame(this.updateRafHandle);
      }

      this.updateRafHandle = global.requestAnimationFrame(() => {
        this.updateRafHandle = null;
        this.onRowsUpdated(
          newIndexes,
          {
            start: startRowIndex,
            end: endRowIndex,
          },
          () => {}
        );
      });
    }
  }

  get scrollTopMax() {
    return this.mounted ? this.scrollContainer.scrollTopMax : 0;
  }

  get scrollLeftMax() {
    return this.mounted ? this.scrollContainer.scrollLeftMax : 0;
  }

  getScrollingElement = () => {
    return this.scrollContainer;
  };

  get scrollTop() {
    return this.mounted ? this.getScrollingElement().scrollTop : 0;
  }

  set scrollTop(value) {
    const element = this.getScrollingElement();
    if (element) {
      element.scrollTop = value;
    }
  }

  get scrollLeft() {
    return this.mounted ? this.getScrollingElement().scrollLeft : 0;
  }

  set scrollLeft(value) {
    const element = this.getScrollingElement();
    if (element) {
      element.scrollLeft = value;
    }
  }

  smoothScrollTo = (...args) => {
    this.scrollContainer.smoothScrollTo(...args);
  };

  componentDidMount = () => {
    this.mounted = true;

    this.setupRowHeightManager(this.props.rowHeightManager);
  };

  componentWillUnmount() {
    if (this.props.rowHeightManager) {
      this.props.rowHeightManager.removeListener('index', this.onIndex);
    }
    this.mounted = false;
    this.unmounted = true;
    this.rows = null;
    this.rowHeights = null;
    this.rowOffsets = null;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const nextCount = Math.max(nextProps.count, 0);
    const rowHeightChange =
      this.props.rowHeight && nextProps.rowHeight != this.props.rowHeight;

    if (this.props.renderRow !== nextProps.renderRow) {
      this.rowCoveredBy = {};
      this.rowSpans = {};
    }

    if (
      nextCount != this.props.count ||
      nextProps.showEmptyRows != this.props.showEmptyRows ||
      rowHeightChange
    ) {
      const oldVisibleCount = this.getVisibleCount();
      this.updateVisibleCount(this.size.height, nextProps);
      this.cleanupRows(nextProps);

      this.reorder =
        rowHeightChange || this.getVisibleCount(nextProps) < oldVisibleCount;

      // optimize this
      this.initSizes(nextProps);
    }
  }

  componentDidUpdate(prevProps) {
    let prevScrollTopPos;
    let prevScrollLeftPos;
    if (this.props.nativeScroll !== prevProps.nativeScroll) {
      prevScrollTopPos = this.scrollTopPos;
      prevScrollLeftPos = this.scrollLeftPos;

      global.requestAnimationFrame(() => {
        if (this.unmounted) {
          return;
        }
        this.scrollTop = prevScrollTopPos;
        this.scrollLeft = prevScrollLeftPos;
      });
    }

    if (this.props.rowHeightManager !== prevProps.rowHeightManager) {
      if (prevProps.rowHeightManager) {
        prevProps.rowHeightManager.removeListener('index', this.onIndex);
      }
      this.setupRowHeightManager(this.props.rowHeightManager);
    }

    if (
      this.props.count != prevProps.count ||
      this.props.renderRow != prevProps.renderRow ||
      this.props.rowHeightManager != prevProps.rowHeightManager ||
      this.props.rowHeightManager == null ||
      this.props.showEmptyRows != prevProps.showEmptyRows
    ) {
      const refreshConfig = { reorder: this.reorder };

      if (prevScrollTopPos !== undefined) {
        refreshConfig.scrollTop = prevScrollTopPos;
        refreshConfig.scrollLeft = prevScrollLeftPos;
      }

      if (this.props.count <= this.visibleCount) {
        // there will be no scroll, so compute as if scrollPosition is zero
        refreshConfig.scrollTop = 0;
      }
      if ((IS_EDGE || IS_FF) && this.props.count < prevProps.count) {
        this.fixEdgeScrollPosition();
      }
      this.reorder = false;
      this.refreshLayout(refreshConfig);
    }

    if (prevProps.stickyRows !== this.props.stickyRows) {
      this.updateStickyRows(undefined, undefined, { force: true });
    }
  }

  fixEdgeScrollPosition = () => {
    if (!(IS_EDGE || IS_FF)) {
      return;
    }

    // because of a weird behavior in edge, we cannot use this.scrollTopMax
    const maxTop =
      this.getTotalRowHeight() -
      (this.scrollContainer.viewNode
        ? this.scrollContainer.viewNode.offsetHeight
        : 0);

    if (this.scrollTop > maxTop) {
      global.requestAnimationFrame(() => {
        if (this.unmounted) {
          return;
        }
        this.scrollTop = maxTop;
      });
    }
  };

  setupRowHeightManager = rowHeightManager => {
    if (rowHeightManager) {
      rowHeightManager.on('index', this.onIndex);
    }
  };

  onIndex = () => {
    this.updateVisibleCount(this.size.height);

    this.forceUpdate(() => {
      if (this.unmounted) {
        return;
      }
      this.refreshLayout({ reorder: false, force: true });
      this.cleanupRows();
      this.fixEdgeScrollPosition();

      this.rows.forEach(row => {
        row.setIndex(row.getIndex(), undefined, undefined, true);
      });
    });
  };

  refreshLayout = config => {
    const defaults = {
      force: true,
      reorder: true,
    };

    this.adjustHeights();
    const options = config ? { ...defaults, ...config } : defaults;

    this.applyScrollStyle(options);
  };

  getOverlappingHeight = () => {
    if (this.scrollContainer && this.scrollContainer.getBeforeAndAfterHeight) {
      return this.scrollContainer.getBeforeAndAfterHeight();
    }

    return 0;
  };

  updateVisibleCount = (height, props) => {
    props = props || this.props;

    const { rowHeightManager, minRowHeight, showEmptyRows } = props;
    const strictVisibleCount = rowHeightManager
      ? Math.ceil(height / rowHeightManager.getMinHeight())
      : Math.ceil(height / (minRowHeight || 1));

    this.strictVisibleCount = strictVisibleCount;

    // we're doing + 1 since if there fit exactly n rows, if the user scrolls
    // to half a row, there can be n + 1 visible rows at max
    this.visibleCount = rowHeightManager
      ? strictVisibleCount + 1
      : strictVisibleCount + 2;

    const maxCount = props.count;

    if (this.visibleCount > maxCount && !showEmptyRows) {
      this.visibleCount = maxCount;
    }
  };

  getGapsFor = (startRowIndex, endRowIndex, sortedRows) => {
    const visibleRowPositions: { [key: number]: boolean } = {};
    const { enableRowSpan } = this.props;

    const rows = sortedRows || this.getSortedRows();

    rows.forEach(row => {
      if (row.isVisible()) {
        visibleRowPositions[row.getIndex()] = true;
      }
    });

    const gaps = [];

    if (enableRowSpan && this.rowCoveredBy[startRowIndex] != null) {
      // the startRowIndex is a covered row
      // so move startRowIndex up to the row before it that has the rowspan
      startRowIndex = this.rowCoveredBy[startRowIndex];
    }

    let alreadyVisible: boolean;
    let coveredBy: number;

    for (; startRowIndex <= endRowIndex; startRowIndex++) {
      alreadyVisible = visibleRowPositions[startRowIndex];

      if (enableRowSpan && !alreadyVisible) {
        coveredBy = this.rowCoveredBy[startRowIndex];
        if (coveredBy != null) {
          // if we can recycle the row,
          // behave as if the row is already visible
          // since we can reuse it and can skip the row from
          // being included in the missing row gaps
          alreadyVisible = this.props.recycleCoveredRows;
        }
      }

      if (!alreadyVisible) {
        gaps.push(startRowIndex);
      }
    }

    return gaps;
  };

  getCleanupRows = (props = this.props) => {
    const indexes = [];
    const { length } = this.rows;
    const visibleCount = this.getVisibleCount(props);

    for (let i = visibleCount; i < length; i++) {
      indexes.push(i);
    }

    return indexes;
  };

  cleanupRows = (props = this.props) => {
    // now clear extra remaining rows from memory
    // since we have kept references to every row
    // we need to delete those from memory
    this.getCleanupRows(props).forEach(i => {
      const row = this.rows[i];

      if (row) {
        delete this.mapping[row.getIndex()];
        delete this.rows[i];
      }
    });
  };

  getDOMNode() {
    return this.scrollContainer
      ? this.scrollContainer.domNode || this.scrollContainer.getDOMNode()
      : null;
  }

  onResize = () => {
    const node = this.getDOMNode();
    if (!node) {
      return;
    }
    const size = this.props.measureSize
      ? this.props.measureSize(node)
      : { width: node.clientWidth, height: node.clientHeight };

    size.height -= this.getOverlappingHeight();
    this.size = size;

    if (
      this.props.scrollProps &&
      typeof this.props.scrollProps.onResize == 'function'
    ) {
      this.props.scrollProps.onResize(size);
    }

    this.updateVisibleCount(size.height);

    if (this.props.virtualized) {
      if (this.props.showEmptyRows) {
        this.initSizes();
      }

      this.forceUpdate(() => {
        if (this.unmounted) {
          return;
        }
        this.refreshLayout({ reorder: false, force: true });
        this.cleanupRows();
      });
    }

    if (this.props.onResize) {
      this.props.onResize(size);
    }
  };

  setRowRowSpan = (rowIndex: number, rowSpan: number) => {
    if (rowSpan === 1) {
      return;
    }

    this.rowSpans[rowIndex] = rowSpan;

    let current = rowIndex + 1;
    const last = rowIndex + rowSpan - 1;
    for (; current <= last; current++) {
      this.rowCoveredBy[current] = rowIndex;
    }
  };

  renderRows() {
    const { props } = this;
    const {
      rowHeight,
      renderRow,
      count,
      pureRows,
      rowHeightManager,
      showEmptyRows,
      virtualized,
      rowContain,
      naturalRowHeight,
      useTransformRowPosition,
    } = props;

    let to = this.getVisibleCount();

    return renderRows({
      ref: this.rowRef,
      onUnmount: this.onRowUnmount,
      notifyRowSpan: this.setRowRowSpan,
      pure: pureRows,
      renderRow,
      rowHeightManager,
      rowHeight,
      rowContain,
      count,
      from: 0,
      to,
      naturalRowHeight,
      onKeyDown: this.onRowKeyDown,
      onFocus: this.onRowFocus,
      useTransformPosition: useTransformRowPosition,
      showEmptyRows,
      virtualized,
    });
  }

  onRowKeyDown = (index, event) => {
    if (event.key !== 'Tab') {
      return;
    }

    if (this.props.handleRowKeyDown) {
      this.props.handleRowKeyDown(index, event);
      return;
    }

    const activeElement = global.document.activeElement;
    const theRow = this.getRowAt(index);
    const rowNode = theRow.getDOMNode ? theRow.getDOMNode() : theRow.node;

    if (!activeElement || !contains(rowNode, activeElement)) {
      // the current focused element is not inside the row
      // so no need to do further work
      return;
    }

    const dir = event.shiftKey ? -1 : 1;
    const nextIndex = index + dir;
    const maxCount = this.getMaxRenderCount();

    if (nextIndex < 0 || nextIndex >= maxCount) {
      return;
    }

    const thisElements = this.props.getRowFocusableElements
      ? this.props.getRowFocusableElements(index, rowNode)
      : getFocusableElements(rowNode);

    if (thisElements && thisElements.length) {
      // the current row has focusable elements

      // but if the current active element is not the first or not the last,
      // let the browser handle the focus
      const limit = dir === -1 ? 0 : thisElements.length - 1;
      if (thisElements[limit] !== activeElement) {
        // and do nothing to help the browser
        return;
      }
    }

    if (
      typeof this.props.shouldPreventDefaultTabKeyOnRow !== 'function' ||
      this.props.shouldPreventDefaultTabKeyOnRow(index, event) !== false
    ) {
      event.preventDefault();
    }

    this.focusRow(nextIndex, dir);
  };

  getMaxRenderCount = (props = this.props) => {
    const visibleCount = this.getVisibleCount(props);

    const maxCount = props.showEmptyRows
      ? Math.max(visibleCount || 0, props.count)
      : Math.max(props.count || 0, 0);

    return maxCount;
  };

  focusRow = (index, dir, callback) => {
    if (index >= this.getMaxRenderCount() || index < 0) {
      return;
    }

    this.scrollToIndex(
      index,
      { direction: dir == 1 ? 'bottom' : 'top' },
      () => {
        const nextRow = this.getRowAt(index);
        const nextRowNode = nextRow.getDOMNode
          ? nextRow.getDOMNode()
          : nextRow.node;

        const elements = this.props.getRowFocusableElements
          ? this.props.getRowFocusableElements(index, nextRowNode)
          : getFocusableElements(nextRowNode);

        if (elements.length) {
          const focusIndex = dir === -1 ? elements.length - 1 : 0;
          elements[focusIndex].focus();
        }

        if (typeof callback == 'function') {
          callback();
        }
      }
    );
  };

  isRowRendered = index => {
    return !!this.getRowAt(index);
  };

  getStickyRowsArray = (): {
    rows: TypeStickyRowInfo[];
    scales: number[];
    rowsPerScales: TypeStickyRowInfo[][];
  } => {
    const stickyRows: { [x: string]: number } = this.props.stickyRows;

    const scaleMap: { [key: number]: TypeStickyRowInfo[] } = {};
    const rows = Object.keys(stickyRows)
      .map((key: string, i: number) => {
        const scale = +(stickyRows[key] || 1);
        const row: { index: number; scale: number } = {
          index: +key,
          scale,
          indexInAllRows: i,
        };
        scaleMap[scale] = scaleMap[scale] || [];
        scaleMap[scale].push(row);
        return row;
      })
      .sort((a, b) => sortAsc(a.index, b.index));

    const scales = (unique(rows.map(r => r.scale)) as number[]).sort(sortAsc);
    const result = {
      rows,
      scales,
      rowsPerScales: scales.map(scale => scaleMap[scale]),
    };

    return result;
  };

  private currentStickyRows: TypeStickyRowInfo[] = [];

  updateStickyRows = (
    scrollTop: number = this.scrollTop,
    firstVisibleRowIndex?: number,
    { force }: { force: boolean } = { force: true }
  ) => {
    if (!this.props.stickyRows) {
      return;
    }

    const { rowsPerScales, rows: allRows } = this.getStickyRowsArray();

    if (firstVisibleRowIndex === undefined) {
      firstVisibleRowIndex = this.getCurrentVisibleRange().start;
    }

    firstVisibleRowIndex = firstVisibleRowIndex || 0;

    let enteringRows: number[] = [];

    const comparator = ({ index }: { index: number }, b: number) =>
      sortAsc(index, b);

    let initialIndex = -1;
    const currentStickyRows: TypeStickyRowInfo[] = [];
    const currentStickyRowsMap = [];
    let maxStickyRowIndex = -1;

    let firstFreeVisibleRowIndex = firstVisibleRowIndex as number;

    rowsPerScales.forEach(rows => {
      if (!rows.length) {
        return;
      }

      const foundIndex = binarySearch(
        rows,
        firstFreeVisibleRowIndex,
        comparator
      );

      let computedFoundIndex = foundIndex;
      let stickyRow;
      let stickyRowIndex;

      if (foundIndex < 0) {
        computedFoundIndex = ~foundIndex - 1;
      }

      stickyRow = rows[computedFoundIndex];

      if (stickyRow) {
        stickyRowIndex = stickyRow.index;

        if (stickyRowIndex > initialIndex) {
          firstFreeVisibleRowIndex++;
          currentStickyRows.push(stickyRow);
          currentStickyRowsMap[stickyRowIndex] = true;
          initialIndex = stickyRowIndex;
          maxStickyRowIndex = Math.max(maxStickyRowIndex, stickyRowIndex);
        }

        const nextRow = allRows[stickyRow.indexInAllRows + 1];
        if (nextRow && nextRow.index <= firstFreeVisibleRowIndex) {
          enteringRows.push(nextRow);
        }
      }
    });

    enteringRows = enteringRows.filter(
      row => !currentStickyRowsMap[row.index] && row.index > maxStickyRowIndex
    );

    const enteringRow = enteringRows[0];

    if (
      JSON.stringify(this.currentStickyRows) ===
        JSON.stringify(currentStickyRows) &&
      !force
    ) {
      this.stickyRowsContainer.setEnteringRow({
        enteringRow,
        scrollTop,
      });

      return;
    }

    this.setStickyRows(currentStickyRows, scrollTop, enteringRow);
  };

  setStickyRows = (
    currentStickyRows: TypeStickyRowInfo[] = this.currentStickyRows,
    scrollTop = this.scrollTop,
    enteringRow
  ) => {
    this.currentStickyRows = currentStickyRows;

    const rowElements: JSX.Element[] = currentStickyRows.map(row => {
      return this.renderStickyRow(row.index);
    });

    this.stickyRowsContainer.setStickyRows(
      rowElements.length ? rowElements : null,
      currentStickyRows,
      {
        enteringRow,
        scrollTop,
      }
    );

    this.currentStickyRows = currentStickyRows;
  };

  renderStickyRow = index => {
    const {
      rowHeight,
      renderRow,
      count,
      pureRows,
      rowHeightManager,
      showEmptyRows,
      virtualized,
      rowContain,
      naturalRowHeight,
      useTransformRowPosition,
    } = this.props;

    return renderRows({
      pure: pureRows,
      renderRow,
      rowHeightManager,
      rowHeight,
      rowContain,
      count,
      from: index,
      to: index + 1,
      naturalRowHeight,
      sticky: true,
      useTransformPosition: useTransformRowPosition,
      virtualized: false,
    })[0];
  };

  isRowVisible = (index: number) => {
    if (!this.isRowRendered(index)) {
      return false;
    }

    const { rowHeightManager } = this.props;

    const top = this.scrollTop;
    const bottom = top + this.size.height;

    let rowTop;
    let rowBottom;

    if (rowHeightManager) {
      rowTop = rowHeightManager.getRowOffset(index);
      rowBottom = rowTop + rowHeightManager.getRowHeight(index);
    } else {
      const row = this.getRowAt(index);
      const info = row.getInfo();

      rowTop = info.offset;
      rowBottom = rowTop + info.height;
    }

    return top <= rowTop && rowBottom <= bottom;
  };

  getRowVisibilityInfo = (index, offset) => {
    const rendered = this.isRowRendered(index);

    const { rowHeightManager, rowHeight, minRowHeight } = this.props;

    const scrollTop = this.scrollTop;
    const top = scrollTop + offset;
    const bottom = scrollTop + this.size.height - offset;

    let rowTop;
    let rowBottom;

    if (rowHeightManager) {
      rowTop = rowHeightManager.getRowOffset(index);
      rowBottom = rowTop + rowHeightManager.getRowHeight(index);
    } else {
      const row = this.getRowAt(index);
      if (row) {
        const info = row.getInfo();

        rowTop = info.offset;
        rowBottom = rowTop + info.height;
      } else {
        const indexes = this.getRenderedIndexes();
        const firstRenderedIndex = indexes[0];
        const lastRenderedIndex = indexes[indexes.length - 1];

        if (index < firstRenderedIndex) {
          rowTop =
            this.rowOffsets[firstRenderedIndex] -
            (firstRenderedIndex - index) * minRowHeight;
        } else if (index > lastRenderedIndex) {
          rowTop =
            this.rowOffsets[lastRenderedIndex] +
            this.rowHeights[lastRenderedIndex] +
            (index - lastRenderedIndex) * minRowHeight;
        } else {
          rowTop = this.rowOffsets[index];
        }

        rowBottom = rowTop + this.rowHeights[index];
      }
    }

    const visible = top <= rowTop && rowBottom <= bottom;

    return {
      rendered,
      visible,
      top: rowTop,
      bottom: rowBottom,
      topDiff: rowTop - top,
      bottomDiff: bottom - rowBottom,
    };
  };

  scrollToIndex(
    index,
    { direction, force, duration = 0, offset = 0 } = emptyObject,
    callback
  ) {
    if (direction) {
      if (direction != 'top' && direction != 'bottom') {
        direction = null;
      }
    }
    if (force && !direction) {
      force = false;
    }

    if (index < 0 || index >= this.getMaxRenderCount()) {
      return;
    }

    if (typeof callback != 'function') {
      callback = emptyFn;
    }

    const info = this.getRowVisibilityInfo(index, offset);

    if (!info.rendered) {
      const { rowHeight } = this.props;
      // if no direction specified, scroll to the direction where this row
      // is in relation to the current view
      if (!direction) {
        const existingIndex = this.rows[0].getIndex();
        direction = index > existingIndex ? 'bottom' : 'top';
      }

      const newScrollTop =
        direction === 'top'
          ? info.top - offset
          : this.scrollTop - info.bottomDiff + offset;

      const afterScroll = () => {
        if (!rowHeight) {
          setTimeout(() => {
            // the raf inside the setTimeout is needed since sometimes
            // this.scrollTop is not correctly updated in scrollToIndex, if scrollToIndex is called
            // directly in the setTimeout

            global.requestAnimationFrame(() => {
              this.scrollToIndex(
                index,
                {
                  direction,
                  force,
                  // if there is a duration, it was applied on the previos scroll action
                  // so the duration has already elapsed - but in order not to transition instantly
                  // lets still use 100ms for the next scroll
                  duration: duration ? 100 : 0,
                },
                callback
              );
            });
          });
        } else {
          callback();
        }
      };

      if (duration) {
        this.smoothScrollTo(newScrollTop, { duration }, afterScroll);
      } else {
        this.scrollTop = newScrollTop;
        afterScroll();
      }

      return;
    }
    const { visible } = info;

    if (!visible) {
      if (!direction) {
        // determine direction based on the row position in the current view
        direction = info.topDiff < 0 ? 'top' : 'bottom';
        force = true;
      }
    }

    if (!visible || (direction && force)) {
      let newScrollTop;
      // the row is either not fully visible, or we have direction
      if (direction == 'top' || info.topDiff < 0) {
        newScrollTop = this.scrollTop + info.topDiff - offset;
      } else if (direction == 'bottom' || info.bottomDiff < 0) {
        newScrollTop = this.scrollTop - info.bottomDiff + offset;
      }

      if (newScrollTop != null) {
        if (duration) {
          this.smoothScrollTo(newScrollTop, { duration }, callback);
          return;
        }
        this.scrollTop = newScrollTop;
      }
    }

    callback();
  }

  getRenderedIndexes = () => {
    return Object.keys(this.mapping).map(k => k * 1);
  };

  onRowFocus = (index, event) => {};

  rafSync = () => {
    if (this.scrollContainer) {
      this.scrollContainer.rafSync();
    }
    this.adjustHeights();
  };

  adjustHeights = () => {
    if (Array.isArray(this.rows)) {
      this.rows.forEach(r => r.updateRowHeight());
    }
  };

  checkHeights = () => {
    const rows = this.getSortedRows();
    let result = true;

    rows.forEach(row => {
      if (result !== true) {
        return;
      }
      const index = row.getIndex();
      if (row.node.offsetHeight != this.rowHeights[index]) {
        console.warn(`row height mismatch at ${index}!`);
        result = index;
      }
    });

    if (result === true) {
      this.rowHeights.reduce((acc, height, index) => {
        if (
          this.rowOffsets[index] !== acc &&
          result === true &&
          index < this.props.count
        ) {
          console.warn(`row offset mismatch at ${index}!`);
          result = index;
        }
        return acc + height;
      }, 0);
    }

    return result;
  };

  getEmptyScrollOffset() {
    if (this.props.emptyScrollOffset != null) {
      return this.props.emptyScrollOffset;
    }
    const SCROLLBAR_WIDTH = getScrollbarWidth();

    return this.props.emptyScrollOffset || SCROLLBAR_WIDTH || 17;
  }
}

InovuaVirtualList.defaultProps = {
  minRowHeight: 20,
  nativeScroll: false,

  shouldAllowScrollbars: () => true,
  rafOnResize: false,
  theme: 'default',
  showEmptyRows: false,
  showWarnings: !uglified,
  virtualized: true,
  scrollOneDirectionOnly: false,
  useTransformPosition: !IS_EDGE && hasSticky(),
  useTransformRowPosition: false,
  recycleCoveredRows: true,
  scrollProps: {},
};

const propTypes = {
  applyScrollLeft: PropTypes.func,
  naturalRowHeight: PropTypes.bool,
  count: props => {
    const { count } = props;

    if (count == null) {
      throw new Error(`"count" is required!`);
    }
    if (typeof count != 'number') {
      throw new Error(`"count" should be a number!`);
    }

    if (count < 0) {
      throw new Error(`"count" should be >= 0!`);
    }
  },

  getRowFocusableElements: PropTypes.func,
  contain: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  rowContain: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  handleRowKeyDown: PropTypes.func,
  rafOnResize: PropTypes.bool,
  checkResizeDelay: PropTypes.number,
  measureSize: PropTypes.func,
  minRowHeight: PropTypes.number,
  minRowWidth: PropTypes.number,
  nativeScroll: PropTypes.bool,
  onRenderRangeChange: PropTypes.func,
  shouldFocusNextRow: PropTypes.func,
  onResize: PropTypes.func,
  onScrollStart: PropTypes.func,
  onScrollbarsChange: PropTypes.func,
  onScrollStop: PropTypes.func,
  pureRows: PropTypes.bool,
  rowHeight: PropTypes.number,
  renderRow: PropTypes.func.isRequired,
  renderRowContainer: PropTypes.func,
  renderSizer: PropTypes.func,
  showEmptyRows: PropTypes.bool,
  useTransformPosition: PropTypes.bool,
  useTransformRowPosition: PropTypes.bool,
  scrollProps: PropTypes.object,
  showWarnings: PropTypes.bool,
  renderView: PropTypes.func,
  renderScroller: PropTypes.func,
  renderScrollerSpacer: PropTypes.func,
  shouldComponentUpdate: PropTypes.func,
  shouldPreventDefaultTabKeyOnRow: PropTypes.func,
  theme: PropTypes.string,
  overscrollBehavior: PropTypes.string,
  virtualized: PropTypes.bool,
  scrollOneDirectionOnly: PropTypes.bool,
  stickyRows: PropTypes.object,
  recycleCoveredRows: PropTypes.bool,
  stickyOffset: PropTypes.number,
  enableRowSpan: PropTypes.bool,
  rowHeightManager: (props, propName) => {
    const value = props[propName];
    if (!value) {
      return new Error(`
You have to provide a "rowHeightManager" property, which should be an instance of RowHeightManager.
`);
    }

    if (!(value instanceof RowHeightManager)) {
      return new Error(
        'The "rowHeightManager" property should be an instance of RowHeightManager!'
      );
    }
  },
};

InovuaVirtualList.propTypes = propTypes;

export {
  RowHeightManager,
  propTypes,
  shouldComponentUpdate,
  getScrollbarWidth,
};
