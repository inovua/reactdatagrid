/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';

import renderRows from '../../react-virtual-list-pro/src/renderRows';
import { RowHeightManager } from '../../react-virtual-list-pro';
import Scroller from './Scroller';
import getVisibleRange from '../../react-virtual-list-pro/src/getVisibleRange';

type ScrollContainerProps = {
  rowHeight?: number;
  count: number;
  renderBrowserRowContainer?: ({ children }: { children: any[] }) => any[];
  onScrollStart?: Function;
  onScrollStop?: (scrollPos: any, prevScrollPos: any, eventTarget: any) => void;
  renderRow?: Function;
  pureRows?: boolean;
  rowHeightManager?: RowHeightManager;
  showEmptyRows?: boolean;
  virtualized?: boolean;
  rowContain?: boolean | string;
  naturalRowHeight?: boolean;
  useTransformRowPosition?: boolean;
  onRowHeightChange?: Function;
  sticky?: boolean;
  enableRowSpan?: boolean;
  extraRows?: any;
  minRowHeight?: number;
  onResize?: (size: { width: number; height: number }) => void;
  recycleCoveredRows: boolean;
};

class InovuaScrollContainerNative extends Component<ScrollContainerProps> {
  private rows: any[];
  private mapping: any;
  private rowSpans: { [key: number]: number };
  private refScrollContainer: any;
  private rowCoveredBy: { [key: number]: number };
  private visibleCount?: number;
  private size: { width: number; height: number };
  private strictVisibleCount?: number;
  private unmounted?: boolean;
  private mounted?: boolean;

  public scrollContainer: any;

  constructor(props: ScrollContainerProps) {
    super(props);

    this.refScrollContainer = (c: any) => {
      this.scrollContainer = c;
    };

    this.rows = [];
    this.mapping = {};
    this.rowSpans = {};
    this.rowCoveredBy = {};
    this.size = { width: 0, height: 0 };
  }

  componentDidMount = () => {
    this.mounted = true;
  };

  componentWillUnmount = () => {
    this.unmounted = true;
    this.mounted = false;
  };

  renderRows = () => {
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
      sticky,
      onRowHeightChange,
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
      sticky,
      onRowHeightChange,
    });
  };

  rowRef = (r: any) => {
    if (!r) {
      return;
    }

    this.mapping[r.props.index] = r;
    this.rows[r.props.index] = r;
  };

  onRowUnmount = (row: any) => {
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
      this.rows.splice(index, 1);
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

  onRowKeyDown = () => {};

  onRowFocus = () => {};

  getVisibleCount = (props: ScrollContainerProps = this.props) => {
    const { virtualized, enableRowSpan, extraRows: extraRowsProps } = props;
    const extraRows = enableRowSpan ? 2 : extraRowsProps || 0;

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

  updateVisibleCount = (height: number) => {
    const { props } = this;

    const { rowHeightManager, minRowHeight, showEmptyRows } = props;
    const strictVisibleCount = rowHeightManager
      ? Math.ceil(height / rowHeightManager.getMinHeight())
      : Math.ceil(height / (minRowHeight || 1));

    this.strictVisibleCount = strictVisibleCount;
    this.visibleCount = rowHeightManager
      ? strictVisibleCount + 1
      : strictVisibleCount + 2;

    const maxCount = props.count;

    if (this.visibleCount > maxCount && !showEmptyRows) {
      this.visibleCount = maxCount;
    }
  };

  getDOMNode = () => {
    return this.scrollContainer
      ? this.scrollContainer.domNode || this.scrollContainer.getDOMNode()
      : null;
  };

  onResize = (notifySize: any) => {
    const node = this.getDOMNode();
    if (!node) {
      return;
    }

    const size = notifySize
      ? notifySize
      : { width: node.clientWidth, height: node.clientHeight };

    this.size = size;

    this.updateVisibleCount(size.height);

    if (this.props.virtualized) {
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

  refreshLayout = (config: { reorder?: boolean; force?: boolean }) => {
    const defaults = {
      force: true,
      reorder: false,
    };

    this.ajdustHeights();
    const options = config ? { ...defaults, ...config } : defaults;

    this.onBrowserScroll(options);
  };

  ajdustHeights = () => {
    if (Array.isArray(this.rows)) {
      this.rows.forEach((r: any) => r.updateRowHeight());
    }
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

  cleanupRows = () => {
    const { props } = this;

    this.getCleanupRows(props).forEach((i: number) => {
      const row = this.rows[i];

      if (row) {
        delete this.mapping[row.getINdex()];
        delete this.rows[i];
      }
    });
  };

  getVisibleRange = (args: any) => {
    return getVisibleRange(args);
  };

  onBrowserScroll = ({
    scrollTop,
  }: {
    scrollTop?: number;
    reorder?: boolean;
  }) => {
    const { props } = this;
    const { count, rowHeightManager, naturalRowHeight, showEmptyRows } = props;

    const range = this.getVisibleRange({
      scrollTop,
      size: this.size,
      count,
      naturalRowHeight,
      rowHeightManager,
      showEmptyRows,
    });

    this.updateRows(range);
  };

  updateRows = (range: { start: number; end: number }) => {
    const { rowHeightManager } = this.props;
    if (rowHeightManager == null) {
      return;
    }
    const startRowIndex = range.start;
    const endRowIndex = range.end;

    const rows = this.getSortedRows();
    const gaps = this.getGapsFor(startRowIndex, endRowIndex, rows);

    const { recycleCoveredRows, enableRowSpan } = this.props;

    const visited: { [key: number]: boolean } = {};
    rows.forEach((row: any) => {
      const rowIndex = row.getIndex();
      const extraRows = enableRowSpan ? row.getRowSpan() - 1 : 0;

      const outOfView =
        rowIndex + extraRows < startRowIndex ||
        rowIndex > endRowIndex ||
        visited[rowIndex] ||
        (enableRowSpan &&
          recycleCoveredRows &&
          this.rowCoveredBy[rowIndex] !== undefined);

      visited[rowIndex] = true;

      if (outOfView && gaps.length) {
        const newIndex = gaps.pop();
        if (newIndex !== undefined) {
          this.setRowIndex(row, newIndex);
        }
      }
    });
  };

  setRowIndex = (row: any, index: number) => {
    const existingRow = this.mapping[index];
    if (existingRow) {
      existingRow.setIndex(index);

      if (existingRow !== row) {
        row.setVisible(false);
      }

      return;
    }

    const oldIndex = row.getIndex();
    row.setIndex(index);
    delete this.mapping[oldIndex];
    this.mapping[index] = row;
  };

  getRows = () => {
    const rows = this.rows;
    const visibleCount = this.getVisibleCount();

    const result: any[] = [];
    let i = -1;
    for (let initialIndex in rows) {
      if (rows.hasOwnProperty(initialIndex) && initialIndex < visibleCount) {
        i++;
        if (rows[i]) {
          result.push(rows[i]);
        }
      }
    }

    return result;
  };

  getSortedRows = () => {
    const rows = this.getRows();
    return rows
      .slice()
      .sort((row1: any, row2: any) => row1.getIndex() - row2.getIndex());
  };

  getGapsFor = (
    startRowIndex: number,
    endRowIndex: number,
    sortedRows: any[]
  ) => {
    const visibleRowPosition: { [key: number]: boolean } = {};
    const { enableRowSpan } = this.props;

    const rows = sortedRows || this.getSortedRows();

    rows.forEach((row: any) => {
      if (row.isVisible()) {
        visibleRowPosition[row.getIndex()] = true;
      }
    });

    const gaps = [];

    if (enableRowSpan && this.rowCoveredBy[startRowIndex] != null) {
      startRowIndex = this.rowCoveredBy[startRowIndex];
    }

    let alreadyVisible: boolean;
    let coveredBy: number;

    for (; startRowIndex <= endRowIndex; startRowIndex++) {
      alreadyVisible = visibleRowPosition[startRowIndex];

      if (enableRowSpan && !alreadyVisible) {
        coveredBy = this.rowCoveredBy[startRowIndex];
        if (coveredBy != null) {
          alreadyVisible = this.props.recycleCoveredRows;
        }
      }

      if (!alreadyVisible) {
        gaps.push(startRowIndex);
      }
    }

    return gaps;
  };

  onScrollStart = () => {};

  onScrollStop = () => {};

  render = () => {
    const { props } = this;

    const domProps: any = {
      ref: this.refScrollContainer,
      key: 'scrollcontainernative',
      children: this.renderRows(),
      onResize: this.onResize,
      onBrowserScroll: this.onBrowserScroll,
      rowHeight: props.rowHeight,
      count: props.count,
      onScrollStart: this.onScrollStart,
      onScrollStop: this.onScrollStop,
      rowContainer: props.renderBrowserRowContainer
        ? props.renderBrowserRowContainer
        : null,
    };

    return <Scroller {...domProps} />;
  };
}

export default InovuaScrollContainerNative;
