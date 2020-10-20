/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import Region from '../../packages/region';
import ResizeOverlay from './ResizeOverlay';
import setupColumnResize from './setupColumnResize';
import join from '../../packages/join';
import FakeFlex from '../../FakeFlex';
import HeaderLayout from './HeaderLayout';
import Content from './Content';
import { Consumer } from '../../context';
import isMobile from '../../packages/isMobile';
const height100 = { height: '100%' };
export default class InovuaDataGridColumnLayout extends React.Component {
    constructor(props) {
        super(props);
        this.scrollTop = 0;
        this.headerLayout = null;
        this.getDOMNode = () => {
            return this.columnLayoutRef.current;
        };
        this.getContentRows = () => {
            return this.content.getRows();
        };
        this.getScrollTop = () => {
            return this.scrollTop || 0;
        };
        this.renderHeaderLayout = computedProps => {
            return (React.createElement(HeaderLayout, Object.assign({}, computedProps, { onResizeMouseDown: this.onResizeMouseDown.bind(this, computedProps), onResizeTouchStart: this.onResizeTouchStart.bind(this, computedProps), onFilterValueChange: computedProps.computedOnColumnFilterValueChange, ref: this.refHeaderLayout, getScrollLeftMax: this.getScrollLeftMax, setScrollLeft: this.setScrollLeft })));
        };
        this.renderContent = computedProps => {
            const { groupBy } = computedProps;
            const groupByValue = groupBy && groupBy.length ? groupBy : null;
            return (React.createElement(Content, Object.assign({ key: "content" }, computedProps, { getScrollLeftMax: this.getScrollLeftMax, groupBy: groupByValue, before: this.renderLockedStartRows(computedProps), after: this.renderLockedEndRows(computedProps), ref: this.refContent, columns: computedProps.visibleColumns, minWidth: computedProps.minWidth, maxWidth: computedProps.maxWidth, onDragRowMouseDown: this.onDragRowMouseDownHandle, onContainerScrollHorizontal: this.onContainerScrollHorizontal.bind(this, computedProps), onContainerScrollVertical: this.onContainerScrollVertical.bind(this, computedProps), onColumnRenderStartIndexChange: this.onColumnRenderStartIndexChange })));
        };
        this.onDragRowMouseDownHandle = (ev, index, cellNode) => {
            // implemented in enterprise
        };
        this.renderLockedEndRows = computedProps => {
            // implemented in enterprise
            return null;
        };
        this.renderLockedStartRows = computedProps => {
            // implemented in enterprise
            return null;
        };
        this.renderLockedRows = (rows, position, computedProps) => {
            // implemented in enterprise
            return null;
        };
        this.renderResizeOverlay = computedProps => {
            return (React.createElement(ResizeOverlay, { resizeProxyStyle: computedProps.resizeProxyStyle, columnResizeProxyWidth: computedProps.columnResizeProxyWidth, columnResizeHandleWidth: computedProps.columnResizeHandleWidth, rtl: computedProps.rtl, ref: this.refResizeOverlay }));
        };
        this.onColumnRenderStartIndexChange = columnRenderStartIndex => {
            if (this.headerLayout) {
                this.headerLayout.setColumnRenderStartIndex(columnRenderStartIndex);
            }
        };
        this.onContainerScrollVertical = (computedProps, scrollTop) => {
            this.scrollTop = scrollTop;
            const { computedLockedRows, rowHeight, stickyHeaders, groupBy, } = computedProps;
            if (rowHeight && stickyHeaders && groupBy && groupBy.length) {
                this.updateStickyHeader(scrollTop);
            }
            if (computedLockedRows && computedLockedRows.length) {
                this.updateLockedRows(scrollTop);
            }
            if (computedProps.onScroll) {
                computedProps.onScroll();
            }
        };
        this.onContainerScrollHorizontal = (computedProps, scrollLeft) => {
            this.scrollLeft = scrollLeft;
            if (this.headerLayout) {
                this.headerLayout.onContainerScrollHorizontal(scrollLeft);
            }
            if (computedProps.onScroll) {
                computedProps.onScroll();
            }
        };
        this.getScrollLeft = () => {
            return this.scrollLeft || 0;
        };
        this.getScrollLeftMax = () => {
            const vl = this.getVirtualList();
            if (!vl) {
                return 0;
            }
            return vl.scrollContainer.scrollLeftMax;
        };
        this.getScrollTopMax = () => {
            const vl = this.getVirtualList();
            if (!vl) {
                return;
            }
            return vl.scrollContainer.scrollTopMax;
        };
        this.setScrollLeft = scrollLeft => {
            const vl = this.getVirtualList();
            if (!vl) {
                return;
            }
            vl.scrollLeft = scrollLeft;
        };
        this.setScrollTop = (scrollTop) => {
            const vl = this.getVirtualList();
            if (!vl) {
                return;
            }
            vl.scrollTop = scrollTop;
        };
        this.getVirtualList = () => {
            return this.content ? this.content.virtualList : null;
        };
        this.startEdit = args => {
            return this.content.startEdit(args);
        };
        this.cancelEdit = args => {
            return this.content.cancelEdit(args);
        };
        this.completeEdit = args => {
            return this.content.completeEdit(args);
        };
        this.getRenderRange = () => {
            return this.content.getRenderRange();
        };
        this.getHeaderLayout = () => {
            return this.headerLayout;
        };
        this.getHeaderCells = () => {
            return this.getHeaderLayout().getHeaderCells();
        };
        this.getHeader = () => {
            return this.headerLayout.getHeader();
        };
        this.getGroupToolbar = () => {
            return this.headerLayout.getGroupToolbar();
        };
        this.getDOMColumnHeaderAt = index => {
            return this.headerLayout.getCellDOMNodeAt(index);
        };
        this.onResizeMouseDown = (...args) => {
            if (isMobile) {
                // handled by onResizeTouchStart
                // returning, because otherwise, both onResizeTouchStart
                // and this method are triggered, which result in buggy behaviour
                return;
            }
            this.onResizeDownAction(...args);
        };
        this.onResizeDownAction = (computedProps, config, { colHeaderNode, event, groupColumns }) => {
            const { computedVisibleIndex: visibleIndex } = config;
            this.setupColumnResize(computedProps, {
                groupColumns,
                visibleIndex: visibleIndex !== undefined ? visibleIndex : config.visibleIndex,
                colHeaderNode,
                headerNode: this.getHeader().getDOMNode(),
                event,
            });
        };
        this.onResizeTouchStart = (...args) => {
            this.onResizeDownAction(...args);
        };
        this.setupColumnResize = (computedProps, { visibleIndex, groupColumns, colHeaderNode, event }) => {
            event.stopPropagation();
            if (event.ctrlKey) {
                return;
            }
            const rtl = computedProps.rtl;
            const region = Region.from(event.currentTarget.firstChild || event.currentTarget);
            const columns = computedProps.visibleColumns;
            const firstFlexIndex = columns.reduce((index, col, i) => {
                if (col.flex != null && index == -1) {
                    return i;
                }
                return index;
            }, -1);
            const index = visibleIndex;
            const headerRegion = Region.from(this.getHeaderLayout().headerDomNode.current);
            const constrainTo = Region.from(headerRegion.get());
            // allow resizing the width to the right without limiting to the grid viewport
            constrainTo.set({
                [this.props.rtl ? 'left' : 'right']: (this.props.rtl ? -1 : 1) *
                    (global.screen
                        ? global.screen.width * 3
                        : Region.from(document.documentElement).getRight() * 2),
            });
            const column = columns[index];
            const columnRegion = Region.from(colHeaderNode);
            const extraOffset = column.lastInGroup ? region.width : region.width / 2;
            let maxPos;
            if (groupColumns) {
                const { columnsMap } = computedProps;
                const groupCols = groupColumns.map(colId => columnsMap[colId]);
                const firstColumnRegion = Region.from(this.getDOMColumnHeaderAt(groupCols[0].computedVisibleIndex));
                const minWidth = groupCols.reduce((acc, col) => {
                    return acc + col.computedMinWidth;
                }, 0);
                const maxWidth = groupCols.reduce((acc, col) => {
                    return acc + (col.computedMaxWidth || Infinity);
                }, 0);
                const pos = rtl
                    ? firstColumnRegion.right - minWidth - extraOffset
                    : minWidth + firstColumnRegion.left - extraOffset;
                constrainTo.set({ [rtl ? 'right' : 'left']: pos });
                if (maxWidth !== Infinity) {
                    maxPos = rtl
                        ? firstColumnRegion.right - maxWidth
                        : firstColumnRegion.left + maxWidth + extraOffset;
                }
            }
            else {
                const minWidth = column.computedMinWidth;
                if (this.props.rtl) {
                    const right = columnRegion.right - minWidth - extraOffset;
                    constrainTo.set({ right });
                    if (column.computedMaxWidth) {
                        maxPos = columnRegion.right - column.computedMaxWidth;
                    }
                }
                else {
                    const left = minWidth + columnRegion.left - extraOffset;
                    constrainTo.set({ left });
                    if (column.computedMaxWidth) {
                        maxPos = columnRegion.left + column.computedMaxWidth;
                    }
                }
            }
            let shareSpace = computedProps.shareSpaceOnResize;
            const nextCol = columns[index + 1];
            const nextColHeaderNode = this.getDOMColumnHeaderAt(index + 1);
            const nextColumnRegion = nextCol ? Region.from(nextColHeaderNode) : null;
            if ((column && column.computedResizable === false) ||
                (nextCol && nextCol.computedResizable === false)) {
                shareSpace = false;
            }
            if (shareSpace && nextColHeaderNode) {
                if (this.props.rtl) {
                    const nextColLeft = nextColumnRegion.left + nextCol.computedMinWidth;
                    if (!maxPos || nextColLeft > maxPos) {
                        maxPos = nextColLeft;
                    }
                }
                else {
                    const nextColRight = nextColumnRegion.right - nextCol.computedMinWidth;
                    if (!maxPos || nextColRight < maxPos) {
                        maxPos = nextColRight;
                    }
                }
            }
            if (maxPos != null) {
                constrainTo.set({ [this.props.rtl ? 'left' : 'right']: maxPos });
            }
            if (this.props.rtl) {
                if (nextCol) {
                    // only do this if it's not the last column
                    constrainTo.set({
                        left: constrainTo.left - computedProps.columnResizeHandleWidth / 2,
                    });
                }
                constrainTo.set({
                    right: constrainTo.right + computedProps.columnResizeHandleWidth,
                });
            }
            this.props.coverHandleRef.current.setCursor('col-resize');
            setupColumnResize({
                headerRegion,
                constrainTo,
                region,
                columns,
                index,
                rtl: this.props.rtl,
                extraOffset: 0,
                firstFlexIndex,
                groupColumns,
                shareSpaceOnResize: computedProps.shareSpaceOnResize,
                shareSpace,
                nextColumnSize: nextColumnRegion ? nextColumnRegion.width : null,
                initialSize: columnRegion.width,
            }, {
                onResizeDragInit: this.onResizeDragInit.bind(this, computedProps),
                onResizeDrag: this.onResizeDrag.bind(this, computedProps),
                onResizeDrop: this.onResizeDrop.bind(this, computedProps),
            }, event);
        };
        this.onResizeDragInit = (computedProps, { offset, constrained }) => {
            const offsetTop = this.getHeaderLayout().getHeader().domRef.current
                .offsetTop;
            this.props.coverHandleRef.current.setActive(true);
            this.resizeOverlay
                .setOffset(offset)
                .setActive(true, { offsetTop })
                .setConstrained(constrained);
        };
        this.onResizeDrop = (computedProps, { index, offset, diff, groupColumns, constrained, size, nextColumnSize, firstFlexIndex, shareSpace, }) => {
            this.props.coverHandleRef.current.setActive(false);
            if (this.resizeOverlay) {
                this.resizeOverlay
                    .setOffset(offset)
                    .setConstrained(constrained)
                    .setActive(false);
            }
            computedProps.computedOnColumnResize({
                groupColumns,
                diff,
                index,
                size,
                nextColumnSize,
                firstFlexIndex,
                shareSpace,
            });
        };
        this.onResizeDrag = (computedProps, { offset, constrained }) => {
            if (this.resizeOverlay) {
                this.resizeOverlay.setOffset(offset).setConstrained(constrained);
            }
        };
        this.isRowFullyVisible = index => {
            return this.content.isRowFullyVisible(index);
        };
        this.refResizeOverlay = r => {
            this.resizeOverlay = r;
        };
        this.refHeaderLayout = layout => {
            this.headerLayout = layout;
        };
        this.columnLayoutRef = createRef();
        this.refContent = c => {
            this.content = c;
        };
    }
    tryStartEdit(args) {
        return this.content.tryStartEdit(args);
    }
    render() {
        const className = join('InovuaReactDataGrid__column-layout');
        return (React.createElement(Consumer, null, computedProps => {
            let flexIndex = 1;
            let { useNativeFlex } = computedProps;
            this.lastComputedProps = computedProps;
            return (React.createElement("div", { ref: this.columnLayoutRef, className: className, style: {
                    ...height100,
                    ...this.props.style,
                } },
                React.createElement(FakeFlex, { useNativeFlex: useNativeFlex, flexIndex: flexIndex, getNode: this.getDOMNode },
                    this.renderHeaderLayout(computedProps),
                    this.renderContent(computedProps)),
                this.renderReorderRowProxy(computedProps),
                this.renderResizeOverlay(computedProps),
                this.renderDragRowArrow(computedProps)));
        }));
    }
    renderReorderRowProxy() {
        return null; // implemented in enterprise
    }
    renderDragRowArrow() {
        return null; // implemented in enterprise
    }
    updateLockedRows(scrollTop) {
        return;
    }
    updateStickyHeader() { }
}
InovuaDataGridColumnLayout.defaultProps = { reorderProxySize: 3 };
InovuaDataGridColumnLayout.propTypes = {
    minRowWidth: PropTypes.number,
    onMount: PropTypes.func,
    onUnmount: PropTypes.func,
    onRowMouseEnter: PropTypes.func,
    onRowMouseLeave: PropTypes.func,
    reorderProxySize: PropTypes.number.isRequired,
};
