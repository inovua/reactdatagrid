/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import autoBind from '../../../packages/react-class/autoBind';
import cleanProps from '../../../packages/react-clean-props';
import shallowequal, { equalReturnKey } from '../../../packages/shallowequal';
import join from '../../../packages/join';
import clamp from '../../../utils/clamp';
import Cell from '../Cell';
import renderCellsMaybeLocked from './renderCellsMaybeLocked';
import adjustCellProps from './adjustCellProps';
const CLASS_NAME = 'InovuaReactDataGrid__row';
const rowClean = (p) => {
    const result = { ...p };
    delete result.activeRowRef;
    return result;
};
const skipSelect = (event) => {
    event.nativeEvent.skipSelect = true;
};
const getValueForPivotColumn = (item, path) => {
    return path.reduce((acc, field, index) => {
        if (!acc || acc[field] == null) {
            return null;
        }
        if (index === path.length - 1) {
            return acc[field];
        }
        return acc[field].pivotSummary || acc[field].values;
    }, item);
};
const getValueForPivotColumnSummary = (item, { pivotSummaryPath: path, }) => {
    let i = 0;
    let root = item;
    let current;
    while ((current = path[i]) && root) {
        if (!root.pivotSummary) {
            return null;
        }
        root = root.pivotSummary[current.value];
        i++;
    }
    if (root && root.pivotColumnSummary) {
        return root.pivotColumnSummary[path[path.length - 1].field];
    }
    return null;
};
export default class DataGridRow extends React.Component {
    constructor(props) {
        super(props);
        this.cells = [];
        this.columnRenderStartIndex = 0;
        this.scrollingDirection = 'vertical';
        this.scrollingInProgress = false;
        this.hasBorderTop = false;
        this.hasBorderBottom = false;
        this.rafId = null;
        this.shouldUpdate = false;
        this.maxRowspan = 1;
        this.getVirtualizeColumns = () => {
            return this.props.virtualizeColumns;
            return this.scrollingDirection !== 'horizontal'
                ? this.props.virtualizeColumns
                : false;
        };
        this.cellRef = (c) => {
            if (!c) {
                return;
            }
            this.cells.push(c);
        };
        this.domRef = createRef();
        this.cells = [];
        autoBind(this);
    }
    shouldComponentUpdate(nextProps) {
        let areEqual = equalReturnKey(this.props, nextProps, {
            computedActiveCell: 1,
            computedActiveIndex: 1,
            columnRenderStartIndex: 1,
            activeRowRef: 1,
            active: 1,
            onKeyDown: 1,
            onFocus: 1,
            setRowSpan: 1,
            passedProps: 1,
            computedRowspans: 1,
            lockedStartColumns: 1,
            selection: 1,
            lockedEndColumns: 1,
            unlockedColumns: 1,
            maxVisibleRows: 1,
            onClick: 1,
            style: 1,
        });
        if (!areEqual.result) {
            return true;
        }
        if (this.props.active !== nextProps.active) {
            return true;
        }
        if (JSON.stringify(this.props.style) !== JSON.stringify(nextProps.style)) {
            return true;
        }
        let prevActiveCellRow, prevActiveColumn;
        let activeCellRow, activeColumn;
        if (this.props.computedActiveCell) {
            [prevActiveCellRow, prevActiveColumn] = this.props.computedActiveCell;
        }
        if (nextProps.computedActiveCell) {
            [activeCellRow, activeColumn] = nextProps.computedActiveCell;
        }
        if (activeCellRow !== prevActiveCellRow) {
            if (nextProps.rowIndex === activeCellRow ||
                nextProps.rowIndex === prevActiveCellRow) {
                return true;
            }
        }
        else {
            if (nextProps.rowIndex === activeCellRow &&
                activeColumn !== prevActiveColumn) {
                return true;
            }
        }
        return false;
    }
    onCellUnmount(cellProps, cell) {
        if (this.cells) {
            this.cells = this.cells.filter(c => c !== cell);
        }
    }
    cleanupCells() {
        this.cells = this.cells.filter(Boolean);
        return this.cells;
    }
    componentWillUnmount() {
        this.cells = [];
    }
    xshouldComponentUpdate(nextProps) {
        if (this.rafId != null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        if (this.shouldUpdate) {
            this.shouldUpdate = false;
            return true;
        }
        const props = this.props;
        this.rafId = requestAnimationFrame(() => {
            this.rafId = null;
            if (!shallowequal(nextProps, props)) {
                this.shouldUpdate = true;
                this.forceUpdate();
            }
        });
        return false;
    }
    // TODO remove unsafe
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.columnRenderCount < this.props.columnRenderCount) {
            this.cleanupCells();
            this.getCells().forEach(cell => {
                if (cell.getProps().computedLocked) {
                    return;
                }
                cell.setStateProps(null);
            });
        }
    }
    componentDidMount() {
        if (this.props.active) {
            this.props.activeRowRef.current = {
                instance: this,
                node: this.getDOMNode(),
            };
        }
        if (this.props.columnRenderStartIndex) {
            this.setColumnRenderStartIndex(this.props.columnRenderStartIndex);
        }
    }
    getDOMNode() {
        return this.domRef.current;
    }
    orderCells() {
        const cells = this.cleanupCells();
        const sortedProps = cells
            .map(c => c.getProps())
            .sort((p1, p2) => p1.index - p2.index);
        cells.sort((cell1, cell2) => cell1.props.renderIndex - cell2.props.renderIndex);
        cells.forEach((c, i) => {
            c.setStateProps(sortedProps[i]);
        });
    }
    componentDidUpdate(prevProps) {
        if (this.props.groupProps && this.props.rowIndex != prevProps.rowIndex) {
            // when the grid is scrolled both horiz & vertically
            // and we scroll back up to a group row (with colspan)
            // then we need to recompute visible rows, since the cell with colspan
            // may otherwise be out of view - but still need to be visible
            // due to the colspan it has
            this.fixForColspan();
        }
        if (this.props.editing && !prevProps.editing) {
            this.updateEditCell();
        }
        if (!prevProps.active && this.props.active) {
            this.props.activeRowRef.current = {
                instance: this,
                node: this.getDOMNode(),
            };
        }
    }
    updateEditCell(props = this.props) {
        const cells = this.getCells();
        const { editColumnIndex } = props;
        for (let i = 0, len = cells.length, cell; i < len; i++) {
            cell = cells[i];
            if (this.getCellIndex(cell) === editColumnIndex) {
                this.setCellIndex(cell, editColumnIndex);
            }
            if (cell.getProps().inEdit) {
                // if there was another cell in edit, make it update correctly
                this.setCellIndex(cell, this.getCellIndex(cell));
            }
        }
    }
    fixForColspan() {
        if (this.props.computedHasColSpan) {
            this.setColumnRenderStartIndex(this.columnRenderStartIndex);
        }
    }
    setScrolling(scrolling) {
        const node = (this.getDOMNode() ||
            this.domRef.current);
        let scrollingDirection = this.scrollingDirection;
        if (scrolling !== false) {
            scrollingDirection = scrolling;
        }
        const oldScrollingInProgress = this.scrollingInProgress;
        const oldScrollingDirection = this.scrollingDirection;
        this.scrollingDirection = scrollingDirection;
        this.scrollingInProgress = scrolling ? true : false;
        if (!node) {
            return;
        }
        if (oldScrollingInProgress !== this.scrollingInProgress) {
            const className = `${CLASS_NAME}--scrolling`;
            if (this.scrollingInProgress) {
                node.classList.add(className);
            }
            else {
                node.classList.remove(className);
            }
        }
        return;
        if (this.scrollingDirection === oldScrollingDirection) {
            return;
        }
        const virtualizeColumnsClassName = `${CLASS_NAME}--virtualize-columns`;
        const virtualizeColumns = this.getVirtualizeColumns();
        if (virtualizeColumns) {
            node.classList.add(virtualizeColumnsClassName);
        }
        else {
            node.classList.remove(virtualizeColumnsClassName);
        }
        if (oldScrollingDirection !== this.scrollingDirection) {
            this.forceUpdate();
        }
    }
    render() {
        const props = this.props;
        const { rowHeight, initialRowHeight, maxRowHeight, groupNestingSize, summaryProps, data, id, columns, minWidth, maxWidth, rowStyle, scrollbars, renderRow, computedRowExpandEnabled, even, odd, active, selected, expanded, passedProps, realIndex, remoteRowIndex, nativeScroll, indexInGroup, naturalRowHeight, rowDetailsStyle, renderDetailsGrid, last, empty, computedPivot, computedShowZebraRows, rowDetailsWidth, availableWidth, groupProps, groupColumn, dataSourceArray, onRenderRow, shouldRenderCollapsedRowDetails, editing, rtl, sticky, hasLockedEnd, hasLockedStart, showHorizontalCellBorders, } = props;
        let { rowClassName } = props;
        const virtualizeColumns = this.getVirtualizeColumns();
        const lastInGroup = indexInGroup == props.groupCount - 1;
        let className = join(props.className, CLASS_NAME, this.scrollingInProgress && `${CLASS_NAME}--scrolling`, empty && `${CLASS_NAME}--empty`, editing && `${CLASS_NAME}--editing`, `${CLASS_NAME}--direction-${rtl ? 'rtl' : 'ltr'}`, computedShowZebraRows &&
            even &&
            (!groupProps || computedPivot) &&
            `${CLASS_NAME}--even`, computedShowZebraRows &&
            odd &&
            (!groupProps || computedPivot) &&
            `${CLASS_NAME}--odd`, !computedShowZebraRows && !groupProps && `${CLASS_NAME}--no-zebra`, groupProps && `${CLASS_NAME}--group-row`, summaryProps && `${CLASS_NAME}--summary-row`, summaryProps &&
            `${CLASS_NAME}--summary-position-${summaryProps.position}`, groupProps && groupProps.collapsed && `${CLASS_NAME}--collapsed`, selected && `${CLASS_NAME}--selected`, expanded && `${CLASS_NAME}--expanded`, hasLockedStart
            ? `${CLASS_NAME}--has-locked-start`
            : `${CLASS_NAME}--no-locked-start`, hasLockedEnd
            ? `${CLASS_NAME}--has-locked-end`
            : `${CLASS_NAME}--no-locked-end`, showHorizontalCellBorders && `${CLASS_NAME}--show-horizontal-borders`, active && `${CLASS_NAME}--active`, virtualizeColumns && `${CLASS_NAME}--virtualize-columns`, rowHeight && `${CLASS_NAME}--rowheight`, naturalRowHeight && `${CLASS_NAME}--natural-rowheight`, realIndex == 0 && `${CLASS_NAME}--first`, last && `${CLASS_NAME}--last`, indexInGroup == 0 && `${CLASS_NAME}--first-in-group`, lastInGroup && `${CLASS_NAME}--last-in-group`);
        if (passedProps) {
            className = join(className, selected && passedProps.selectedClassName);
        }
        let style = {
            ...props.style,
            height: naturalRowHeight ? null : rowHeight,
            width: props.width,
            minWidth,
            direction: 'ltr',
        };
        if (maxWidth != null) {
            style.maxWidth = maxWidth;
        }
        if (maxRowHeight != null) {
            style.maxHeight = maxRowHeight;
        }
        if (rowStyle) {
            if (typeof rowStyle === 'function') {
                const rowStyleResult = rowStyle({ data, props, style });
                if (rowStyleResult !== undefined) {
                    style = { ...style, ...rowStyleResult };
                }
            }
            else {
                style = { ...style, ...rowStyle };
            }
        }
        if (rowClassName) {
            if (typeof rowClassName == 'function') {
                rowClassName = rowClassName({ data, props, className });
            }
            if (rowClassName && typeof rowClassName == 'string') {
                className = join(className, rowClassName);
            }
        }
        const rowProps = {
            ...props,
            className,
            style,
            ref: this.domRef,
            ...passedProps,
            // passedProps should not overwrite the folowing methods
            // onEvent prop will be called also
            onClick: this.onClick,
            onContextMenu: this.onContextMenu,
        };
        rowProps.children = [
            React.createElement("div", { key: "cellWrap", className: "InovuaReactDataGrid__row-cell-wrap InovuaReactDataGrid__row-hover-target", style: {
                    width: props.width,
                    height: (naturalRowHeight ? null : rowHeight),
                    position: 'absolute',
                    top: 0,
                    left: rtl ? -(props.emptyScrollOffset || 0) : 0,
                } }, this.renderRow(data, columns, style)),
        ];
        const groupDepth = groupColumn
            ? 0
            : data && data.__group
                ? data.depth - 1
                : data && data.__summary
                    ? rowProps.summaryProps.depth
                    : this.props.depth || 0;
        const activeBordersDiv = sticky ? (React.createElement("div", { key: "active-row-borders", className: join(`${CLASS_NAME}-active-borders`, this.hasBorderTop && `${CLASS_NAME}-active-borders--has-border-top`, this.hasBorderBottom &&
                `${CLASS_NAME}-actived-borders--has-border-bottom`) })) : null;
        const shouldRender = expanded || shouldRenderCollapsedRowDetails;
        if (computedRowExpandEnabled && shouldRender && !data.__group) {
            const rowDetailsInfo = {
                data,
                rtl,
                isRowExpandable: this.isRowExpandable,
                rowIndex: realIndex,
                remoteRowIndex,
                rowId: this.props.getItemId(data),
                rowExpanded: expanded,
                id,
                rowSelected: selected,
                rowActive: active,
                toggleRowExpand: this.toggleRowExpand,
                setRowExpanded: this.setRowExpanded,
                dataSource: dataSourceArray,
            };
            let detailsStyle = {
                position: 'absolute',
                height: rowHeight - initialRowHeight,
                overflow: renderDetailsGrid ? 'visible' : 'auto',
                top: initialRowHeight,
            };
            if (rtl) {
                detailsStyle.direction = 'rtl';
            }
            if (rowDetailsWidth == 'max-viewport-width') {
                detailsStyle.width = Math.min(availableWidth, (props.width || maxWidth));
            }
            if (rowDetailsWidth === 'min-viewport-width') {
                detailsStyle.width = Math.max(availableWidth, (props.width || maxWidth));
            }
            if (rowDetailsWidth === 'viewport-width') {
                detailsStyle.width = availableWidth;
            }
            if (groupDepth) {
                detailsStyle[rtl ? 'paddingRight' : 'paddingLeft'] =
                    (groupNestingSize || 0) * groupDepth;
            }
            detailsStyle[rtl ? 'right' : 'left'] = 0;
            if (isNaN(detailsStyle.width)) {
                delete detailsStyle.width;
            }
            if (!expanded) {
                detailsStyle.display = 'none';
            }
            if (rowDetailsStyle) {
                if (typeof rowDetailsStyle === 'function') {
                    let styleResult = rowDetailsStyle(detailsStyle, rowDetailsInfo);
                    if (styleResult !== undefined) {
                        detailsStyle = styleResult;
                    }
                }
                else {
                    detailsStyle = { ...detailsStyle, ...rowDetailsStyle };
                }
            }
            let showBorderBottom = !lastInGroup || last;
            if (nativeScroll && last && expanded) {
                showBorderBottom = false;
            }
            rowProps.children.push(React.createElement("div", { key: "rowDetails", style: detailsStyle, onClick: skipSelect, className: join(`${CLASS_NAME}-details`, `${CLASS_NAME}-details--${rowDetailsWidth}`, renderDetailsGrid ? `${CLASS_NAME}-details--details-grid` : null, !nativeScroll ||
                    (nativeScroll && scrollbars && !scrollbars.vertical) ||
                    availableWidth > minWidth
                    ? `${CLASS_NAME}-details--show-border-right`
                    : null, showBorderBottom ? `${CLASS_NAME}-details--show-border-bottom` : '') }, this.renderRowDetails(rowDetailsInfo)), React.createElement("div", { className: `${CLASS_NAME}-details-special-bottom-border`, style: {
                    [rtl ? 'right' : 'left']: (groupDepth || 0) * groupNestingSize,
                } }), groupDepth
                ? [...new Array(groupDepth)].map((_, index) => (React.createElement("div", { key: index, className: `${CLASS_NAME}-details-border`, style: {
                        height: '100%',
                        position: 'absolute',
                        [rtl ? 'right' : 'left']: (index + 1) * groupNestingSize,
                        top: 0,
                    } })))
                : null, rowDetailsWidth != 'max-viewport-width' ? (React.createElement("div", { key: "rowDetailsBorder", style: {
                    top: initialRowHeight - 1,
                    width: availableWidth,
                    [rtl ? 'right' : 'left']: (groupDepth || 0) * groupNestingSize,
                }, className: `${CLASS_NAME}-details-special-top-border` })) : null);
        }
        if (sticky) {
            if (activeBordersDiv) {
                rowProps.children.push(React.createElement("div", { key: "active-row-borders", className: `InovuaReactDataGrid__row-active-borders-wrapper`, style: {
                        // height: initialRowHeight,
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        [rtl ? 'right' : 'left']: (groupNestingSize || 0) * groupDepth,
                        width: availableWidth - (groupNestingSize || 0) * groupDepth,
                        pointerEvents: 'none',
                    } }, activeBordersDiv));
            }
        }
        let row;
        if (renderRow) {
            row = renderRow(rowProps);
        }
        if (onRenderRow) {
            onRenderRow(rowProps);
        }
        if (row === undefined) {
            row = (React.createElement("div", Object.assign({}, cleanProps(rowProps, DataGridRow.propTypes), { id: null, data: null, value: null })));
        }
        return row;
    }
    renderRowDetails(rowDetailsInfo) {
        const { computedRenderRowDetails } = this.props;
        if (computedRenderRowDetails) {
            return computedRenderRowDetails(rowDetailsInfo);
        }
        return 'Please specify `renderRowDetails`';
    }
    onContextMenu(event) {
        const props = this.props;
        const { passedProps, onRowContextMenu } = props;
        if (onRowContextMenu) {
            onRowContextMenu(props, event);
        }
        if (passedProps && passedProps.onContextMenu) {
            passedProps.onContextMenu(event, props);
        }
    }
    setCellIndex(cell, index, cellProps) {
        cellProps =
            cellProps ||
                (this.props.computedHasColSpan
                    ? this.getPropsForCells().slice(index, index + 1)[0]
                    : this.getPropsForCells(index, index)[0]);
        cell.setStateProps(cellProps);
    }
    getCellIndex(cell) {
        return cell.getProps().computedVisibleIndex;
    }
    sortCells(cells) {
        return cells.sort((cell1, cell2) => this.getCellIndex(cell1) - this.getCellIndex(cell2));
    }
    getCellAt(index) {
        return this.getCells().filter(c => c.getProps().computedVisibleIndex === index)[0];
    }
    getCellById(id) {
        return this.getCells().filter(c => c.getProps().id === id)[0];
    }
    getCells() {
        return this.cells;
    }
    getSortedCells() {
        return this.sortCells(this.getCells().slice());
    }
    getGaps(startIndex, endIndex) {
        const visibleCellPositions = {};
        this.getSortedCells().forEach(cell => {
            const cellProps = cell.getProps();
            if (cellProps.computedLocked) {
                return;
            }
            const { computedVisibleIndex, computedColspan, groupProps } = cellProps;
            if (groupProps && computedVisibleIndex <= groupProps.depth + 1) {
                return;
            }
            visibleCellPositions[computedVisibleIndex] = true;
            if (computedColspan) {
                for (var i = 0; i < computedColspan; i++) {
                    visibleCellPositions[computedVisibleIndex + i] = true;
                }
            }
        });
        const gaps = [];
        for (; startIndex <= endIndex; startIndex++) {
            if (!visibleCellPositions[startIndex]) {
                gaps.push(startIndex);
            }
        }
        return gaps;
    }
    toggleRowExpand(rowIndex) {
        if (typeof rowIndex !== 'number') {
            rowIndex = this.props.realIndex;
        }
        this.props.toggleRowExpand(rowIndex);
    }
    toggleNodeExpand(rowIndex) {
        if (typeof rowIndex !== 'number') {
            rowIndex = this.props.realIndex;
        }
        this.props.toggleNodeExpand(rowIndex);
    }
    loadNodeAsync() {
        const { data } = this.props;
        this.props.loadNodeAsync?.(data);
    }
    isRowExpandable(rowIndex) {
        if (typeof rowIndex !== 'number') {
            rowIndex = this.props.realIndex;
        }
        return this.props.isRowExpandableAt(rowIndex);
    }
    setRowExpanded(expanded, _) {
        let rowIndex = this.props.realIndex;
        let _expanded = expanded;
        if (typeof expanded === 'number') {
            rowIndex = expanded;
            _expanded = _;
        }
        this.props.setRowExpanded(rowIndex, _expanded);
    }
    getCurrentGaps() { }
    setColumnRenderStartIndex(columnRenderStartIndex) {
        if (this.columnRenderStartIndex === columnRenderStartIndex) {
            return;
        }
        this.columnRenderStartIndex = columnRenderStartIndex;
        if (this.getVirtualizeColumns() === false) {
            return;
        }
        let newCellProps;
        let renderRange;
        let cellPropsAt;
        if (this.props.computedHasColSpan) {
            newCellProps = this.getPropsForCells();
            renderRange = this.getColumnRenderRange(newCellProps);
            cellPropsAt = (index) => newCellProps[index];
        }
        else {
            renderRange = this.getColumnRenderRange();
            newCellProps = this.getPropsForCells(renderRange?.start, (renderRange?.end || 0) + 1);
            cellPropsAt = (index) => newCellProps.filter(cellProps => cellProps.computedVisibleIndex === index)[0];
        }
        if (!renderRange) {
            return;
        }
        const { start, end } = renderRange;
        const gaps = this.getGaps(start, end);
        if (!gaps.length) {
            return;
        }
        const gapsMap = gaps.reduce((acc, gapIndex) => {
            acc[gapIndex] = true;
            return acc;
        }, {});
        const tempCellMap = {};
        const { groupColumn } = this.props;
        const calls = [];
        this.getCells().forEach(cell => {
            const cellProps = cell.getProps();
            const { groupProps, computedVisibleIndex: cellIndex, computedColspan, computedLocked, } = cellProps;
            if (computedLocked) {
                return;
            }
            if (!groupColumn && groupProps && cellIndex <= groupProps.depth + 1) {
                // dont reuse those cells
                return;
            }
            let outside = cellIndex < start || cellIndex > end || cellIndex === undefined;
            if (outside && computedColspan) {
                var endCellIndex = cellIndex + (computedColspan - 1);
                outside =
                    (cellIndex < start && endCellIndex < start) || cellIndex > end;
            }
            const outOfView = outside || tempCellMap[cellIndex] || gapsMap[cellIndex];
            tempCellMap[cellIndex] = true;
            let newIndex;
            if (outOfView && gaps.length) {
                newIndex = gaps[gaps.length - 1];
                calls.push([cell, newIndex]);
                gaps.length -= 1;
            }
        });
        calls.forEach(call => {
            const cell = call[0];
            const newIndex = call[1];
            this.setCellIndex(cell, newIndex, cellPropsAt(newIndex));
        });
    }
    getPropsForCells(startIndex, endIndex) {
        // if (startIndex !== undefined || endIndex !== undefined) {
        //   console.warn(
        //     'Calling getPropsForCells with start/end index is deprecated. Use .slice instead'
        //   );
        // }
        const initialColumns = this.props.columns;
        let columns = initialColumns;
        const { props } = this;
        const { hasLockedStart, data, onGroupToggle, computedPivot, rowHeight, remoteRowIndex, initialRowHeight, lastLockedStartIndex, lastLockedEndIndex, lastUnlockedIndex, minRowHeight, realIndex, showHorizontalCellBorders, showVerticalCellBorders, empty, treeColumn, groupColumn, totalDataCount, depth, dataSourceArray, computedGroupBy, groupProps, summaryProps, indexInGroup, firstUnlockedIndex, firstLockedEndIndex, selectAll, deselectAll, columnUserSelect, multiSelect, selection, setRowSelected, computedRowExpandEnabled, rtl, last: lastRow, computedCellSelection, lastNonEmpty, maxVisibleRows, onCellClick, editStartEvent, naturalRowHeight, renderNodeTool, computedTreeEnabled, expanded: rowExpanded, expandGroupTitle, expandColumn: expandColumnFn, onCellSelectionDraggerMouseDown, onCellMouseDown, onCellEnter, computedCellMultiSelectionEnabled, getCellSelectionKey, lastCellInRange, computedRowspans, renderIndex, nativeScroll, onDragRowMouseDown, theme, onContextMenu, setActiveIndex, renderTreeCollapseTool, renderTreeExpandTool, renderTreeLoadingTool, } = props;
        const expandColumnId = expandColumnFn
            ? expandColumnFn({ data })
            : undefined;
        const virtualizeColumns = this.getVirtualizeColumns();
        const visibleColumnCount = columns.length;
        const expandColumnIndex = expandColumnId
            ? columns.filter(c => c.id === expandColumnId)[0]?.computedVisibleIndex
            : undefined;
        if (startIndex !== undefined) {
            columns = columns.slice(startIndex, endIndex ? endIndex + 1 : startIndex + 1);
        }
        startIndex = startIndex || 0;
        let hasBorderTop = false;
        let hasBorderBottom = false;
        const hiddenCells = {};
        const belongsToColspan = {};
        const columnsTillColspanStart = {};
        const lastInGroup = indexInGroup == this.props.groupCount - 1;
        const activeCell = props.computedActiveCell && getCellSelectionKey
            ? getCellSelectionKey(...props.computedActiveCell)
            : null;
        const lastInRange = lastCellInRange || activeCell || null;
        let maxRowspan = 1;
        const cellPropsArray = columns.map((column, xindex) => {
            let theColumnIndex = xindex + startIndex;
            const columnProps = column;
            const { name, computedVisibleIndex } = columnProps;
            let value = data ? data[name] : null;
            const rowIndex = realIndex;
            if (groupProps && data && data.groupColumnSummary) {
                value = data.groupColumnSummary[name];
            }
            if (groupProps && data && column.groupColumn) {
                // this is the first column, the group column in a pivot grid
                // so make group cells have the group value
                value = data.value;
            }
            if (columnProps.pivotColumnPath) {
                // this is a pivot column
                value = data.pivotSummary
                    ? getValueForPivotColumn(data.pivotSummary, columnProps.pivotColumnPath)
                    : value;
            }
            if (columnProps.pivotGrandSummaryColumn) {
            }
            else {
                if (columnProps.pivotSummaryPath) {
                    value = data.pivotSummary
                        ? getValueForPivotColumnSummary(data, {
                            pivotSummaryPath: columnProps.pivotSummaryPath,
                            pivotGrandSummaryColumn: columnProps.pivotGrandSummaryColumn,
                        })
                        : value;
                }
            }
            const defaults = {};
            if (columnUserSelect !== undefined) {
                defaults.userSelect = columnUserSelect;
            }
            const groupTitleCell = !groupColumn &&
                groupProps &&
                groupProps.depth + 1 == computedVisibleIndex;
            const groupExpandCell = !groupColumn && groupProps && groupProps.depth == computedVisibleIndex;
            let hidden = groupProps
                ? expandGroupTitle && !groupColumn
                    ? computedVisibleIndex > groupProps.depth + 1
                    : false
                : false;
            if (expandColumnIndex != null &&
                computedVisibleIndex > expandColumnIndex) {
                hidden = true;
            }
            const cellProps = {
                ...defaults,
                ...columnProps,
                remoteRowIndex,
                indexInColumns: theColumnIndex,
                depth,
                expandColumnIndex,
                expandColumn: expandColumnIndex === computedVisibleIndex,
                editStartEvent,
                onCellClick,
                computedRowspan: computedRowspans ? computedRowspans[column.id] : 1,
                groupNestingSize: this.props.groupNestingSize,
                treeNestingSize: this.props.treeNestingSize,
                data,
                naturalRowHeight,
                totalDataCount,
                onCellSelectionDraggerMouseDown,
                onCellMouseDown,
                onCellEnter,
                rtl,
                computedPivot,
                selectAll,
                deselectAll,
                selection,
                renderNodeTool,
                onDragRowMouseDown,
                multiSelect,
                treeColumn: treeColumn !== undefined ? treeColumn === columnProps.id : false,
                setRowSelected,
                setRowExpanded: computedRowExpandEnabled ? this.setRowExpanded : null,
                toggleRowExpand: computedRowExpandEnabled ? this.toggleRowExpand : null,
                toggleNodeExpand: computedTreeEnabled ? this.toggleNodeExpand : null,
                loadNodeAsync: computedTreeEnabled ? this.loadNodeAsync : null,
                rowActive: this.props.active,
                rowSelected: this.props.selected,
                rowExpanded,
                rowIndex,
                rowHeight,
                groupColumnVisible: !!groupColumn,
                minRowHeight,
                groupProps,
                summaryProps,
                empty,
                computedGroupBy,
                nativeScroll,
                computedCellMultiSelectionEnabled,
                lastRowInGroup: lastInGroup,
                columnIndex: computedVisibleIndex,
                first: computedVisibleIndex == 0,
                last: computedVisibleIndex == visibleColumnCount - 1,
                value,
                virtualizeColumns,
                hasLockedStart,
                rowIndexInGroup: indexInGroup,
                rowRenderIndex: renderIndex,
                hidden,
                groupTitleCell,
                groupExpandCell,
                isRowExpandable: computedRowExpandEnabled ? this.isRowExpandable : null,
                tryRowCellEdit: this.tryRowCellEdit,
                tryNextRowEdit: this.tryNextRowEdit,
                onGroupToggle,
                initialRowHeight: rowExpanded ? initialRowHeight : rowHeight,
                theme,
                onContextMenu,
                setActiveIndex,
                renderTreeCollapseTool,
                renderTreeExpandTool,
                renderTreeLoadingTool,
            };
            if (computedCellSelection && getCellSelectionKey) {
                cellProps.cellSelected =
                    computedCellSelection[getCellSelectionKey(rowIndex, computedVisibleIndex)];
                if (cellProps.cellSelected) {
                    cellProps.hasRightSelectedSibling = cellProps.last
                        ? false
                        : computedCellSelection[getCellSelectionKey(rowIndex, computedVisibleIndex + 1)];
                    cellProps.hasLeftSelectedSibling = cellProps.first
                        ? false
                        : computedCellSelection[getCellSelectionKey(rowIndex, computedVisibleIndex - 1)];
                    cellProps.hasTopSelectedSibling =
                        computedCellSelection[getCellSelectionKey(rowIndex - 1, computedVisibleIndex)];
                    cellProps.hasBottomSelectedSibling =
                        computedCellSelection[getCellSelectionKey(rowIndex + 1, computedVisibleIndex)];
                }
            }
            if (getCellSelectionKey && (activeCell || lastInRange)) {
                const cellKey = getCellSelectionKey(rowIndex, computedVisibleIndex);
                if (activeCell && activeCell === cellKey) {
                    cellProps.cellActive = true;
                }
                if (lastInRange && lastInRange === cellKey) {
                    cellProps.lastInRange = true;
                }
            }
            if (cellProps.visibilityTransitionDuration ||
                cellProps.showTransitionDuration ||
                cellProps.hideTransitionDuration) {
                cellProps.onTransitionEnd = this.onTransitionEnd.bind(this, cellProps, columnProps);
            }
            if (this.props.editing &&
                this.props.editColumnIndex === cellProps.columnIndex) {
                cellProps.inEdit = true;
                cellProps.editValue = this.props.editValue;
            }
            if ((virtualizeColumns && !cellProps.computedLocked) ||
                this.props.editable ||
                cellProps.computedEditable) {
                cellProps.cellRef = this.cellRef;
                cellProps.onUnmount = this.onCellUnmount;
            }
            const { computedLocked, colspan } = cellProps;
            const lockedStart = computedLocked === 'start';
            const lockedEnd = computedLocked === 'end';
            const unlocked = !computedLocked;
            let computedColspan = 1;
            if (typeof colspan === 'function') {
                computedColspan = cellProps.computedColspan = Math.max(1, colspan({
                    remoteRowIndex,
                    dataSourceArray,
                    data: cellProps.data,
                    value: cellProps.value,
                    rowIndex: cellProps.rowIndex,
                    column,
                    columns,
                    empty,
                }));
                if (lockedStart) {
                    computedColspan = clamp(computedColspan, 1, Math.max(lastLockedStartIndex - computedVisibleIndex + 1, 1));
                }
                if (lockedEnd) {
                    computedColspan = clamp(computedColspan, 1, Math.max(lastLockedEndIndex - computedVisibleIndex + 1, 1));
                }
                if (unlocked) {
                    computedColspan = clamp(computedColspan, 1, Math.max(lastUnlockedIndex - computedVisibleIndex + 1, 1));
                }
                if (computedColspan > 1) {
                    cellProps.computedWidth = columns
                        .slice(theColumnIndex, theColumnIndex + computedColspan)
                        .reduce((sum, col) => {
                        if (col.id !== column.id) {
                            hiddenCells[col.id] = true;
                            if (column.computedLocked === col.computedLocked) {
                                belongsToColspan[col.id] = column.id;
                                columnsTillColspanStart[col.id] =
                                    col.computedVisibleIndex - column.computedVisibleIndex;
                            }
                        }
                        return sum + col.computedWidth;
                    }, 0);
                }
            }
            cellProps.lastInSection = lockedStart
                ? computedVisibleIndex + computedColspan - 1 === firstUnlockedIndex - 1
                : lockedEnd
                    ? computedVisibleIndex + computedColspan - 1 === visibleColumnCount - 1
                    : computedVisibleIndex + computedColspan - 1 ===
                        firstLockedEndIndex - 1;
            cellProps.firstInSection = lockedStart
                ? computedVisibleIndex === 0
                : lockedEnd
                    ? computedVisibleIndex === firstLockedEndIndex
                    : computedVisibleIndex === firstUnlockedIndex;
            if (computedGroupBy && !groupColumn && !!cellProps.depth) {
                cellProps.noBackground = computedVisibleIndex < cellProps.depth;
            }
            if (hiddenCells[column.id]) {
                cellProps.hidden = true;
            }
            if (belongsToColspan[column.id]) {
                cellProps.computedColspanedBy = belongsToColspan[column.id];
                cellProps.computedColspanToStart = columnsTillColspanStart[column.id];
            }
            if ((groupProps && !groupColumn) || expandColumnIndex != null) {
                adjustCellProps(cellProps, this.props);
            }
            if (cellProps.hidden) {
                cellProps.last = false;
                cellProps.lastInSection = false;
            }
            else {
                cellProps.showBorderLeft =
                    showVerticalCellBorders && computedVisibleIndex > 0;
                cellProps.showBorderBottom = showHorizontalCellBorders;
                if (!showVerticalCellBorders && computedGroupBy) {
                    cellProps.showBorderLeft =
                        computedVisibleIndex > 0 &&
                            computedVisibleIndex <= computedGroupBy.length;
                }
                if (computedGroupBy) {
                    if (!cellProps.groupProps) {
                        cellProps.showBorderBottom = groupColumn
                            ? showHorizontalCellBorders
                            : computedVisibleIndex >= computedGroupBy.length &&
                                showHorizontalCellBorders;
                        // look behind for a summary
                        const summaryBefore = indexInGroup === 0 && !groupColumn
                            ? dataSourceArray[rowIndex - indexInGroup]
                            : null;
                        if (summaryBefore &&
                            summaryBefore.__summary &&
                            computedVisibleIndex >= computedGroupBy.length) {
                            cellProps.showBorderBottom = false;
                        }
                    }
                    if (!empty) {
                        if (!groupColumn &&
                            (computedVisibleIndex < computedGroupBy.length || lastInGroup)) {
                            cellProps.showBorderBottom = rowExpanded;
                        }
                        if (cellProps.groupProps) {
                            cellProps.showBorderBottom = cellProps.groupProps.collapsed
                                ? !!groupColumn
                                : groupColumn
                                    ? true
                                    : computedVisibleIndex > cellProps.groupProps.depth &&
                                        cellProps.groupProps.depth >= computedGroupBy.length;
                            cellProps.showBorderTop =
                                groupTitleCell ||
                                    groupExpandCell ||
                                    (!expandGroupTitle && !groupColumn);
                        }
                        else if (indexInGroup === 0 && !groupColumn) {
                            cellProps.showBorderTop =
                                computedVisibleIndex >= computedGroupBy.length;
                        }
                        if (lastNonEmpty && !lastRow && showHorizontalCellBorders) {
                            cellProps.showBorderBottom =
                                computedVisibleIndex >=
                                    (cellProps.groupProps
                                        ? cellProps.groupProps.depth
                                        : computedGroupBy.length);
                        }
                    }
                    else if (rowIndex > 0 && showHorizontalCellBorders) {
                        if (rowIndex === totalDataCount) {
                            cellProps.showBorderBottom =
                                computedVisibleIndex >= computedGroupBy.length;
                        }
                        else {
                            cellProps.showBorderBottom = computedGroupBy
                                ? computedVisibleIndex >= computedGroupBy.length
                                : true;
                        }
                    }
                }
                if (lastRow) {
                    cellProps.showBorderBottom =
                        rowIndex < maxVisibleRows - 1 || rowExpanded;
                }
                if (lockedStart && cellProps.lastInSection) {
                    // the last cell in lock start should have a right border
                    cellProps.showBorderRight = true;
                }
                if (lockedEnd && computedVisibleIndex === firstLockedEndIndex) {
                    // the first cell in the lock end group should have a left border
                    cellProps.showBorderLeft = true;
                }
                if (cellProps.groupProps &&
                    computedVisibleIndex >= cellProps.groupProps.depth + 1 &&
                    !groupColumn &&
                    props.expandGroupTitle) {
                    cellProps.showBorderLeft = false;
                }
                if (cellProps.summaryProps) {
                    cellProps.showBorderBottom = lastRow;
                    cellProps.showBorderTop =
                        computedVisibleIndex > cellProps.summaryProps.depth;
                    if (cellProps.summaryProps.position == 'start') {
                        cellProps.showBorderTop =
                            computedVisibleIndex >= cellProps.summaryProps.depth;
                        cellProps.showBorderBottom = false;
                    }
                    cellProps.showBorderLeft = showVerticalCellBorders
                        ? true
                        : computedVisibleIndex <= cellProps.summaryProps.depth;
                    if (computedVisibleIndex > cellProps.summaryProps.depth &&
                        computedVisibleIndex <= computedGroupBy.length &&
                        !groupColumn) {
                        cellProps.showBorderLeft = false;
                    }
                    if (computedVisibleIndex === 0) {
                        cellProps.showBorderLeft = false;
                    }
                    cellProps.noBackground = !groupColumn;
                }
                // the first cell in unlocked group should have no left border, if there are locked start cols
                if (firstUnlockedIndex === computedVisibleIndex && hasLockedStart) {
                    cellProps.showBorderLeft = false;
                }
                if (cellProps.groupSpacerColumn && rowExpanded) {
                    cellProps.showBorderBottom = false;
                }
                // only show borders for visible cells
                if (cellProps.last) {
                    cellProps.showBorderRight = true;
                }
                const prevColumn = columns[theColumnIndex - 1];
                const nextColumn = columns[theColumnIndex + 1];
                if (nextColumn &&
                    nextColumn.prevBorderRight !== undefined &&
                    !(lockedStart && cellProps.lastInSection)) {
                    cellProps.showBorderRight = nextColumn.prevBorderRight;
                }
                if (prevColumn && prevColumn.nextBorderLeft !== undefined) {
                    cellProps.showBorderLeft = prevColumn.nextBorderLeft;
                }
                if (columnProps.showBorderRight !== undefined) {
                    cellProps.showBorderRight = columnProps.showBorderRight;
                }
                if (columnProps.showBorderLeft !== undefined) {
                    cellProps.showBorderLeft = columnProps.showBorderLeft;
                }
            }
            if (cellProps.computedEditable) {
                cellProps.onEditStopForRow = this.onCellStopEdit;
                cellProps.onEditStartForRow = this.onCellStartEdit;
                cellProps.onEditCancelForRow = this.onCellEditCancel;
                cellProps.onEditValueChangeForRow = this.onCellEditValueChange;
                cellProps.onEditCompleteForRow = this.onCellEditComplete;
            }
            hasBorderBottom = hasBorderBottom || cellProps.showBorderBottom;
            hasBorderTop = hasBorderTop || cellProps.showBorderTop;
            return cellProps;
        });
        this.maxRowspan = maxRowspan;
        if (this.props.computedEnableRowspan) {
            this.props.setRowSpan && this.props.setRowSpan(maxRowspan);
        }
        this.hasBorderTop = hasBorderTop;
        this.hasBorderBottom = hasBorderBottom;
        return cellPropsArray;
    }
    onCellStopEdit(value, cellProps) {
        if (this.props.onEditStop) {
            this.props.onEditStop({
                value,
                data: cellProps.data,
                rowId: this.props.getItemId(cellProps.data),
                columnId: cellProps.id,
                columnIndex: cellProps.computedVisibleIndex,
                rowIndex: cellProps.rowIndex,
                cellProps,
            });
        }
    }
    onCellStartEdit(value, cellProps) {
        if (this.props.onEditStart) {
            this.props.onEditStart({
                data: cellProps.data,
                value,
                rowId: this.props.getItemId(cellProps.data),
                columnId: cellProps.id,
                columnIndex: cellProps.computedVisibleIndex,
                rowIndex: cellProps.rowIndex,
                cellProps,
            });
        }
    }
    onCellEditCancel(cellProps) {
        if (this.props.onEditCancel) {
            this.props.onEditCancel({
                data: cellProps.data,
                rowId: this.props.getItemId(cellProps.data),
                columnIndex: cellProps.computedVisibleIndex,
                columnId: cellProps.id,
                rowIndex: cellProps.rowIndex,
                cellProps,
            });
        }
    }
    onCellEditValueChange(value, cellProps) {
        if (this.props.onEditValueChange) {
            this.props.onEditValueChange({
                value,
                data: cellProps.data,
                rowId: this.props.getItemId(cellProps.data),
                columnId: cellProps.id,
                columnIndex: cellProps.computedVisibleIndex,
                rowIndex: cellProps.rowIndex,
                cellProps,
            });
        }
    }
    onCellEditComplete(value, cellProps) {
        if (this.props.onEditComplete) {
            this.props.onEditComplete({
                value,
                data: cellProps.data,
                rowId: this.props.getItemId(cellProps.data),
                columnId: cellProps.id,
                columnIndex: cellProps.computedVisibleIndex,
                rowIndex: cellProps.rowIndex,
                cellProps,
            });
        }
    }
    tryRowCellEdit(editIndex, dir = 0, isEnterNavigation) {
        const cols = this.props.columns;
        let col;
        let colIndex;
        if (!dir) {
            dir = 1;
        }
        dir = dir == 1 ? 1 : -1;
        let currentIndex = dir == 1 ? 0 : cols.length - 1;
        const foundCols = [];
        while (cols[currentIndex]) {
            col = cols[currentIndex];
            if (col.editable || (this.props.editable && col.editable !== false)) {
                colIndex = col.computedVisibleIndex;
                if (colIndex == editIndex) {
                    foundCols.push(col);
                }
                else {
                    if (dir < 0) {
                        if (colIndex < editIndex) {
                            foundCols.push(col);
                        }
                    }
                    else if (dir > 0) {
                        if (colIndex > editIndex) {
                            foundCols.push(col);
                        }
                    }
                }
            }
            currentIndex += dir;
        }
        if (!foundCols.length) {
            this.tryNextRowEdit(dir, isEnterNavigation
                ? editIndex
                : dir > 0
                    ? 0
                    : this.props.columns.length - 1);
            return Promise.reject(null);
        }
        foundCols.sort((a, b) => {
            // if dir > 0, sort asc, otherwise, desc
            return dir > 0 ? a - b : b - a;
        });
        // let retries: any = {};
        return new Promise((resolve, reject) => {
            const startEdit = (cols, index = 0) => {
                const errBack = () => {
                    isEnterNavigation
                        ? this.tryNextRowEdit(dir, editIndex, true)
                        : startEdit(cols, index + 1);
                };
                const col = cols[index];
                if (!col) {
                    this.tryNextRowEdit(dir, isEnterNavigation
                        ? editIndex
                        : dir > 0
                            ? 0
                            : this.props.columns.length - 1);
                    return reject('column not found');
                }
                const cell = this.getCellById(col.id);
                if (!cell) {
                    // if (retries[col.id]) {
                    //   return reject('column not found');
                    // }
                    // retries[col.id] = true;
                    if (this.props.scrollToColumn) {
                        this.props.scrollToColumn(col.id, undefined, () => {
                            setTimeout(() => {
                                startEdit(cols, index);
                            }, 20);
                        });
                    }
                    return;
                }
                return cell
                    .startEdit(undefined, errBack)
                    .then(resolve)
                    .catch(errBack);
            };
            startEdit(foundCols, 0);
        });
    }
    tryNextRowEdit(dir, columnIndex, isEnterNavigation) {
        if (this.props.scrollToIndexIfNeeded) {
            this.props.scrollToIndexIfNeeded(this.props.rowIndex + 2 * dir, { direction: dir == -1 ? 'top' : 'bottom' }, () => {
                if (this.props.tryNextRowEdit) {
                    this.props.tryNextRowEdit(this.props.rowIndex + dir, dir, columnIndex, isEnterNavigation);
                }
            });
        }
    }
    onTransitionEnd(cellProps, columnProps, e) {
        e.stopPropagation();
        if (columnProps.onTransitionEnd) {
            columnProps.onTransitionEnd(e);
        }
        if (this.props.onTransitionEnd) {
            this.props.onTransitionEnd(e, cellProps);
        }
    }
    getColumnRenderRange(cellProps) {
        const { lockedStartColumns, lockedEndColumns, columnRenderCount, groupProps, columns, groupColumn, } = this.props;
        const virtualizeColumns = this.getVirtualizeColumns();
        if (!virtualizeColumns) {
            return null;
        }
        const minStartIndex = lockedStartColumns.length
            ? lockedStartColumns.length
            : groupProps && !groupColumn //when there is a groupColumn, start virtualization from there
                ? groupProps.depth + 2
                : 0;
        const maxEndIndex = columns.length - lockedEndColumns.length - 1;
        let columnRenderStartIndex = this.columnRenderStartIndex == null
            ? this.props.columnRenderStartIndex || 0
            : this.columnRenderStartIndex;
        columnRenderStartIndex = Math.max(columnRenderStartIndex, minStartIndex);
        const fixStartIndexForColspan = () => {
            if (cellProps) {
                while (cellProps[columnRenderStartIndex].computedColspanedBy) {
                    columnRenderStartIndex--;
                }
            }
        };
        if (columnRenderCount != null) {
            let columnRenderEndIndex = columnRenderStartIndex + columnRenderCount;
            columnRenderEndIndex = Math.min(columnRenderEndIndex, maxEndIndex);
            if (columnRenderEndIndex - columnRenderCount != columnRenderStartIndex) {
                columnRenderStartIndex = Math.max(columnRenderEndIndex - columnRenderCount, minStartIndex);
            }
            if (columnRenderEndIndex < 0) {
                return {
                    start: 0,
                    end: 0,
                };
            }
            fixStartIndexForColspan();
            return { start: columnRenderStartIndex, end: columnRenderEndIndex };
        }
        return null;
    }
    expandRangeWithColspan(range, cellProps) {
        let extraNeededColumns = cellProps.reduce((total, cellProps) => {
            return (total +
                (cellProps.computedColspan > 1 ? cellProps.computedColspan - 1 : 0));
        }, 0);
        if (!extraNeededColumns) {
            return range;
        }
        const { firstUnlockedIndex } = this.props;
        if (range.start < firstUnlockedIndex) {
            range.start = firstUnlockedIndex;
        }
        if (range.start > extraNeededColumns) {
            range.start -= extraNeededColumns;
            return range;
        }
        extraNeededColumns -= range.start;
        range.start = 0;
        if (extraNeededColumns) {
            range.end += extraNeededColumns;
        }
        return range;
    }
    renderRow(_, __, style) {
        const { scrollLeft, hasLockedStart, hasLockedEnd, lockedStartColumns, lockedEndColumns, computedHasColSpan, groupProps, columns, } = this.props;
        const virtualizeColumns = this.getVirtualizeColumns();
        let cellProps;
        if (!virtualizeColumns) {
            cellProps = this.getPropsForCells();
        }
        else {
            let lockedStartCellProps = [];
            let lockedEndCellProps = [];
            let groupCellProps = [];
            let renderRange;
            if (computedHasColSpan) {
                cellProps = this.getPropsForCells();
                if (hasLockedStart) {
                    lockedStartCellProps = cellProps.slice(0, lockedStartColumns.length);
                }
                else if (groupProps) {
                    groupCellProps = cellProps.slice(0, groupProps.depth + 2);
                }
                if (hasLockedEnd) {
                    lockedEndCellProps = cellProps.slice(columns.length - lockedEndColumns.length, columns.length);
                }
                renderRange = this.getColumnRenderRange(cellProps);
                if (renderRange) {
                    renderRange = this.expandRangeWithColspan(renderRange, cellProps);
                    cellProps = cellProps.slice(renderRange.start, renderRange.end + 1);
                }
            }
            else {
                renderRange = this.getColumnRenderRange();
                cellProps = this.getPropsForCells(renderRange?.start, renderRange?.end || 0);
                if (hasLockedStart) {
                    lockedStartCellProps = this.getPropsForCells(0, lockedStartColumns.length - 1);
                }
                else if (groupProps) {
                    groupCellProps = this.getPropsForCells(0, groupProps.depth + 2 - 1);
                }
                if (hasLockedEnd) {
                    lockedEndCellProps = this.getPropsForCells(lockedEndColumns[0].computedVisibleIndex, columns.length - 1);
                }
            }
            if (hasLockedStart) {
                cellProps = [...lockedStartCellProps, ...cellProps];
            }
            else if (groupProps) {
                cellProps = [...groupCellProps, ...cellProps];
            }
            if (hasLockedEnd) {
                cellProps.push(...lockedEndCellProps);
            }
        }
        const result = cellProps.map((cProps, index) => {
            let cell;
            let key = index;
            if (!virtualizeColumns) {
                key = cProps.id || index;
            }
            if (this.props.cellFactory) {
                cell = this.props.cellFactory(cProps);
            }
            if (cell === undefined) {
                cell = (React.createElement(Cell, Object.assign({}, cProps, { ref: cProps.cellRef ? cProps.cellRef : null, key: key })));
            }
            return cell;
        });
        return renderCellsMaybeLocked(result, this.props, scrollLeft, undefined, style);
    }
    onClick(event) {
        const props = this.props;
        const { passedProps } = props;
        if (props.computedTreeEnabled && props.expandOnMouseDown) {
            this.toggleNodeExpand(props.rowIndex);
        }
        if (props.onClick) {
            props.onClick(event, props);
        }
        if (passedProps && passedProps.onClick) {
            passedProps.onClick(event, props);
        }
    }
}
const emptyFn = () => { };
DataGridRow.defaultProps = {
    onClick: emptyFn,
    onMouseEnter: emptyFn,
    onMouseLeave: emptyFn,
    onMouseDown: emptyFn,
    columnRenderStartIndex: 0,
    showAllGroupCells: false,
};
DataGridRow.propTypes = {
    rowActive: PropTypes.bool,
    rowSelected: PropTypes.bool,
    availableWidth: PropTypes.number,
    computedGroupBy: PropTypes.array,
    expandGroupTitle: PropTypes.bool,
    expandColumn: PropTypes.any,
    getCellSelectionKey: PropTypes.func,
    depth: PropTypes.number,
    columns: PropTypes.array,
    columnsMap: PropTypes.shape({}),
    active: PropTypes.bool,
    computedActiveCell: PropTypes.any,
    cellFactory: PropTypes.func,
    computedCellMultiSelectionEnabled: PropTypes.bool,
    computedCellSelection: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
    columnRenderCount: PropTypes.number,
    columnRenderStartIndex: PropTypes.number,
    columnUserSelect: PropTypes.bool,
    deselectAll: PropTypes.func,
    empty: PropTypes.bool,
    even: PropTypes.bool,
    firstLockedEndIndex: PropTypes.number,
    firstLockedStartIndex: PropTypes.number,
    firstUnlockedIndex: PropTypes.number,
    flex: PropTypes.number,
    groupCount: PropTypes.number,
    groupNestingSize: PropTypes.number,
    treeNestingSize: PropTypes.number,
    groupProps: PropTypes.object,
    summaryProps: PropTypes.object,
    hasLockedEnd: PropTypes.bool,
    hasLockedStart: PropTypes.bool,
    indexInGroup: PropTypes.number,
    last: PropTypes.bool,
    lastCellInRange: PropTypes.any,
    lastNonEmpty: PropTypes.bool,
    lastRowInGroup: PropTypes.bool,
    lockedEndColumns: PropTypes.array,
    lockedStartColumns: PropTypes.array,
    maxRowHeight: PropTypes.number,
    minRowHeight: PropTypes.number,
    maxVisibleRows: PropTypes.number,
    minWidth: PropTypes.number,
    multiSelect: PropTypes.bool,
    odd: PropTypes.bool,
    onArrowDown: PropTypes.func,
    onArrowUp: PropTypes.func,
    onCellClick: PropTypes.func,
    onCellEnter: PropTypes.func,
    onCellMouseDown: PropTypes.func,
    onCellSelectionDraggerMouseDown: PropTypes.func,
    onRowContextMenu: PropTypes.func,
    passedProps: PropTypes.object,
    realIndex: PropTypes.number,
    renderIndex: PropTypes.number,
    renderRow: PropTypes.func,
    onRenderRow: PropTypes.func,
    rowHeight: PropTypes.number,
    rowExpandHeight: PropTypes.number,
    initialRowHeight: PropTypes.number,
    defaultRowHeight: PropTypes.number,
    emptyScrollOffset: PropTypes.number,
    rowIndex: PropTypes.number,
    remoteRowIndex: PropTypes.number,
    rowIndexInGroup: PropTypes.bool,
    rowStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    scrollLeft: PropTypes.number,
    selectAll: PropTypes.func,
    selected: PropTypes.bool,
    expanded: PropTypes.bool,
    selection: PropTypes.any,
    computedRowExpandEnabled: PropTypes.bool,
    computedTreeEnabled: PropTypes.bool,
    computedRenderRowDetails: PropTypes.func,
    isRowExpandableAt: PropTypes.func,
    setRowSelected: PropTypes.func,
    setRowExpanded: PropTypes.func,
    toggleRowExpand: PropTypes.func,
    toggleNodeExpand: PropTypes.func,
    expandOnMouseDown: PropTypes.bool,
    loadNodeAsync: PropTypes.func,
    showAllGroupCells: PropTypes.bool,
    computedShowCellBorders: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]),
    showHorizontalCellBorders: PropTypes.bool,
    showVerticalCellBorders: PropTypes.bool,
    totalColumnCount: PropTypes.number,
    totalComputedWidth: PropTypes.number,
    totalDataCount: PropTypes.number,
    totalLockedEndWidth: PropTypes.number,
    totalLockedStartWidth: PropTypes.number,
    totalUnlockedWidth: PropTypes.number,
    unlockedColumns: PropTypes.array,
    virtualizeColumns: PropTypes.bool,
    nativeScroll: PropTypes.bool,
    shouldRenderCollapsedRowDetails: PropTypes.bool,
    rowDetailsStyle: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    dataSourceArray: PropTypes.array,
    getItemId: PropTypes.func.isRequired,
    editable: PropTypes.bool,
    editing: PropTypes.bool,
    editValue: PropTypes.any,
    editRowIndex: PropTypes.number,
    editColumnIndex: PropTypes.number,
    editColumnId: PropTypes.any,
    naturalRowHeight: PropTypes.bool,
    renderDetailsGrid: PropTypes.func,
    scrollToColumn: PropTypes.func,
    scrollToIndexIfNeeded: PropTypes.func,
    renderNodeTool: PropTypes.func,
    computedEnableRowspan: PropTypes.bool,
    setRowSpan: PropTypes.func,
    treeColumn: PropTypes.string,
    scrollbars: PropTypes.shape({
        horizontal: PropTypes.bool,
        vertical: PropTypes.bool,
    }),
    rtl: PropTypes.bool,
    computedPivot: PropTypes.array,
    groupColumnSummaries: PropTypes.any,
    groupSummary: PropTypes.any,
    groupColumn: PropTypes.any,
    lastUnlockedIndex: PropTypes.number,
    lastLockedEndIndex: PropTypes.number,
    lastLockedStartIndex: PropTypes.number,
    computedShowZebraRows: PropTypes.bool,
    computedRowspans: PropTypes.any,
    editStartEvent: PropTypes.string,
    onGroupToggle: PropTypes.func,
    onEditStop: PropTypes.func,
    onEditStart: PropTypes.func,
    onEditCancel: PropTypes.func,
    onEditValueChange: PropTypes.func,
    onEditComplete: PropTypes.func,
    onFilterValueChange: PropTypes.func,
    tryNextRowEdit: PropTypes.func,
    getScrollLeftMax: PropTypes.func,
    activeRowRef: PropTypes.any,
    sticky: PropTypes.bool,
    edition: PropTypes.string,
    computedLicenseValid: PropTypes.bool,
    parentGroupDataArray: PropTypes.any,
    rowDetailsWidth: PropTypes.oneOf([
        'max-viewport-width',
        'min-viewport-width',
        'viewport-width',
    ]),
    computedHasColSpan: PropTypes.bool,
    onRowReorder: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    onDragRowMouseDown: PropTypes.func,
    renderLockedStartCells: PropTypes.func,
    renderLockedEndCells: PropTypes.func,
    setActiveIndex: PropTypes.func,
    renderTreeCollapseTool: PropTypes.func,
    renderTreeExpandTool: PropTypes.func,
    renderTreeLoadingTool: PropTypes.func,
};
