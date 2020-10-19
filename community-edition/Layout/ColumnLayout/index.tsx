/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { MouseEvent, ReactNode, createRef } from 'react';
import PropTypes from 'prop-types';
import Region from '../../packages/region';

import ResizeOverlay from './ResizeOverlay';
import setupColumnResize from './setupColumnResize';
import join from '../../packages/join';
import FakeFlex from '../../FakeFlex';

import HeaderLayout from './HeaderLayout';
import Content from './Content';

import { Consumer } from '../../context';

import { TypeComputedProps } from '../../types';
import isMobile from '../../packages/isMobile';

const height100 = { height: '100%' };

export default class InovuaDataGridColumnLayout extends React.Component {
  private scrollTop: number = 0;
  lastComputedProps?: TypeComputedProps | null;
  headerLayout: React.RefObject<HTMLDivElement> | null;

  constructor(props) {
    super(props);

    this.refResizeOverlay = r => {
      this.resizeOverlay = r;
    };

    this.headerLayout = createRef();
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

    return (
      <Consumer>
        {computedProps => {
          let flexIndex = 1;
          let { useNativeFlex } = computedProps;

          this.lastComputedProps = computedProps;
          return (
            <div
              ref={this.columnLayoutRef}
              className={className}
              style={{
                ...height100,
                ...this.props.style,
              }}
            >
              <FakeFlex
                useNativeFlex={useNativeFlex}
                flexIndex={flexIndex}
                getNode={this.getDOMNode}
              >
                {this.renderHeaderLayout(computedProps)}
                {this.renderContent(computedProps)}
              </FakeFlex>
              {this.renderReorderRowProxy(computedProps)}
              {this.renderResizeOverlay(computedProps)}
              {this.renderDragRowArrow(computedProps)}
            </div>
          );
        }}
      </Consumer>
    );
  }

  getDOMNode = () => {
    return this.columnLayoutRef.current;
  };

  renderReorderRowProxy(): ReactNode {
    return null; // implemented in enterprise
  }
  renderDragRowArrow(): ReactNode {
    return null; // implemented in enterprise
  }

  getContentRows = () => {
    return this.content.getRows();
  };

  getScrollTop = () => {
    return this.scrollTop || 0;
  };

  renderHeaderLayout = computedProps => {
    return (
      <HeaderLayout
        {...computedProps}
        onResizeMouseDown={this.onResizeMouseDown.bind(this, computedProps)}
        onResizeTouchStart={this.onResizeTouchStart.bind(this, computedProps)}
        onFilterValueChange={computedProps.computedOnColumnFilterValueChange}
        ref={this.headerLayout}
        getScrollLeftMax={this.getScrollLeftMax}
        setScrollLeft={this.setScrollLeft}
      />
    );
  };

  renderContent = computedProps => {
    const { groupBy } = computedProps;

    const groupByValue = groupBy && groupBy.length ? groupBy : null;

    return (
      <Content
        key="content"
        {...computedProps}
        getScrollLeftMax={this.getScrollLeftMax}
        groupBy={groupByValue}
        before={this.renderLockedStartRows(computedProps)}
        after={this.renderLockedEndRows(computedProps)}
        ref={this.refContent}
        columns={computedProps.visibleColumns}
        minWidth={computedProps.minWidth}
        maxWidth={computedProps.maxWidth}
        onDragRowMouseDown={this.onDragRowMouseDownHandle}
        onContainerScrollHorizontal={this.onContainerScrollHorizontal.bind(
          this,
          computedProps
        )}
        onContainerScrollVertical={this.onContainerScrollVertical.bind(
          this,
          computedProps
        )}
        onColumnRenderStartIndexChange={this.onColumnRenderStartIndexChange}
      />
    );
  };
  onDragRowMouseDownHandle = (ev: MouseEvent, index: number, cellNode: any) => {
    // implemented in enterprise
  };

  renderLockedEndRows = computedProps => {
    // implemented in enterprise
    return null;
  };
  renderLockedStartRows = computedProps => {
    // implemented in enterprise
    return null;
  };

  renderLockedRows = (rows, position: 'start' | 'end', computedProps) => {
    // implemented in enterprise
    return null;
  };

  renderResizeOverlay = computedProps => {
    return (
      <ResizeOverlay
        resizeProxyStyle={computedProps.resizeProxyStyle}
        columnResizeProxyWidth={computedProps.columnResizeProxyWidth}
        columnResizeHandleWidth={computedProps.columnResizeHandleWidth}
        rtl={computedProps.rtl}
        ref={this.refResizeOverlay}
      />
    );
  };

  onColumnRenderStartIndexChange = columnRenderStartIndex => {
    if (this.headerLayout.current) {
      this.headerLayout.current.setColumnRenderStartIndex(
        columnRenderStartIndex
      );
    }
  };

  onContainerScrollVertical = (computedProps, scrollTop) => {
    this.scrollTop = scrollTop;

    const {
      computedLockedRows,
      rowHeight,
      stickyHeaders,
      groupBy,
    } = computedProps;

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

  updateLockedRows(scrollTop) {
    return;
  }

  onContainerScrollHorizontal = (computedProps, scrollLeft) => {
    this.scrollLeft = scrollLeft;

    if (this.headerLayout.current) {
      this.headerLayout.current.onContainerScrollHorizontal(scrollLeft);
    }

    if (computedProps.onScroll) {
      computedProps.onScroll();
    }
  };

  updateStickyHeader() {}

  getScrollLeft = () => {
    return this.scrollLeft || 0;
  };

  getScrollLeftMax = () => {
    const vl = this.getVirtualList();

    if (!vl) {
      return 0;
    }
    return vl.scrollContainer.scrollLeftMax;
  };

  getScrollTopMax = () => {
    const vl = this.getVirtualList();

    if (!vl) {
      return;
    }

    return vl.scrollContainer.scrollTopMax;
  };

  setScrollLeft = scrollLeft => {
    const vl = this.getVirtualList();

    if (!vl) {
      return;
    }
    vl.scrollLeft = scrollLeft;
  };

  setScrollTop = (scrollTop: number) => {
    const vl = this.getVirtualList();

    if (!vl) {
      return;
    }

    vl.scrollTop = scrollTop;
  };

  getVirtualList = () => {
    return this.content ? this.content.virtualList : null;
  };

  startEdit = args => {
    return this.content.startEdit(args);
  };

  cancelEdit = args => {
    return this.content.cancelEdit(args);
  };

  completeEdit = args => {
    return this.content.completeEdit(args);
  };

  getRenderRange = () => {
    return this.content.getRenderRange();
  };

  getHeaderLayout = () => {
    return this.headerLayout?.current;
  };

  getHeaderCells = () => {
    return this.getHeaderLayout().getHeaderCells();
  };

  getHeader = () => {
    return this.headerLayout?.current.getHeader();
  };

  getGroupToolbar = () => {
    return this.headerLayout?.current.getGroupToolbar();
  };

  getDOMColumnHeaderAt = index => {
    return this.headerLayout?.current.getCellDOMNodeAt(index);
  };

  onResizeMouseDown = (...args) => {
    if (isMobile) {
      // handled by onResizeTouchStart

      // returning, because otherwise, both onResizeTouchStart
      // and this method are triggered, which result in buggy behaviour
      return;
    }
    this.onResizeDownAction(...args);
  };

  onResizeDownAction = (
    computedProps,
    config,
    { colHeaderNode, event, groupColumns }
  ) => {
    const { computedVisibleIndex: visibleIndex } = config;
    this.setupColumnResize(computedProps, {
      groupColumns,
      visibleIndex:
        visibleIndex !== undefined ? visibleIndex : config.visibleIndex,
      colHeaderNode,
      headerNode: this.getHeader().getDOMNode(),
      event,
    });
  };

  onResizeTouchStart = (...args) => {
    this.onResizeDownAction(...args);
  };

  setupColumnResize = (
    computedProps,
    { visibleIndex, groupColumns, colHeaderNode, event }
  ) => {
    event.stopPropagation();

    if (event.ctrlKey) {
      return;
    }

    const rtl = computedProps.rtl;
    const region = Region.from(
      event.currentTarget.firstChild || event.currentTarget
    );
    const columns = computedProps.visibleColumns;

    const firstFlexIndex = columns.reduce((index, col, i) => {
      if (col.flex != null && index == -1) {
        return i;
      }
      return index;
    }, -1);

    const index = visibleIndex;

    const headerRegion = Region.from(
      this.getHeaderLayout().headerDomNode.current
    );
    const constrainTo = Region.from(headerRegion.get());

    // allow resizing the width to the right without limiting to the grid viewport
    constrainTo.set({
      [this.props.rtl ? 'left' : 'right']:
        (this.props.rtl ? -1 : 1) *
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
      const firstColumnRegion = Region.from(
        this.getDOMColumnHeaderAt(groupCols[0].computedVisibleIndex)
      );
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
    } else {
      const minWidth = column.computedMinWidth;
      if (this.props.rtl) {
        const right = columnRegion.right - minWidth - extraOffset;
        constrainTo.set({ right });

        if (column.computedMaxWidth) {
          maxPos = columnRegion.right - column.computedMaxWidth;
        }
      } else {
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

    if (
      (column && column.computedResizable === false) ||
      (nextCol && nextCol.computedResizable === false)
    ) {
      shareSpace = false;
    }

    if (shareSpace && nextColHeaderNode) {
      if (this.props.rtl) {
        const nextColLeft = nextColumnRegion.left + nextCol.computedMinWidth;

        if (!maxPos || nextColLeft > maxPos) {
          maxPos = nextColLeft;
        }
      } else {
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

    setupColumnResize(
      {
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
      },
      {
        onResizeDragInit: this.onResizeDragInit.bind(this, computedProps),
        onResizeDrag: this.onResizeDrag.bind(this, computedProps),
        onResizeDrop: this.onResizeDrop.bind(this, computedProps),
      },
      event
    );
  };

  onResizeDragInit = (computedProps, { offset, constrained }) => {
    const offsetTop = this.getHeaderLayout().getHeader().domRef.current
      .offsetTop;

    this.props.coverHandleRef.current.setActive(true);
    this.resizeOverlay
      .setOffset(offset)
      .setActive(true, { offsetTop })
      .setConstrained(constrained);
  };

  onResizeDrop = (
    computedProps,
    {
      index,
      offset,
      diff,
      groupColumns,
      constrained,
      size,
      nextColumnSize,
      firstFlexIndex,
      shareSpace,
    }
  ) => {
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

  onResizeDrag = (computedProps, { offset, constrained }) => {
    if (this.resizeOverlay) {
      this.resizeOverlay.setOffset(offset).setConstrained(constrained);
    }
  };

  isRowFullyVisible = index => {
    return this.content.isRowFullyVisible(index);
  };
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
