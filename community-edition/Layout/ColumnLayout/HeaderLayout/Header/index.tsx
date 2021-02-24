/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { RefObject } from 'react';
import PropTypes from 'prop-types';

import cleanProps from '../../../../packages/react-clean-props';
import Region from '../../../../packages/region';
import selectParent from '../../../../common/selectParent';
import uglified from '../../../../packages/uglified';

import Cell from '../../Cell';
import HeaderGroup from './HeaderGroup';

import renderCellsMaybeLocked from '../../Content/renderCellsMaybeLocked';

import join from '../../../../packages/join';
import getCellHeader from './getCellHeader';

const notEmpty = x => !!x;
const emptyFn = () => {};

export { getCellHeader };
export const getParentGroups = (
  groupName,
  groups,
  { includeSelf } = { includeSelf: false }
) => {
  const parentGroups = [];

  if (!groups) {
    return parentGroups;
  }
  let nextGroup = groups[groupName] ? groups[groups[groupName].group] : null;

  if (includeSelf && groups[groupName]) {
    parentGroups.push(groups[groupName]);
  }

  while (nextGroup) {
    parentGroups.push(nextGroup);
    nextGroup = groups[nextGroup.group];
  }

  return parentGroups;
};

export default class InovuaDataGridHeader extends React.Component {
  onCellMount = (cellProps, c) => {
    // do not consider cells while dragging
    if (cellProps.dragging) {
      return;
    }

    if (this.props.virtualizeColumns && !cellProps.computedLocked) {
      this.unlockedCells.push(c);
    }

    this.cells.push(c);
  };
  onCellUnmount = (cellProps, cell) => {
    // do not consider cells while dragging
    if (cellProps.dragging) {
      return;
    }

    if (this.props.virtualizeColumns && !cellProps.computedLocked) {
      if (this.unlockedCells) {
        this.unlockedCells = this.unlockedCells.filter(c => c !== cell);
      }
    }
    if (this.cells) {
      this.cells = this.cells.filter(c => c !== cell);
    }
  };
  domRef:
    | string
    | ((instance: HTMLDivElement | null) => void)
    | RefObject<HTMLDivElement>
    | null
    | undefined;

  constructor(props) {
    super(props);

    this.cells = [];
    this.unlockedCells = [];

    this.domRef = React.createRef();
  }

  findCellById = (cellId, cellsArray = this.cells) => {
    return cellsArray.filter(c => c.getProps().id === cellId)[0];
  };

  getCells = () => {
    const result = [];

    this.props.columns.forEach(c => {
      const cell = this.findCellById(c.id);
      if (cell) {
        const props = cell.getProps();
        result[props.computedVisibleIndex] = cell;
      }
    });

    return result;
  };

  getGroupsAndCells = () => {
    const cells = this.getCells();

    const result = [];

    const add = item => {
      if (result.indexOf(item) == -1) {
        result.push(item);
      }
    };

    cells.forEach(cell => {
      let target = cell;

      while (target && target.props.parent) {
        add(target);
        target = target.props.parent;
      }
      if (target) {
        add(target);
      }
    });

    return result;
  };

  componentWillUnmount() {
    this.cells = null;
    this.unlockedCells = null;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.columnRenderCount < this.props.columnRenderCount) {
      const newLength = Math.max(nextProps.columnRenderCount + 1, 0);

      this.getUnlockedCells().forEach(cell => {
        cell.setStateProps(null);
      });
    }
  }

  setCellIndex = (cell, index) => {
    const cellProps = this.getPropsForCells(index)[0];

    cell.setStateProps(cellProps);
  };

  getCellIndex = cell => {
    return cell.getProps().index;
  };

  sortCells = cells => {
    return cells.sort(
      (cell1, cell2) => this.getCellIndex(cell1) - this.getCellIndex(cell2)
    );
  };

  getUnlockedCells = () => {
    const { columns, lockedStartColumns } = this.props;

    const result = [];

    this.props.columns.forEach(c => {
      const cell = this.findCellById(c.id, this.unlockedCells);
      if (cell) {
        const props = cell.getProps();
        const index = props.computedVisibleIndex - lockedStartColumns.length;
        result[index] = cell;
      }
    });

    return result;
  };

  getSortedCells = () => {
    return this.sortCells(this.getUnlockedCells());
  };

  getGaps = (startIndex, endIndex) => {
    const visibleCellPositions = {};

    this.getSortedCells().forEach(cell => {
      visibleCellPositions[this.getCellIndex(cell)] = true;
    });

    const gaps = [];

    for (; startIndex <= endIndex; startIndex++) {
      if (!visibleCellPositions[startIndex]) {
        gaps.push(startIndex);
      }
    }

    return gaps;
  };

  setColumnRenderStartIndex = columnRenderStartIndex => {
    this.columnRenderStartIndex = columnRenderStartIndex;

    const renderRange = this.getColumnRenderRange();

    if (!renderRange) {
      return;
    }

    const { start, end } = renderRange;
    const gaps = this.getGaps(start, end);

    if (!gaps.length) {
      return;
    }

    this.getUnlockedCells().forEach(cell => {
      const cellProps = cell.getProps();
      const { computedVisibleIndex: cellIndex, computedLocked } = cellProps;

      if (computedLocked) {
        return;
      }

      const outOfView = cellIndex < start || cellIndex > end;

      let newIndex;

      if (outOfView && gaps.length) {
        newIndex = gaps[gaps.length - 1];
        this.setCellIndex(cell, newIndex);
        gaps.length -= 1;
      }
    });
  };

  getColumnRenderRange = () => {
    const {
      columnRenderCount,
      lockedStartColumns,
      lockedEndColumns,
      virtualizeColumns,
      columns,
    } = this.props;

    if (!virtualizeColumns) {
      return null;
    }

    const minStartIndex = lockedStartColumns.length;
    const maxEndIndex = columns.length - lockedEndColumns.length - 1;

    let columnRenderStartIndex =
      this.columnRenderStartIndex == null
        ? this.props.columnRenderStartIndex || 0
        : this.columnRenderStartIndex;

    columnRenderStartIndex = Math.max(columnRenderStartIndex, minStartIndex);

    if (columnRenderCount != null) {
      let columnRenderEndIndex = columnRenderStartIndex + columnRenderCount;
      columnRenderEndIndex = Math.min(columnRenderEndIndex, maxEndIndex);

      if (columnRenderEndIndex - columnRenderCount != columnRenderStartIndex) {
        columnRenderStartIndex = Math.max(
          columnRenderEndIndex - columnRenderCount,
          minStartIndex
        );
      }

      return { start: columnRenderStartIndex, end: columnRenderEndIndex };
    }

    return null;
  };

  prepareStyle = props => {
    const { headerHeight, width, minWidth, index, scrollbarWidth } = props;
    const style = { ...props.style };

    if (width || minWidth) {
      if (width) {
        style.width = Math.max(width, minWidth || 0);
      }

      if (minWidth) {
        style.minWidth = minWidth;
      }
    }

    if (headerHeight) {
      style.height = headerHeight;
    }

    style.zIndex = style.zIndex || 100 - (index || 0);
    const scrollLeft =
      // this.props.scrollLeft is passed for placeholder header - on column reorder
      this.props.scrollLeft != null ? this.props.scrollLeft : this.scrollLeft;

    const transformPos = this.props.rtl
      ? this.props.getScrollLeftMax() - scrollLeft
      : -scrollLeft;

    style.transform = `translate3d(${transformPos || 0}px, 0px, 0px)`;

    return style;
  };

  getDOMNode() {
    return this.domRef.current;
  }

  notifyScrollLeftMax = scrollLeftMax => {
    const resizerClassName = 'InovuaReactDataGrid__column-resizer';
    const lastUnlockedResizer = this.getDOMNode().querySelector(
      `.${resizerClassName}--last-unlocked`
    );

    if (lastUnlockedResizer) {
      const { columnResizeHandleWidth } = this.props;
      const remaining =
        scrollLeftMax - (this.scrollLeft + columnResizeHandleWidth / 2);
      const visible = remaining <= 0;

      // there's an edge case when hovering over the last unlocked resize handle
      // when we have locked cols and there is horizontal scrollbar and scrollLeft is small
      // if the user comes with the mouse over the last unlocked resizer,
      // without triggering hover on the locked-end-wrapper to make it have a greater z-index
      // then the resizer would be visible
      // we do this scripting to protect even against this case
      lastUnlockedResizer.style.pointerEvents = visible ? 'auto' : 'none';

      const classList = lastUnlockedResizer.classList;

      if (classList && classList.add && classList.remove) {
        if (visible) {
          classList.add(`${resizerClassName}--active`);
        } else {
          classList.remove(`${resizerClassName}--active`);
        }
      } else {
        lastUnlockedResizer.style.zIndex = visible ? 5000 : 2000;
      }

      // this could also be solved by listening to mouse-enter/leave on the first lockedend column header
      // and checking if scrollLeft = scrollLeftMax at that point to make the last unlocked resizer have a greater zindex
    }
  };

  setScrollLeft = scrollLeft => {
    this.scrollLeft = scrollLeft;
    const node = this.props.hasLocked
      ? this.getDOMNode().querySelector(
          '.InovuaReactDataGrid__unlocked-wrapper'
        )
      : this.getDOMNode();

    if (node) {
      const transformPos = this.props.rtl
        ? this.props.getScrollLeftMax() - scrollLeft
        : -scrollLeft;
      node.style.transform = `translate3d(${transformPos}px, 0px, 0px)`;
    }

    if (this.props.updateLockedWrapperPositions) {
      this.props.updateLockedWrapperPositions.call(
        this,
        this.props,
        scrollLeft,
        {
          isHeader: true,
        }
      );
    }
  };

  render() {
    const { props } = this;
    const { columns, rtl } = props;

    const className = join(
      'InovuaReactDataGrid__header',
      `InovuaReactDataGrid__header--direction-${rtl ? 'rtl' : 'ltr'}`,
      props.className
    );
    const style = this.prepareStyle(props);

    const children = this.renderColumns(columns);
    const cleanedProps = cleanProps(props, InovuaDataGridHeader.propTypes);

    return (
      <div
        {...cleanedProps}
        className={className}
        data={null}
        style={style}
        ref={this.domRef}
        onFocus={this.onFocus}
      >
        {children}
      </div>
    );
  }

  onFocus = event => {
    const body = selectParent('.InovuaReactDataGrid__body', event.target);
    if (!body) {
      return;
    }
    const OFFSET = 15;
    const headerRegion = Region.from(body);
    const targetRegion = Region.from(event.target);

    const scrollLeft = this.scrollLeft || this.props.scrollLeft || 0;

    if (!headerRegion.containsRegion(targetRegion)) {
      if (targetRegion.left < headerRegion.left) {
        const diff = headerRegion.left - targetRegion.left;

        const newScrollLeft = scrollLeft - (diff + OFFSET);
        this.props.setScrollLeft(newScrollLeft);
      }
    }
  };

  getPropsForCells = (startIndex, endIndex = startIndex + 1) => {
    const props = this.props;

    const {
      renderInPortal,
      columnHeaderUserSelect,
      columnResizeHandleWidth,
      columnUserSelect,
      data,
      showColumnContextMenu,
      showColumnFilterContextMenu,
      deselectAll,
      firstLockedEndIndex,
      firstUnlockedIndex,
      filterable,
      computedShowHeaderBorderRight,
      hasLockedEnd,
      hasLockedStart,
      lockedStartColumns,
      lockedEndColumns,
      nativeScroll,
      resizeProxyStyle,
      rtl,
      i18n,
      scrollbarWidth,
      selectAll,
      selectedCount,
      filterTypes,
      computedSortable,
      totalCount,
      renderSortTool,
      unselectedCount,
      virtualizeColumns,
      showColumnMenuTool,
      showColumnMenuToolOnHover,
      lastUnlockedIndex,
      lastLockedStartIndex,
      lastLockedEndIndex,
      theme,
    } = props;

    let columns = props.columns;

    if (startIndex !== undefined) {
      columns = columns.slice(startIndex, endIndex);
    }

    const firstLockedIndex = hasLockedEnd
      ? props.columns.length - lockedEndColumns.length
      : -1;

    return columns.map((column, i) => {
      const {
        computedSortable: sortableColumn,
        computedResizable: resizableColumn,
      } = column;

      const isSortable = sortableColumn;
      const isResizable = resizableColumn;

      let cellStyle = column.style;

      if (props.headerHeight) {
        if (column.style) {
          cellStyle = Object.assign({}, cellStyle);
        }
        if (!cellStyle) {
          cellStyle = {};
        }
        cellStyle.height = props.headerHeight;
      }

      const defaults = {
        filterable,
        renderSortTool,
        showColumnMenuTool,
        showColumnMenuToolOnHover,
      };
      if (columnUserSelect !== undefined) {
        defaults.userSelect = columnUserSelect;
      }
      if (columnHeaderUserSelect !== undefined) {
        defaults.headerUserSelect = columnHeaderUserSelect;
      }

      const cellProps = Object.assign(defaults, column, {
        headerCell: true,
        headerHeight: props.headerHeight,
        i18n,
        selectedCount,
        unselectedCount,
        totalCount,
        showColumnContextMenu,
        showColumnFilterContextMenu,
        selectAll,
        deselectAll,
        style: cellStyle,
        resizeProxyStyle,
        renderInPortal,
        lastUnlockedIndex,
        lastLockedStartIndex,
        lastLockedEndIndex,
        filterTypes,
        onFilterValueChange: this.onFilterValueChange,
        lastUnlocked: column.computedVisibleIndex === firstLockedIndex - 1,
        columnResizeHandleWidth,
        virtualizeColumns,
        rtl,
        onResizeMouseDown: props.onResizeMouseDown,
        onResizeTouchStart: props.onResizeTouchStart,
        onMouseDown: this.onCellMouseDown,
        onTouchStart: this.onCellTouchStart,
        computedSortable: isSortable,
        computedResizable: isResizable,
        hasLockedStart,
        nativeScroll,
        scrollbarWidth,
        data,
        theme,
      });

      cellProps.onFocus = this.onHeaderCellFocus.bind(this, cellProps, column);

      if (cellProps.group) {
        cellProps.parentGroups = getParentGroups(
          cellProps.group,
          this.props.computedGroupsMap,
          { includeSelf: true }
        );
      }

      if (props.onCellClick) {
        cellProps.onClick = props.onCellClick;
      }

      if (
        cellProps.visibilityTransitionDuration ||
        cellProps.hideTransitionDuration ||
        cellProps.showTransitionDuration
      ) {
        cellProps.onTransitionEnd = this.onTransitionEnd.bind(
          this,
          cellProps,
          column
        );
      }

      cellProps.onSortClick = (props.onSortClick || emptyFn).bind(
        null,
        cellProps
      );
      cellProps.value = getCellHeader(cellProps, column, props);

      cellProps.onUnmount = this.onCellUnmount;
      cellProps.onMount = this.onCellMount;

      const { showBorderLeft, showBorderRight } = cellProps;

      cellProps.showBorderRight =
        (cellProps.computedLocked === 'start' &&
          cellProps.computedVisibleIndex == firstUnlockedIndex - 1) ||
        // if we should reserve a space for the scrollbar, and this is the last visible column
        (computedShowHeaderBorderRight &&
          column.computedVisibleIndex === column.computedVisibleCount - 1);

      cellProps.lastInSection =
        cellProps.computedLocked === 'start'
          ? cellProps.computedVisibleIndex === lastLockedStartIndex
          : cellProps.computedLocked === 'end'
          ? cellProps.computedVisibleIndex === lastLockedEndIndex
          : cellProps.computedVisibleIndex === lastUnlockedIndex;

      cellProps.firstInSection =
        cellProps.computedLocked === 'start'
          ? cellProps.computedVisibleIndex == 0
          : cellProps.computedLocked === 'end'
          ? cellProps.computedVisibleIndex === firstLockedEndIndex
          : cellProps.computedVisibleIndex === firstUnlockedIndex;

      cellProps.showBorderLeft =
        cellProps.computedLocked === 'end'
          ? cellProps.computedVisibleIndex >= firstLockedEndIndex
          : cellProps.computedLocked === 'start'
          ? cellProps.computedVisibleIndex > 0
          : cellProps.computedVisibleIndex > firstUnlockedIndex;

      const prevColumn = columns[i - 1];
      const nextColumn = columns[i + 1];

      if (prevColumn && prevColumn.nextBorderLeft !== undefined) {
        cellProps.showBorderLeft = prevColumn.nextBorderLeft;
      }

      if (nextColumn && nextColumn.prevBorderRight !== undefined) {
        cellProps.showBorderRight = nextColumn.prevBorderRight;
      }

      if (showBorderLeft !== undefined) {
        cellProps.showBorderLeft = showBorderLeft;
      }

      if (showBorderRight !== undefined) {
        cellProps.showBorderRight = showBorderRight;
      }

      return cellProps;
    });
  };

  onHeaderCellFocus = (headerCellProps, column, e) => {
    if (this.props.onColumnHeaderFocus) {
      this.props.onColumnHeaderFocus(headerCellProps, column, e);
    }
  };

  onTransitionEnd = (cellProps, column, e) => {
    e.stopPropagation();
    if (column.onTransitionEnd) {
      column.onTransitionEnd(e);
    }

    if (this.props.onTransitionEnd) {
      this.props.onTransitionEnd(e, cellProps);
    }
  };

  onCellMouseDown = (headerCellProps, event) => {
    if (this.props.onCellMouseDown) {
      this.props.onCellMouseDown(headerCellProps, event);
    }
  };
  onCellTouchStart = (headerCellProps, event) => {
    if (this.props.onCellTouchStart) {
      this.props.onCellTouchStart(headerCellProps, event);
    }
  };

  renderColumns = () => {
    const props = this.props;
    const {
      computedGroupsMap: groups,
      hasLockedStart,
      hasLockedEnd,
      lockedStartColumns,
      lockedEndColumns,
      columns,
    } = props;

    const renderRange = this.getColumnRenderRange();
    const cellProps = renderRange
      ? this.getPropsForCells(renderRange.start, renderRange.end + 1)
      : this.getPropsForCells();

    let lockedStartCells;
    let lockedEndCells;

    if (renderRange) {
      if (hasLockedStart) {
        lockedStartCells = this.getPropsForCells(0, lockedStartColumns.length);
      }
      if (hasLockedEnd) {
        lockedEndCells = this.getPropsForCells(
          columns.length - lockedEndColumns.length,
          columns.length
        );
      }
    }
    if (groups) {
      if (hasLockedStart || hasLockedEnd) {
        if (hasLockedStart) {
          lockedStartCells =
            lockedStartCells ||
            this.getPropsForCells(0, lockedStartColumns.length);
          lockedStartCells = this.renderGroupedCells(lockedStartCells);
        }
        if (hasLockedEnd) {
          lockedEndCells =
            lockedEndCells ||
            this.getPropsForCells(
              columns.length - lockedEndColumns.length,
              columns.length
            );
          lockedEndCells = this.renderGroupedCells(lockedEndCells);
        }

        let unlockedCells = renderRange
          ? cellProps
          : this.getPropsForCells(
              lockedStartColumns.length,
              columns.length - lockedEndColumns.length
            );

        unlockedCells = this.renderGroupedCells(unlockedCells);

        return renderCellsMaybeLocked([], this.props, props.scrollLeft, {
          lockedStartContent: lockedStartCells,
          lockedEndContent: lockedEndCells,
          unlockedContent: unlockedCells,
          isHeader: true,
        });
      }

      return this.renderGroupedCells(cellProps, groups);
    }

    let result = [];
    if (hasLockedStart && lockedStartCells) {
      result.push(...lockedStartCells);
    }

    result.push(...cellProps);

    if (hasLockedEnd && lockedEndCells) {
      result.push(...lockedEndCells);
    }

    result = result.map((cProps, index) => {
      return <Cell {...cProps} key={index} />;
    });

    return renderCellsMaybeLocked(result, this.props, props.scrollLeft, {
      isHeader: true,
    });
  };

  getCellDOMNodeAt = index => {
    const { columns, showWarnings, virtualizeColumns } = this.props;
    const column = columns[index];
    if (!column) {
      return null;
    }

    const arr =
      column.computedLocked || !virtualizeColumns
        ? this.getCells()
        : this.getUnlockedCells();

    const cell = arr.filter(
      c => c.getProps().computedVisibleIndex === index
    )[0];

    if (!cell && showWarnings) {
      console.error(`Cannot find dom cell at ${index}.`);
    }

    return cell.getDOMNode
      ? cell.getDOMNode()
      : cell.domRef
      ? cell.domRef.current
      : null;
  };

  renderHeaderGroup = (groupName, groupItems) => {
    const {
      computedGroupsMap: groups,
      columnsMap,
      hasLockedStart,
      hasLockedEnd,
      lockedStartColumns,
      lockedEndColumns,
      firstLockedEndIndex,
      lastLockedStartIndex,
      lastLockedEndIndex,
      firstUnlockedIndex,
      lastUnlockedIndex,
      resizeProxyStyle,
      rtl,
    } = this.props;
    const group = groups[groupName];
    const parentGroups = getParentGroups(groupName, groups);
    const depth = group ? group.computedDepth : 0;

    // we compute ALL the columns that are under this HeaderGroup
    const columns = groupItems
      .filter(x => !!x)
      .reduce((acc, item) => {
        if (item.type == HeaderGroup) {
          // its items can be HeaderGroup s, in which case, they have columns
          acc.push(...item.props.columns);
        } else {
          // or simple column headers, in which case, they have a column id
          acc.push(item.props.id);
        }

        return acc;
      }, []);

    const style = {
      width: columns.reduce((width, colId) => {
        return width + columnsMap[colId].computedWidth;
      }, 0),
    };

    let resizable =
      group && group.resizable !== undefined
        ? group.resizable
        : this.props.resizable;

    const allColumnsUnresizable = columns.reduce((acc, colId) => {
      return acc && columnsMap[colId].computedResizable === false;
    }, true);

    if (allColumnsUnresizable) {
      resizable = false;
    }

    const firstColumn = columnsMap[columns[0]];
    const lastColumn = columnsMap[columns[columns.length - 1]];
    const firstIndex = firstColumn.computedVisibleIndex;
    const lastIndex = lastColumn.computedVisibleIndex;
    const showBorderLeft =
      firstIndex >= lockedStartColumns.length
        ? firstIndex > lockedStartColumns.length ||
          firstColumn.computedLocked === 'end'
        : firstIndex > 0;

    const containsLastColumn =
      lastColumn.computedVisibleIndex === this.props.columns.length - 1;
    const showBorderRight =
      lastColumn.computedVisibleIndex === lockedStartColumns.length - 1;
    const adjustResizer =
      hasLockedEnd &&
      lastColumn.computedVisibleIndex ===
        this.props.columns.length - lockedEndColumns.length - 1;

    const firstInSection =
      firstColumn.computedLocked === 'start'
        ? firstIndex === 0
        : firstColumn.computedLocked === 'end'
        ? firstIndex == firstLockedEndIndex
        : firstIndex === firstUnlockedIndex;

    const lastInSection =
      lastColumn.computedLocked === 'start'
        ? lastIndex === lastLockedStartIndex
        : lastColumn.computedLocked === 'end'
        ? lastIndex == lastLockedEndIndex
        : lastIndex === lastUnlockedIndex;

    if (firstColumn.inTransition) {
      let duration = firstColumn.inShowTransition
        ? firstColumn.showTransitionDuration
        : firstColumn.hideTransitionDuration;

      duration = duration || firstColumn.visibilityTransitionDuration;

      style.transitionDuration =
        typeof duration == 'number' ? `${duration}ms` : duration;
    }

    const key = `${groupName}-${depth}-${columns.join('-')}`;

    return (
      <HeaderGroup
        key={key}
        depth={depth}
        group={group}
        style={style}
        rtl={rtl}
        firstIndex={firstIndex}
        lastUnlockedIndex={this.props.lastUnlockedIndex}
        lastLockedStartIndex={this.props.lastLockedStartIndex}
        lastLockedEndIndex={this.props.lastLockedEndIndex}
        filterable={this.props.filterable}
        inTransition={firstColumn.inTransition}
        inShowTransition={firstColumn.inShowTransition}
        inHideTransition={firstColumn.inHideTransition}
        showTransitionDuration={firstColumn.showTransitionDuration}
        hideTransitionDuration={firstColumn.hideTransitionDuration}
        visibilityTransitionDuration={firstColumn.visibilityTransitionDuration}
        onMouseDown={this.props.onGroupMouseDown}
        columns={columns}
        resizeProxyStyle={resizeProxyStyle}
        locked={
          lastColumn.computedLocked === 'start'
            ? 'start'
            : firstColumn.computedLocked === 'end'
            ? 'end'
            : false
        }
        parentGroups={parentGroups}
        containsLastColumn={containsLastColumn}
        firstInSection={firstInSection}
        lastInSection={lastInSection}
        adjustResizer={adjustResizer}
        showBorderLeft={showBorderLeft}
        showBorderRight={showBorderRight}
        children={groupItems}
        resizable={resizable}
        columnResizeHandleWidth={this.props.columnResizeHandleWidth}
        onResizeMouseDown={this.onResizeMouseDown}
        onResizeTouchStart={this.onResizeTouchStart}
      />
    );
  };

  onResizeMouseDown = (groupProps, headerGroupInstance, event) => {
    if (this.props.onResizeMouseDown) {
      const colId = groupProps.columns[groupProps.columns.length - 1];
      const visibleIndex = this.props.columnsMap[colId].computedVisibleIndex;
      this.props.onResizeMouseDown(
        { visibleIndex, computedVisibleIndex: visibleIndex },
        {
          colHeaderNode: headerGroupInstance.domRef
            ? headerGroupInstance.domRef.current
            : null,
          event,
          groupColumns: groupProps.columns,
        }
      );
    }
  };

  onResizeTouchStart = (groupProps, headerGroupInstance, event) => {
    if (this.props.onResizeTouchStart) {
      const colId = groupProps.columns[groupProps.columns.length - 1];
      const visibleIndex = this.props.columnsMap[colId].computedVisibleIndex;
      this.props.onResizeTouchStart(
        { visibleIndex },
        {
          colHeaderNode: headerGroupInstance.domRef
            ? headerGroupInstance.domRef.current
            : null,
          event,
          groupColumns: groupProps.columns,
        }
      );
    }
  };

  getItemsForDepth = (items, depth) => {
    return items.map(item => {
      return item.props.depth === depth ? item : null;
    });
  };

  renderItems = items => {
    const { computedGroupsDepth } = this.props;

    // + 1 since we also have cell level
    let currentDepth = computedGroupsDepth + 1;

    while (currentDepth > 0) {
      items = this.groupItemsForDepth(items, currentDepth);
      currentDepth--;
    }

    return items;
  };

  groupItemsForDepth = (items, depth) => {
    const depthItems = this.getItemsForDepth(items, depth);

    let index = 0;

    let item = depthItems[index];
    let currentGroupName = this.getItemGroupName(item);
    let itemGroupName;
    let groupItems;
    let headerGroup;
    let groupStartIndex = 0;
    const len = depthItems.length + 1;

    while (index <= len) {
      itemGroupName = this.getItemGroupName(item);
      if (currentGroupName == null && itemGroupName != null) {
        groupStartIndex = index;
        currentGroupName = itemGroupName;
      } else if (itemGroupName != currentGroupName) {
        groupItems = items.slice(groupStartIndex, index);
        headerGroup = this.renderHeaderGroup(currentGroupName, groupItems);
        // replace the groupItems in the !!items!! array - not in items
        items.splice(
          groupStartIndex /* start */,
          groupItems.length /* delete count */,
          headerGroup /* insert */
        );
        // need to do this on depthItems as well in order to keep arrays in sync
        depthItems.splice(groupStartIndex, groupItems.length, headerGroup);
        index = groupStartIndex;
        currentGroupName = null;
      }
      index++;
      item = depthItems[index];
    }

    return items;
  };

  /**
   * Returns the group where this item (header cell/ HeaderGroup) belongs to
   */
  getItemGroupName = item => {
    if (!item) {
      return null;
    }

    const { computedGroupsMap: groups } = this.props;
    let groupName;

    if (item.type == HeaderGroup) {
      groupName = item.props.group ? item.props.group.group : null;
    } else {
      groupName = item.props.group;
    }

    const group = groups[groupName];

    return group ? group.name || '' : '';
  };

  fixDepth = (item, depthDiff) => {
    while (depthDiff >= 0) {
      item = this.renderHeaderGroup(this.getItemGroupName(item), [item], {
        depth: item.props.depth - 1,
        forceHeader: true,
      });
      depthDiff--;
    }

    return item;
  };

  renderGroupedCells = cellProps => {
    const { computedGroupsMap: groups, showWarnings } = this.props;

    const items = cellProps.map((props, index) => {
      const group = groups[props.group];
      if (showWarnings && props.group && !group) {
        this.warn(
          `Column "${props.id}" references group "${props.group}", but the group is never defined in the groups prop.`
        );
      }
      const depth = group ? group.computedDepth + 1 : 0;

      return <Cell {...props} key={props.id} depth={depth} />;
    });

    return this.renderItems(items);
  };

  onFilterValueChange = (filterValue, cellProps) => {
    if (this.props.onFilterValueChange) {
      this.props.onFilterValueChange({
        filterValue,
        columnId: cellProps.id,
        columnIndex: cellProps.computedVisibleIndex,
        cellProps,
      });
    }
  };

  warn = msg => {
    console.error(msg);
  };
}

InovuaDataGridHeader.defaultProps = {
  onResize: () => {},
  showWarnings: !uglified,
};

InovuaDataGridHeader.propTypes = {
  availableWidth: PropTypes.number,
  columnHeaderUserSelect: PropTypes.bool,
  columnRenderCount: PropTypes.number,
  columnResizeHandleWidth: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  columnUserSelect: PropTypes.bool,
  columns: PropTypes.array,
  columnsMap: PropTypes.object,
  lockedStartColumns: PropTypes.array,
  unlockedColumns: PropTypes.array,
  lockedEndColumns: PropTypes.array,
  deselectAll: PropTypes.func,
  firstLockedEndIndex: PropTypes.number,
  firstLockedStartIndex: PropTypes.number,
  isMultiSort: PropTypes.bool,
  onGroupMouseDown: PropTypes.func,
  onResizeMouseDown: PropTypes.func,
  onResizeTouchStart: PropTypes.func,
  resizable: PropTypes.bool,
  resizeProxyStyle: PropTypes.object,
  scrollbarWidth: PropTypes.number,
  selectAll: PropTypes.func,
  selectedCount: PropTypes.number,
  sortInfo: PropTypes.any,
  sortable: PropTypes.bool,
  totalCount: PropTypes.number,
  unselectedCount: PropTypes.number,
  virtualListBorderLeft: PropTypes.number,
  virtualListBorderRight: PropTypes.number,
  nativeScroll: PropTypes.bool,
  computedShowHeaderBorderRight: PropTypes.any,
  hasLockedEnd: PropTypes.bool,
  hasLockedStart: PropTypes.bool,
  showColumnContextMenu: PropTypes.func,
  showColumnFilterContextMenu: PropTypes.func,
  onColumnHeaderFocus: PropTypes.func,
  showColumnMenuTool: PropTypes.bool,
  showColumnMenuToolOnHover: PropTypes.bool,
  firstUnlockedIndex: PropTypes.number,
  lockedRows: PropTypes.any,
  i18n: PropTypes.any,
  filterable: PropTypes.bool,
  filterTypes: PropTypes.any,
  computedGroupsDepth: PropTypes.number,
  computedGroupsMap: PropTypes.objectOf(
    PropTypes.shape({ name: PropTypes.string.isRequired })
  ),
  headerHeight: PropTypes.number,
  maxWidth: PropTypes.number,
  renderSortTool: PropTypes.func,
  minWidth: PropTypes.number,
  onCellMouseDown: PropTypes.func,
  onCellTouchStart: PropTypes.func,
  onCellClick: PropTypes.func,
  computedOnColumnFilterValueChange: PropTypes.func,
  onSortClick: PropTypes.func,
  onResize: PropTypes.func,
  scrollLeft: PropTypes.number,
  showWarnings: PropTypes.bool,
  unselected: PropTypes.any,
  virtualizeColumns: PropTypes.bool,
  width: PropTypes.number,
  updateLockedWrapperPositions: PropTypes.func,
  lastLockedEndIndex: PropTypes.number,
  lastLockedStartIndex: PropTypes.number,
  lastUnlockedIndex: PropTypes.number,
  getScrollLeftMax: PropTypes.func,
  rtl: PropTypes.bool,
  renderLockedEndCells: PropTypes.func,
  renderLockedStartCells: PropTypes.func,
  renderInPortal: PropTypes.any,
  onFilterValueChange: PropTypes.func,
  setScrollLeft: PropTypes.func,
};
