/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from 'react';
import renderRows from '../../react-virtual-list-pro/src/renderRows';
import Scroller from './Scroller';
import getVisibleRange from '../../react-virtual-list-pro/src/getVisibleRange';
class InovuaScrollContainerNative extends Component {
    constructor(props) {
        super(props);
        this.componentDidMount = () => {
            this.mounted = true;
        };
        this.componentWillUnmount = () => {
            this.unmounted = true;
            this.mounted = false;
        };
        this.renderRows = () => {
            const { props } = this;
            const { rowHeight, renderRow, count, pureRows, rowHeightManager, showEmptyRows, virtualized, rowContain, naturalRowHeight, useTransformRowPosition, sticky, onRowHeightChange, } = props;
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
        this.rowRef = (r) => {
            if (!r) {
                return;
            }
            this.mapping[r.props.index] = r;
            this.rows[r.props.index] = r;
        };
        this.onRowUnmount = (row) => {
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
        this.setRowRowSpan = (rowIndex, rowSpan) => {
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
        this.onRowKeyDown = () => { };
        this.onRowFocus = () => { };
        this.getVisibleCount = (props = this.props) => {
            const { virtualized, enableRowSpan, extraRows: extraRowsProps } = props;
            const extraRows = enableRowSpan ? 2 : extraRowsProps || 0;
            if (this.visibleCount === undefined) {
                return 0;
            }
            if (!virtualized) {
                return ((props.showEmptyRows
                    ? Math.max(this.visibleCount || 0, props.count || 0)
                    : props.count) + extraRows);
            }
            return ((props.showEmptyRows
                ? this.visibleCount || props.count
                : Math.min(this.visibleCount || props.count, props.count)) + extraRows);
        };
        this.updateVisibleCount = (height) => {
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
        this.getDOMNode = () => {
            return this.scrollContainer
                ? this.scrollContainer.domNode || this.scrollContainer.getDOMNode()
                : null;
        };
        this.onResize = (notifySize) => {
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
        this.refreshLayout = (config) => {
            const defaults = {
                force: true,
                reorder: false,
            };
            this.ajdustHeights();
            const options = config ? { ...defaults, ...config } : defaults;
            this.onBrowserScroll(options);
        };
        this.ajdustHeights = () => {
            if (Array.isArray(this.rows)) {
                this.rows.forEach((r) => r.updateRowHeight());
            }
        };
        this.getCleanupRows = (props = this.props) => {
            const indexes = [];
            const { length } = this.rows;
            const visibleCount = this.getVisibleCount(props);
            for (let i = visibleCount; i < length; i++) {
                indexes.push(i);
            }
            return indexes;
        };
        this.cleanupRows = () => {
            const { props } = this;
            this.getCleanupRows(props).forEach((i) => {
                const row = this.rows[i];
                if (row) {
                    delete this.mapping[row.getINdex()];
                    delete this.rows[i];
                }
            });
        };
        this.getVisibleRange = (args) => {
            return getVisibleRange(args);
        };
        this.onBrowserScroll = ({ scrollTop, }) => {
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
        this.updateRows = (range) => {
            const { rowHeightManager } = this.props;
            if (rowHeightManager == null) {
                return;
            }
            const startRowIndex = range.start;
            const endRowIndex = range.end;
            const rows = this.getSortedRows();
            const gaps = this.getGapsFor(startRowIndex, endRowIndex, rows);
            const { recycleCoveredRows, enableRowSpan } = this.props;
            const visited = {};
            rows.forEach((row) => {
                const rowIndex = row.getIndex();
                const extraRows = enableRowSpan ? row.getRowSpan() - 1 : 0;
                const outOfView = rowIndex + extraRows < startRowIndex ||
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
        this.setRowIndex = (row, index) => {
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
        this.getRows = () => {
            const rows = this.rows;
            const visibleCount = this.getVisibleCount();
            const result = [];
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
        this.getSortedRows = () => {
            const rows = this.getRows();
            return rows
                .slice()
                .sort((row1, row2) => row1.getIndex() - row2.getIndex());
        };
        this.getGapsFor = (startRowIndex, endRowIndex, sortedRows) => {
            const visibleRowPosition = {};
            const { enableRowSpan } = this.props;
            const rows = sortedRows || this.getSortedRows();
            rows.forEach((row) => {
                if (row.isVisible()) {
                    visibleRowPosition[row.getIndex()] = true;
                }
            });
            const gaps = [];
            if (enableRowSpan && this.rowCoveredBy[startRowIndex] != null) {
                startRowIndex = this.rowCoveredBy[startRowIndex];
            }
            let alreadyVisible;
            let coveredBy;
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
        this.onScrollStart = () => { };
        this.onScrollStop = () => { };
        this.render = () => {
            const { props } = this;
            const domProps = {
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
            return React.createElement(Scroller, Object.assign({}, domProps));
        };
        this.refScrollContainer = (c) => {
            this.scrollContainer = c;
        };
        this.rows = [];
        this.mapping = {};
        this.rowSpans = {};
        this.rowCoveredBy = {};
        this.size = { width: 0, height: 0 };
    }
}
export default InovuaScrollContainerNative;
