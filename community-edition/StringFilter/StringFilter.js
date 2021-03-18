/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import TextInput from '../packages/TextInput';
import debounce from '../packages/debounce';
export default class StringFilter extends React.Component {
    constructor(props) {
        super(props);
        this.renderClearIcon = ({ width, height }) => {
            return (React.createElement("svg", { style: { width, height }, viewBox: "0 0 10 10" },
                React.createElement("path", { fill: "none", fillRule: "evenodd", strokeLinecap: "round", strokeWidth: "1.33", d: "M1 1l8 8m0-8L1 9" })));
        };
        const { filterValue } = props;
        this.state = {
            value: filterValue ? filterValue.value || '' : '',
        };
        this.onChange = this.onChange.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
        if (props.filterDelay && props.filterDelay >= 1) {
            this.onValueChange = debounce(this.onValueChange, props.filterDelay, {
                leading: false,
                trailing: true,
            });
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.filterValue &&
            nextProps.filterValue.value !== this.state.value) {
            this.setValue(nextProps.filterValue.value);
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
    onValueChange(value) {
        this.props.onChange({
            ...this.props.filterValue,
            value,
        });
    }
    render() {
        let { filterValue, readOnly, disabled, style, rtl, theme } = this.props;
        const inputProps = {
            readOnly,
            disabled,
            theme,
            rtl,
            style: {
                minWidth: 0,
                ...style,
            },
        };
        let filterEditorProps;
        if (filterValue) {
            filterEditorProps = filterValue.filterEditorProps;
            inputProps.value = this.state.value;
        }
        return this.props.render(React.createElement(TextInput, Object.assign({}, filterEditorProps, { type: "text", onChange: this.onChange, renderClearIcon: this.renderClearIcon, className: "InovuaReactDataGrid__column-header__filter InovuaReactDataGrid__column-header__filter--string" }, inputProps)));
    }
}
