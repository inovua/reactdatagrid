/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import cleanProps from '@inovua/reactdatagrid-community/packages/react-clean-props';

import renderSortTool from '@inovua/reactdatagrid-community/Layout/ColumnLayout/Cell/renderSortTool';
import join from '@inovua/reactdatagrid-community/packages/join';

import humanize from '@inovua/reactdatagrid-community/utils/humanize';

const ICON_SIZE = 10;
const SORT_ICON_SIZE = 10;

const getItemContent = column => {
  const { header, name, groupHeader } = column;

  if (groupHeader !== undefined) {
    if (typeof groupHeader !== 'function') {
      return groupHeader;
    }

    return groupHeader(column);
  }

  if (header !== undefined) {
    if (typeof header !== 'function') {
      return header;
    }

    return header(column, {
      column,
      group: true,
      headerProps: undefined,
      cellProps: undefined,
      contextMenu: undefined,
    });
  }

  return humanize(name || '');
};

const emptyObject = {};

export default class GroupToolbarItem extends React.Component {
  domRef: React.RefObject<HTMLDivElement>;

  constructor(props) {
    super(props);

    this.state = { dragging: false };

    // needed for d&d
    this.domRef = createRef();
  }
  render() {
    const { props, state } = this;
    const column = props.column || emptyObject;
    const { computedSortable: sortable } = column;

    const dragging = props.dragging || state.dragging;

    const className = join(
      props.className,
      'InovuaReactDataGrid__group-toolbar-item',
      dragging && 'InovuaReactDataGrid__group-toolbar-item--dragging',
      `InovuaReactDataGrid__group-toolbar-item--direction-${
        this.props.rtl ? 'rtl' : 'ltr'
      }`,
      sortable && 'InovuaReactDataGrid__group-toolbar-item--sortable',
      props.placeholder &&
        'InovuaReactDataGrid__group-toolbar-item--placeholder',
      `InovuaReactDataGrid__group-toolbar-item--theme-${props.theme}`
    );

    const divProps = cleanProps(props, GroupToolbarItem.propTypes);

    const onClick = sortable ? this.onSortClick : null;

    const children = props.placeholder
      ? props.children
      : getItemContent(column);

    const style = dragging
      ? {
          top: state.top || 0,
          [this.props.rtl ? 'right' : 'left']: this.props.rtl
            ? state.right || 0
            : state.left || 0,
          height: state.height || 0,
        }
      : {};

    const domProps = {
      ...divProps,
      ref: this.domRef,
      style: { ...props.style, ...style },
      className,
      onClick,
      children: [children, this.renderSortTool(), this.renderClearIcon()],
    };

    let result;
    if (this.props.renderGroupItem) {
      result = this.props.renderGroupItem(domProps, {
        column,
        onClear: this.onClear,
      });
    }

    if (result === undefined) {
      result = <div {...domProps} />;
    }

    return result;
  }

  onSortClick = () => {
    if (this.dragging) {
      return;
    }

    if (this.props.onSortClick) {
      this.props.onSortClick(this.props.column);
    }
  };

  renderSortTool = () => {
    const column = this.props.column || emptyObject;

    const { computedSortable: sortable } = column;
    const { dir: direction } = column.computedSortInfo || emptyObject;
    const render = column.renderSortTool || this.props.renderSortTool;

    return renderSortTool(
      {
        sortable,
        direction,
        renderSortTool: render,
        size: SORT_ICON_SIZE,
      },
      { ...column, groupToolbarItem: true }
    );
  };

  renderClearIcon = () => {
    const { clearIcon, placeholder } = this.props;
    const column = this.props.column || emptyObject;
    const { computedSortable: sortable } = column;
    const dragging = this.state.dragging || this.props.dragging;

    if (!clearIcon) {
      return null;
    }

    let style = clearIcon.props ? clearIcon.props.style : null;

    if (dragging || placeholder) {
      style = Object.assign({}, style, { visibility: 'hidden' });
    }

    return (
      <div
        key="clearTool"
        onClick={this.onClear}
        style={style}
        className={join(
          clearIcon.props && clearIcon.props.className,
          'InovuaReactDataGrid__group-toolbar-item__clear-icon',
          !sortable &&
            'InovuaReactDataGrid__group-toolbar-item__clear-icon-no-sortable'
        )}
      >
        {clearIcon}
      </div>
    );
  };

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
    this.setState({ dragging }, callback);
  };

  onClear = event => {
    event.stopPropagation();
    setTimeout(() => {
      this.props.onClear(event);
    });
  };

  getVisibleIndex = () => {
    return this.props.column.computedVisibleIndex;
  };
}

GroupToolbarItem.propTypes = {
  clearIcon: PropTypes.node,
  dragging: PropTypes.bool,
  onClear: PropTypes.func,
  placeholder: PropTypes.bool,
  rtl: PropTypes.bool,
  renderSortTool: PropTypes.func,
  theme: PropTypes.string,
  index: PropTypes.number,
  onSortClick: PropTypes.func,
  renderGroupItem: PropTypes.func,
  column: PropTypes.object,
};

GroupToolbarItem.defaultProps = {
  clearIcon: (
    <svg height={ICON_SIZE} width={ICON_SIZE} viewBox="0 0 10 10">
      <path
        fill="none"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeWidth="1.33"
        d="M1 1l8 8m0-8L1 9"
      />
    </svg>
  ),
};
