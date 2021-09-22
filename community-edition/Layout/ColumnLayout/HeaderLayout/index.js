/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import Component from '../../../packages/react-class';

import debounce from '../../../packages/debounce';
import contains from '../../../packages/contains';

import assignDefined from '../../../packages/assign-defined';
import Region from '../../../packages/region';

import isMobile from '../../../packages/isMobile';

import getRangesForBoxes from './getRangesForBoxes';
import getRangesForColumns from './getRangesForColumns';

import setupColumnDrag from './setupColumnDrag';
import moveXBeforeY from '../../../utils/moveXBeforeY';
import isFocusable from '../../../utils/isFocusable';
import getDropIndex from './getDropIndex';
import getUndraggableSuccessiveCount from './getUndraggableSuccessiveCount';

import DragCell, { MAX_WIDTH as DRAG_CELL_MAX_WIDTH } from './DragCell';
import DragHeaderGroup from './DragHeaderGroup';
import HeaderWrapper from './HeaderWrapper';

import { getParentGroups } from './Header';

import getScrollbarWidth from '../../../packages/getScrollbarWidth';

const SCROLL_MARGIN = 40;

let DRAG_INFO = null;

const preventDefault = e => e.preventDefault();

const getColumnOrder = (props, filter) => {
  const doFilter = c => (!c.groupColumn && filter ? filter(c) : true);
  let order;
  if (props.computedColumnOrder) {
    order = props.computedColumnOrder.map(id => props.columnsMap[id]);
  } else {
    order = props.allColumns;
  }
  const toId = c => c.id;
  order = (order || []).filter(doFilter).map(toId);

  const lockedStart = props.lockedStartColumns.filter(doFilter).map(toId);
  const lockedMap = lockedStart.reduce((acc, cId) => {
    acc[cId] = true;
    return acc;
  }, {});

  const lockedEnd = props.lockedEndColumns.filter(doFilter).map(toId);

  lockedEnd.reduce((acc, cId) => {
    acc[cId] = true;
    return acc;
  }, lockedMap);

  return [
    ...lockedStart,
    ...order.filter(cId => !lockedMap[cId]),
    ...lockedEnd,
  ];
};

// ----------------------------
//     Contact                |
// ----------------------------
//    Address       |         |
// _________________|   Office|
//   Street | City  |         |
// ---------------------------|

const getParentsForColumns = (columns, groups, maxDepth) => {
  const parentsForColumns = columns.map(col => {
    const result = [
      col.id,
      ...getParentGroups(col.group, groups, { includeSelf: true }).map(
        g => g.name
      ),
    ];

    while (result.length <= maxDepth + 1) {
      result.splice(0, 0, result[0]);
    }

    return result;
  });

  return parentsForColumns;
};
const getValidDropPositions = ({
  dragTargetDepth,
  dragTargetIndex,
  dragTargetLength,
  parentsForColumns,
  columns,
  allowGroupSplitOnReorder,
}) => {
  const getGroupsForColumn = parents => {
    parents = parents || [];
    const initialName = parents[0];
    let shouldCheck = true;

    const groups = [];
    parents.forEach(group => {
      if (!shouldCheck) {
        groups.push(group);
        return;
      }
      if (shouldCheck && group !== initialName) {
        shouldCheck = false;
        groups.push(group);
        return;
      }
      groups.push(null);
    });

    return groups;
  };

  const getGroupStartFor = (parents, depth, index) => {
    const initialParent = parents[index].slice(-depth - 1)[0];
    let itParents;
    let currentParent;
    do {
      itParents = parents[index - 1];
      if (!itParents) {
        break;
      }
      currentParent = itParents.slice(-depth - 1)[0];
      if (currentParent !== initialParent) {
        break;
      }
      index--;
    } while (index >= 0);
    return index;
  };
  const getGroupEndFor = (parents, depth, index) => {
    const initialParent = parents[index].slice(-depth - 1)[0];
    let itParents;
    let currentParent;

    do {
      index++;
      itParents = parents[index];
      if (!itParents) {
        break;
      }
      currentParent = itParents.slice(-depth - 1)[0];
      if (currentParent !== initialParent) {
        break;
      }
    } while (index < parents.length);
    return index;
  };
  const res = columns.reduce((acc, col, index) => {
    if (
      index > dragTargetIndex &&
      index <= dragTargetIndex + dragTargetLength
    ) {
      return acc;
    }
    acc[index] = true;
    return acc;
  }, {});

  res[columns.length] = true;

  if (!allowGroupSplitOnReorder) {
    const dragTargetParentGroups = getGroupsForColumn(
      parentsForColumns[dragTargetIndex]
    ).filter(x => x);
    const isSingleColumn = !dragTargetParentGroups.length;

    const usedDepth = isSingleColumn ? 0 : dragTargetDepth;
    const parentGroupStartIndex = !usedDepth
      ? 0
      : getGroupStartFor(parentsForColumns, usedDepth - 1, dragTargetIndex);
    const parentGroupEndIndex = !usedDepth
      ? columns.length
      : getGroupEndFor(parentsForColumns, usedDepth - 1, dragTargetIndex);

    const currentGroupEndIndex = getGroupEndFor(
      parentsForColumns,
      usedDepth,
      dragTargetIndex
    );

    for (let i = 0; i <= columns.length; i++) {
      delete res[i];
    }

    for (let i = parentGroupStartIndex; i < parentGroupEndIndex; i++) {
      const itGroupStartIndex = getGroupStartFor(
        parentsForColumns,
        usedDepth,
        i
      );
      const itGroupEndIndex = getGroupEndFor(parentsForColumns, usedDepth, i);

      // the beginning and end of each group are positions where we can drop
      res[itGroupStartIndex] = true;
      res[itGroupEndIndex] = true;
    }

    const groupEndIsLastUnlocked =
      columns[currentGroupEndIndex] &&
      columns[currentGroupEndIndex].computedLocked === 'end' &&
      columns[currentGroupEndIndex - 1] &&
      columns[currentGroupEndIndex - 1].computedLocked !== 'end';

    if (!groupEndIsLastUnlocked) {
      // delete the group end position
      delete res[currentGroupEndIndex];
    }
  }

  return res;
};
class ReorderArrow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      bottom: 0,
      top: 0,
      left: 0,
    };
  }

  set({ bottom, top, left, right, target }) {
    this.setState({
      target,
      bottom,
      left,
      top,
      right,
    });
  }
  setVisible(visible) {
    if (visible != this.state.visible) {
      this.setState({
        visible,
      });
    }
  }
  render() {
    const { size } = this.props;
    const { bottom, top, left, right, visible, target } = this.state;

    return (
      <div
        ref={this.refReorderArrow}
        style={{
          position: 'absolute',
          top,
          left,
          right,
          width: size,
          height: bottom - top,
          bottom,

          pointerEvents: 'none',
          opacity: visible ? 1 : 0,
          display: 'block',
        }}
        className={`InovuaReactDataGrid__column-reorder-arrow InovuaReactDataGrid__column-reorder-arrow--direction-${
          this.props.rtl ? 'rtl' : 'ltr'
        }`}
      >
        <div
          className={`InovuaReactDataGrid__column-reorder-arrow-fill InovuaReactDataGrid__column-reorder-arrow-fill--direction-${
            this.props.rtl ? 'rtl' : 'ltr'
          } InovuaReactDataGrid__column-reorder-arrow-fill--target-${target ||
            'none'}`}
        />
        {this.props.renderReorderIndicator()}
      </div>
    );
  }
}

ReorderArrow.defaultProps = {
  renderReorderIndicator: () => {},
};

export default class InovuaDataGridHeaderLayout extends Component {
  constructor(props) {
    super(props);

    this.state = { draggingProps: null };

    this.refDragGroupItem = item => {
      this.dragGroupItem = item;
    };

    this.refDragCell = cell => {
      this.dragCell = cell;
    };

    this.refDragHeaderGroup = item => {
      this.dragHeaderGroup = item;
    };

    this.groupToolbar = createRef();

    this.refHeader = h => {
      this.headerNode = null;
      if (h) {
        this.headerNode = h.getDOMNode ? h.getDOMNode() : null;

        if (!this.headerNode) {
          throw 'Cannot find header node';
        }

        if (isMobile) {
          this.headerNode.addEventListener('touchmove', preventDefault);
        }
      } else {
        if (this.headerNode && isMobile) {
          this.headerNode.removeEventListener('touchmove', preventDefault);
        }
        this.headerNode = null;
      }
      this.header = h;
    };

    this.headerWrapper = createRef();

    this.refReorderArrow = cmp => {
      this.reorderArrow = cmp;
    };

    this.headerDomNode = createRef();

    this.lazyNotifyHeaderScrollLeftMax = debounce(
      this.notifyHeaderScrollLeftMax,
      150
    );
  }

  notifyHeaderScrollLeftMax(scrollLeftMax) {
    if (this.header && this.props.lockedEndColumns) {
      this.header.notifyScrollLeftMax(
        scrollLeftMax === undefined ? this.getScrollLeftMax() : scrollLeftMax
      );
    }
  }

  onContainerScrollHorizontal(scrollLeft) {
    this.scrollLeft = scrollLeft;
    if (this.header) {
      this.header.setScrollLeft(scrollLeft);
      this.lazyNotifyHeaderScrollLeftMax();
    }
  }

  setScrollLeft(scrollLeft) {
    this.props.setScrollLeft(scrollLeft);
  }

  getScrollLeft() {
    return this.scrollLeft || 0;
  }

  getScrollLeftMax() {
    return this.props.getScrollLeftMax();
  }

  setColumnRenderStartIndex(columnRenderStartIndex) {
    if (this.header) {
      this.header.setColumnRenderStartIndex(columnRenderStartIndex);
    }
  }

  render() {
    return (
      <div
        ref={this.headerDomNode}
        className={'InovuaReactDataGrid__header-layout'}
      >
        {this.renderGroupToolbar()}
        {this.renderHeaderWrapper()}
        {this.renderDragCell()}
        {this.renderDragGroupItem()}
        {this.renderDragHeaderGroup()}
        {this.renderReorderIndicator()}
      </div>
    );
  }

  renderGroupToolbar() {
    const {
      columnsMap,
      onGroupByChange,
      onHeaderSortClick,
      renderGroupItem,
      renderSortTool,
      renderGroupToolbar,
      computedGroupBy: groupBy,
      disableGroupByToolbar,
      i18n,
      rtl,
      theme,
    } = this.props;

    if (!groupBy || !renderGroupToolbar) {
      return null;
    }

    return renderGroupToolbar({
      columnsMap,
      groupBy,
      rtl,
      theme,
      renderSortTool,
      onGroupByChange,
      disableGroupByToolbar,
      renderGroupItem,
      headerGroupPlaceholderText: i18n('dragHeaderToGroup'),
      onItemMouseDown: this.onGroupItemMouseDown,
      onSortClick: onHeaderSortClick,
      ref: this.groupToolbar,
    });
  }

  renderHeaderWrapper() {
    const { props } = this;
    const { computedShowHeader } = props;

    if (!computedShowHeader) {
      return null;
    }

    const scrollLeft =
      (this.scrollLeft !== undefined ? this.scrollLeft : props.scrollLeft) || 0;

    const groupBy =
      this.props.computedGroupBy && this.props.computedGroupBy.length
        ? this.props.computedGroupBy
        : null;

    return (
      <HeaderWrapper
        {...props}
        groupBy={groupBy}
        onHeaderGroupMouseDown={this.onHeaderGroupMouseDown}
        onHeaderCellMouseDown={this.onHeaderCellMouseDown}
        onHeaderCellTouchStart={this.onHeaderCellTouchStart}
        ref={this.headerWrapper}
        refHeader={this.refHeader}
        scrollLeft={scrollLeft}
        setScrollLeft={this.setScrollLeft}
      />
    );
  }

  renderDragCell() {
    return <DragCell ref={this.refDragCell} />;
  }

  renderDragGroupItem() {
    if (!this.props.renderDragGroupItem) {
      return null;
    }
    return this.props.renderDragGroupItem(this.refDragGroupItem);
  }

  renderDragHeaderGroup() {
    if (!this.props.computedGroups) {
      return;
    }

    return <DragHeaderGroup ref={this.refDragHeaderGroup} />;
  }

  onGroupItemMouseDown(column, index, event) {
    this.onHeaderCellMouseDown(column, event, {
      dragTarget: 'group',
      dragIndex: index,
    });
  }

  getCellDOMNodeAt(index) {
    return this.header.getCellDOMNodeAt(index);
  }

  getHeader() {
    return this.header;
  }

  onHeaderGroupMouseDown(event, headerGroupProps, headerGroup) {
    if (event.ctrlKey || event.metaKey) {
      return;
    }

    if (this._dragIndex !== undefined) {
      // already dragging a cell
      return;
    }

    if (headerGroupProps.group && headerGroupProps.group.draggable === false) {
      return;
    }

    const dragTargetNode = headerGroup.domRef
      ? headerGroup.domRef.current
      : null;
    const shouldStop = [
      ...dragTargetNode.querySelectorAll(
        '.InovuaReactDataGrid__column-header__filter-wrapper'
      ),
    ].reduce((shouldStop, filterWrapperNode) => {
      if (
        contains(filterWrapperNode, event.target) ||
        filterWrapperNode === event.target
      ) {
        return true;
      }
      return shouldStop;
    }, false);

    if (shouldStop) {
      return;
    }

    const groupColumns = headerGroupProps.columns.reduce((acc, colId) => {
      acc[colId] = true;
      return acc;
    }, {});

    this.groupColumns = groupColumns;

    const dragBoxes = this.header.getGroupsAndCells().filter(item => {
      if (item === headerGroup) {
        return true;
      }

      if (item.props.id in groupColumns) {
        return false;
      }

      return !item.props.isHeaderGroup;
    });

    const dragIndex = dragBoxes.indexOf(headerGroup);
    const dragTargetIndex = this.props.columnsMap[headerGroup.props.columns[0]]
      .computedVisibleIndex;
    const dragTargetDepth = headerGroup.props.depth;
    const dragTargetLength = headerGroup.props.columns.length;

    const parentsForColumns = getParentsForColumns(
      this.props.visibleColumns,
      this.props.computedGroupsMap,
      this.props.computedGroupsDepth
    );
    this.maybeDragMouseDown(event, {
      dragTarget: 'headergroup',
      dragTargetIndex,
      dragTargetDepth,
      dragTargetLength,
      parentsForColumns,
      dragTargetNode,
      dragIndex,
      dragBoxes,
      allowTargetChange: false,
      ranges: getRangesForBoxes(dragBoxes, i => i),
    });
  }

  onHeaderCellTouchStart(...args) {
    return this.onHeaderCellMouseDown(...args);
  }
  onHeaderCellMouseDown(
    { computedVisibleIndex: visibleIndex },
    event,
    { dragTarget = 'header', dragIndex } = { dragTarget: 'header' }
  ) {
    if (this.props.reorderColumns === false) {
      return;
    }
    if (isFocusable(event.target)) {
      return;
    }
    // commented out because if the user renders an input or a <select> on the grid header for example,
    // it is not reachable via mouse interactions

    if (
      event.nativeEvent.which == 3 /* right click */ ||
      event.metaKey ||
      event.ctrlKey
    ) {
      return;
    }

    if (dragIndex === undefined) {
      dragIndex = visibleIndex;
    }

    if (event.ctrlKey || event.metaKey) {
      return;
    }

    let allowTargetChange = undefined;

    let dragColumn;
    const dragTargetNode = this.getCellDOMNodeAt(visibleIndex);

    if (dragTarget == 'header') {
      dragColumn = this.props.visibleColumns[visibleIndex];
      if (
        !dragColumn ||
        dragColumn.groupColumn ||
        dragColumn.draggable === false
      ) {
        event.stopPropagation();
        return;
      }

      if (this.props.computedGroupBy) {
        if (
          this.props.computedGroupBy.indexOf(dragColumn.id) != -1 ||
          this.props.computedGroupBy.indexOf(dragColumn.name) != -1
        ) {
          // the column is already used for grouping, so dont allow target change
          allowTargetChange = false;
        }
      }

      if (dragColumn.draggable === false) {
        return;
      }

      if (dragColumn.groupBy === false) {
        allowTargetChange = false;
      }
    }

    const dragTargetIndex = dragIndex;
    const dragTargetDepth =
      dragColumn &&
      dragColumn.group &&
      this.props.computedGroupsMap &&
      this.props.computedGroupsMap[dragColumn.group]
        ? this.props.computedGroupsMap[dragColumn.group].computedDepth + 1
        : this.props.computedGroupsDepth + 1;

    const parentsForColumns = getParentsForColumns(
      this.props.visibleColumns,
      this.props.computedGroupsMap,
      this.props.computedGroupsDepth
    );

    this.maybeDragMouseDown(event, {
      dragTarget,
      dragIndex,
      dragTargetNode,
      parentsForColumns,
      dragTargetIndex,
      dragTargetDepth,
      dragTargetLength: 1,
      allowTargetChange,
    });
  }

  maybeDragMouseDown(
    event,
    {
      dragTarget,
      dragIndex,
      allowTargetChange,
      ranges,
      parentsForColumns,
      dragTargetIndex,
      dragTargetDepth,
      dragTargetNode,
      dragTargetLength,
    }
  ) {
    if (this.props.computedPivot) {
      return;
    }
    this._dragIndex = dragIndex;
    let removeListeners;

    let mouseMoveEventCount = 0;
    let didSetupDrag = false;

    const cleanup = () => {
      delete this._dragIndex;
      if (removeListeners) {
        removeListeners();
      }
    };

    const onMouseUp = cleanup;

    const onMouseMove = event => {
      if (didSetupDrag) {
        return;
      }
      mouseMoveEventCount++;

      if (mouseMoveEventCount > 1) {
        didSetupDrag = true;
        removeListeners();
        this.setupDrag(
          {
            dragTarget,
            dragIndex,
            allowTargetChange,
            ranges,
            parentsForColumns,
            dragTargetIndex,
            dragTargetDepth,
            dragTargetLength,
            dragTargetNode,
          },
          event
        );
      }
    };

    const mouseup = isMobile ? 'touchend' : 'mouseup';
    const mousemove = isMobile ? 'touchmove' : 'mousemove';

    removeListeners = () => {
      removeListeners = null;
      global.removeEventListener(mouseup, onMouseUp, false);
      global.removeEventListener(mousemove, onMouseMove, false);
    };

    if (isMobile) {
      // do this timeout, since on mobile, touchend does not occur (could it be because of preventDefault on touchmove?)
      setTimeout(() => {
        onMouseUp();
      }, 350);
    }

    global.addEventListener(mouseup, onMouseUp, false);
    global.addEventListener(mousemove, onMouseMove, false);
  }

  renderReorderIndicator() {
    const size = this.props.reorderProxySize;
    return (
      <ReorderArrow
        ref={this.refReorderArrow}
        size={size}
        rtl={this.props.rtl}
        renderReorderIndicator={this.props.renderReorderIndicator}
      />
    );
  }

  setReorderArrowAt(index, ranges, target, offset = 0, visible) {
    visible =
      visible !== undefined
        ? visible
        : index != DRAG_INFO.dragIndex || target != DRAG_INFO.dragTarget;
    if (offset) {
      visible = true;
    }

    const { rtl } = this.props;

    this.reorderArrow.setVisible(visible);

    const last = index == ranges.length;

    let box = ranges[index];

    const { headerRegion, initialScrollLeft } = DRAG_INFO;

    if (!box && last) {
      const lastBox = ranges[ranges.length - 1] || {
        left: headerRegion.left,
        right: headerRegion.left, // intentionally left?
      };
      box = {
        [rtl ? 'right' : 'left']: rtl ? lastBox.left : lastBox.right,
        computedLocked: lastBox.computedLocked,
      };
    }
    box = box || (rtl ? { right: 0 } : { left: 0 });

    // adjust pos if the arrow is at the beginning or at the end
    let boxPos = rtl ? box.right : box.left;

    if (rtl && this.props.nativeScroll && this.props.scrollbars.vertical) {
      boxPos -= getScrollbarWidth();
    }

    return this.setReorderArrowPosition(
      rtl
        ? -boxPos + headerRegion.right - offset
        : boxPos - headerRegion.left + offset,
      target
    );
  }

  setReorderArrowPosition(pos, target) {
    const { rtl } = this.props;
    this.reorderArrowPosition = this.reorderArrowPosition || {};
    assignDefined(this.reorderArrowPosition, {
      [rtl ? 'right' : 'left']: pos,
    });

    this.reorderArrow.set({
      target,
      [rtl ? 'right' : 'left']: rtl
        ? this.reorderArrowPosition.right
        : this.reorderArrowPosition.left,
      ...DRAG_INFO.reorderProxyPosition[target],
    });

    return this;
  }

  setReorderArrowVisible(visible) {
    this.reorderArrow.setVisible(visible);

    return this;
  }

  getGroupToolbar() {
    return this.groupToolbar.current;
  }

  getGroupByItems() {
    if (!this.groupToolbar.current) {
      return null;
    }

    return this.groupToolbar.current.getSortedItemsInfo();
  }

  getHeaderCells() {
    return this.header.getCells();
  }

  getBoxesFor(target) {
    if (target == 'header') {
      return this.header.getCells();
    }

    if (target == 'group' && this.groupToolbar.current) {
      return this.groupToolbar.current.getCells();
    }

    if (target == 'headergroup') {
      return this.header.getGroupsAndCells();
    }

    return [];
  }

  getDragBoxInstance(dragIndex, dragTarget, dragTargetDepth, dragTargetLength) {
    if (dragTarget === 'group') {
      return this.getGroupToolbar().getCells()[dragIndex];
    }
    const dragCell = this.getHeaderCells()[dragIndex];

    let dragBox = dragCell;

    if (dragTargetLength) {
      let cellProps = dragCell.getProps();
      while (cellProps.depth > dragTargetDepth) {
        if (cellProps.parent) {
          dragBox = cellProps.parent;
          cellProps = dragBox.props;
        } else {
          break;
        }
      }
    }

    return dragBox;
  }

  setupDrag(
    {
      dragTarget,
      dragIndex,
      allowTargetChange = true,

      parentsForColumns,
      dragTargetIndex,
      dragTargetDepth,
      dragTargetLength,
    },
    event
  ) {
    const columns = this.props.visibleColumns;
    const { rtl } = this.props;

    const headerRegion = Region.from(this.headerDomNode.current);
    const dragBox = this.getDragBoxInstance(
      dragIndex,
      dragTarget,
      dragTargetDepth,
      dragTargetLength
    );

    const initialScrollLeft = this.getScrollLeft();
    const dragBoxProps = dragBox.getProps ? dragBox.getProps() : dragBox.props;

    const rtlOffset = Math.max(
      this.props.totalComputedWidth - this.props.size.width,
      0
    );
    const columnRanges = getRangesForColumns(columns, {
      rtl,
      rtlOffset,
      initialOffset: rtl ? headerRegion.right : headerRegion.left,
      headerRegion,
      initialScrollLeft,
      availableWidth: Math.min(
        this.props.availableWidth,
        this.props.totalComputedWidth
      ),
      totalLockedEndWidth: this.props.totalLockedEndWidth,
    });

    const groupByRanges =
      this.props.computedGroupBy && this.props.computedGroupBy.length
        ? getRangesForBoxes(this.getGroupToolbar().getCells())
        : [];

    const dragProxy =
      dragTarget == 'header'
        ? this.dragCell
        : dragTarget == 'group'
        ? this.dragGroupItem
        : this.dragHeaderGroup;

    const dragColumn =
      dragTarget === 'group' ? dragBoxProps.column : columns[dragIndex];

    const headerDragColumn = dragTarget == 'header' ? dragColumn : null;

    const columnId =
      dragTarget == 'header'
        ? headerDragColumn.id
        : dragTarget == 'group'
        ? dragColumn.id
        : null;

    const dragBoxNode = dragBox.domRef ? dragBox.domRef.current : null;

    const dragBoxInitialRegion =
      dragBox && dragBox.getProxyRegion
        ? dragBox.getProxyRegion()
        : Region.from(dragBoxNode);
    if (
      DRAG_CELL_MAX_WIDTH &&
      dragBoxInitialRegion.getWidth() > DRAG_CELL_MAX_WIDTH
    ) {
      dragBoxInitialRegion.setWidth(DRAG_CELL_MAX_WIDTH);
    }
    if (Region.from(dragBoxNode).getWidth() > headerRegion.getWidth() / 2) {
      // if the column or col group is bigger than half the width of the header
      // place the proxy left edge approx where the mouse is, so it can be dragged more easily
      if (rtl) {
        dragBoxInitialRegion.shift({
          right:
            event.pageX -
            dragBoxInitialRegion.right -
            this.props.columnReorderScrollByAmount,
        });
      } else {
        dragBoxInitialRegion.shift({
          left:
            event.pageX -
            dragBoxInitialRegion.left -
            this.props.columnReorderScrollByAmount,
        });
      }
    }
    const dragBoxOffsets = {
      top: headerRegion.top,
      [rtl ? 'right' : 'left']: rtl ? headerRegion.right : headerRegion.left,
    };

    let extendedDragBoxProps = { ...dragBoxProps };

    if (this.props.renderColumnReorderProxy) {
      Object.assign(extendedDragBoxProps, {
        renderColumnReorderProxy: this.props.renderColumnReorderProxy,
      });
    }

    dragProxy.setProps(extendedDragBoxProps);

    const dragProxyPosition = {
      top: dragBoxInitialRegion.top - dragBoxOffsets.top,
      [rtl ? 'right' : 'left']: rtl
        ? dragBoxOffsets.right - dragBoxInitialRegion.right
        : dragBoxInitialRegion.left - dragBoxOffsets.left,
    };

    dragProxy.setHeight(dragBoxInitialRegion.height);
    dragProxy.setWidth(dragBoxInitialRegion.width);
    dragProxy.setTop(dragProxyPosition.top);
    if (rtl) {
      dragProxy.setRight(dragProxyPosition.right);
    } else {
      dragProxy.setLeft(dragProxyPosition.left);
    }

    this.setReorderArrowVisible(
      headerDragColumn ? headerDragColumn.draggable !== false : true
    );

    const maxHeaderIndex =
      columns.length - getUndraggableSuccessiveCount([...columns].reverse());

    const minHeaderIndex = getUndraggableSuccessiveCount(columns);

    // make all drop positions valid
    let validDropPositions = columns.reduce((acc, col, i) => {
      acc[i] = true;
      return acc;
    }, {});
    validDropPositions[columns.length] = true;

    if (
      this.props.groups &&
      this.props.groups.length &&
      !this.props.allowGroupSplitOnReorder
    ) {
      validDropPositions = getValidDropPositions({
        dragTargetDepth,
        dragTargetIndex,
        dragTargetLength,
        parentsForColumns,
        columns,
        allowGroupSplitOnReorder: this.props.allowGroupSplitOnReorder,
        maxDepth: this.props.computedGroupsDepth + 1,
      });
    }

    if (
      validDropPositions &&
      !validDropPositions[dragIndex] &&
      dragTarget != 'group'
    ) {
      validDropPositions[dragIndex] = true;
    }

    const wrapperNode = this.headerDomNode ? this.headerDomNode.current : null;

    let filterRowHeight = 0;
    if (this.props.computedFilterable) {
      const filterWrapperNode = wrapperNode.querySelector(
        '.InovuaReactDataGrid__column-header__filter-wrapper'
      );

      if (filterWrapperNode) {
        filterRowHeight = filterWrapperNode.offsetHeight;
      }
    }
    DRAG_INFO = {
      allowTargetChange,
      columnId,
      headerRegion,
      headerDragColumn,
      minHeaderIndex,
      maxHeaderIndex,
      dragColumn,
      dragColumnsIds:
        dragTarget == 'headergroup' ? dragBox.props.columns : null,
      dragBox,
      dragBoxInitialRegion,
      dragBoxRegion: dragBoxInitialRegion.clone(),
      dragBoxProps,
      dragBoxOffsets,
      dragProxy,
      dragProxyInitialPosition: dragProxyPosition,
      dragTarget,
      dropTarget: dragTarget,
      dragIndex,
      columnRanges,
      groupByRanges,
      parentsForColumns,
      dragTargetIndex,
      dragTargetDepth,
      dragTargetLength,
      scrollLeftMax: this.props.getScrollLeftMax(),
      initialScrollLeft,
      headerRegion,
      validDropPositions,
    };

    const groupToolbarNode = this.groupToolbar.current
      ? this.groupToolbar.current.domRef
        ? this.groupToolbar.current.domRef.current
        : null
      : null;

    const headerGroupTargetNode = wrapperNode;
    const groupTargetNode = groupToolbarNode || this.headerDomNode.current;

    const groupComputedStyle = getComputedStyle(groupTargetNode);

    DRAG_INFO.reorderProxyPosition = {
      group: {
        top: parseInt(groupComputedStyle.paddingTop),
        bottom:
          groupTargetNode.offsetHeight -
          parseInt(groupComputedStyle.paddingBottom),
      },
      header: {
        top: this.props.computedGroupBy ? groupTargetNode.offsetHeight : 0,
        bottom: headerGroupTargetNode.offsetHeight - filterRowHeight,
      },
      headergroup: {
        top: this.props.computedGroupBy ? groupTargetNode.offsetHeight : 0,
        bottom: headerGroupTargetNode.offsetHeight - filterRowHeight,
      },
    };

    this.setReorderArrowAt(
      dragIndex,
      dragTarget === 'group' ? groupByRanges : columnRanges,
      dragTarget
    );
    this.setReorderArrowPosition(undefined, dragTarget);

    dragProxy.setDragging(true);

    this.props.coverHandleRef.current.setActive(true);
    this.props.coverHandleRef.current.setCursor('grabbing');

    const headerNode = this.headerDomNode ? this.headerDomNode.current : null;

    setupColumnDrag(
      {
        constrainTo: this.props.constrainReorder
          ? Region.from(headerNode.parentNode)
          : undefined,
        region: dragBoxInitialRegion,
      },
      { onDrag: this.onHeaderCellDrag, onDrop: this.onHeaderCellDrop },
      event
    );
  }

  onHeaderCellDrop() {
    this.props.coverHandleRef.current.setActive(false);
    delete this._dragIndex;
    let { dropIndex, props } = this;

    if (dropIndex === undefined || !DRAG_INFO) {
      if (DRAG_INFO) {
        DRAG_INFO.dragProxy.setDragging(false);
      }

      this.setReorderArrowVisible(false);
      DRAG_INFO = null;
      return;
    }

    const {
      dragColumn,
      columnId,
      dragColumnsIds,
      dragTarget,
      dropTarget,
      dragProxy,
      newLocked,
    } = DRAG_INFO;

    let { dragIndex } = DRAG_INFO;

    DRAG_INFO = null;
    this.setReorderArrowVisible(false);
    dragProxy.setDragging(false);

    const columns = this.props.visibleColumns;
    const currentLocked = columns[dragIndex].computedLocked;
    if (
      dropIndex == dragIndex &&
      newLocked === currentLocked &&
      dragTarget == dropTarget
    ) {
      return;
    }

    if (dragTarget == 'headergroup') {
      if (dropIndex == dragIndex && dragTarget == dropTarget) {
        return;
      }
      if (columns[dropIndex]) {
        this.moveColumnsBeforeIndex(
          dragColumnsIds,
          columns[dropIndex].computedVisibleIndex,
          newLocked
        );
      } else if (dropIndex == columns.length) {
        const col = columns[columns.length - 1];
        if (col) {
          this.moveColumnsBeforeIndex(
            dragColumnsIds,
            col.computedVisibleIndex + 1,
            newLocked
          );
        }
      }
      return;
    }

    const { visibleColumns, computedGroupBy: groupBy } = props;

    if (dropTarget == dragTarget) {
      if (dragTarget == 'group') {
        // moving a group to another index
        this.setGroupBy(moveXBeforeY(groupBy, dragIndex, dropIndex));
      }
      if (dragTarget == 'header') {
        this.moveColumnsBeforeIndex([columnId], dropIndex, newLocked);
      }
    }

    if (dragTarget == 'header' && dropTarget == 'group') {
      // dragging a column to group by - GROUP BY column
      const groupByColumn = visibleColumns[dragIndex];
      const newGroupBy = [].concat(groupBy);

      newGroupBy.splice(dropIndex, 0, groupByColumn.id);
      this.setGroupBy(newGroupBy);
    }

    if (dragTarget == 'group' && dropTarget == 'header') {
      this.ungroupColumnToIndex(columnId, dropIndex);
    }
  }

  ungroupColumnToIndex(columnId, dropIndex) {
    const { props } = this;
    const { allColumns, visibleColumns } = props;

    const dragColumn = allColumns.filter(c => c.id === columnId)[0];

    const newGroupBy = []
      .concat(this.props.computedGroupBy)
      .filter(g => g != columnId);

    const columnAtDropIndex = visibleColumns[dropIndex];
    if (columnAtDropIndex && columnAtDropIndex.id === columnId) {
      this.setGroupBy(newGroupBy);
      return;
    }

    const order = getColumnOrder(props, c => c.id !== columnId);

    const insertIndex = columnAtDropIndex
      ? order.indexOf(columnAtDropIndex.id)
      : order.length;
    order.splice(insertIndex, 0, columnId);

    const columnAtDropIndexOrLast =
      columnAtDropIndex || visibleColumns[visibleColumns.length - 1];
    if (columnAtDropIndexOrLast.computedLocked != dragColumn.computedLocked) {
      this.props.setColumnLocked(
        columnId,
        columnAtDropIndexOrLast.computedLocked
      );
    }

    this.setGroupBy(newGroupBy);
    this.setColumnOrder(order);
  }

  moveColumnsBeforeIndex(columnsIds, dropIndex, newLocked) {
    const { props } = this;
    const {
      visibleColumns,
      columnVisibilityMap,
      allowGroupSplitOnReorder,
    } = props;
    const columnOrder = getColumnOrder(props);

    const columns = visibleColumns.filter(
      col => columnsIds.indexOf(col.id) != -1
    );

    // moving a column to another index
    const dragColumnsIndexesInAllColumns = columnsIds.map(columnId =>
      columnOrder.indexOf(columnId)
    );

    let dropBeforeIndexInAllColumns = visibleColumns[dropIndex]
      ? columnOrder.indexOf(visibleColumns[dropIndex].id)
      : columnOrder.length;

    const firstDragIndex = dragColumnsIndexesInAllColumns[0];

    if (
      !allowGroupSplitOnReorder &&
      firstDragIndex < dropBeforeIndexInAllColumns
    ) {
      while (true) {
        let columnRightBefore = columnOrder[dropBeforeIndexInAllColumns - 1];
        if (
          columnRightBefore &&
          columnVisibilityMap[columnRightBefore] === false
        ) {
          dropBeforeIndexInAllColumns--;
          continue;
        }
        break;
      }
    }

    const targetColumn =
      visibleColumns[dropIndex] || visibleColumns[visibleColumns.length - 1];

    columns.forEach(col => {
      if (newLocked != col.computedLocked) {
        this.props.setColumnLocked(col.id, newLocked);
      }
    });

    const newColumnOrder = moveXBeforeY(
      columnOrder,
      dragColumnsIndexesInAllColumns,
      dropBeforeIndexInAllColumns
    );
    this.setColumnOrder(newColumnOrder);
  }

  onHeaderCellDrag({ left: diffLeft, top: diffTop }) {
    if (!DRAG_INFO) {
      return;
    }
    const {
      allowTargetChange,
      dragTarget,
      dragIndex,
      dragProxy,
      dragColumn,
      dragBoxInitialRegion,
      dragBoxOffsets,
      dragBoxRegion,
      groupByRanges,
      columnRanges: theRanges,
      headerRegion,
      scrollLeftMax,
      initialScrollLeft,
      validDropPositions,
    } = DRAG_INFO;

    dragBoxRegion.set({
      left: dragBoxInitialRegion.left,
      top: dragBoxInitialRegion.top,
      bottom: dragBoxInitialRegion.bottom,
      right: dragBoxInitialRegion.right,
    });

    let { dropTarget } = DRAG_INFO;

    const { columnReorderScrollByAmount, rtl } = this.props;

    const scrollLeft = this.getScrollLeft();
    const scrollDiff = scrollLeft - initialScrollLeft;
    const initialDiffLeft = diffLeft;

    dragBoxRegion.shift({ top: diffTop, left: diffLeft });

    diffLeft += scrollDiff;

    const minScrollLeft = Math.max(headerRegion.left, 0);
    const maxScrollRight = headerRegion.right;

    const groupToolbarNode =
      this.groupToolbar &&
      this.groupToolbar.current &&
      this.groupToolbar.current.domRef
        ? this.groupToolbar.current.domRef.current
        : null;

    if (this.groupToolbar.current && allowTargetChange) {
      const groupToolbarRegion = Region.from(groupToolbarNode);
      if (
        dragBoxRegion.top + dragBoxRegion.height / 2 <
        groupToolbarRegion.bottom
      ) {
        if (dropTarget !== 'group' && dragColumn.groupBy !== false) {
          dropTarget = DRAG_INFO.dropTarget = 'group';
        }
      } else {
        if (dropTarget != 'header') {
          dropTarget = DRAG_INFO.dropTarget = 'header';
        }
      }
    }

    let scrollAdjust = 0;
    let dragProxyAdjust = 0;

    const dragComputedLocked = this.props.visibleColumns[dragIndex]
      .computedLocked;

    if (dropTarget == 'header' || dropTarget == 'headergroup') {
      if (
        dragBoxInitialRegion.left +
          initialDiffLeft -
          this.props.totalLockedStartWidth <
          minScrollLeft + SCROLL_MARGIN &&
        initialDiffLeft < 0
      ) {
        // for scrolling towards start
        scrollAdjust = -columnReorderScrollByAmount;
      } else if (
        dragBoxInitialRegion.right + initialDiffLeft >
          maxScrollRight - SCROLL_MARGIN - this.props.totalLockedEndWidth &&
        initialDiffLeft > 0
      ) {
        // for scrolling towards end
        scrollAdjust = columnReorderScrollByAmount;
      }
      if (scrollAdjust) {
        if (scrollLeft + scrollAdjust < 0) {
          scrollAdjust = -scrollLeft;
        }
        if (scrollLeft + scrollAdjust > scrollLeftMax) {
          scrollAdjust = scrollLeftMax - scrollLeft;
        }
        if (scrollAdjust) {
          this.setScrollLeft(scrollLeft + scrollAdjust);
          dragProxyAdjust = scrollAdjust;
        }
      }
    }

    if (rtl) {
      dragProxy.setRight(
        dragBoxOffsets.right +
          -initialDiffLeft -
          dragBoxInitialRegion.right -
          dragProxyAdjust
      );
    } else {
      dragProxy.setLeft(
        dragBoxInitialRegion.left +
          initialDiffLeft -
          dragBoxOffsets.left -
          dragProxyAdjust
      );
    }
    dragProxy.setTop(dragBoxRegion.top - dragBoxOffsets.top);

    let dir =
      dropTarget == 'group' && dragTarget == 'group'
        ? initialDiffLeft < 0
          ? -1
          : 1
        : dragTarget != dropTarget || diffLeft < 0
        ? -1
        : 1;

    if (dragComputedLocked) {
      dir = initialDiffLeft < 0 ? -1 : 1;
    }

    if (rtl) {
      dir *= -1;
    }

    const mapRange = r => {
      if (!r.computedLocked) {
        return {
          ...r,
          left: r.left - scrollDiff,
          right: r.right - scrollDiff,
        };
      }
      return r;
    };
    const currentRanges = dropTarget === 'group' ? groupByRanges : theRanges;
    const ranges = currentRanges.map(mapRange);
    const compareRanges = currentRanges.map(mapRange);

    const dragMinIndex =
      dropTarget == 'header' ? DRAG_INFO.minHeaderIndex : undefined;

    const dragMaxIndex =
      dropTarget == 'header' ? DRAG_INFO.maxHeaderIndex : undefined;

    let dropIndex;

    const { index: newDropIndex, locked } = getDropIndex({
      dir,
      rtl,
      dragMinIndex,
      dragMaxIndex,
      dragTarget,
      dropTarget,
      dragRange: {
        ...ranges[dragIndex],
        left: dragBoxRegion.left,
        right: dragBoxRegion.right,
        index: dragIndex,
      },
      dragIndex,
      ranges: compareRanges,
      validDropPositions:
        dropTarget === dragTarget ? validDropPositions : undefined,
    });

    DRAG_INFO.newLocked = locked;

    if (newDropIndex != undefined) {
      dropIndex = newDropIndex;
    }

    let offset = 0;
    let visible;

    if (locked === 'start' && newDropIndex === this.props.firstUnlockedIndex) {
      offset = (rtl ? -1 : 1) * -11;
    }
    if (
      newDropIndex === this.props.firstLockedEndIndex &&
      dragIndex !== this.props.firstLockedEndIndex
    ) {
      if (locked === 'end') {
        offset = (rtl ? -1 : 1) * 4;
      } else if (!locked) {
        offset = (rtl ? -1 : 1) * -6;
      }
    }
    if (newDropIndex === this.props.visibleColumns.length) {
      offset = rtl ? 6 : -6;
    }
    if (
      locked == null &&
      dragComputedLocked === 'end' &&
      newDropIndex === this.props.firstLockedEndIndex
    ) {
      // dragging the first locked end column to be unlocked
      visible = true;
    }

    this.dropIndex = dropIndex;

    this.setReorderArrowVisible(true);

    this.setReorderArrowPosition(undefined, dropTarget);
    this.setReorderArrowAt(
      dropIndex,
      compareRanges,
      dropTarget,
      offset,
      visible
    );
  }

  setColumnOrder(newColumnOrder) {
    const columnOrder = getColumnOrder(this.props);

    if (
      this.props.setColumnOrder &&
      JSON.stringify(columnOrder) !== JSON.stringify(newColumnOrder)
    ) {
      this.props.setColumnOrder(newColumnOrder);
    }
  }

  setGroupBy(groupBy) {
    if (
      this.props.onGroupByChange &&
      JSON.stringify(groupBy) !== JSON.stringify(this.props.computedGroupBy)
    ) {
      this.props.onGroupByChange(groupBy);
    }
  }

  insertGroupBy(at, column) {
    const { props } = this;
    const order = [...props.computedGroupBy];

    order.splice(at, 0, column.id);

    this.setGroupBy(order);
  }
}

InovuaDataGridHeaderLayout.propTypes = {
  i18n: PropTypes.func.isRequired,
  renderGroupToolbar: PropTypes.func,
  renderDragGroupItem: PropTypes.func,
  getScrollLeftMax: PropTypes.func.isRequired,
  setScrollLeft: PropTypes.func.isRequired,
  renderColumnReorderProxy: PropTypes.func,
};
