/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import GroupItem from './GroupToolbar/GroupToolbarItem';
export default class DragGroupItem extends React.Component {
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
                if (this.groupItem && visible) {
                    this.groupItem.setDragging(visible, callback);
                    if (this.top !== undefined) {
                        this.groupItem.setTop(this.top);
                    }
                    if (this.left !== undefined) {
                        this.groupItem.setLeft(this.left);
                    }
                    if (this.right !== undefined) {
                        this.groupItem.setRight(this.right);
                    }
                    if (this.height !== undefined) {
                        this.groupItem.setHeight(this.height);
                    }
                    if (this.width !== undefined) {
                        this.groupItem.setWidth(this.width);
                    }
                }
            });
        };
        this.setHeight = height => {
            this.height = height;
            if (this.groupItem && this.state.visible) {
                this.groupItem.setHeight(height);
            }
        };
        this.setWidth = width => {
            this.width = width;
            if (this.groupItem && this.state.visible) {
                this.groupItem.setWidth(width);
            }
        };
        this.setTop = top => {
            this.top = top;
            if (this.groupItem && this.state.visible) {
                this.groupItem.setTop(top);
            }
        };
        this.setLeft = left => {
            this.left = left;
            if (this.groupItem && this.state.visible) {
                this.groupItem.setLeft(left);
            }
        };
        this.setRight = right => {
            this.right = right;
            if (this.groupItem && this.state.visible) {
                this.groupItem.setRight(right);
            }
        };
        this.refGroupItem = item => {
            this.groupItem = item;
        };
        this.state = { visible: false };
    }
    render() {
        if (this.state.visible) {
            const props = this.getProps();
            const className = props.className
                ? `${props.className} InovuaReactDataGrid__drag-proxy`
                : 'InovuaReactDataGrid__drag-proxy';
            return (React.createElement(GroupItem, Object.assign({}, props, { className: className, ref: this.refGroupItem })));
        }
        return null;
    }
}
