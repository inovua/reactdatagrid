/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import debounce from '../packages/debounce';
import Combo from '../packages/ComboBox';
import ScrollContainer from '../packages/react-scroll-container-pro/src';
const renderScroller = props => {
    delete props.tabIndex;
    return (React.createElement("div", Object.assign({}, props, { className: `${props.className} InovuaReactDataGrid__column-header__filter--select__scroller` })));
};
const renderListScroller = props => {
    return (React.createElement(ScrollContainer, Object.assign({}, props, { applyCSSContainOnScroll: false, renderScroller: renderScroller, viewStyle: { width: '100%' } })));
};
const stopPropagation = e => e.stopPropagation();
export default class SelectFilter extends React.Component {
    constructor(props) {
        super(props);
        const { filterValue } = props;
        this.state = {
            value: filterValue ? filterValue.value || null : null,
        };
        this.onChange = this.onChange.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
        if (props.filterDelay && props.filterDelay >= 1) {
            this.onValueChange = debounce(this.onValueChange, props.filterDelay);
        }
    }
    onChange(value) {
        this.onValueChange(value);
        this.setValue(value);
    }
    setValue(value) {
        this.setState({
            value,
        });
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.filterValue &&
            nextProps.filterValue.value !== this.state.value) {
            this.setValue(nextProps.filterValue.value);
        }
    }
    onValueChange(value) {
        this.props.onChange({
            ...this.props.filterValue,
            value,
        });
    }
    render() {
        let { filterValue, readOnly, disabled, style, nativeScroll, filterEditorProps, rtl, theme, } = this.props;
        const comboProps = {
            readOnly,
            disabled,
            theme,
            rtl,
            style: {
                minWidth: 0,
                ...style,
            },
        };
        if (filterValue) {
            comboProps.value = this.state.value;
        }
        const finalEditorProps = typeof filterEditorProps === 'function'
            ? filterEditorProps(this.props)
            : filterEditorProps;
        const finalProps = {
            collapseOnSelect: true,
            renderListScroller: nativeScroll ? undefined : renderListScroller,
            dataSource: filterValue.dataSource ? filterValue.dataSource : [],
            ...finalEditorProps,
            onChange: this.onChange,
            className: 'InovuaReactDataGrid__column-header__filter InovuaReactDataGrid__column-header__filter--select',
            ...comboProps,
        };
        const onKeyDown = finalProps.onKeyDown;
        finalProps.onKeyDown = e => {
            if (onKeyDown) {
                onKeyDown(e);
            }
            stopPropagation(e);
        };
        return this.props.render(React.createElement(Combo, Object.assign({}, finalProps)));
    }
}
SelectFilter.defaultProps = {
    nativeScroll: false,
};
