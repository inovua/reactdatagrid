/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, createRef, RefObject } from 'react';

import join from '@inovua/reactdatagrid-community/packages/join';

type Props = {
  visible?: boolean;
  PROXY_CLASS_NAME: String;
  renderRowReorderProxy: Function;
};

type State = {
  visible: boolean;
  offset: number;
  dragIndex: number;
  height: number;
  props: any;
};

class DragRow extends Component<Props, State> {
  private dragRowRef: RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);

    this.dragRowRef = createRef();

    this.state = {
      offset: 0,
      visible: false,
      props: null,
      height: 0,
      dragIndex: 0,
    };
  }

  render = () => {
    const { PROXY_CLASS_NAME } = this.props;
    const { visible, height } = this.state;

    const rowProxyClassName = join(
      PROXY_CLASS_NAME,
      visible ? `${PROXY_CLASS_NAME}--visible` : `${PROXY_CLASS_NAME}--hidden`
    );

    return (
      <div
        ref={this.dragRowRef}
        style={{ height }}
        className={rowProxyClassName}
      >
        {this.renderRowReorderProxy()}
      </div>
    );
  };

  renderRowReorderProxy = () => {
    const { renderRowReorderProxy } = this.props;
    const { props, dragIndex } = this.state;

    if (!props) {
      return;
    }

    let result;

    if (renderRowReorderProxy && typeof renderRowReorderProxy === 'function') {
      const data =
        this.state.props &&
        this.state.props.data &&
        this.state.props.data[this.state.dragIndex];
      const dataSource =
        this.state.props &&
        this.state.props.dataSource &&
        this.state.props.dataSource[this.state.dragIndex];
      result = renderRowReorderProxy({
        data,
        dataSource,
        dragRowIndex: this.state.dragIndex,
      });
    }

    if (result === undefined) {
      if (props) {
        const columns = props.columns;
        const firstColumn = columns && columns[0];
        const columnName = firstColumn.name;

        result = <div>{props.data[dragIndex][columnName]}</div>;
      }
    }

    return result;
  };

  getProps = () => {
    return this.state.props || this.props;
  };

  setVisible = (visible: boolean) => {
    if (visible !== this.state.visible) {
      this.setState({ visible });
    }
  };

  setTop = (top: number) => {
    const { offset } = this.state;

    if (this.dragRowRef && this.dragRowRef.current) {
      this.dragRowRef.current.style.top = `${offset + top}px`;
    }
  };

  setLeft = (left: number) => {
    if (this.dragRowRef && this.dragRowRef.current) {
      this.dragRowRef.current.style.left = `${left}px`;
    }
  };

  setHeight = (height: number) => {
    this.setState({ height });
  };

  setOffset = (height: number) => {
    this.setState({ offset: height });
  };

  setProps = (props: any) => {
    this.setState({ props });
  };

  setDragIndex = (index: number) => {
    this.setState({ dragIndex: index });
  };

  static defaultProps = ({
    PROXY_CLASS_NAME: 'InovuaReactDataGrid__row-drag-proxy',
  } as unknown) as Props;
}

export default DragRow;
