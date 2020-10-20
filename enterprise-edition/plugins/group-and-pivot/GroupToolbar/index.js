/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import cleanProps from '@inovua/reactdatagrid-community/packages/react-clean-props';
import join from '@inovua/reactdatagrid-community/packages/join';
import GroupItem from './GroupToolbarItem';
export default class GroupToolbar extends React.Component {
    constructor(props) {
        super(props);
        this.renderItem = (column, name, index) => {
            if (!column) {
                return null;
            }
            let dragThis;
            let style;
            const { dragging, shifted = [] } = this.state;
            if (shifted[index] != null) {
                style = { position: 'relative', left: shifted[index] };
            }
            if (dragging) {
                const { dragIndex, left: diff } = dragging;
                if (index == dragIndex) {
                    dragThis = true;
                    style = { position: 'relative', left: diff, zIndex: 10 };
                }
            }
            const groupItem = (React.createElement(GroupItem, { index: index, rtl: this.props.rtl, dragging: dragThis, style: style, renderGroupItem: this.props.renderGroupItem, theme: this.props.theme, renderSortTool: this.props.renderSortTool, onMouseDown: this.props.onItemMouseDown.bind(this, column, index), key: column.id || column.name || index, column: column, onSortClick: this.props.onSortClick, onClear: this.onClear.bind(this, column, name), ref: this.refGroupItem.bind(this, column) }));
            if (this.state.insertIndex == index) {
                return [this.renderArrow(), groupItem];
            }
            return groupItem;
        };
        this.renderArrow = () => {
            return (React.createElement("div", { className: "InovuaReactDataGrid__group-toolbar-insert-arrow", style: { height: this.state.arrowHeight } }));
        };
        this.setGroupBy = groupBy => {
            if (this.props.onGroupByChange &&
                JSON.stringify(groupBy) != JSON.stringify(this.props.groupBy)) {
                this.props.onGroupByChange(groupBy);
            }
        };
        this.onClear = (column, name) => {
            const groupBy = this.p.groupBy;
            if (Array.isArray(groupBy)) {
                const index = groupBy.indexOf(name);
                if (index == -1) {
                    return;
                }
                this.setGroupBy([
                    ...groupBy.slice(0, index),
                    ...groupBy.slice(index + 1),
                ]);
            }
        };
        this.getCells = () => {
            const { columns, groupBy } = this.props;
            if (Array.isArray(groupBy) && groupBy.length) {
                return groupBy.map(name => this.groupItems[columns[name].id]);
            }
            return [];
        };
        this.state = {
            dragging: null,
            insertIndex: -1,
            groupBy: props.defaultGroupBy,
        };
        this.groupItems = {};
        this.refGroupItem = (column, groupItem) => {
            this.groupItems[column.id] = groupItem;
        };
        // needed for d&d
        this.domRef = createRef();
    }
    render() {
        const props = (this.p = Object.assign({}, this.props));
        props.groupBy = props.groupBy || this.state.groupBy;
        const { groupBy, theme, columns } = props;
        const className = join(props.className, 'InovuaReactDataGrid__group-toolbar', `InovuaReactDataGrid__group-toolbar--direction-${props.rtl ? 'rtl' : 'ltr'}`, `InovuaReactDataGrid__group-toolbar--theme-${theme}`);
        let content;
        if (Array.isArray(groupBy) && groupBy.length) {
            content = groupBy.map((name, index) => this.renderItem(columns[name], name, index));
        }
        else {
            content = (React.createElement(GroupItem, { theme: this.props.theme, rtl: this.props.rtl, placeholder: true, style: { cursor: 'auto' } }, this.props.placeholder));
        }
        const divProps = cleanProps(props, GroupToolbar.propTypes);
        return (React.createElement("div", Object.assign({ ref: this.domRef }, divProps, { className: className }),
            content,
            this.state.insertIndex == groupBy.length && this.renderArrow()));
    }
}
GroupToolbar.propTypes = {
    clearIcon: PropTypes.node,
    columns: PropTypes.object,
    groupBy: PropTypes.arrayOf(PropTypes.string),
    onGroupByChange: PropTypes.func.isRequired,
    renderGroupItem: PropTypes.func,
    onItemMouseDown: PropTypes.func,
    onSortClick: PropTypes.func,
    renderSortTool: PropTypes.func,
    placeholder: PropTypes.node,
    rtl: PropTypes.bool,
    theme: PropTypes.string,
};
GroupToolbar.defaultProps = {
    theme: 'default',
    placeholder: 'Drag header to group',
};
