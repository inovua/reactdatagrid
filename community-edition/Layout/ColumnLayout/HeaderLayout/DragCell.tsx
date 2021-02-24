/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Cell from '../Cell';

export const MAX_WIDTH = 350;

type TypeProps = {
  className?: string;
  headerWrapperClassName?: string;
  maxWidth?: number;
  computedWidth: number;
};

type TypeState = {
  visible: boolean;
  props?: TypeProps;
};
export default class DragCell extends React.Component<TypeProps, TypeState> {
  private left?: number;
  private right?: number;
  private top?: number;
  private height?: number;
  private width?: number;

  constructor(props: TypeProps) {
    super(props);

    this.state = { visible: false };
  }

  getProps = () => {
    return this.state.props || this.props;
  };

  setProps = (props: TypeProps) => {
    this.setState({ props });
  };

  render() {
    if (this.state.visible) {
      const props = this.getProps();
      const className = props.className
        ? `${props.className} InovuaReactDataGrid__drag-proxy`
        : 'InovuaReactDataGrid__drag-proxy';

      const headerWrapperClassName = props.headerWrapperClassName
        ? `${props.headerWrapperClassName} InovuaReactDataGrid__drag-proxy`
        : 'InovuaReactDataGrid__drag-proxy';

      const maxWidth = props.maxWidth
        ? Math.min(props.maxWidth, MAX_WIDTH)
        : MAX_WIDTH;
      const computedWidth = Math.min(props.computedWidth, maxWidth);

      return (
        <Cell
          {...props}
          maxWidth={maxWidth}
          computedWidth={computedWidth}
          className={className}
          headerWrapperClassName={headerWrapperClassName}
          onMount={this.onCellMount}
          onUnmount={this.onCellUnmount}
        />
      );
    }

    return null;
  }

  onCellMount = (props, cell) => {
    if (this.left) {
      cell.setLeft(this.left);
    }
    if (this.right) {
      cell.setRight(this.right);
    }
    if (this.top) {
      cell.setTop(this.top);
    }
    if (this.height) {
      cell.setHeight(this.height);
    }
    if (this.width) {
      cell.setWidth(this.width);
    }
    cell.setDragging(true);
    this.cell = cell;
  };

  onCellUnmount = () => {
    this.cell = null;
  };

  setDragging = (visible, callback) => {
    if (!visible) {
      this.top = undefined;
      this.left = undefined;
      this.right = undefined;
      this.height = undefined;
      this.width = undefined;
    }
    this.setState({ visible }, () => {
      if (this.cell && visible) {
        this.cell.setDragging(visible, callback);
      }
    });
  };

  setTop = top => {
    this.top = top;
    if (this.cell && this.state.visible) {
      this.cell.setTop(top);
    }
  };

  setHeight = height => {
    this.height = height;
    if (this.cell && this.state.visible) {
      this.cell.setHeight(height);
    }
  };

  setWidth = width => {
    this.width = width;
    if (this.cell && this.state.visible) {
      this.cell.setWidth(width);
    }
  };

  setLeft = left => {
    this.left = left;
    if (this.cell && this.state.visible) {
      this.cell.setLeft(left);
    }
  };
  setRight = right => {
    this.right = right;
    if (this.cell && this.state.visible) {
      this.cell.setRight(right);
    }
  };
}
