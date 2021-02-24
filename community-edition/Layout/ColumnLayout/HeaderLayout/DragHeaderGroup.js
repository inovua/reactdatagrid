/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import HeaderGroup from './Header/HeaderGroup';
const extraChildrenProps = { onUnmount: null, ref: null, dragging: true };
export default class DragHeaderGroup extends React.Component {
    constructor(props) {
        super(props);
        this.getProps = () => {
            return this.state.props || this.props;
        };
        this.setProps = props => {
            this.setState({ props });
        };
        this.setDragging = (visible, callback) => {
            if (!visible) {
                this.top = undefined;
                this.left = undefined;
                this.right = undefined;
                this.width = undefined;
                this.height = undefined;
            }
            this.setState({ visible }, () => {
                if (this.headerGroup && visible) {
                    this.headerGroup.setDragging(visible, callback);
                    if (this.top !== undefined) {
                        this.headerGroup.setTop(this.top);
                    }
                    if (this.left !== undefined) {
                        this.headerGroup.setLeft(this.left);
                    }
                    if (this.right !== undefined) {
                        this.headerGroup.setRight(this.right);
                    }
                    if (this.height !== undefined) {
                        this.headerGroup.setHeight(this.height);
                    }
                    if (this.width !== undefined) {
                        this.headerGroup.setWidth(this.width);
                    }
                }
            });
        };
        this.setHeight = height => {
            this.height = height;
            if (this.headerGroup && this.state.visible) {
                this.headerGroup.setHeight(height);
            }
        };
        this.setWidth = width => {
            this.width = width;
            if (this.headerGroup && this.state.visible) {
                this.headerGroup.setWidth(width);
            }
        };
        this.setTop = top => {
            this.top = top;
            if (this.headerGroup && this.state.visible) {
                this.headerGroup.setTop(top);
            }
        };
        this.setLeft = left => {
            this.left = left;
            if (this.headerGroup && this.state.visible) {
                this.headerGroup.setLeft(left);
            }
        };
        this.setRight = right => {
            this.right = right;
            if (this.headerGroup && this.state.visible) {
                this.headerGroup.setRight(right);
            }
        };
        this.refHeaderGroup = group => {
            this.headerGroup = group;
        };
        this.state = { visible: false };
    }
    render() {
        if (this.state.visible) {
            const props = this.getProps();
            const className = props.className
                ? `${props.className} InovuaReactDataGrid__drag-proxy`
                : 'InovuaReactDataGrid__drag-proxy';
            return (React.createElement(HeaderGroup, Object.assign({}, props, { dragging: true, extraChildrenProps: extraChildrenProps, className: className, ref: this.refHeaderGroup })));
        }
        return null;
    }
}
