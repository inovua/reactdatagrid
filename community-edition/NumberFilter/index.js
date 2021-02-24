/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import NumericInput from '../packages/NumericInput';
import debounce from 'lodash.debounce';

export default class NumberFilter extends React.Component {
  constructor(props) {
    super(props);

    this.refInput = i => {
      this.input = i;
    };
    this.state = {
      value: props.filterValue ? props.filterValue.value || '' : '',
    };

    this.onChange = this.onChange.bind(this);
    this.onStartChange = this.onStartChange.bind(this);
    this.onEndChange = this.onEndChange.bind(this);
    this.onValueChange = this.onValueChange.bind(this);

    const filterDelay = props.filterDelay;
    if (filterDelay && filterDelay >= 1) {
      this.onValueChange = debounce(this.onValueChange, filterDelay, {
        leading: false,
        trailing: true,
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.filterValue.value !== nextProps.filterValue.value) {
      // When we change operators from unary to binary and vice versa
      // we have to reset the value, and i pass this new value to NumberFilter state
      this.setValue(nextProps.filterValue.value);
    }
    if (
      nextProps.filterValue &&
      nextProps.filterValue.value !== this.state.value
    ) {
      this.setValue(nextProps.filterValue.value);
    }
  }

  onChange(value) {
    if (value === this.state.value) {
      return;
    }
    this.onValueChange(value);

    this.setValue(value);
  }

  onStartChange(start) {
    if (this.state.value) {
      if (this.state.value.start && start === this.state.value.start) {
        return;
      }
    }
    const newValue = { ...this.state.value, start };
    this.onValueChange(newValue);
    this.setValue(newValue);
  }

  onEndChange(end) {
    if (this.state.value) {
      if (this.state.value.end && end === this.state.value.end) {
        return;
      }
    }
    const newValue = { ...this.state.value, end };
    this.onValueChange(newValue);
    this.setValue(newValue);
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
    let { filterValue, i18n, filterEditorProps } = this.props;
    const { readOnly, disabled, theme } = this.props;

    if (filterEditorProps == null) {
      filterEditorProps = filterValue.filterEditorProps;
    }

    const inputProps = {
      readOnly,
      disabled,
      theme,
      style: {
        minWidth: 0,
      },
    };

    if (filterValue) {
      inputProps.value = this.state.value;
    }

    switch (filterValue.operator) {
      case 'inrange':
      case 'notinrange':
        const { start, end } = this.state.value || { start: '', end: '' },
          startInputProps = { ...inputProps, value: start },
          endInputProps = { ...inputProps, value: end };

        const startFilterEditorProps =
          typeof filterEditorProps === 'function'
            ? filterEditorProps(this.props, {
                value: start,
                index: 0,
              })
            : filterEditorProps;
        const endFilterEditorProps =
          typeof filterEditorProps === 'function'
            ? filterEditorProps(this.props, { value: end, index: 1 })
            : filterEditorProps;

        const startProps = {
          placeholder: i18n('start'),
          ...startFilterEditorProps,
          ref: this.refInput,
          onChange: this.onStartChange,
          className:
            'InovuaReactDataGrid__column-header__filter InovuaReactDataGrid__column-header__filter--number',
          ...startInputProps,
        };

        const endProps = {
          placeholder: i18n('end'),
          ...endFilterEditorProps,
          ref: this.refInput,
          onChange: this.onEndChange,
          className:
            'InovuaReactDataGrid__column-header__filter InovuaReactDataGrid__column-header__filter--number',
          ...endInputProps,
        };
        return this.props.render(
          <div style={{ display: 'flex' }}>
            <NumericInput {...startProps} />
            <div className="InovuaReactDataGrid__column-header__filter__binary_operator_separator" />
            <NumericInput {...endProps} />
          </div>
        );

      default:
        const finalEditorProps =
          typeof filterEditorProps === 'function'
            ? filterEditorProps(this.props, {
                value: this.state.value,
              })
            : filterEditorProps;

        const finalProps = {
          ...finalEditorProps,
          ref: this.refInput,
          onChange: this.onChange,
          arrowSize: 10,
          className:
            'InovuaReactDataGrid__column-header__filter InovuaReactDataGrid__column-header__filter--number',
          ...inputProps,
        };

        return this.props.render(<NumericInput {...finalProps} />);
    }
  }
}
