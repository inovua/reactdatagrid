/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { createRef } from 'react';
import Region from '@inovua/reactdatagrid-community/packages/region';
import InovuaDataGridColumnLayout from '@inovua/reactdatagrid-community/Layout/ColumnLayout';
import DragRow from './plugins/row-reorder/DragRow';
import DragRowArrow from './plugins/row-reorder/DragRowArrow';
import ScrollingRegion from './plugins/row-reorder/ScrollingRegion';
import getRangesForRows from '@inovua/reactdatagrid-community/Layout/ColumnLayout/getRangesForRows';
import setupRowDrag from './plugins/row-reorder/setupRowDrag';
import getDropRowIndex from '@inovua/reactdatagrid-community/Layout/ColumnLayout/getDropRowIndex';
import moveXBeforeY from '@inovua/reactdatagrid-community/utils/moveXBeforeY';
import dropIndexValidation from '@inovua/reactdatagrid-community/Layout/ColumnLayout/dropIndexValidation';
import LockedRows from './plugins/locked-rows/LockedRows';
let DRAG_INFO = null;
let scrolling = false;
const SCROLL_MARGIN = 40;
const DRAG_ROW_MAX_HEIGHT = 100;
const SCROLL_SPEED = 60;
const raf = global.requestAnimationFrame;
export default class InovuaDataGridEnterpriseColumnLayout extends InovuaDataGridColumnLayout {
    constructor(props) {
        super(props);
        this.dragBoxInitialHeight = 0;
        this.dropRowHeight = 0;
        this.validDropPositions = [];
        this.renderLockedEndRows = (computedProps) => {
            return this.renderLockedRows(computedProps.computedLockedEndRows, 'end', computedProps);
        };
        this.renderLockedStartRows = (computedProps) => {
            return this.renderLockedRows(computedProps.computedLockedStartRows, 'start', computedProps);
        };
        this.renderLockedRows = (rows, position, computedProps) => {
            if (!rows || !rows.length) {
                return null;
            }
            return (React.createElement(LockedRows, { key: position, rows: rows, computedProps: computedProps, position: position }));
        };
        this.renderDragRowArrow = () => {
            const props = this.lastComputedProps;
            const { rowReorderArrowStyle } = props;
            return (React.createElement(DragRowArrow, { ref: this.refDragRowArrow, rowHeight: this.dropRowHeight, rowReorderArrowStyle: rowReorderArrowStyle }));
        };
        this.renderReorderRowProxy = (props) => {
            return (React.createElement(DragRow, { ref: this.refDragRow, renderRowReorderProxy: props && props.renderRowReorderProxy }));
        };
        this.renderScrollingTopRegion = () => {
            return (React.createElement(ScrollingRegion, { ref: this.scrollTopRegionRef, dir: -1, onMouseEnter: (event) => this.onScrollingRegionMouseEnter(event, -1), onMouseLeave: this.onScrollingRegionMouseLeave }));
        };
        this.renderScrollingBottomRegion = () => {
            return (React.createElement(ScrollingRegion, { ref: this.scrollBottomRegionRef, dir: 1, onMouseEnter: (event) => this.onScrollingRegionMouseEnter(event, 1), onMouseLeave: this.onScrollingRegionMouseLeave }));
        };
        this.onScrollingRegionMouseEnter = (event, dir) => {
            event.preventDefault();
            if (DRAG_INFO && DRAG_INFO.dragging) {
                scrolling = true;
                const props = this.lastComputedProps;
                const { rowReorderScrollByAmount, rowReorderAutoScrollSpeed } = props;
                if (scrolling && dir) {
                    global.clearInterval(this.gridScrollInterval);
                    this.gridScrollInterval = global.setInterval(() => this.startScrolling(rowReorderScrollByAmount, dir), rowReorderAutoScrollSpeed || SCROLL_SPEED);
                }
            }
        };
        this.startScrolling = (rowReorderScrollByAmount, dir) => {
            const initialScrollTop = this.getScrollTop();
            const newScrollTop = initialScrollTop + dir * rowReorderScrollByAmount;
            raf(() => {
                this.setScrollPosition(newScrollTop);
            });
        };
        this.setScrollPosition = (scrollTop) => {
            const scrollTopMax = this.getScrollTopMax();
            this.setReorderArrowVisible(false);
            if (scrollTop < 0) {
                scrollTop = 0;
            }
            if (scrollTop > scrollTopMax) {
                scrollTop = scrollTopMax;
            }
            this.setScrollTop(scrollTop);
        };
        this.onScrollingRegionMouseLeave = () => {
            scrolling = false;
            this.setReorderArrowVisible(true);
            global.clearInterval(this.gridScrollInterval);
        };
        this.getDragRowInstance = (dragIndex) => {
            const visibleRows = this.getContentRows();
            const dragRow = visibleRows.filter((row) => row.props.rowIndex === dragIndex)[0];
            return dragRow;
        };
        this.onDragRowMouseDownHandle = (ev, index, cellNode) => {
            if ((ev.isDefaultPrevented && ev.isDefaultPrevented()) ||
                ev.defaultPrevented) {
                return;
            }
            const props = this.lastComputedProps;
            const { onRowReorder, rowReorderColumn, computedPagination, computedSortInfo, computedFiltered, dataSource, data, computedPivot, computedGroupBy, } = props;
            if (!onRowReorder &&
                (typeof onRowReorder !== 'function' || typeof onRowReorder !== 'boolean')) {
                if (!rowReorderColumn) {
                    return;
                }
            }
            if ((ev.nativeEvent
                ? ev.nativeEvent.which === 3
                : ev.which === 3) /* right click */ ||
                ev.metaKey ||
                ev.ctrlKey) {
                return;
            }
            if (computedPagination ||
                computedSortInfo ||
                computedFiltered ||
                typeof dataSource === 'function' ||
                (computedPivot && computedPivot.length > 0) ||
                (computedGroupBy && computedGroupBy.length > 0)) {
                if (typeof onRowReorder !== 'function') {
                    return;
                }
            }
            const dragIndex = index;
            let dragRow;
            dragRow = data[dragIndex];
            if (!dragRow) {
                ev?.stopPropagation();
                return;
            }
            const contentNode = this.content.getDOMNode();
            const headerNode = this.headerLayout
                ? this.headerLayout.headerDomNode.current
                : null;
            const contentRegion = Region.from(contentNode);
            const headerRegion = Region.from(headerNode);
            const headerHeight = headerRegion.getHeight();
            const node = cellNode && cellNode.current;
            const cellRegion = Region.from(node);
            this.dragRowArrow.setOffset(headerHeight);
            this.setupDrag(ev, { dragIndex, contentRegion, headerHeight, cellRegion }, props);
        };
        this.setupDrag = (event, { dragIndex, contentRegion, headerHeight, cellRegion, }, props) => {
            const { count, rowHeightManager } = props;
            const initialScrollTop = this.getScrollTop();
            const rowRanges = getRangesForRows({
                count,
                initialOffset: contentRegion.top,
                rowHeightManager,
                initialScrollTop,
            });
            const dragBox = this.getDragRowInstance(dragIndex);
            const dragBoxNode = dragBox.domRef ? dragBox.domRef.current : null;
            let dragBoxInitialRegion;
            if (dragBox) {
                dragBoxInitialRegion = Region.from(dragBoxNode);
            }
            this.dragBoxInitialHeight =
                dragBoxInitialRegion && dragBoxInitialRegion.getHeight();
            if (DRAG_ROW_MAX_HEIGHT &&
                dragBoxInitialRegion &&
                dragBoxInitialRegion.getHeight() > DRAG_ROW_MAX_HEIGHT) {
                dragBoxInitialRegion.setHeight(DRAG_ROW_MAX_HEIGHT);
                dragBoxInitialRegion.shift({
                    top: this.dragBoxInitialHeight / 2 - DRAG_ROW_MAX_HEIGHT / 2,
                });
            }
            const dragRowHeight = dragBoxInitialRegion.getHeight();
            const dragProxy = this.dragRow ? this.dragRow : undefined;
            dragProxy.setDragIndex(dragIndex);
            dragProxy.setProps(props);
            const dragBoxOffsets = {
                top: contentRegion.top,
                left: contentRegion.left,
            };
            const leftBoxOffset = cellRegion.left - dragBoxOffsets.left;
            this.dragRowArrow.setLeft(leftBoxOffset);
            const dragProxyPosition = {
                top: dragBoxInitialRegion.top - dragBoxOffsets.top,
                left: dragBoxInitialRegion.left - dragBoxOffsets.left,
            };
            if (this.scrollTopRegionRef.current) {
                this.scrollTopRegionRef.current.setVisible(true);
            }
            if (this.scrollBottomRegionRef.current) {
                this.scrollBottomRegionRef.current.setVisible(true);
            }
            dragProxy.setHeight(dragRowHeight);
            dragProxy.setTop(dragProxyPosition.top);
            dragProxy.setLeft(dragProxyPosition.left);
            DRAG_INFO = {
                dragging: true,
                dragIndex,
                rowRanges,
                contentRegion,
                headerHeight,
                dragBoxInitialRegion,
                dragBoxRegion: dragBoxInitialRegion.clone(),
                dragProxy,
                dragBoxOffsets,
                initialScrollTop,
                leftBoxOffset,
                scrollTopMax: this.getScrollTopMax(),
            };
            this.setReorderArrowAt(dragIndex, rowRanges);
            setupRowDrag(event, dragBoxInitialRegion, {
                onDrag: (event, config) => this.onRowDrag(event, config, props),
                onDrop: (event, config) => this.onRowDrop(event, config, props),
            });
        };
        this.onRowDrag = (event, config, props) => {
            if (!DRAG_INFO) {
                return;
            }
            const { dragIndex, rowRanges: currentRanges, contentRegion, dragBoxInitialRegion, dragBoxRegion, dragProxy, headerHeight, dragBoxOffsets, initialScrollTop, scrollTopMax, leftBoxOffset, } = DRAG_INFO;
            let diffTop = config.diff.top;
            let diffLeft = config.diff.left;
            dragBoxRegion.set({
                top: dragBoxInitialRegion.top,
                bottom: dragBoxInitialRegion.bottom,
                left: dragBoxInitialRegion.left,
                right: dragBoxInitialRegion.right,
            });
            const { rowReorderScrollByAmount, isRowReorderValid, count, rowHeightManager, } = props;
            const scrollTop = this.getScrollTop();
            const scrollDiff = scrollTop - initialScrollTop;
            const initialDiffTop = diffTop;
            const initialDiffLeft = diffLeft;
            dragBoxRegion.shift({
                top: diffTop,
                left: diffLeft,
            });
            diffTop += scrollDiff;
            const minScrollTop = Math.max(contentRegion.top, 0);
            const maxScrollTop = contentRegion.bottom;
            let scrollAjust = 0;
            let dragProxyAjust = 0;
            if (dragBoxInitialRegion.top + initialDiffTop <
                minScrollTop + SCROLL_MARGIN &&
                initialDiffTop < 0) {
                scrollAjust = -rowReorderScrollByAmount;
            }
            else if (dragBoxInitialRegion.top + initialDiffTop >
                maxScrollTop - SCROLL_MARGIN &&
                initialDiffTop > 0) {
                scrollAjust = rowReorderScrollByAmount;
            }
            if (scrollAjust) {
                if (scrollTop + scrollAjust < 0) {
                    scrollAjust = -scrollTop;
                }
                if (scrollTop + scrollAjust > scrollTopMax) {
                    scrollAjust = scrollTopMax - scrollTop;
                }
                if (scrollAjust) {
                    if (!props.rowReorderAutoScroll) {
                        this.setScrollTop(scrollTop + scrollAjust);
                    }
                    dragProxyAjust = scrollAjust;
                }
            }
            const dragProxyTop = dragBoxInitialRegion.top -
                dragBoxOffsets.top +
                initialDiffTop -
                dragProxyAjust +
                headerHeight;
            const dragProxyLeft = dragBoxInitialRegion.left -
                dragBoxOffsets.left +
                initialDiffLeft +
                leftBoxOffset;
            dragProxy.setTop(dragProxyTop);
            dragProxy.setLeft(dragProxyLeft);
            dragProxy.setVisible(true);
            let dir = initialDiffTop > 0 ? 1 : -1;
            const mapRange = (r) => {
                return {
                    ...r,
                    top: r.top - scrollDiff,
                    bottom: r.bottom - scrollDiff,
                };
            };
            const compareRanges = currentRanges.map(mapRange);
            let dropIndex = -1;
            const { index: newDropIndex } = getDropRowIndex({
                rowHeightManager,
                dragBoxInitialRegion,
                dragBoxOffsets,
                initialDiffTop,
                scrollTop,
                dragIndex,
                dir,
            });
            if (newDropIndex !== -1) {
                dropIndex = newDropIndex;
            }
            let validDropPositions;
            if (this.dropIndex !== dropIndex) {
                validDropPositions = dropIndexValidation({
                    count,
                    dragIndex,
                    dropIndex,
                    isRowReorderValid,
                });
                this.validDropPositions = validDropPositions;
                this.dragRowArrow.setValid(this.validDropPositions[dropIndex]);
            }
            this.dropIndex = dropIndex;
            const rowHeight = rowHeightManager.getRowHeight(this.dropIndex);
            this.dragRowArrow.setHeight(rowHeight);
            if (dragIndex !== dropIndex && dragIndex + 1 !== dropIndex) {
                this.setReorderArrowAt(dropIndex, compareRanges);
            } else {
                this.setReorderArrowVisible(false);
              }
        };
        this.onRowDrop = (event, config, props) => {
            const { dropIndex } = this;
            const { onRowReorder, data, setOriginalData } = props;
            if (dropIndex === undefined) {
                if (DRAG_INFO) {
                    DRAG_INFO.dragProxy.setVisible(false);
                }
                this.setReorderArrowVisible(false);
                DRAG_INFO = null;
                return;
            }
            const { dragProxy } = DRAG_INFO;
            let { dragIndex } = DRAG_INFO;
            DRAG_INFO = null;
            global.clearInterval(this.gridScrollInterval);
            this.dragBoxInitialHeight = 0;
            this.setReorderArrowVisible(false);
            dragProxy.setVisible(false);
            if (this.scrollTopRegionRef.current) {
                this.scrollTopRegionRef.current.setVisible(false);
            }
            if (this.scrollBottomRegionRef.current) {
                this.scrollBottomRegionRef.current.setVisible(false);
            }
            if (dropIndex === dragIndex || dropIndex === dragIndex + 1) {
                return;
            }
            if (!this.validDropPositions[dropIndex]) {
                return;
            }
            if (onRowReorder && typeof onRowReorder === 'function') {
                const rowData = data[dragIndex];
                onRowReorder({
                    data: rowData,
                    dragRowIndex: dragIndex,
                    insertRowIndex: dropIndex,
                });
                return;
            }
            if (this.validDropPositions[dropIndex]) {
                const newDataSource = moveXBeforeY(data, dragIndex, dropIndex);
                setOriginalData(newDataSource);
            }
        };
        this.setReorderArrowAt = (index, ranges, visible) => {
            visible = visible !== undefined ? visible : index !== DRAG_INFO.dragIndex;
            if (!scrolling) {
                this.setReorderArrowVisible(visible);
            }
            let box = ranges[index];
            const { contentRegion } = DRAG_INFO;
            // if there is no box, probably it's trying to position it after the last row
            let boxPos = !box
                ? ranges[ranges.length - 1].bottom - 4 /*todo remove magic constant */
                : box.top;
            const arrowPosition = boxPos - contentRegion.top;
            return this.setReorderArrowPosition(arrowPosition);
        };
        this.setReorderArrowPosition = (top) => {
            this.dragRowArrow.setTop(top);
        };
        this.setReorderArrowVisible = (visible) => {
            this.dragRowArrow.setVisible(visible);
        };
        this.refDragRow = (row) => {
            this.dragRow = row;
        };
        this.refDragRowArrow = (dragRow) => {
            this.dragRowArrow = dragRow;
        };
        this.scrollTopRegionRef = createRef();
        this.scrollBottomRegionRef = createRef();
    }
}
