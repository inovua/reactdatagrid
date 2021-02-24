/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component, createRef } from 'react';
import join from '@inovua/reactdatagrid-community/packages/join';
class DragRowArrow extends Component {
    constructor(props) {
        super(props);
        this.setTop = (top) => {
            if (this.dragRowArrowRef && this.dragRowArrowRef.current) {
                this.dragRowArrowRef.current.style.top = `${top + this.state.offset}px`;
            }
        };
        this.setHeight = (height) => {
            if (height !== this.state.height) {
                this.setState({ height });
            }
        };
        this.setLeft = (left) => {
            if (left !== this.state.left) {
                this.setState({ left });
            }
        };
        this.setOffset = (offset) => {
            this.setState({ offset });
        };
        this.setVisible = (visible) => {
            if (visible !== this.state.visible) {
                this.setState({ visible });
            }
        };
        this.setValid = (isValid) => {
            if (isValid !== this.state.isValid) {
                this.setState({ isValid });
            }
        };
        this.render = () => {
            const className = join('InovuaReactDataGrid__row-reorder-arrow', this.state.isValid
                ? 'InovuaReactDataGrid__row-reorder-arrow--valid'
                : 'InovuaReactDataGrid__row-reorder-arrow--invalid');
            return (React.createElement("div", { ref: this.dragRowArrowRef, className: className, style: {
                    pointerEvents: 'none',
                    position: 'absolute',
                    height: 3,
                    width: 40,
                    left: this.state.left,
                    opacity: this.state.visible ? 1 : 0,
                    zIndex: 99,
                } }));
        };
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
}
export default DragRowArrow;
