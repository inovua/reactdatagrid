/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { autoBind } from '../../../packages/react-class';
import uglified from '../../../packages/uglified';

import cleanProps from '../../../common/cleanProps';
import assign from '../../../common/assign';
import join from '../../../common/join';

import getClassNames from './utils/getClassNames';

import { checkedIcon, uncheckedIcon, indeterminateIcon } from './icons';

const stopPropagation = e => e.stopPropagation();

const isValidCheckValue = (value, props) =>
  value === props.checkedValue ||
  value === props.uncheckedValue ||
  (value === props.indeterminateValue && props.supportIndeterminate);

const nextValue = (oldValue, props) => {
  if (oldValue === props.checkedValue) {
    // checked -> unchecked
    return props.uncheckedValue;
  }

  if (oldValue === props.uncheckedValue) {
    // unchecked -> indeterminate (if supported, otherwise to checked)
    return props.supportIndeterminate
      ? props.indeterminateValue
      : props.checkedValue;
  }

  if (props.supportIndeterminate && oldValue === props.indeterminateValue) {
    // indeterminate -> checked
    return props.checkedValue;
  }

  return props.uncheckedValue;
};

const getComponentStyle = (props, state) => {
  const { focused } = state;
  const {
    disabled,
    focusedStyle,
    disabledStyle,
    readOnly,
    readOnlyStyle,
    style,
  } = props;

  const styles = [style || {}];

  if (focused) {
    styles.push(focusedStyle);
  }

  if (disabled) {
    styles.push(disabledStyle);
  }

  if (readOnly) {
    styles.push(readOnlyStyle);
  }

  return assign({}, ...styles);
};

const getComputedIconStyle = config => {
  const {
    focused,
    disabled,
    focusedIconStyle,
    disabledIconStyle,
    iconStyle,
  } = config;
  const styles = [iconStyle];

  styles.push(getIconSizeStyle(config));

  if (focused) {
    styles.push(focusedIconStyle);
  }

  if (disabled) {
    styles.push(disabledIconStyle);
  }

  return assign({}, ...styles);
};

const getIconClassName = props => {
  let iconClassName = '';

  if (props.iconClassName) {
    iconClassName = props.iconClassName;
  }
  if (props.disabled && props.disabledIconClassName) {
    iconClassName = join(iconClassName, props.disabledIconClassName);
  }
  if (props.focused && props.focusedIconClassName) {
    iconClassName = join(iconClassName, props.focusedIconClassName);
  }
  if (props.readOnly && props.readOnlyIconClassName) {
    iconClassName = join(iconClassName, props.readOnlyIconClassName);
  }

  return iconClassName;
};

const renderIconFunctionOrJSX = (iconRender, props, { style, className }) => {
  if (typeof iconRender === 'function') {
    return iconRender({ style, className }, props);
  }

  // default style has width and height set to 24
  return React.cloneElement(iconRender, {
    style: {
      ...iconRender.props.style,
      ...style,
    },
    className: join(iconRender.props.className, className),
  });
};

const renderCheckedIcon = (props, iconProps) => {
  const { checkedIcon, checkedIconSrc } = props;

  if (checkedIconSrc) {
    return <img {...iconProps} src={checkedIconSrc} />;
  }

  return renderIconFunctionOrJSX(checkedIcon, props, iconProps);
};

const renderUncheckedIcon = (props, iconProps) => {
  const { uncheckedIcon, uncheckedIconSrc } = props;

  if (uncheckedIconSrc) {
    return <img {...iconProps} src={uncheckedIconSrc} />;
  }

  return renderIconFunctionOrJSX(uncheckedIcon, props, iconProps);
};

const renderIndeterminateIcon = (props, iconProps) => {
  const { indeterminateIcon, indeterminateIconSrc } = props;

  if (indeterminateIconSrc) {
    return <img {...iconProps} src={indeterminateIconSrc} />;
  }

  return renderIconFunctionOrJSX(indeterminateIcon, props, iconProps);
};

const renderIcon = config => {
  const checkedDescriptor = getCheckedDescriptor(config.checked, config);
  const checkBoxIconStyle = getComputedIconStyle(config);

  const iconProps = {
    className: getIconClassName(config),
    style: checkBoxIconStyle,
  };

  switch (checkedDescriptor) {
    case CHECKED_STATE:
      return renderCheckedIcon(config, iconProps);

    case UNCHECKED_STATE:
      return renderUncheckedIcon(config, iconProps);

    case INDETERMINATE_STATE:
      return renderIndeterminateIcon(config, iconProps);
  }
};

const getIconSizeStyle = props => {
  const style = {};
  const { iconSize } = props;

  if (Array.isArray(iconSize)) {
    style.width = iconSize[0];
    style.height = iconSize[1];
  } else {
    style.width = style.height = iconSize;
  }

  return style;
};

const CHECKED_STATE = 'checked';
const UNCHECKED_STATE = 'unchecked';
const INDETERMINATE_STATE = 'indeterminate';

const getCheckedDescriptor = (checked, props) => {
  const { checkedValue, supportIndeterminate, indeterminateValue } = props;

  if (checked === checkedValue) {
    return CHECKED_STATE;
  }

  if (supportIndeterminate && checked === indeterminateValue) {
    return INDETERMINATE_STATE;
  }

  return UNCHECKED_STATE;
};

const renderHiddenInput = props => {
  const { withHiddenInput, name } = props;
  let { checked } = props;
  const checkedDescriptor = getCheckedDescriptor(checked, props);

  switch (checkedDescriptor) {
    case CHECKED_STATE:
      checked =
        props.checkedSubmitValue === undefined
          ? props.checkedValue
          : props.checkedSubmitValue;
      break;
    case UNCHECKED_STATE:
      checked =
        props.uncheckedSubmitValue === undefined
          ? props.uncheckedValue
          : props.uncheckedSubmitValue;
      break;
    case INDETERMINATE_STATE:
      checked =
        props.indeterminateSubmitValue === undefined
          ? props.indeterminateValue
          : props.indeterminateSubmitValue;
  }

  if (checked === null) {
    checked = '';
  }

  if (withHiddenInput) {
    return <input type="hidden" name={name} value={checked} />;
  }

  return null;
};

const getChecked = (props, state) => {
  const checked = isControlledComponent(props) ? props.checked : state.checked;

  return isValidCheckValue(checked, props) ? checked : props.uncheckedValue;
};

const isControlledComponent = props => {
  return props.checked !== undefined;
};

class InovuaCheckBox extends Component {
  constructor(props) {
    super(props);

    autoBind(this);

    const { defaultChecked, uncheckedValue } = props;

    this.state = {
      checked: isValidCheckValue(defaultChecked, props)
        ? defaultChecked
        : uncheckedValue,
    };

    this.checkboxRef = createRef();
  }

  componentDidUpdate(previousProps) {
    this.checkUpdateIndeterminate(this.p);

    if (
      previousProps.supportIndeterminate &&
      !this.props.supportIndeterminate
    ) {
      this.setNativeIndeterminate(false);
    }
  }

  componentDidMount() {
    this.checkUpdateIndeterminate();
    if (this.props.autoFocus) {
      this.focus();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.autoFocus && !this.props.autoFocus && !this.isFocused()) {
      this.focus();
    }
  }

  focus() {
    this.checkboxRef.current.focus();
  }

  checkUpdateIndeterminate(props = this.p) {
    if (props.browserNative && props.supportIndeterminate) {
      this.setNativeIndeterminate(
        getCheckedDescriptor(props.checked, props) === INDETERMINATE_STATE
      );
    }
  }

  isFocused() {
    return this.state.focused;
  }

  handleFocus(event) {
    const { onFocus } = this.p;

    this.setState({
      focused: true,
    });

    onFocus && onFocus(event);
  }

  handleBlur(event) {
    const { onBlur } = this.p;

    this.setState({
      focused: false,
    });

    onBlur && onBlur(event);
  }

  changeToNextValue(event) {
    const { readOnly, checked, nextValue } = this.p;

    if (readOnly) {
      return;
    }

    const nextCheckedValue = nextValue(checked, this.p);

    this.setChecked(nextCheckedValue, event);
  }

  setChecked(value, event) {
    const { disabled, onChange } = this.p;

    if (disabled) {
      return;
    }

    if (!isValidCheckValue(value, this.p)) {
      return;
    }

    if (!isControlledComponent(this.props)) {
      this.setState({
        checked: value,
      });
    }

    if (typeof onChange == 'function') {
      onChange(value, event);
    }
  }

  handleClick(event) {
    const { onClick, disabled } = this.p;

    if (disabled) {
      return;
    }

    this.changeToNextValue(event);

    if (onClick) {
      onClick(event);
    }
  }

  handleKeyDown(event) {
    const { onKeyDown } = this.p;

    if (event.key === ' ') {
      // a space was pressed
      event.preventDefault();
      this.changeToNextValue(event);
    }

    if (typeof onKeyDown == 'function') {
      onKeyDown(event);
    }
  }

  getProps(props, state) {
    const checked = getChecked(props, state);

    const style = getComponentStyle(props, state);

    const className = getClassNames(props, state, { checked });
    const shouldSubmitIsFunction = typeof props.shouldSubmit === 'function';
    const shouldSubmitValue = shouldSubmitIsFunction
      ? props.shouldSubmit(checked, props)
      : typeof props.shouldSubmit === 'undefined' || props.shouldSubmit;

    if (
      props.showWarnings &&
      shouldSubmitIsFunction &&
      shouldSubmitValue &&
      !props.name
    ) {
      console.warn(
        'shouldSubmit function returned true, but "name" prop is missing'
      );
    }

    const withHiddenInput = !!(props.name && shouldSubmitValue);

    const { focused } = state;

    return {
      ...props,
      checked,
      style,
      withHiddenInput,
      focused,
      className,
    };
  }

  render() {
    const { props, state } = this;

    const {
      children,
      className,
      style,
      tabIndex,
      iconCheckOnly,
      browserNative,
      focusable,
    } = (this.p = this.getProps(props, state));

    const eventHandlers = {
      onBlur: this.handleBlur,
      onFocus: this.handleFocus,
      onKeyDown: this.handleKeyDown,
    };

    if (!iconCheckOnly) {
      eventHandlers.onClick = this.handleClick;
    }

    const domProps = {
      ...cleanProps(props, InovuaCheckBox.propTypes),
      ...eventHandlers,
      className,
      style,
      ref: this.checkboxRef,
      tabIndex: props.disabled === true ? null : tabIndex,
    };

    if (!props.focusable) {
      delete domProps.tabIndex;
    }

    return browserNative ? (
      this.renderBrowserNative(domProps)
    ) : (
      <div {...domProps}>
        {this.renderCheckbox(
          this.p,
          iconCheckOnly && { onClick: this.handleClick }
        )}
        {children && (
          <div className={`${props.rootClassName}__inner-content-wrapper`}>
            {children}
          </div>
        )}
      </div>
    );
  }

  renderBrowserNative(domProps) {
    const { children, iconCheckOnly } = this.props;
    const Factory = iconCheckOnly ? 'div' : 'label';

    return (
      <Factory
        {...domProps}
        onClick={this.props.onClick}
        onChange={stopPropagation}
      >
        {this.renderBrowserNativeInput()}
        {children}
      </Factory>
    );
  }

  renderBrowserNativeInput() {
    const {
      tabIndex,
      rootClassName,
      disabled,
      checked,
      renderNativeBrowserInput,
      withHiddenInput,
      name,
    } = this.p;

    const className = join(
      this.p.className,
      `${rootClassName}--browser-native`
    );

    const inputProps = {
      disabled,
      className,
      type: 'checkbox',
      ref: ref => (this.node = ref),
      onClick: this.handleClick,
      checked: !!checked,
      tabIndex: disabled === true ? null : tabIndex,
    };

    if (withHiddenInput) {
      inputProps.name = name;
    }

    let result;
    if (typeof renderNativeBrowserInput === 'function') {
      result = renderNativeBrowserInput({ inputProps, props: this.p });
    }
    if (result === undefined) {
      result = <input {...inputProps} />;
    }

    return result;
  }

  renderCheckbox(config, eventHandlers) {
    const input = config.disabled !== true && renderHiddenInput(config);
    const icon = renderIcon(config);
    const domProps = {};

    if (config.disabled) {
      domProps.disabled = 'disabled';
    }

    return (
      <div
        className={`${config.rootClassName}__icon-wrapper`}
        {...domProps}
        {...eventHandlers}
      >
        {input}
        {icon}
      </div>
    );
  }

  setNativeIndeterminate(indeterminate) {
    if (this.node) {
      this.node.indeterminate = indeterminate;
    }
  }
}

InovuaCheckBox.defaultProps = {
  rootClassName: 'inovua-react-toolkit-checkbox',
  browserNative: false,
  iconStyle: {},
  disabledIconStyle: {},
  focusedIconStyle: {},

  disabledStyle: {},
  readOnlyStyle: {},
  focusedStyle: {},

  supportIndeterminate: false,

  focusable: true,
  disabled: false,
  readOnly: false,
  tabIndex: 0,

  checkedValue: true,
  uncheckedValue: false,
  indeterminateValue: null,
  checkedSubmitValue: undefined,
  uncheckedSubmitValue: undefined,
  indeterminateSubmitValue: undefined,
  checked: undefined,
  defaultChecked: undefined,

  // in order to be correctly vertically aligned
  // the icon size needs to be somehow linked to the current font size
  // so we use em units and a value that is divisible by 2.
  iconSize: 16,

  checkedIcon,
  uncheckedIcon,
  indeterminateIcon,
  iconCheckOnly: false,

  shouldSubmit: undefined,
  nextValue,

  childrenPosition: 'end',
  inlineBlock: true,
  theme: 'default',
  showWarnings: !uglified,
};

const { func, number, object, string, bool, any } = PropTypes;
const nonNullPropType = (props, propName, componentName) => {
  if (props[propName] === null) {
    return new Error(
      `${propName} is null in ${componentName}. This is not valid for input; use undefined instead.`
    );
  }
  return null;
};

InovuaCheckBox.propTypes = {
  rootClassName: string,
  browserNative: bool,
  focusable: bool,
  renderNativeBrowserInput: func,
  shouldSubmit: (props, propName, componentName) => {
    if (
      props.shouldSubmit &&
      typeof props.shouldSubmit !== 'function' &&
      !props.name
    ) {
      return new Error(
        `"shouldSubmit" was true, but component ${componentName} requires prop "name" to be submitted.`
      );
    }
  },
  value: props => {
    if (typeof props.value !== 'undefined') {
      return new Error('"value" prop is not supported. Use "checked" instead.');
    }
  },
  defaultValue: props => {
    if (typeof props.defaultValue !== 'undefined') {
      return new Error(
        '"defaultValue" prop is not supported. Use "checked" instead.'
      );
    }
  },
  nextValue: func,

  name: string,
  iconClassName: string,
  readOnlyClassName: string,
  disabledClassName: string,
  focusedClassName: string,
  checked: any,
  defaultChecked: any,

  disabled: bool,
  readOnly: bool,
  tabIndex: number,

  supportIndeterminate: bool,

  checkedValue: any,
  uncheckedValue: any,
  indeterminateValue: any,
  checkedSubmitValue: nonNullPropType,
  uncheckedSubmitValue: nonNullPropType,
  indeterminateSubmitValue: nonNullPropType,

  iconSize: PropTypes.oneOfType([
    string,
    PropTypes.arrayOf([string]),
    number,
    PropTypes.arrayOf(number),
  ]),

  checkedIconSrc: string,
  checkedIcon: any,
  iconCheckOnly: bool,

  uncheckedIconSrc: string,
  uncheckedIcon: any,

  indeterminateIconSrc: string,
  indeterminateIcon: any,

  childrenPosition: PropTypes.oneOf(['start', 'end']),
  inlineBlock: bool,
  rtl: bool,

  theme: string,

  iconStyle: object,
  disabledIconStyle: object,
  focusedIconStyle: object,

  iconClassName: string,
  disabledIconClassName: string,
  focusedIconClassName: string,
  readOnlyIconClassName: string,

  disabledStyle: object,
  readOnlyStyle: object,
  focusedStyle: object,
  showWarnings: bool,
};

export default InovuaCheckBox;
