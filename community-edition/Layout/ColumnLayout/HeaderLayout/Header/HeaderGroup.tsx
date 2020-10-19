/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { cloneElement, RefObject } from 'react';
import PropTypes from 'prop-types';
import Region from '../../../../packages/region';

import join from '../../../../packages/join';
import humanize from '../../../../utils/humanize';

import ColumnResizer from '../../Cell/ColumnResizer';

const emptyObject = Object.freeze ? Object.freeze({}) : {};

const BASE_CLASS_NAME = 'InovuaReactDataGrid__header-group__title';

const TOP_Z_INDEX = 10000;

const getHeader = (group = emptyObject) => {
  const { header, name } = group;

  if (header) {
    if (typeof header !== 'function') {
      return header;
    }

    return header(group);
  }

  return humanize(name || '');
};

export default class HeaderGroup extends React.Component {
  domRef:
    | string
    | ((instance: HTMLDivElement | null) => void)
    | RefObject<HTMLDivElement>
    | null
    | undefined;
  constructor(props) {
    super(props);

    this.state = { dragging: false };
    this.domRef = React.createRef();
  }

  setTop = top => {
    this.setState({ top });
  };

  setLeft = left => {
    this.setState({ left });
  };

  setRight = right => {
    this.setState({ right });
  };

  setHeight = height => {
    this.setState({ height });
  };

  setWidth = width => {
    this.setState({ width });
  };

  setDragging = (dragging, callback) => {
    const newState = { dragging };
    if (!dragging) {
      newState.top = 0;
      newState.left = 0;
      newState.width = 0;
      newState.height = 0;
    }

    this.setState(newState, callback);
  };

  prepareStyle = () => {
    const { state, props } = this;
    let style = props.style;

    if (props.group.style) {
      style = { ...style, ...props.group.style };
    }

    if (state.dragging) {
      style = Object.assign({}, style, { zIndex: TOP_Z_INDEX });
      if (this.props.rtl) {
        style.right = state.right || 0;
      } else {
        style.left = state.left || 0;
      }
      style.top = state.top || 0;
      style.height = state.height || '';
      style.width = state.width || '';
      style.position = 'absolute';
      style.overflow = 'hidden';
    }

    return style;
  };

  render() {
    const { props } = this;
    const {
      showBorderLeft,
      showBorderRight,
      resizable,
      children,
      group,
      dragging,
      depth,
      columnResizeHandleWidth,
      containsLastColumn,
      firstInSection,
      lastInSection,
      adjustResizer,
      locked,
      rtl,
      resizeProxyStyle,
    } = props;

    const style = this.prepareStyle();

    const resizerRight =
      containsLastColumn || adjustResizer || lastInSection
        ? 0
        : -props.columnResizeHandleWidth / 2;

    const header = getHeader(group);

    const { headerAlign } = group || emptyObject;

    const className = join(
      BASE_CLASS_NAME,
      firstInSection &&
        'InovuaReactDataGrid__header-group__title--first-in-section',
      `InovuaReactDataGrid__header-group__title--depth-${depth}`,
      group.headerClassName,
      `InovuaReactDataGrid__header-group__title--direction-${
        rtl ? 'rtl' : 'ltr'
      }`,

      showBorderLeft &&
        `InovuaReactDataGrid__header-group__title--show-border-${
          rtl ? 'right' : 'left'
        }`,
      showBorderRight &&
        `InovuaReactDataGrid__header-group__title--show-border-${
          rtl ? 'left' : 'right'
        }`,
      locked && `InovuaReactDataGrid__header-group__title--locked-${locked}`,
      dragging && `InovuaReactDataGrid__header-group__title--dragging`,
      containsLastColumn && 'InovuaReactDataGrid__header-group__title--last',
      !header ? 'InovuaReactDataGrid__header-group__title--empty' : null,
      `${BASE_CLASS_NAME}--align-${headerAlign || 'start'}`
    );

    const groupHeader =
      !header && !depth ? null : (
        <div style={group.headerStyle} className={className}>
          {header || '\u00a0'}
        </div>
      );

    let resizeHandleStyle;

    if (resizable) {
      resizeHandleStyle = { width: columnResizeHandleWidth };
      if (resizeProxyStyle) {
        resizeHandleStyle = Object.assign(
          {},
          resizeProxyStyle,
          resizeHandleStyle
        );
      }
    }

    const resizer = resizable ? (
      <ColumnResizer
        className="InovuaReactDataGrid__header-group-resizer"
        onMouseDown={this.onResizeMouseDown}
        onTouchStart={this.onResizeTouchStart}
        style={{
          width: columnResizeHandleWidth,
          [rtl ? 'left' : 'right']: resizerRight,
          [rtl ? 'right' : 'left']: 'unset',
          zIndex: depth * 10000 + (100 - this.props.firstIndex || 0),
        }}
        resizeHandleStyle={resizeHandleStyle}
        resizeHandleClassName="InovuaReactDataGrid__header-group-resize-handle"
      />
    ) : null;

    return (
      <div
        onMouseDown={this.onMouseDown}
        style={style}
        ref={this.domRef}
        className={join(
          props.className,
          'InovuaReactDataGrid__header-group',
          group.className,
          props.inTransition && 'InovuaReactDataGrid__header-group--transition',
          this.state.dragging && 'InovuaReactDataGrid__header-group--dragging'
        )}
      >
        {resizer}
        {groupHeader}
        <div className="InovuaReactDataGrid__header-group-cells">
          {children.map(this.renderChild)}
        </div>
      </div>
    );
  }

  getProxyRegion = () => {
    const node = this.domRef ? this.domRef.current : null;

    const region = Region.from(node);

    if (this.props.filterable) {
      const filterWrapper = node.querySelector(
        '.InovuaReactDataGrid__column-header__filter-wrapper'
      );
      if (filterWrapper) {
        region.setHeight(region.getHeight() - filterWrapper.offsetHeight);
      }
    }

    return region;
  };

  //@ts-ignore
  renderChild = (child, index) => {
    //@ts-ignore
    const extraProps = { parent: this, indexInHeaderGroup: index };

    const dragging = this.props.dragging || this.state.dragging;

    if (this.props.extraChildrenProps) {
      Object.assign(extraProps, this.props.extraChildrenProps);
    }
    if (dragging) {
      extraProps.dragging = dragging;
    }
    extraProps.key = index;
    return cloneElement(child, extraProps);
  };

  onResizeMouseDown = event => {
    if (this.props.onResizeMouseDown) {
      event.stopPropagation();
      this.props.onResizeMouseDown(this.props, this, event);
    }
  };

  onResizeTouchStart = event => {
    if (this.props.onResizeTouchStart) {
      event.stopPropagation();
      this.props.onResizeTouchStart(this.props, this, event);
    }
  };

  onMouseDown = event => {
    if (this.props.onMouseDown) {
      this.props.onMouseDown(event, this.props, this);
    }
  };
}

HeaderGroup.defaultProps = { isHeaderGroup: true };

HeaderGroup.propTypes = {
  columnResizeHandleWidth: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  group: PropTypes.shape({
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    headerClassName: PropTypes.string,
    headerStyle: PropTypes.object,
  }),
  depth: PropTypes.number.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  children: PropTypes.node,
  extraChildrenProps: PropTypes.object,
  containsLastColumn: PropTypes.bool,
  lastInSection: PropTypes.bool,
  filterable: PropTypes.bool,
  onResizeMouseDown: PropTypes.func,
  onResizeTouchStart: PropTypes.func,
  parentGroups: PropTypes.array,
  showBorderLeft: PropTypes.bool,
  showBorderRight: PropTypes.bool,
  siblingCount: PropTypes.number,
  siblingIndex: PropTypes.number,
};
