/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component, createRef } from 'react';
import join from '@inovua/reactdatagrid-community/packages/join';
class DragRow extends Component {
    constructor(props) {
        super(props);
        this.render = () => {
            const { PROXY_CLASS_NAME } = this.props;
            const { visible, height } = this.state;
            const rowProxyClassName = join(PROXY_CLASS_NAME, visible ? `${PROXY_CLASS_NAME}--visible` : `${PROXY_CLASS_NAME}--hidden`);
            return (React.createElement("div", { ref: this.dragRowRef, style: { height }, className: rowProxyClassName }, this.renderRowReorderProxy()));
        };
        this.renderRowReorderProxy = () => {
            const { renderRowReorderProxy } = this.props;
            const { props, dragIndex } = this.state;
            if (!props) {
                return;
            }
            let result;
            if (renderRowReorderProxy && typeof renderRowReorderProxy === 'function') {
                const data = this.state.props &&
                    this.state.props.data &&
                    this.state.props.data[this.state.dragIndex];
                const dataSource = this.state.props &&
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
                    result = React.createElement("div", null, props.data[dragIndex][columnName]);
                }
            }
            return result;
        };
        this.getProps = () => {
            return this.state.props || this.props;
        };
        this.setVisible = (visible) => {
            if (visible !== this.state.visible) {
                this.setState({ visible });
            }
        };
        this.setTop = (top) => {
            const { offset } = this.state;
            if (this.dragRowRef && this.dragRowRef.current) {
                this.dragRowRef.current.style.top = `${offset + top}px`;
            }
        };
        this.setLeft = (left) => {
            if (this.dragRowRef && this.dragRowRef.current) {
                this.dragRowRef.current.style.left = `${left}px`;
            }
        };
        this.setHeight = (height) => {
            this.setState({ height });
        };
        this.setOffset = (height) => {
            this.setState({ offset: height });
        };
        this.setProps = (props) => {
            this.setState({ props });
        };
        this.setDragIndex = (index) => {
            this.setState({ dragIndex: index });
        };
        this.dragRowRef = createRef();
        this.state = {
            offset: 0,
            visible: false,
            props: null,
            height: 0,
            dragIndex: 0,
        };
    }
}
DragRow.defaultProps = {
    PROXY_CLASS_NAME: 'InovuaReactDataGrid__row-drag-proxy',
};
export default DragRow;
