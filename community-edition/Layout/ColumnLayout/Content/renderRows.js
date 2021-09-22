/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Row from './Row';

import getRowSpans from './getRowSpans';

const emptyObject = Object.freeze ? Object.freeze({}) : {};

export default (
  {
    from,
    to,
    empty,
    renderIndex,
    editRowIndex,
    editValue,
    editColumnIndex,
    editColumnId,
    setRowSpan,
    sticky,
    rowHeight,
    tryNextRowEdit,
    onEditStop,
    onEditStart,
    onEditValueChange,
    scrollLeft,
    columnRenderCount,
    columnRenderStartIndex,
  },
  {
    // the full data array
    availableWidth,
    data,
    onTransitionEnd,
    columns,
    computedPivot,
    groupColumn,
    activeRowRef,
    columnsMap,
    renderLockedStartCells,
    renderLockedEndCells,
    computedOnCellMouseDown,
    computedEnableRowspan,
    lockedStartColumns,
    lockedEndColumns,
    renderDetailsGrid,
    editable,
    rowDetailsWidth,
    scrollbars,
    scrollToColumn,
    scrollToIndexIfNeeded,
    hasLockedStart,
    hasLockedEnd,
    computedShowEmptyRows,
    setRowSelected,
    setRowExpanded,
    toggleRowExpand,
    toggleNodeExpand,
    expandOnMouseDown,
    loadNodeAsync,
    computedTreeEnabled,
    computedActiveCell,
    rtl,
    naturalRowHeight,
    lastCellInRange,
    getCellSelectionKey,
    onRowContextMenu,
    // should have the following props:
    // index - the index of the column group
    // count - how many column groups there are
    columnGroupCount,
    columnGroupIndex,
    columnUserSelect,
    selectAll,
    deselectAll,
    expandGroupTitle,
    expandColumn,
    computedCellSelection,
    lastLockedStartIndex,
    lastLockedEndIndex,
    lastUnlockedIndex,
    computedGroupBy,
    computedIndexesInGroups,
    edition,
    computedLicenseValid,
    computedGroupCounts,
    rowHeightManager,
    maxRowHeight,
    minRowHeight,
    editStartEvent,
    getItemId,
    firstUnlockedIndex,
    firstLockedStartIndex,
    firstLockedEndIndex,
    maxVisibleRows,
    // row event handlers
    onRowMouseEnter,
    onRowMouseLeave,
    computedOnRowClick,
    onCellClick,
    onCellSelectionDraggerMouseDown,
    onCellMouseDown,
    onCellEnter,
    onEditCancel,
    onEditComplete,
    computedCellMultiSelectionEnabled,
    nativeScroll,
    renderRow,
    onRenderRow,
    rowClassName,
    rowStyle,
    rowFactory,
    rowProps: passedProps = emptyObject,
    rowKey,
    cellFactory,
    // selected can be an object or an index
    computedSelected,
    computedUnselected,
    treeColumn,
    renderNodeTool,
    renderTreeCollapseTool,
    renderTreeExpandTool,
    renderTreeLoadingTool,
    isRowExpanded,
    rowExpandHeight,
    isRowExpandedById,
    computedRenderRowDetails,
    isRowExpandableAt,
    computedRowExpandEnabled,
    computedRowMultiSelectionEnabled,
    computedRowSelectionEnabled,
    computedActiveIndex,
    computedSkip,
    computedShowZebraRows,
    computedHasColSpan,
    rowHeight: initialRowHeight,
    totalColumnCount,
    totalComputedWidth,
    totalLockedStartWidth,
    totalLockedEndWidth,
    totalUnlockedWidth,
    currentDataSourceCount,
    computedShowCellBorders,
    emptyScrollOffset,
    showHorizontalCellBorders,
    showVerticalCellBorders,
    getScrollLeftMax,
    shouldRenderCollapsedRowDetails,
    rowDetailsStyle,
    minRowWidth,
    maxWidth,
    startIndex = 0,
    groupNestingSize,
    treeNestingSize,
    onGroupToggle,
    computedCollapsedGroups,
    computedExpandedGroups,
    groupPathSeparator,
    renderGroupTitle,
    renderGroupTool,
    renderLockedEndGroupTitle,
    renderUnlockedGroupTitle,
    virtualizeColumns,
    computedLivePagination,
    onRowReorder,
    onDragRowMouseDown,
    theme,
    onContextMenu,
    setActiveIndex,
  }
) => {
  const remoteOffset = computedLivePagination ? 0 : computedSkip || 0;

  const totalCount = data.length;
  let dataArray = data.slice(from, to);
  const isGrouped = computedGroupBy && computedGroupBy.length;
  const defaultRowHeight = rowHeightManager.getDefaultRowHeight();

  if (computedShowEmptyRows && !dataArray.length) {
    dataArray = [null];
  }

  let depth = null;

  if (isGrouped) {
    depth = computedGroupBy.length;
  }

  return dataArray.map((rowData, i) => {
    const index = i + startIndex;
    const id = rowData ? getItemId(rowData) : i;
    const realIndex = index + from;

    const active = computedActiveIndex === realIndex;
    let indexInGroup = isGrouped ? computedIndexesInGroups[realIndex] : null;

    if (empty) {
      indexInGroup = realIndex + ((totalCount % 2) - 1);
    }

    const keyIndex = rowKey === 'realIndex' ? realIndex : index;
    const key = `row-${keyIndex}`;

    const isSelected =
      !empty &&
      computedRowSelectionEnabled &&
      (computedRowMultiSelectionEnabled
        ? computedSelected === true
          ? computedUnselected
            ? computedUnselected[id] === undefined
            : true
          : computedSelected.hasOwnProperty(id)
        : computedSelected == id);

    const rowExpanded = isRowExpandedById(id);

    const rowProps = {
      availableWidth,
      computedGroupBy,
      expandGroupTitle,
      expandColumn,
      getCellSelectionKey,
      id,
      depth,
      columns,
      columnsMap,
      computedHasColSpan,
      lockedStartColumns,
      lockedEndColumns,
      hasLockedStart,
      rowDetailsWidth,
      hasLockedEnd,
      columnUserSelect,
      minWidth: minRowWidth,
      width: totalComputedWidth,
      active,
      activeRowRef,
      emptyScrollOffset,
      empty,
      editable,
      key,
      scrollLeft,
      getScrollLeftMax,
      groupColumn,
      renderRow,
      onRenderRow,
      cellFactory,
      computedActiveCell,
      computedShowZebraRows,
      lastCellInRange,
      groupNestingSize,
      treeNestingSize,
      columnRenderCount,
      rowStyle: rowStyle,
      rowClassName,
      onTransitionEnd,
      onRowContextMenu,
      renderNodeTool,
      indexInGroup: isGrouped ? indexInGroup : null,
      groupCount:
        isGrouped && computedGroupCounts ? computedGroupCounts[realIndex] : 0,
      editStartEvent,
      virtualizeColumns,
      firstUnlockedIndex,
      firstLockedStartIndex,
      columnRenderStartIndex,
      firstLockedEndIndex,
      tryNextRowEdit,
      totalComputedWidth,
      totalLockedStartWidth,
      totalLockedEndWidth,
      totalUnlockedWidth,
      sticky,
      computedCellSelection,
      computedCellMultiSelectionEnabled,
      shouldRenderCollapsedRowDetails,
      rowDetailsStyle,
      renderDetailsGrid,
      renderIndex,
      realIndex,
      // is used in rowSelect, for a correct selection (onClick)
      rowIndex: realIndex,
      remoteRowIndex: remoteOffset + realIndex,
      maxVisibleRows,
      last: !computedShowEmptyRows
        ? realIndex == totalCount - 1
        : !!(
            maxVisibleRows &&
            realIndex >= maxVisibleRows - 1 &&
            realIndex == totalCount - 1
          ),
      lastNonEmpty: realIndex === totalCount - 1,
      // the totaldatacount includes group rows
      totalDataCount: totalCount,
      rowHeight,
      defaultRowHeight,
      rowExpandHeight,
      initialRowHeight,
      setRowSpan,
      maxRowHeight,
      minRowHeight,
      getItemId,
      computedShowCellBorders,
      showHorizontalCellBorders,
      showVerticalCellBorders,
      passedProps,
      setRowSelected,
      setRowExpanded,
      renderLockedStartCells,
      renderLockedEndCells,
      computedRowExpandEnabled,
      computedRenderRowDetails,
      isRowExpandableAt,
      treeColumn,
      rtl,
      toggleRowExpand,
      toggleNodeExpand,
      expandOnMouseDown,
      loadNodeAsync,
      edition,
      computedLicenseValid,
      computedEnableRowspan,
      computedTreeEnabled,
      naturalRowHeight,
      selectAll,
      deselectAll,
      totalColumnCount,
      computedPivot,
      multiSelect: computedRowMultiSelectionEnabled,
      selection: computedSelected,
      selected: isSelected,
      expanded: rowExpanded,
      lastLockedStartIndex,
      lastLockedEndIndex,
      lastUnlockedIndex,
      // row uses selected as a bool, a state
      data: rowData,
      dataSourceArray: data,
      onMouseEnter: !empty ? onRowMouseEnter : null,
      onMouseLeave: !empty ? onRowMouseLeave : null,
      onClick: !empty ? computedOnRowClick : null,
      scrollToColumn,
      scrollToIndexIfNeeded,
      onCellClick,
      onCellSelectionDraggerMouseDown,
      onCellMouseDown: computedOnCellMouseDown,
      onCellEnter,
      onEditStop,
      onEditStart,
      onEditCancel,
      onEditValueChange,
      onEditComplete,
      scrollbars,
      even: false,
      odd: false,
      nativeScroll,
      onRowReorder,
      onDragRowMouseDown,
      theme,
      onContextMenu,
      setActiveIndex,
      renderTreeCollapseTool,
      renderTreeExpandTool,
      renderTreeLoadingTool,
    };

    if (rowProps.rowIndex === editRowIndex) {
      rowProps.editing = true;
      rowProps.editValue = editValue;
      rowProps.editColumnIndex = editColumnIndex;
      rowProps.editColumnId = editColumnId;
    }

    if (rowData && rowData.__group) {
      rowProps.indexInGroup = null;
      const rowGroupKey = `${rowData.keyPath.join(groupPathSeparator)}`;
      let collapsed;
      if (computedCollapsedGroups === true) {
        collapsed = true;
        if (computedExpandedGroups[rowGroupKey]) {
          collapsed = false;
        }
      } else if (computedExpandedGroups === true) {
        collapsed = false;
        if (computedCollapsedGroups[rowGroupKey]) {
          collapsed = true;
        }
      } else {
        collapsed = computedCollapsedGroups[rowGroupKey];
      }

      rowProps.groupProps = {
        renderGroupTitle,
        renderGroupTool,
        renderLockedEndGroupTitle,
        renderUnlockedGroupTitle,
        onGroupToggle,
        collapsed,

        groupNestingSize,
        depth: rowData.depth - 1,
      };
      rowProps.onGroupToggle = onGroupToggle;
      rowProps.groupSummary = rowData.groupSummary;
      rowProps.groupColumnSummaries = rowData.groupColumnSummaries;
      rowProps.selected = false;
    }

    if (isGrouped) {
      rowProps.parentGroupDataArray = [];
    }

    let even = !!((isGrouped && !computedPivot ? indexInGroup : realIndex) % 2);
    if (empty && isGrouped) {
      const tmpIndex =
        (computedIndexesInGroups[currentDataSourceCount - 1] || 0) +
        (realIndex - currentDataSourceCount - 1);
      even = !!(tmpIndex % 2);
    }

    if (rowData && rowData.__summary) {
      rowProps.summaryProps = {
        position: rowData.__summary,
        groupProps: rowData.__parentGroup,
        value: rowData.__parentGroup.groupColumnSummaries,
        depth: rowData.__parentGroup.depth - 1,
      };
      even = true;
    }

    if (maxWidth != null) {
      rowProps.maxWidth = maxWidth;
    }

    rowProps.even = even;
    rowProps.odd = !even;

    let row;
    if (rowFactory) {
      row = rowFactory(rowProps);
    }
    if (computedEnableRowspan) {
      rowProps.computedRowspans = getRowSpans(rowProps);
      setRowSpan(
        Math.max(
          ...Object.keys(rowProps.computedRowspans).map(
            key => rowProps.computedRowspans[key]
          )
        )
      );
    }

    if (row === undefined) {
      row = <Row {...rowProps} />;
    }

    return row;
  });
};
