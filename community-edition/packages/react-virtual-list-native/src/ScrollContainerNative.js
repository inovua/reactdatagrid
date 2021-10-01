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
import throttle from 'lodash.throttle';
import getFocusableElements from '../../getFocusableElements';
import contains from '../../contains';
const emptyObject = {};
const emptyFn = () => { };
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
        this.getScrollingElement = () => {
            return this.scrollContainer;
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
        this.scrollToIndex = (index, { direction, force, duration = 0, offset = 0, } = emptyObject, callback) => {
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
                const newScrollTop = direction === 'top'
                    ? info.top - offset
                    : this.scrollTopPos - info.bottomDiff + offset;
                const afterScroll = () => {
                    if (!rowHeight) {
                        setTimeout(() => {
                            // the raf inside the setTimeout is needed since sometimes
                            // this.scrollTopPos is not correctly updated in scrollToIndex, if scrollToIndex is called
                            // directly in the setTimeout
                            global.requestAnimationFrame(() => {
                                this.scrollToIndex(index, {
                                    direction,
                                    force,
                                    // if there is a duration, it was applied on the previos scroll action
                                    // so the duration has already elapsed - but in order not to transition instantly
                                    // lets still use 100ms for the next scroll
                                    duration: duration ? 100 : 0,
                                }, callback);
                            });
                        });
                    }
                    else {
                        callback();
                    }
                };
                if (duration) {
                    this.smoothScrollTo(newScrollTop, { duration }, afterScroll);
                }
                else {
                    this.scrollTopPos = newScrollTop;
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
                    newScrollTop = this.scrollTopPos + info.topDiff - offset;
                }
                else if (direction == 'bottom' || info.bottomDiff < 0) {
                    newScrollTop = this.scrollTopPos - info.bottomDiff + offset;
                }
                if (newScrollTop != null) {
                    if (duration) {
                        this.smoothScrollTo(newScrollTop, { duration }, callback);
                        return;
                    }
                    this.scrollTopPos = newScrollTop;
                }
            }
            callback();
        };
        this.getRenderedIndexes = () => {
            return Object.keys(this.mapping).map((k) => k * 1);
        };
        this.smoothScrollTo = (...args) => {
            this.scrollContainer.smoothScrollTo(...args);
        };
        this.getRowVisibilityInfo = (index, offset) => {
            const rendered = this.isRowRendered(index);
            const { rowHeightManager, minRowHeight } = this.props;
            const scrollTop = this.scrollTopPos;
            const top = scrollTop + offset;
            const bottom = scrollTop + this.size.height - offset;
            let rowTop;
            let rowBottom;
            if (rowHeightManager) {
                rowTop = rowHeightManager.getRowOffset(index);
                rowBottom = rowTop + rowHeightManager.getRowHeight(index);
            }
            else {
                const row = this.getRowAt(index);
                if (row) {
                    const info = row.getInfo();
                    rowTop = info.offset;
                    rowBottom = rowTop + info.height;
                }
                else {
                    const indexes = this.getRenderedIndexes();
                    const firstRenderedIndex = indexes[0];
                    const lastRenderedIndex = indexes[indexes.length - 1];
                    if (minRowHeight !== undefined) {
                        if (index < firstRenderedIndex) {
                            rowTop =
                                this.rowOffsets[firstRenderedIndex] -
                                    (firstRenderedIndex - index) * minRowHeight;
                        }
                        else if (index > lastRenderedIndex) {
                            rowTop =
                                this.rowOffsets[lastRenderedIndex] +
                                    this.rowHeights[lastRenderedIndex] +
                                    (index - lastRenderedIndex) * minRowHeight;
                        }
                        else {
                            rowTop = this.rowOffsets[index];
                        }
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
                scrollTop: 0,
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
            if (scrollTop < 0) {
                scrollTop = 0;
            }
            this.scrollTopPos = scrollTop;
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
        this.getMaxRenderCount = () => {
            const { props } = this;
            const visibleCount = this.getVisibleCount(props);
            const maxCount = props.showEmptyRows
                ? Math.max(visibleCount || 0, props.count)
                : Math.max(props.count || 0, 0);
            return maxCount;
        };
        this.focusRow = (index, dir, callback) => {
            const maxCount = this.getMaxRenderCount();
            if (index >= maxCount || index < 0) {
                return;
            }
            this.scrollToIndex(index, { direction: dir === 1 ? 'bottom' : 'top' }, () => {
                const nextRow = this.getRowAt(index);
                const nextRowNode = nextRow.getDOMNode
                    ? nextRow.getDOMNode()
                    : nextRow.node;
                const elements = this.props.getRowFocusableElements
                    ? this.props.getRowFocusableElements(index, nextRowNode)
                    : getFocusableElements(nextRowNode);
                if (elements?.length) {
                    const focusIndex = dir === -1 ? elements.length - 1 : 0;
                    elements[focusIndex].focus();
                }
                if (typeof callback === 'function') {
                    callback();
                }
            });
        };
        this.getRowAt = (index) => {
            let row = this.mapping[index];
            if (row && row.getIndex() != index) {
                row == null;
            }
            return row;
        };
        this.onRowKeyDown = (index, event) => {
            if (event.key !== 'Tab' || event.key !== 'Enter') {
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
                return;
            }
            const dir = event.shiftKey ? -1 : 1;
            const nextIndex = index + dir;
            const maxCount = this.getMaxRenderCount();
            if (nextIndex < 0 || nextIndex >= maxCount) {
                return;
            }
            const elements = this.props.getRowFocusableElements
                ? this.props.getRowFocusableElements(index, rowNode)
                : getFocusableElements(rowNode);
            if (elements && elements.length) {
                const limit = dir === -1 ? 0 : elements.length - 1;
                if (elements[limit] !== activeElement) {
                    return;
                }
            }
            if (typeof this.props.shouldPreventDefaultTabKeyOnRow !== 'function' ||
                this.props.shouldPreventDefaultTabKeyOnRow(index, event) !== false) {
                event.preventDefault();
            }
            this.focusRow(nextIndex, dir);
        };
        this.isRowRendered = (index) => {
            return !!this.getRowAt(index);
        };
        this.isRowVisible = (index) => {
            if (!this.isRowRendered(index)) {
                return false;
            }
            const { rowHeightManager } = this.props;
            const top = this.scrollTopPos;
            const bottom = top + this.size.height;
            let rowTop;
            let rowBottom;
            if (rowHeightManager) {
                rowTop = rowHeightManager.getRowOffset(index);
                rowBottom = rowTop + rowHeightManager.getRowHeight(index);
            }
            else {
                const row = this.getRowAt(index);
                const info = row.getInfo();
                rowTop = info.offset;
                rowBottom = rowTop + info.height;
            }
            return top <= rowTop && rowBottom <= bottom;
        };
        this.onRowFocus = () => { };
        this.onScrollStart = (...args) => {
            if (this.props.onScrollStart) {
                this.props.onScrollStart(...args);
            }
        };
        this.onScrollStop = (...args) => {
            if (this.props.onScrollStop) {
                this.props.onScrollStop(...args);
            }
        };
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
                minRowWidth: props.minRowWidth,
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
        this.rowHeights = {};
        this.size = { width: 0, height: 0 };
        this.scrollTopPos = 0;
        this.updateRows = throttle(this.updateRows, 16);
    }
    get scrollTopMax() {
        return this.mounted ? this.getScrollingElement().scrollTopMax : 0;
    }
    get scrollLeftMax() {
        return this.mounted ? this.getScrollingElement().scrollLeftMax : 0;
    }
    get scrollTop() {
        return this.mounted ? this.getScrollingElement().scrollTop : 0;
    }
    get scrollLeft() {
        return this.mounted ? this.getScrollingElement().scrollLeft : 0;
    }
    set scrollTop(value) {
        const element = this.getScrollingElement();
        if (element) {
            element.scrollTop = value;
        }
    }
    set scrollLeft(value) {
        const element = this.getScrollingElement();
        if (element) {
            element.scrollLeft = value;
        }
    }
}
export default InovuaScrollContainerNative;
