/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Component from '../../../packages/react-class';
import assign from 'object-assign';
import join from '../../../join';
import shouldComponentUpdate from '../../../shouldComponentUpdate';

import Cell from '../Cell';
const emptyFn = () => {};

export default class GroupRow extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shouldComponentUpdate(this, nextProps, nextState);
  }

  render() {
    const props = this.props;

    const {
      data,
      rowHeight,
      minWidth,
      maxWidth,
      depth,
      groupNestingSize,
      onGroupToggle,
      collapsed,
      realIndex,
      indexInGroup,
      active,
      last,
    } = props;

    const lastInGroup = indexInGroup == props.parentGroupCount - 1;

    const className = join(
      'InovuaReactDataGrid__group-row',
      active && 'InovuaReactDataGrid__group-row--active',
      `InovuaReactDataGrid__group-row--depth-${depth}`,
      realIndex == 0 && 'InovuaReactDataGrid__group-row--first',
      collapsed && 'InovuaReactDataGrid__group-row--collapsed',
      indexInGroup == 0 && 'InovuaReactDataGrid__group-row--first-in-group',
      lastInGroup && 'InovuaReactDataGrid__group-row--last-in-group',
      last && 'InovuaReactDataGrid__group-row--last',
      props.className
    );

    const style = assign({}, props.style, { height: rowHeight, minWidth });

    if (maxWidth != null) {
      style.maxWidth = maxWidth;
    }

    const column = this.props.columns[0];
    const cellProps = {
      data,
      groupCell: true,
      minWidth,
      maxWidth,
      index: column.computedVisibleIndex,
      first: column.computedVisibleIndex == 0,
      last: this.props.columnGroupIndex == this.props.columnGroupCount - 1,
      groupNestingSize,
      collapsed,
      onGroupToggle,
      visibleIndex: column.computedVisibleIndex,
      value:
        column.computedVisibleIndex == 0 ? this.renderGroupTitle(props) : null,
      depth,
    };

    let cell;
    if (this.props.cellFactory) {
      cell = this.props.cellFactory(cellProps);
    }

    if (cell === undefined) {
      cell = <Cell {...cellProps} />;
    }

    return (
      <div
        className={className}
        style={style}
        id={null}
        data={null}
        onClick={this.onClick}
        {...props}
      >
        {cell}
      </div>
    );
  }

  onClick(event) {
    const props = this.props;

    props.onClick(event, props);
  }

  renderGroupTitle(props) {
    const data = props.data;

    if (props.renderGroupTitle) {
      return props.renderGroupTitle(props.data, props);
    }

    return data.value;
  }
}

GroupRow.defaultProps = { onClick: emptyFn };
