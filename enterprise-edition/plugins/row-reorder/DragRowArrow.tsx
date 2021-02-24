/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, createRef, RefObject } from 'react';

import join from '@inovua/reactdatagrid-community/packages/join';

type Props = {
  rowHeight: number;
};

type State = {
  visible: boolean;
  top: number;
  left: number;
  offset: number;
  height: number;
  isValid: boolean;
};

class DragRowArrow extends Component<Props, State> {
  private dragRowArrowRef: RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);

    this.state = {
      visible: false,
      offset: 0,
      top: 0,
      left: 0,
      height: 0,
      isValid: true,
    };

    this.dragRowArrowRef = createRef();
  }

  setTop = (top: number) => {
    if (this.dragRowArrowRef && this.dragRowArrowRef.current) {
      this.dragRowArrowRef.current.style.top = `${top + this.state.offset}px`;
    }
  };

  setHeight = (height: number) => {
    if (height !== this.state.height) {
      this.setState({ height });
    }
  };

  setLeft = (left: number) => {
    if (left !== this.state.left) {
      this.setState({ left });
    }
  };

  setOffset = (offset: number) => {
    this.setState({ offset });
  };

  setVisible = (visible: boolean) => {
    if (visible !== this.state.visible) {
      this.setState({ visible });
    }
  };

  setValid = (isValid: boolean) => {
    if (isValid !== this.state.isValid) {
      this.setState({ isValid });
    }
  };

  render = () => {
    const className = join(
      'InovuaReactDataGrid__row-reorder-arrow',
      this.state.isValid
        ? 'InovuaReactDataGrid__row-reorder-arrow--valid'
        : 'InovuaReactDataGrid__row-reorder-arrow--invalid'
    );

    return (
      <div
        ref={this.dragRowArrowRef}
        className={className}
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          height: 3,
          width: 40,
          left: this.state.left,
          opacity: this.state.visible ? 1 : 0,
          zIndex: 99,
        }}
      ></div>
    );
  };
}

export default DragRowArrow;
