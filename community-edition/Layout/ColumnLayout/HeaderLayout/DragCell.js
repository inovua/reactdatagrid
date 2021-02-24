/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import Cell from '../Cell';
export const MAX_WIDTH = 350;
export default class DragCell extends React.Component {
    constructor(props) {
        super(props);
        this.getProps = () => {
            return this.state.props || this.props;
        };
        this.setProps = (props) => {
            this.setState({ props });
        };
        this.onCellMount = (props, cell) => {
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
        this.onCellUnmount = () => {
            this.cell = null;
        };
        this.setDragging = (visible, callback) => {
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
        this.setTop = top => {
            this.top = top;
            if (this.cell && this.state.visible) {
                this.cell.setTop(top);
            }
        };
        this.setHeight = height => {
            this.height = height;
            if (this.cell && this.state.visible) {
                this.cell.setHeight(height);
            }
        };
        this.setWidth = width => {
            this.width = width;
            if (this.cell && this.state.visible) {
                this.cell.setWidth(width);
            }
        };
        this.setLeft = left => {
            this.left = left;
            if (this.cell && this.state.visible) {
                this.cell.setLeft(left);
            }
        };
        this.setRight = right => {
            this.right = right;
            if (this.cell && this.state.visible) {
                this.cell.setRight(right);
            }
        };
        this.state = { visible: false };
    }
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
            return (React.createElement(Cell, Object.assign({}, props, { maxWidth: maxWidth, computedWidth: computedWidth, className: className, headerWrapperClassName: headerWrapperClassName, onMount: this.onCellMount, onUnmount: this.onCellUnmount })));
        }
        return null;
    }
}
