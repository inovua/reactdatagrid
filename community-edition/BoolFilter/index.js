/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import CheckBox from '../packages/CheckBox';
import debounce from '../packages/debounce';
class BoolFilter extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = (checked) => {
            this.onValueChange(checked);
            this.setValue(checked);
        };
        this.UNSAFE_componentWillReceiveProps = (nextProps) => {
            if (nextProps.filterValue &&
                nextProps.filterValue.value !== this.state.value) {
                const value = nextProps.filterValue.value;
                this.setValue(value);
            }
        };
        this.setValue = (checked) => {
            this.setState({
                value: checked,
            });
        };
        this.onValueChange = (checked) => {
            this.props.onChange &&
                this.props.onChange({
                    ...this.props.filterValue,
                    value: checked,
                });
        };
        this.render = () => {
            const { readOnly, filterEditorProps } = this.props;
            const finalEditorProps = typeof filterEditorProps === 'function'
                ? filterEditorProps(this.props)
                : filterEditorProps;
            return (this.props.render &&
                this.props.render(React.createElement(CheckBox, Object.assign({}, finalEditorProps, { readOnly: readOnly, theme: this.props.theme, disabled: this.props.disabled, onChange: this.onChange, supportIndeterminate: true, indeterminateValue: null, className: "InovuaReactDataGrid__column-header__filter InovuaReactDataGrid__column-header__filter--bool", checked: this.state.value }))));
        };
        const { filterValue } = props;
        this.state = {
            value: filterValue ? filterValue.value : null,
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
}
export default BoolFilter;
