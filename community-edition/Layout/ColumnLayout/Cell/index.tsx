/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import Region from '../../../packages/region';

import shallowequal, { equalReturnKey } from '../../../packages/shallowequal';

import autoBind from '../../../packages/react-class/autoBind';

import RENDER_HEADER from './renderHeader';
import renderGroupTool from './renderGroupTool';
import renderNodeTool from './renderNodeTool';

import sealedObjectFactory from '../../../utils/sealedObjectFactory';
import join from '../../../packages/join';
import isFocusable from '../../../utils/isFocusable';
import bemFactory from '../../../bemFactory';
import renderSortTool from './renderSortTool';

import { id as REORDER_COLUMN_ID } from '../../../normalizeColumns/defaultRowReorderColumnId';
import TextEditor from './editors/Text';
import Renderable from '../../../types/TypeRenderable';
import { EnhancedCellProps, CellRenderObject } from './CellProps';
import { setupResizeObserver } from '../../../utils/setupResizeObserver';
// import diff from '../../../packages/shallow-changes';

const cellBem = bemFactory('InovuaReactDataGrid__cell');
const headerBem = bemFactory('InovuaReactDataGrid__column-header');

const emptyObject = Object.freeze ? Object.freeze({}) : {};

const emptyFn = () => {};

const CELL_RENDER_OBJECT: CellRenderObject = sealedObjectFactory({
  empty: null,
  value: null,
  data: null,
  columnIndex: null,
  rowIndex: null,
  remoteRowIndex: null,
  rowIndexInGroup: null,
  nodeProps: null,
  rowSelected: null,
  rowExpanded: null,
  treeColumn: null,
  setRowSelected: null,
  setRowExpanded: null,
  isRowExpandable: null,
  toggleRowExpand: null,
  toggleNodeExpand: null,
  loadNodeAsync: null,
  toggleGroup: null,
  cellProps: null,
  totalDataCount: null,
  rendersInlineEditor: null,
});

const CELL_RENDER_SECOND_OBJ = sealedObjectFactory({
  cellProps: null,
  column: null,
  headerProps: null,
});

const wrapInContent = (value: Renderable) => (
  <div
    key="content"
    className="InovuaReactDataGrid__cell__content"
    children={value}
  />
);

export default class InovuaDataGridCell extends React.Component {
  domRef: React.RefObject<unknown>;
  isCancelled: boolean;
  constructor(props) {
    super(props);

    this.domRef = React.createRef();
    this.state = { props };

    autoBind(this);

    if (props.headerCell) {
      this.state.left = 0;
    }

    this.isCancelled = false;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }

  getProps() {
    return this.state.props;
  }

  setStateProps(stateProps) {
    if (this.unmounted) {
      return;
    }
    const newProps = Object.assign(
      {},
      InovuaDataGridCell.defaultProps,
      stateProps
    );

    if (!shallowequal(newProps, this.getProps())) {
      this.updateProps(newProps);
    }
  }

  updateProps(props, callback) {
    const newState = { props };

    this.updateState(newState, callback);
  }

  onUpdate() {
    if (this.props.onUpdate) {
      this.props.onUpdate(this.getProps(), this);
    }
  }

  componentDidMount() {
    this.node = this.getDOMNode();
    if (this.props.onMount) {
      this.props.onMount(this.props, this);
    }

    if (this.props.naturalRowHeight) {
      // this.cleanupResizeObserver = setupResizeObserver(this.node, size => {
      //   this.props.onResize?.({
      //     cell: this,
      //     props: this.getProps(),
      //     size,
      //   });
      // });
    }
  }

  componentWillUnmount() {
    if (this.cleanupResizeObserver) {
      this.cleanupResizeObserver();
    }
    if (this.props.onUnmount) {
      this.props.onUnmount(this.props, this);
    }
    this.unmounted = true;
  }

  shouldComponentUpdate(nextProps, nextState) {
    let areEqual = equalReturnKey(nextProps, this.props, {
      computedActiveIndex: 1,
      activeRowRef: 1,
      active: 1,
      remoteRowIndex: 1,
      onResizeMouseDown: 1,
      onResizeTouchStart: 1,
      onFocus: 1,
      onSortClick: 1,
      onTouchStart: 1,
    });

    const equalProps = areEqual.result;
    if (!areEqual.result) {
      // console.log(
      //   'UPDATE CELL',
      //   areEqual.key,
      //   // this.props[areEqual.key!],
      //   // nextProps[areEqual.key!],
      //   diff(nextProps, this.props)
      // );
      return true;
    }

    if (equalProps && !this.updating) {
      return false;
    }

    const equal = this.state
      ? equalProps && shallowequal(nextState, this.state)
      : equalProps;

    return !equal;
  }

  prepareStyle(props) {
    const {
      maxWidth,
      minRowHeight,
      computedLocked,
      virtualizeColumns,
      computedWidth,
      computedOffset,
      rowHeight,
      initialRowHeight,
      naturalRowHeight,
      headerCell,
      hidden,
      rtl,
      inTransition,
      inShowTransition,
      computedRowspan,
      zIndex,
    } = props;

    const style = {};

    if (typeof props.style === 'function') {
      if (!headerCell) {
        Object.assign(style, props.style(props));
      }
    } else {
      Object.assign(style, props.style);
    }

    style.width = computedWidth;
    style.minWidth = computedWidth;

    if (minRowHeight) {
      style.minHeight = minRowHeight;
    }

    if (headerCell) {
      style.maxWidth = computedWidth;
    }

    if (maxWidth) {
      style.maxWidth = maxWidth;
    }

    if (!headerCell) {
      if (rowHeight && !naturalRowHeight) {
        style.height = rowHeight;
      }

      if (naturalRowHeight) {
        style.minHeight = minRowHeight;
      } else {
        if (initialRowHeight) {
          style.height = initialRowHeight;
        }
        if (rowHeight && computedRowspan > 1) {
          style.height = (initialRowHeight || rowHeight) * computedRowspan;
        }
      }
    }

    if (hidden) {
      style.display = 'none';
    }

    if (!headerCell && !computedLocked) {
      // style.position = naturalRowHeight ? 'relative' : 'absolute';
      style.position = naturalRowHeight ? 'relative' : 'absolute';
      style.top = 0;
      if (!naturalRowHeight) {
        if (rtl) {
          style.right = computedOffset;
        } else {
          style.left = computedOffset;
        }
      }
    }

    if (this.state && this.state.dragging) {
      if (rtl) {
        style.right = this.state.right || 0;
      } else {
        style.left = this.state.left || 0;
      }
      style.top = this.state.top || 0;
      style.height = this.state.height || '';

      if (!props.computedResizable && props.computedFilterable) {
        if (rtl) {
          style.right = 0;
        } else {
          style.left = 0;
        }
        style.top = 0;
      }
      style.position = 'absolute';
      style.zIndex = 100;
    }

    if (zIndex) {
      style.zIndex = zIndex;
    }

    if (computedWidth === 0) {
      style.paddingLeft = 0;
      style.paddingRight = 0;
    }

    if (inTransition) {
      let duration = inShowTransition
        ? props.showTransitionDuration
        : props.hideTransitionDuration;

      duration = duration || props.visibilityTransitionDuration;

      style.transitionDuration =
        typeof duration == 'number' ? `${duration}ms` : duration;
    }

    return style;
  }

  prepareClassName(props) {
    const {
      groupCell: isGroupCell,
      groupTitleCell,
      groupExpandCell,
      headerCell: isHeaderCell,
      headerCellDefaultClassName,
      cellDefaultClassName,
      computedGroupBy,
      depth,
      computedVisibleIndex,
      headerCell,
      headerEllipsis,
      groupProps,
      hidden,
      showBorderRight,
      showBorderTop,
      showBorderBottom,
      showBorderLeft,
      firstInSection,
      lastInSection,
      noBackground,
      computedLocked,
      computedWidth,
      inTransition,
      rowSelected,
      computedRowspan,
      cellSelected,
      cellActive,
      groupSpacerColumn,
      computedPivot,
      computedResizable,
      groupColumnVisible,
      lockable,
      computedFilterable,
      rtl,
      inEdit,
    } = props;

    let { userSelect, headerUserSelect } = props;

    if (typeof userSelect === 'boolean') {
      userSelect = userSelect ? 'text' : 'none';
    }
    if (typeof headerUserSelect === 'boolean') {
      headerUserSelect = headerUserSelect ? 'text' : 'none';
    }

    const nested =
      depth != null &&
      computedVisibleIndex == 0 &&
      !headerCell &&
      !groupColumnVisible;

    const baseClassName = isHeaderCell
      ? headerCellDefaultClassName
      : cellDefaultClassName;

    const commonClassName = join(
      !computedLocked && `${baseClassName}--unlocked`,
      computedLocked && `${baseClassName}--locked`,
      computedLocked && `${baseClassName}--locked-${computedLocked}`
    );

    const last =
      props.last ||
      props.computedVisibleIndex == props.computedVisibleCount - 1;

    let className = join(
      typeof props.className === 'function'
        ? props.className(props)
        : props.className,
      baseClassName,
      commonClassName,
      !isHeaderCell && props.cellClassName,
      (nested || hidden) && `${baseClassName}--no-padding`,
      hidden && `${baseClassName}--hidden`,
      `${baseClassName}--direction-${rtl ? 'rtl' : 'ltr'}`,
      computedRowspan > 1 && `${baseClassName}--rowspan`,
      inTransition && `${baseClassName}--transition`,
      inTransition && computedWidth && `${baseClassName}--showing`,
      inTransition && !computedWidth && `${baseClassName}--hiding`,
      computedWidth === 0 && `${baseClassName}--no-size`,
      nested && `${baseClassName}--stretch`,
      (isHeaderCell && headerUserSelect == null) || !isHeaderCell
        ? userSelect && `${baseClassName}--user-select-${userSelect}`
        : null,
      groupExpandCell && `${baseClassName}--group-expand-cell`,
      groupTitleCell && `${baseClassName}--group-title-cell`,
      rowSelected && `${baseClassName}--selected`,
      groupProps && `${baseClassName}--group-cell`,
      computedPivot && `${baseClassName}--pivot-enabled`,
      groupSpacerColumn && `${baseClassName}--group-column-cell`,
      inEdit && `${baseClassName}--in-edit`,
      cellSelected && `${baseClassName}--cell-selected`,
      cellActive && `${baseClassName}--cell-active`,
      props.textAlign &&
        (isHeaderCell ? !props.headerAlign : true) &&
        `${baseClassName}--align-${props.textAlign}`,
      props.textVerticalAlign &&
        (isHeaderCell ? !props.headerVerticalAlign : true) &&
        `${baseClassName}--vertical-align-${props.textVerticalAlign}`,
      props.virtualizeColumns && `${baseClassName}--virtualize-columns`,
      props.computedVisibleIndex === 0 && `${baseClassName}--first`,
      props.rowIndexInGroup === 0 && `${baseClassName}--first-row-in-group`,
      last && `${baseClassName}--last`,
      showBorderLeft &&
        computedWidth !== 0 &&
        (!isHeaderCell || !(computedResizable || computedFilterable)) &&
        `${baseClassName}--show-border-${rtl ? 'right' : 'left'}`,
      firstInSection && `${baseClassName}--first-in-section`,
      lastInSection && `${baseClassName}--last-in-section`,
      showBorderRight &&
        computedWidth !== 0 &&
        (!isHeaderCell || !(computedResizable || computedFilterable)) &&
        `${baseClassName}--show-border-${rtl ? 'left' : 'right'}`,
      showBorderTop && `${baseClassName}--show-border-top`,
      showBorderBottom && `${baseClassName}--show-border-bottom`,
      noBackground && `${baseClassName}--no-background`
    );

    if (cellSelected) {
      className = join(
        className,
        props.hasTopSelectedSibling &&
          `${baseClassName}--cell-has-top-selected-sibling`,
        props.hasBottomSelectedSibling &&
          `${baseClassName}--cell-has-bottom-selected-sibling`,
        props.hasLeftSelectedSibling &&
          `${baseClassName}--cell-has-${
            rtl ? 'right' : 'left'
          }-selected-sibling`,
        props.hasRightSelectedSibling &&
          `${baseClassName}--cell-has-${
            rtl ? 'left' : 'right'
          }-selected-sibling`
      );
    }

    if (isHeaderCell) {
      className = join(
        className,
        commonClassName,
        props.headerClassName,
        props.titleClassName,
        this.state && this.state.dragging && `${baseClassName}--dragging`,
        this.state && this.state.left && `${baseClassName}--reordered`,
        props.computedSortable && `${baseClassName}--sortable`,
        headerUserSelect && `${baseClassName}--user-select-${headerUserSelect}`,
        last && !headerEllipsis && `${baseClassName}--overflow-hidden`,
        `${baseClassName}--align-${props.headerAlign || 'start'}`,
        props.group
          ? `${baseClassName}--has-group`
          : `${baseClassName}--has-no-group`,
        props.headerVerticalAlign &&
          `${baseClassName}--vertical-align-${props.headerVerticalAlign}`,
        props.computedResizable
          ? `${baseClassName}--resizable`
          : `${baseClassName}--unresizable`,
        props.computedLockable
          ? `${baseClassName}--lockable`
          : `${baseClassName}--unlockable`,
        props.lastInGroup && `${baseClassName}--last-in-group`
      );
    } else {
      className = join(
        className,
        (groupProps
          ? groupProps.depth == computedVisibleIndex
          : computedGroupBy
          ? computedGroupBy.length === computedVisibleIndex
          : computedVisibleIndex === 0) &&
          `${baseClassName}--active-row-left-border`
      );
    }

    if (isGroupCell) {
      className = join(className, 'InovuaReactDataGrid__group-cell');
    }

    return className;
  }

  setDragging(dragging, callback) {
    const newState = { dragging };
    if (!dragging) {
      newState.top = 0;
      if (this.props.rtl) {
        newState.right = 0;
      } else {
        newState.left = 0;
      }
    }
    this.updateState(newState, callback);
  }

  updateState(state, callback) {
    this.updating = true;
    this.setState(state, () => {
      this.updating = false;
      if (callback && typeof callback === 'function') {
        callback();
      }
    });
  }

  setLeft(left) {
    this.updateState({ left });
  }

  setRight(right) {
    this.updateState({ right });
  }

  setTop(top) {
    this.updateState({ top });
  }

  setHeight(height) {
    this.updateState({ height });
  }

  setWidth(width) {
    this.updateState({ width });
  }

  getInitialIndex() {
    return this.props.computedVisibleIndex;
  }

  getcomputedVisibleIndex() {
    return this.getProps().computedVisibleIndex;
  }

  render() {
    const props = this.getProps();

    const {
      cellActive,
      cellSelected,
      data,
      empty,
      groupProps,
      headerCell,
      hidden,
      name,
      onCellEnter,
      onRender,
      treeColumn,
      groupSpacerColumn,
      groupColumn,
      loadNodeAsync,
      groupColumnVisible,
      rowIndex,
      remoteRowIndex,
      rowSelected,
      rowExpanded,
      setRowSelected,
      setRowExpanded,
      isRowExpandable,
      toggleRowExpand,
      toggleNodeExpand,
      totalDataCount,
      computedVisibleIndex,
      inEdit,
    } = props;

    let { value, render: renderCell, renderSummary } = props;

    const className = this.prepareClassName(props);
    const style = this.prepareStyle(props);
    const headerProps = headerCell ? props.headerProps || emptyObject : null;

    if (
      !headerCell &&
      groupSpacerColumn &&
      groupProps &&
      groupProps.depth == computedVisibleIndex
    ) {
      value = this.renderGroupTool();
    }

    const children = value;

    let cellProps: EnhancedCellProps = Object.assign(
      {},
      props,
      headerCell ? headerProps : props.cellProps,
      {
        instance: this,
        value,
        name,
        columnIndex: computedVisibleIndex,
        children,
        onClick: this.onClick,
        onDoubleClick: this.onDoubleClick,
        onContextMenu: this.onContextMenu,
        onMouseDown: this.onMouseDown,
        onTouchStart: this.onTouchStart,
      }
    );

    cellProps.className = headerCell
      ? headerProps.className
        ? `${className} ${headerProps.className}`
        : className
      : props.cellProps && props.cellProps.className
      ? typeof props.cellProps.className === 'function'
        ? `${className} ${props.cellProps.className(cellProps)}`
        : `${className} ${props.cellProps.className}`
      : className;

    if (!headerCell) {
      CELL_RENDER_OBJECT.empty = empty;
      CELL_RENDER_OBJECT.value = value;
      CELL_RENDER_OBJECT.data = data;
      CELL_RENDER_OBJECT.cellProps = cellProps;
      CELL_RENDER_OBJECT.columnIndex = computedVisibleIndex;
      CELL_RENDER_OBJECT.treeColumn = treeColumn;
      CELL_RENDER_OBJECT.rowIndex = rowIndex;
      CELL_RENDER_OBJECT.remoteRowIndex = remoteRowIndex;
      CELL_RENDER_OBJECT.rowIndexInGroup = props.rowIndexInGroup;
      CELL_RENDER_OBJECT.rowSelected = rowSelected;
      CELL_RENDER_OBJECT.rowExpanded = rowExpanded;
      CELL_RENDER_OBJECT.nodeProps = data ? data.__nodeProps : emptyObject;
      CELL_RENDER_OBJECT.setRowSelected = setRowSelected;
      CELL_RENDER_OBJECT.setRowExpanded = setRowExpanded;
      CELL_RENDER_OBJECT.toggleGroup = this.toggleGroup;
      CELL_RENDER_OBJECT.toggleRowExpand = toggleRowExpand;
      CELL_RENDER_OBJECT.toggleNodeExpand = toggleNodeExpand;
      CELL_RENDER_OBJECT.loadNodeAsync = loadNodeAsync;
      CELL_RENDER_OBJECT.isRowExpandable = isRowExpandable;
      CELL_RENDER_OBJECT.totalDataCount = totalDataCount;
    }

    let rendersInlineEditor = headerCell
      ? false
      : cellProps.rendersInlineEditor;

    if (rendersInlineEditor && typeof rendersInlineEditor === 'function') {
      rendersInlineEditor = cellProps.rendersInlineEditor(CELL_RENDER_OBJECT);
    }

    CELL_RENDER_OBJECT.rendersInlineEditor = rendersInlineEditor;

    cellProps.style = headerCell
      ? headerProps.style
        ? Object.assign({}, style, headerProps.style)
        : style
      : props.cellProps && props.cellProps.style
      ? typeof props.cellProps.style === 'function'
        ? Object.assign({}, style, props.cellProps.style(cellProps))
        : Object.assign({}, style, props.cellProps.style)
      : style;

    if (inEdit || rendersInlineEditor) {
      cellProps.editProps = {
        inEdit,
        startEdit: this.startEdit,

        value: props.editValue,
        onClick: this.onEditorClick,
        onChange: this.onEditValueChange,
        onComplete: this.onEditorComplete,
        onCancel: this.onEditorCancel,

        onEnterNavigation: this.onEditorEnterNavigation,
        onTabNavigation: this.onEditorTabNavigation,
        gotoNext: this.gotoNextEditor,
        gotoPrev: this.gotoPrevEditor,
      };
    }

    if (onCellEnter) {
      cellProps.onMouseEnter = this.onCellEnter;
    }

    if (headerCell) {
      cellProps.onFocus = this.onHeaderCellFocus;
    }

    if (headerCell) {
      cellProps = this.prepareHeaderCellProps(cellProps);
    } else {
      if (
        data &&
        (data.__summary || (data.__group && data.groupColumnSummary)) &&
        renderSummary
      ) {
        renderCell = renderSummary;
      }
      if (renderCell) {
        // reuse the same sealed object in order to have better perf

        CELL_RENDER_SECOND_OBJ.cellProps = cellProps;
        CELL_RENDER_SECOND_OBJ.column = cellProps;
        CELL_RENDER_SECOND_OBJ.headerProps = null;

        if (data && (!data.__group || groupColumnVisible)) {
          // group rendering is handled in renderGroupTitle (see adjustCellProps)
          cellProps.children = renderCell(
            CELL_RENDER_OBJECT,
            CELL_RENDER_SECOND_OBJ
          );
        }
      }

      if (
        !hidden &&
        cellProps.children != null &&
        cellProps.textEllipsis !== false
      ) {
        cellProps.children = wrapInContent(cellProps.children);
      }

      if (onRender) {
        onRender(cellProps, CELL_RENDER_OBJECT);
      }

      if (cellSelected || cellActive || inEdit || rendersInlineEditor) {
        cellProps.children = [
          cellProps.children,
          this.renderSelectionBox(cellProps),
          inEdit && !rendersInlineEditor ? this.renderEditor(cellProps) : null,
        ];
      }
      if (treeColumn) {
        if (Array.isArray(cellProps.children)) {
          cellProps.children = [
            this.renderNodeTool(props),
            ...cellProps.children,
          ];
        } else {
          cellProps.children = [this.renderNodeTool(props), cellProps.children];
        }
      }
    }

    const initialDOMProps = this.getInitialDOMProps();

    const domProps = Object.assign({}, initialDOMProps, {
      onFocus: cellProps.onFocus || initialDOMProps.onFocus,
      onClick: cellProps.onClick || initialDOMProps.onClick,
      onContextMenu: cellProps.onContextMenu || initialDOMProps.onContextMenu,
      onDoubleClick: cellProps.onDoubleClick || initialDOMProps.onDoubleClick,
      onMouseDown: cellProps.onMouseDown || initialDOMProps.onMouseDown,
      onTouchStart: cellProps.onTouchStart || initialDOMProps.onTouchStart,
      onMouseEnter: cellProps.onMouseEnter || initialDOMProps.onMouseEnter,
      style: initialDOMProps.style
        ? Object.assign({}, initialDOMProps.style, cellProps.style)
        : cellProps.style,
      className: join(initialDOMProps.className, cellProps.className),
    });

    domProps.ref = this.domRef;

    return headerCell ? (
      RENDER_HEADER(cellProps, domProps, this, this.state)
    ) : (
      <div
        {...domProps}
        children={cellProps.children}
        id={null}
        name={null}
        value={null}
        title={null}
        data={null}
      />
    );
  }

  renderNodeTool(props) {
    const {
      data,
      renderTreeCollapseTool,
      renderTreeExpandTool,
      renderTreeLoadingTool,
    } = props;
    const nodeProps = data.__nodeProps || emptyObject;

    const leafNode = nodeProps.leafNode;
    const loading = nodeProps.loading;
    const expanded = nodeProps.expanded;
    const collapsed = !expanded;

    const style = {
      [this.props.rtl ? 'marginRight' : 'marginLeft']:
        (nodeProps.depth || 0) * props.treeNestingSize,
    };

    if (this.props.rtl && collapsed) {
      style.transform = 'rotate(180deg)';
    }
    const element = renderNodeTool(
      {
        render: props.renderNodeTool,
        nodeExpanded: expanded,
        nodeCollapsed: collapsed,
        nodeLoading: loading,
        leafNode: leafNode,
        nodeProps,
        node: data,
        rtl: this.props.rtl,
        size: 20,
        style,
        toggleNodeExpand: props.toggleNodeExpand,
        renderTreeCollapseTool,
        renderTreeExpandTool,
        renderTreeLoadingTool,
      },
      props
    );

    if (!element) {
      return;
    }

    return cloneElement(element, { key: 'nodeTool' });
  }

  getInitialDOMProps() {
    const props = this.getProps();

    let domProps = props.domProps;
    let specificDomProps = props.headerCell
      ? props.headerDOMProps
      : props.cellDOMProps;

    if (typeof domProps == 'function') {
      domProps = domProps(props);
    }
    if (typeof specificDomProps == 'function') {
      specificDomProps = specificDomProps(props);
    }

    return Object.assign({}, domProps, specificDomProps);
  }

  renderEditor() {
    const props = this.getProps();

    const editorProps = {
      nativeScroll: props.nativeScroll,
      ...props.editorProps,
      editorProps: props.editorProps,
      cell: this,
      cellProps: props,
      value: props.editValue,
      theme: props.theme,

      autoFocus: true,

      onChange: this.onEditValueChange,
      onComplete: this.onEditorComplete,
      onCancel: this.onEditorCancel,

      onEnterNavigation: this.onEditorEnterNavigation,
      onTabNavigation: this.onEditorTabNavigation,
      gotoNext: this.gotoNextEditor,
      gotoPrev: this.gotoPrevEditor,

      key: 'editor',

      onClick: this.onEditorClick,
    };

    const Editor = props.editor;
    if (Editor) {
      return <Editor {...editorProps} />;
    }

    if (props.renderEditor) {
      return props.renderEditor(editorProps, editorProps.cellProps, this);
    }

    return <TextEditor {...editorProps} />;
  }

  isInEdit() {
    return this.getProps().inEdit;
  }

  getEditable(editValue, props = this.getProps()) {
    if (props.groupSpacerColumn || props.groupProps) {
      return Promise.resolve(false);
    }
    const { computedEditable: editable } = props;

    if (typeof editable === 'function') {
      return Promise.resolve(editable(editValue, props));
    }

    return Promise.resolve(editable);
  }

  onEditorTabLeave(direction) {}

  gotoNextEditor() {
    this.props.tryRowCellEdit(this.getProps().computedVisibleIndex + 1, +1);
  }

  gotoPrevEditor() {
    this.props.tryRowCellEdit(this.getProps().computedVisibleIndex - 1, -1);
  }

  onEditorEnterNavigation(complete: boolean, dir: number) {
    const props = this.getProps();
    if (typeof dir !== 'number') {
      dir = 0;
    }

    const newIndex = props.rowIndex + dir;
    if (!complete) {
      this.stopEdit();
      if (newIndex != props.rowIndex) {
        this.props.tryNextRowEdit(dir, props.columnIndex, true);
      }
    } else {
      this.onEditorComplete();
      if (newIndex != props.rowIndex) {
        this.props.tryNextRowEdit(dir, props.columnIndex, true);
      }
    }
  }

  onEditorTabNavigation(complete, dir) {
    const props = this.getProps();
    if (typeof dir !== 'number') {
      dir = 0;
    }
    const newIndex = props.computedVisibleIndex + dir;
    if (!complete) {
      this.stopEdit();
      if (newIndex != props.computedVisibleIndex) {
        this.props.tryRowCellEdit(newIndex, dir);
      }
    } else {
      this.onEditorComplete();
      if (newIndex != props.computedVisibleIndex) {
        this.props.tryRowCellEdit(newIndex, dir);
      }
    }
  }

  onEditorClick(event) {
    event.stopPropagation();
  }

  onEditorCancel() {
    this.cancelEdit();
  }

  startEdit(editValue: any, errBack?: (...args: any[]) => any) {
    const props = this.getProps();

    this.isCancelled = false;

    const editValuePromise =
      editValue === undefined
        ? this.getEditStartValue(props)
        : Promise.resolve(editValue);

    return (
      editValuePromise
        .then(editValue => {
          return this.getEditable(editValue, props).then(editable => {
            if (!editable) {
              return Promise.reject(editable);
            }

            if (props.onEditStart) {
              props.onEditStart(editValue, props);
            }
            if (props.onEditStartForRow) {
              props.onEditStartForRow(editValue, props);
            }
            return editValue;
          });
        })
        // in order to not show console.error message in console
        .catch(errBack || (err => {}))
    );
  }

  stopEdit(editValue = this.getCurrentEditValue()) {
    const props = this.getProps();
    if (this.props.onEditStop) {
      this.props.onEditStop(editValue, props);
    }
    if (this.props.onEditStopForRow) {
      this.props.onEditStopForRow(editValue, props);
    }
  }

  cancelEdit() {
    this.isCancelled = true;
    this.stopEdit();
    const props = this.getProps();

    if (this.props.onEditCancel) {
      this.props.onEditCancel(props);
    }
    if (this.props.onEditCancelForRow) {
      this.props.onEditCancelForRow(props);
    }
  }

  onEditorComplete() {
    const now = Date.now();

    if (
      this.lastEditCompleteTimestamp &&
      now - this.lastEditCompleteTimestamp < 50
    ) {
      return;
    }

    this.lastEditCompleteTimestamp = now;

    if (!this.isCancelled) {
      this.completeEdit();
    }

    this.isCancelled = false;
  }

  completeEdit(completeValue = this.getEditCompleteValue()) {
    const props = this.getProps();

    this.stopEdit();

    if (this.props.onEditComplete) {
      this.props.onEditComplete(completeValue, props);
    }
    if (this.props.onEditCompleteForRow) {
      this.props.onEditCompleteForRow(completeValue, props);
    }
  }

  getCurrentEditValue() {
    return this.getProps().editValue;
  }

  getEditCompleteValue(value = this.getCurrentEditValue()) {
    if (this.props.getEditCompleteValue) {
      return this.props.getEditCompleteValue(value, this.getProps());
    }

    return value;
  }

  onFilterValueChange(filterValue) {
    const props = this.getProps();

    if (props.onFilterValueChange) {
      props.onFilterValueChange(filterValue, props);
    }
  }

  onEditValueChange(e) {
    const value = e && e.target ? e.target.value : e;
    const props = this.getProps();

    if (this.props.onEditValueChange) {
      this.props.onEditValueChange(value, props);
    }

    if (this.props.onEditValueChangeForRow) {
      this.props.onEditValueChangeForRow(value, props);
    }
  }

  renderSelectionBox() {
    const props = this.getProps();
    const { inTransition, inShowTransition, cellSelected, cellActive } = props;

    if (!cellSelected && !cellActive) {
      return null;
    }

    const style = {};

    if (inTransition) {
      let duration = inShowTransition
        ? props.showTransitionDuration
        : props.hideTransitionDuration;

      duration = duration || props.visibilityTransitionDuration;

      style.transitionDuration =
        typeof duration == 'number' ? `${duration}ms` : duration;
    }

    return (
      <div
        key="selectionBox"
        style={style}
        className="InovuaReactDataGrid__cell__selection"
      >
        {this.props.lastInRange &&
          this.props.computedCellMultiSelectionEnabled && (
            <div
              className={`InovuaReactDataGrid__cell__selection-dragger InovuaReactDataGrid__cell__selection-dragger--direction-${
                this.props.rtl ? 'rtl' : 'ltr'
              }`}
              onMouseDown={this.onCellSelectionDraggerMouseDown}
            />
          )}
      </div>
    );
  }

  onHeaderCellFocus(event) {
    const props = this.getProps();

    if (props.onFocus) {
      props.onFocus(event, props);
    }

    const initialProps = this.getInitialDOMProps();

    if (initialProps.onFocus) {
      initialProps.onFocus(event, props);
    }
  }

  onCellEnter(event) {
    const props = this.getProps();

    if (props.onCellEnter) {
      props.onCellEnter(event, props);
    }

    const initialProps = this.getInitialDOMProps();

    if (initialProps.onMouseEnter) {
      initialProps.onMouseEnter(event, props);
    }
  }

  onCellSelectionDraggerMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
    // in order for onCellMouseDown not to be triggered
    // as well since the dragger has a bit different behavior
    if (this.props.onCellSelectionDraggerMouseDown) {
      this.props.onCellSelectionDraggerMouseDown(event, this.getProps());
    }
  }

  prepareHeaderCellProps(cellProps) {
    const props = this.getProps();
    const { children, computedSortInfo } = cellProps;
    const { computedSortable } = props;

    const sortTools = computedSortable
      ? this.getSortTools(
          computedSortInfo ? computedSortInfo.dir : null,
          cellProps
        )
      : null;

    if (sortTools) {
      cellProps.children = [
        children && children.props
          ? cloneElement(children, { key: 'content' })
          : children,
        sortTools,
      ];
      if (
        props.headerAlign === 'end' ||
        (!props.headerAlign && props.textAlign == 'end')
      ) {
        // make sort tool come first
        cellProps.children.reverse();
      }
    }

    if (cellProps.renderHeader) {
      if (!Array.isArray(cellProps.children)) {
        cellProps.children = [cellProps.children];
      }
      cellProps.children = cellProps.renderHeader(cellProps);
    }

    if (computedSortInfo && computedSortInfo.dir) {
      const dirName = computedSortInfo.dir === 1 ? 'asc' : 'desc';

      cellProps.className = join(
        cellProps.className,
        `${props.headerCellDefaultClassName}--sort-${dirName}`
      );
    }
    cellProps.onResizeMouseDown = this.onResizeMouseDown.bind(this, cellProps);
    cellProps.onResizeTouchStart = this.onResizeTouchStart.bind(
      this,
      cellProps
    );

    return cellProps;
  }

  onMouseDown(event) {
    const props = this.getProps();
    const initialDOMProps = this.getInitialDOMProps();

    if (props.onMouseDown) {
      props.onMouseDown(props, event);
    }

    if (initialDOMProps.onMouseDown) {
      initialDOMProps.onMouseDown(event, props);
    }

    if (props.onCellMouseDown) {
      props.onCellMouseDown(event, props);
    }

    if (props.onDragRowMouseDown && props.id === REORDER_COLUMN_ID) {
      props.onDragRowMouseDown(event, props.rowIndex, this.domRef);
    }
    // event.preventDefault() // DO NOT prevent default,
    // since this makes keyboard navigation unusable because
    // the grid does not get focus any more
    // event.stopPropagation();
  }

  onContextMenu(event) {
    const props = this.getProps();
    const initialDOMProps = this.getInitialDOMProps();

    if (event.nativeEvent) {
      event.nativeEvent.__cellProps = props;
    }
    if (props.onContextMenu) {
      props.onContextMenu(event, props);
    }

    if (initialDOMProps.onContextMenu) {
      initialDOMProps.onContextMenu(event, props);
    }
  }

  onTouchStart(event) {
    const props = this.getProps();
    const initialDOMProps = this.getInitialDOMProps();

    if (props.onTouchStart) {
      props.onTouchStart(props, event);
    }

    if (initialDOMProps.onTouchStart) {
      initialDOMProps.onTouchStart(event, props);
    }

    if (props.onCellTouchStart) {
      props.onCellTouchStart(event, props);
    }
    if (props.onDragRowMouseDown && props.id === REORDER_COLUMN_ID) {
      props.onDragRowMouseDown(event, props.rowIndex, this.domRef);
    }
    // event.preventDefault() // DO NOT prevent default,
    // since this makes keyboard navigation unusable because
    // the grid does not get focus any more
    event.stopPropagation();
  }

  onResizeMouseDown(cellProps, event) {
    const props = this.getProps();

    if (props.onResizeMouseDown) {
      const node = this.getDOMNode();

      props.onResizeMouseDown(cellProps, {
        colHeaderNode: node,
        event,
      });
    }
  }

  onResizeTouchStart(cellProps, event) {
    const props = this.getProps();

    if (props.onResizeTouchStart) {
      props.onResizeTouchStart(cellProps, {
        colHeaderNode: this.getDOMNode(),
        event,
      });
    }
  }

  getDOMNode() {
    return this.domRef.current;
  }

  onClick(event) {
    const props = this.getProps();
    const initialDOMProps = this.getInitialDOMProps();
    if (props.onClick) {
      props.onClick(event, props);
    }
    if (initialDOMProps.onClick) {
      initialDOMProps.onClick(event, props);
    }

    if (!this.props.headerCell && props.onCellClick) {
      props.onCellClick(event, props);
    }

    if (!this.props.headerCell) {
      if (
        props.computedEditable &&
        !props.inEdit &&
        (props.editStartEvent === 'onClick' || props.editStartEvent === 'click')
      ) {
        this.startEdit();
      }

      return;
    }

    if (this.props.preventSortOnClick) {
      if (this.props.preventSortOnClick(event, props) === true) {
        return;
      }
    }

    if (!props.sortDelay || props.sortDelay < 1) {
      return this.onSortClick();
    }

    if (this.sortTimeoutId) {
      clearTimeout(this.sortTimeoutId);
      this.sortTimeoutId = null;
    }

    this.sortTimeoutId = setTimeout(() => {
      this.onSortClick();
      this.sortTimeoutId = null;
    }, parseInt(props.sortDelay, 10));

    return undefined;
  }

  onDoubleClick(event) {
    const props = this.getProps();
    const initialDOMProps = this.getInitialDOMProps();

    if (props.onDoubleClick) {
      props.onDoubleClick(event, props);
    }

    if (initialDOMProps.onDoubleClick) {
      initialDOMProps.onDoubleClick(event, props);
    }

    const { headerProps, headerCell } = props;

    if (!headerCell) {
      if (
        props.computedEditable &&
        !props.inEdit &&
        (props.editStartEvent === 'onDoubleClick' ||
          props.editStartEvent === 'dblclick' ||
          props.editStartEvent === 'doubleclick')
      ) {
        this.startEdit();
      }

      return;
    }

    if (headerProps && headerProps.onDoubleClick) {
      headerProps.onDoubleClick(event, props);
    }

    if (this.sortTimeoutId) {
      clearTimeout(this.sortTimeoutId);
      this.sortTimeoutId = null;
    }
  }

  getEditStartValue(props = this.getProps()) {
    if (typeof props.getEditStartValue == 'function') {
      return Promise.resolve(props.getEditStartValue(props.value, props));
    }
    return Promise.resolve(props.value);
  }

  onSortClick() {
    const props = this.getProps();

    if (props.headerCell && props.computedSortable) {
      if (props.onSortClick) {
        props.onSortClick(props);
      }
    }
  }

  // direction can be 1, -1 or null
  getSortTools(direction = null, cellProps) {
    const { computedSortable, renderSortTool: render } = this.getProps();
    return renderSortTool(
      { sortable: computedSortable, direction, renderSortTool: render },
      cellProps
    );
  }

  showFilterContextMenu(node) {
    if (this.props.showColumnFilterContextMenu) {
      this.props.showColumnFilterContextMenu(node, this.getProps());
    }
  }

  showContextMenu(menuTool, onHide) {
    if (this.props.showColumnContextMenu) {
      this.props.showColumnContextMenu(
        menuTool ? (menuTool.domRef ? menuTool.domRef.current : null) : null,
        this.getProps(),
        this,
        onHide
      );
    }
  }

  getProxyRegion() {
    const node = this.getDOMNode();

    const { computedResizable, computedFilterable } = this.getProps();

    return computedFilterable
      ? Region.from(node.firstChild)
      : Region.from(computedResizable ? node.firstChild : node);
  }

  renderGroupTool() {
    const props = this.getProps();
    const { rtl, collapsed, groupProps } = props;

    return renderGroupTool({
      render: groupProps.renderGroupTool,
      collapsed,
      rtl,
      size: 20,
      toggleGroup: this.toggleGroup,
    });
  }

  toggleGroup = event => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    const props = this.getProps();

    if (typeof props.onGroupToggle === 'function') {
      const { data } = props;
      props.onGroupToggle(data.keyPath, props, event);
    }
  };
}

InovuaDataGridCell.defaultProps = {
  cellDefaultClassName: cellBem(),
  headerCellDefaultClassName: headerBem(),
  computedMinWidth: 40,
  groupNestingSize: 10,
  treeNestingSize: 10,
  checkboxTabIndex: null,
  onSortClick: emptyFn,
  preventSortOnClick: event => {
    const target = event.target;

    return isFocusable(target);
  },
};

InovuaDataGridCell.propTypes = {
  computedAbsoluteIndex: PropTypes.number,
  checkboxTabIndex: PropTypes.number,
  cellActive: PropTypes.bool,
  cellClassName: PropTypes.string,
  cellDefaultClassName: PropTypes.string,
  cellDOMProps: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  computedCellMultiSelectionEnabled: PropTypes.bool,
  cellSelectable: PropTypes.bool,
  cellSelected: PropTypes.bool,
  checkboxColumn: PropTypes.any,
  collapsed: PropTypes.bool,
  computedColspan: PropTypes.number,
  computedRowspan: PropTypes.number,
  columnIndex: PropTypes.number,
  columnResizeHandleWidth: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  computedLocked: PropTypes.oneOf([false, 'start', 'end']),
  computedWidth: PropTypes.number,
  data: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.array]),
  defaultWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  depth: PropTypes.number,
  deselectAll: PropTypes.func,
  domProps: PropTypes.object,
  empty: PropTypes.bool,
  first: PropTypes.bool,
  firstInSection: PropTypes.bool,
  computedFlex: PropTypes.number,
  flex: PropTypes.number,
  group: PropTypes.string,
  computedGroupBy: PropTypes.any,
  groupCell: PropTypes.bool,
  groupSpacerColumn: PropTypes.bool,
  groupNestingSize: PropTypes.number,
  groupProps: PropTypes.object,
  hasBottomSelectedSibling: PropTypes.bool,
  hasLeftSelectedSibling: PropTypes.bool,
  hasLockedStart: PropTypes.bool,
  hasRightSelectedSibling: PropTypes.bool,
  hasTopSelectedSibling: PropTypes.bool,
  header: PropTypes.any,
  headerAlign: PropTypes.oneOf(['start', 'center', 'end']),
  headerCell: PropTypes.bool,
  headerCellDefaultClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  headerDOMProps: PropTypes.object,
  headerEllipsis: PropTypes.bool,
  headerHeight: PropTypes.number,
  headerProps: PropTypes.any,
  headerUserSelect: PropTypes.oneOf([true, false, 'text', 'none']),
  headerVerticalAlign: PropTypes.oneOf([
    'top',
    'middle',
    'center',
    'bottom',
    'start',
    'end',
  ]),
  headerWrapperClassName: PropTypes.string,
  hidden: PropTypes.bool,
  hideIntermediateState: PropTypes.bool,
  hideTransitionDuration: PropTypes.number,
  hiding: PropTypes.bool,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  inHideTransition: PropTypes.bool,
  inShowTransition: PropTypes.bool,
  inTransition: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  index: PropTypes.number,
  initialIndex: PropTypes.number,
  isColumn: PropTypes.bool,
  last: PropTypes.bool,
  lastInRange: PropTypes.bool,
  lastInSection: PropTypes.bool,
  lastRowInGroup: PropTypes.bool,
  lastUnlocked: PropTypes.bool,
  locked: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  computedMaxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  minWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  computedMinWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  minRowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  multiSelect: PropTypes.bool,
  name: PropTypes.string,
  nativeScroll: PropTypes.bool,
  nextBorderLeft: PropTypes.bool,
  noBackground: PropTypes.bool,
  onCellClick: PropTypes.func,
  onCellEnter: PropTypes.func,
  onCellMouseDown: PropTypes.func,
  preventSortOnClick: PropTypes.func,
  onCellSelectionDraggerMouseDown: PropTypes.func,
  onGroupToggle: PropTypes.func,
  onMount: PropTypes.func,
  onRender: PropTypes.func,
  onResizeMouseDown: PropTypes.func,
  onResizeTouchStart: PropTypes.func,
  onSortClick: PropTypes.func,
  onUnmount: PropTypes.func,
  prevBorderRight: PropTypes.bool,
  render: PropTypes.func,
  renderCheckbox: PropTypes.func,
  renderGroupTitle: PropTypes.func,
  renderHeader: PropTypes.func,
  renderSortTool: PropTypes.func,
  computedResizable: PropTypes.bool,
  lockable: PropTypes.bool,
  resizeProxyStyle: PropTypes.object,
  rowActive: PropTypes.bool,
  rowHeight: PropTypes.number,
  initialRowHeight: PropTypes.number,
  rowIndex: PropTypes.number,
  rowIndexInGroup: PropTypes.number,
  rowRenderIndex: PropTypes.number,
  rowSelected: PropTypes.bool,
  scrollbarWidth: PropTypes.number,
  indexInHeaderGroup: PropTypes.number,
  parentGroups: PropTypes.array,
  selectAll: PropTypes.func,
  selectedCount: PropTypes.number,
  selection: PropTypes.any,
  setRowSelected: PropTypes.func,
  setRowExpanded: PropTypes.func,
  toggleRowExpand: PropTypes.func,
  toggleNodeExpand: PropTypes.func,
  shouldComponentUpdate: PropTypes.func,
  showBorderBottom: PropTypes.bool,
  showBorderLeft: PropTypes.bool,
  showBorderRight: PropTypes.any,
  showBorderTop: PropTypes.bool,
  showColumnContextMenu: PropTypes.func,
  showColumnMenuSortOptions: PropTypes.bool,
  showColumnMenuFilterOptions: PropTypes.bool,
  showColumnMenuLockOptions: PropTypes.bool,
  showColumnMenuGroupOptions: PropTypes.bool,
  showTransitionDuration: PropTypes.number,
  sort: PropTypes.any,
  sortDelay: PropTypes.number,
  computedSortInfo: PropTypes.any,
  computedSortable: PropTypes.bool,
  textAlign: PropTypes.oneOf(['start', 'center', 'end']),
  textEllipsis: PropTypes.bool,
  textVerticalAlign: PropTypes.oneOf([
    'top',
    'middle',
    'center',
    'bottom',
    'start',
    'end',
  ]),
  titleClassName: PropTypes.string,
  tryRowCellEdit: PropTypes.func,
  totalCount: PropTypes.number,
  totalDataCount: PropTypes.number,
  unselectedCount: PropTypes.number,
  userSelect: PropTypes.oneOf([true, false, 'text', 'none']),
  value: PropTypes.any,
  virtualizeColumns: PropTypes.bool,
  visibilityTransitionDuration: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]),
  computedVisible: PropTypes.bool,
  computedVisibleCount: PropTypes.number,
  computedVisibleIndex: PropTypes.number,
  indexInColumns: PropTypes.number,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  editable: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),

  onEditStop: PropTypes.func,
  onEditStart: PropTypes.func,
  onEditCancel: PropTypes.func,
  onEditValueChange: PropTypes.func,
  onEditComplete: PropTypes.func,

  onEditStopForRow: PropTypes.func,
  onEditStartForRow: PropTypes.func,
  onEditCancelForRow: PropTypes.func,
  onEditValueChangeForRow: PropTypes.func,
  onEditCompleteForRow: PropTypes.func,

  onDragRowMouseDown: PropTypes.func,

  isRowExpandable: PropTypes.func,

  editorProps: PropTypes.any,
  editValue: PropTypes.any,
  Editor: PropTypes.func,
  renderEditor: PropTypes.func,
  zIndex: PropTypes.number,

  computedOffset: PropTypes.number,
  groupTitleCell: PropTypes.bool,
  groupExpandCell: PropTypes.bool,

  rendersInlineEditor: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),

  groupColumn: PropTypes.bool,
  treeColumn: PropTypes.bool,
  renderNodeTool: PropTypes.func,

  showInContextMenu: PropTypes.bool,
  naturalRowHeight: PropTypes.bool,

  rtl: PropTypes.bool,
  computedFilterable: PropTypes.bool,
  computedEditable: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  groupColumnVisible: PropTypes.bool,
  filterTypes: PropTypes.any,
  filterDelay: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  getFilterValue: PropTypes.func,
  onFilterValueChange: PropTypes.func,
  getEditStartValue: PropTypes.func,
  getEditCompleteValue: PropTypes.func,
  editStartEvent: PropTypes.string,
  setActiveIndex: PropTypes.func,

  renderColumnReorderProxy: PropTypes.func,
};
