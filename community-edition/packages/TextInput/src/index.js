/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import autoBind from '../../../packages/react-class/autoBind';

import Field from '../../Field';

import join from '../../../common/join';
import cleanProps from '../../../common/cleanProps';

const preventDefault = e => e.preventDefault();

const getClearButtonClassNames = props => {
  const clearButtonClassName = join(
    `${props.rootClassName}__clear-button`,
    props.clearButtonClassName
  );

  return { clearButtonClassName };
};

const isControlled = props => props.value !== undefined;
const emptyObject = {};

class TextInput extends Component {
  constructor(props) {
    super(props);

    this.fieldRef = field => {
      this.field = field;
    };

    this.state = {
      focused: false,
      value: props.defaultValue == null ? '' : props.defaultValue,
    };

    autoBind(this);
  }

  handleChange(value, event) {
    this.setValue(value, event);
  }

  focus() {
    this.field.focus();
  }

  setValue(value, event) {
    if (!isControlled(this.props)) {
      this.setState({
        value,
      });
    }

    if (this.props.inputProps && this.props.inputProps.onChange) {
      this.props.inputProps.onChange(value, event);
    }

    if (this.props.onChange) {
      this.props.onChange(value, event);
    }
  }

  render() {
    const { props, state } = this;

    const { wrapperProps, style, enableClearButton } = props;

    const inputProps = props.inputProps || emptyObject;
    const inputClassName = join(
      `${props.rootClassName}__input`,
      inputProps.className
    );

    const value = isControlled(props) ? props.value : state.value;

    const fieldProps = {
      size: 1,
      ...inputProps,
      ref: this.fieldRef,
      className: inputClassName,
      onChange: this.handleChange,
      value,
      type: props.type,
      stopChangePropagation: props.stopChangePropagation,
    };

    if (props.hidden) {
      fieldProps.hidden = props.hidden;
    }
    if (props.name) {
      fieldProps.name = props.name;
    }
    if (props.placeholder) {
      fieldProps.placeholder = props.placeholder;
    }
    if (props.required) {
      fieldProps.required = props.required;
    }
    if (props.readOnly) {
      fieldProps.readOnly = props.readOnly;
    }
    if (props.autoFocus) {
      fieldProps.autoFocus = props.autoFocus;
    }
    if (props.maxLength != undefined) {
      fieldProps.maxLength = props.maxLength;
    }
    if (props.minLength != undefined) {
      fieldProps.minLength = props.minLength;
    }
    if (props.size != undefined) {
      fieldProps.size = props.size;
    }
    if (props.disabled) {
      fieldProps.disabled = props.disabled;
    }

    const className = join(
      props.rootClassName,
      props.className,
      props.rtl ? `${props.rootClassName}--rtl` : `${props.rootClassName}--ltr`,
      props.theme && `${props.rootClassName}--theme-${props.theme}`,
      enableClearButton && `${props.rootClassName}--enable-clear-button`,
      state.focused && `${props.rootClassName}--focused`,
      fieldProps.disabled && `${props.rootClassName}--disabled`
    );

    const input = <Field {...fieldProps} />;

    const wrapperDomProps = cleanProps(wrapperProps, TextInput.propTypes);
    const domProps = cleanProps(props, TextInput.propTypes);
    delete domProps.onChange;

    return (
      <div
        {...domProps}
        {...wrapperDomProps}
        className={className}
        style={style}
        onBlur={this.onBlur}
        onClick={this.onClick}
        onFocus={this.onFocus}
      >
        {input}
        {this.renderClearButtonWrapper(fieldProps)}
      </div>
    );
  }

  handleClearButtonClick(event) {
    event.preventDefault();

    this.setState({
      focused: true,
    });

    this.setValue('');

    this.focus();
  }

  renderClearButtonWrapper(fieldProps) {
    const { props, state } = this;
    const {
      clearButtonColor,
      clearButtonStyle,
      clearButtonSize,
      enableClearButton,
      rootClassName,
    } = props;
    const value = isControlled(props) ? props.value : state.value;
    const emptyValue = value == '' || value == null;
    const showButton =
      enableClearButton &&
      !emptyValue &&
      !fieldProps.disabled &&
      !fieldProps.readOnly;

    return (
      <div
        key="clearButton"
        className={join(
          `${rootClassName}__clear-button-wrapper`,
          !showButton && `${rootClassName}__clear-button-wrapper--hidden`
        )}
      >
        {this.renderClearButton({
          clearButtonColor,
          clearButtonStyle,
          clearButtonSize,
          ...getClearButtonClassNames(props),
        })}
      </div>
    );
  }

  renderClearButton(config) {
    const {
      clearButtonColor,
      clearButtonStyle,
      clearButtonClassName,
      clearButtonSize,
    } = config;

    const svgProps = {};
    const tabIndex = this.props.acceptClearToolFocus ? 0 : -1;

    if (clearButtonColor) {
      svgProps.fill = clearButtonColor;
    }

    if (clearButtonSize) {
      if (Array.isArray(clearButtonSize)) {
        svgProps.width = clearButtonSize[0];
        svgProps.height = clearButtonSize[1];
      } else {
        svgProps.width = clearButtonSize;
        svgProps.height = clearButtonSize;
      }
    }

    return (
      <button
        key="clearButton"
        onClick={this.handleClearButtonClick}
        onMouseDown={preventDefault}
        className={clearButtonClassName}
        style={{ ...clearButtonStyle }}
        tabIndex={tabIndex}
      >
        {this.renderClearIcon(svgProps)}
      </button>
    );
  }

  renderClearIcon = svgProps => {
    let result;

    if (
      this.props.renderClearIcon &&
      typeof this.props.renderClearIcon === 'function'
    ) {
      result = this.props.renderClearIcon({ ...svgProps });
    }

    if (result === undefined) {
      result = (
        <svg style={{ ...svgProps }} viewBox="0 0 10 10">
          <path
            fill="none"
            fillRule="evenodd"
            strokeLinecap="round"
            strokeWidth="1.33"
            d="M1 1l8 8m0-8L1 9"
          />
        </svg>
      );
    }

    return result;
  };

  onClick(event) {
    if (!this.state.focused) {
      this.focus();
    }
    if (this.props.wrapperProps && this.props.wrapperProps.onClick) {
      this.props.wrapperProps.onClick(event);
    }
  }

  onBlur(event) {
    this.setState({
      focused: false,
    });
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  }

  onFocus(event) {
    this.setState({
      focused: true,
    });
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  }
}

TextInput.defaultProps = {
  hidden: false,
  type: 'text',
  theme: 'default',
  rootClassName: 'inovua-react-toolkit-text-input',
  enableClearButton: true,
  clearButtonSize: 10,
  stopChangePropagation: true,
  acceptClearToolFocus: false,
};

TextInput.propTypes = {
  type: PropTypes.string,
  theme: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  autoFocus: PropTypes.bool,
  maxLength: PropTypes.number,
  size: PropTypes.number,
  minLength: PropTypes.number,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
  stopChangePropagation: PropTypes.bool,
  enableClearButton: PropTypes.bool,
  acceptClearToolFocus: PropTypes.bool,
  rtl: PropTypes.bool,
  rootClassName: PropTypes.string,
  //clearButton style
  clearButtonSize: PropTypes.number,
  clearButtonColor: PropTypes.string,
  clearButtonStyle: PropTypes.object,
  clearButtonClassName: PropTypes.string,
  renderClearIcon: PropTypes.func,
};

export default TextInput;
