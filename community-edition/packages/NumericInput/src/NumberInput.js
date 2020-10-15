/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import autoBind from '../../../packages/react-class/autoBind';
import hasTouch from '../../../packages/hasTouch';

import raf from '../../../common/raf';
import join from '../../../common/join';
import clamp from '../../../common/clamp';
import debounce from '../../../common/debounce';
import cleanProps from '../../../common/cleanProps';
import EVENT_NAMES from '../../../common/eventNames';

import getSelectedRange from './utils/get-selection-range';
import getSelectionStart from './utils/get-selection-start';
import setCaretPosition from './utils/set-caret-position';
import getDecimalDelimiter from './utils/get-decimal-delimiter';

import getTransformedStringValues, {
  getDecimalDelimiterPosition,
} from './utils/get-transformed-string-values';

import getCurrencyForCountryCode from './utils/get-currency-for-country-code';

const preventDefault = e => e.preventDefault();

const emptyObject = {};
const isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n);
const isInt = n => Number(n) === n && n % 1 === 0;

const getArrowClasses = (spinDirection, props) => {
  const upArrowClass = join(
    `${props.rootClassName}__spinner-arrow`,
    `${props.rootClassName}__spinner-arrow--up`,
    spinDirection === 1 && `${props.rootClassName}__spinner-arrow--active`
  );

  const downArrowClass = join(
    `${props.rootClassName}__spinner-arrow`,
    `${props.rootClassName}__spinner-arrow--down`,
    spinDirection === -1 && `${props.rootClassName}__spinner-arrow--active`
  );

  return { upArrowClass, downArrowClass };
};

const getClearButtonClassNames = props => {
  const clearButtonClassName = join(
    `${props.rootClassName}__clear-button`,
    `${props.rootClassName}__clear-button--${props.rtl ? 'rtl' : 'ltr'}`,
    props.clearButtonClassName
  );

  return { clearButtonClassName };
};

const toUpperFirst = str => {
  return str ? str.charAt(0).toUpperCase() + str.substring(1) : '';
};

const noDot = value => {
  value += '';
  return value.indexOf('.') === -1;
};

/**
 * Returns true if the given value is >=  than #minValue
 * @param  {Number/String}  value
 * @return {Boolean}
 */
const isMinValueRespected = (value, props) => {
  const minValue = props.minValue;

  if (minValue == null || value === '') {
    return true;
  }

  return value >= minValue;
};

/**
 * Returns true if the given value is <=  than #maxValue
 * @param  {Number/String}  value
 * @return {Boolean}
 */
const isMaxValueRespected = (value, props) => {
  const maxValue = props.maxValue;

  if (maxValue == null || value === '') {
    return true;
  }

  return value <= maxValue;
};

const checkNumeric = (value, { numbersOnly, allowNegative, allowFloat }) => {
  if (value === '') {
    return true;
  }

  if (numbersOnly) {
    const numeric = isNumeric(value);

    return (
      numeric ||
      (allowNegative && value === '-') ||
      (allowFloat && value === '.') ||
      (allowNegative && allowFloat && value == '-.')
    );
  }

  return true;
};

const isPossibleNumericStart = (value, { allowFloat, allowNegative }) => {
  if (allowFloat && value === '.') {
    return true;
  }
  if (allowNegative && value === '-') {
    return true;
  }

  if (allowNegative && allowFloat && value === '-.') {
    return true;
  }

  return !isNaN(value);
};

const checkFloat = (value, { allowFloat }) => {
  if (allowFloat === false) {
    return noDot(value) && isNumeric(value) && isInt(value * 1);
  }
};

const isFloat = n => Number(n) === n && n % 1 !== 0;
const isFloatString = n => {
  const str = `${n}`;

  return isFloat(str) || (isNumeric(str) && str.indexOf('.') !== -1);
};

const checkPositive = (value, { allowNegative }) => {
  if (allowNegative === false) {
    return isNumeric(value) && value * 1 >= 0;
  }
};

const getInitialStateValue = props => {
  const { value, defaultValue } = props;
  if (value) {
    return null;
  }

  if (defaultValue || defaultValue === 0) {
    return getFormatedValue(defaultValue, props);
  }

  return '';
};

const getFormatedValue = (value, props) => {
  if (value || value === 0) {
    const { locale, prefix, suffix, minValue, maxValue, precision } = props;
    return getTransformedStringValues(value, {
      locale,
      precision,
      min: minValue,
      max: maxValue,
      prefix,
      suffix,
    })[0];
  }
};

const getCurrentValue = (props, state) => {
  const { value, defaultValue } = props;
  const { formattedValue } = state;

  if (value != null) {
    return value;
  }

  if (formattedValue == null) {
    return getFormatedValue(defaultValue, props);
  }

  return formattedValue;
};

const isControlled = props => {
  return props.value !== undefined;
};

const getInitialStatePrecision = props => {
  if (isControlledPrecision(props)) {
    return null;
  }

  return 0;
};

const isControlledPrecision = props => {
  return props.precision === 0 || !!props.precision;
};

const getSuffix = props => {
  const { suffix, format, currencySymbol, currencyPosition, locale } = props;
  if (suffix) {
    return suffix;
  }

  if (format === 'currency' && currencyPosition === 'end') {
    if (currencySymbol) {
      return currencySymbol;
    }
    return getCurrencyForCountryCode(
      locale || (global.navigator ? global.navigator.language : '')
    );
  }

  if (format === 'percentage') {
    return '%';
  }
};

const getPrefix = props => {
  const { prefix, format, currencySymbol, currencyPosition, locale } = props;
  if (prefix) {
    return prefix;
  }

  if (format === 'currency' && currencyPosition === 'start') {
    if (currencySymbol) {
      return currencySymbol;
    }
    return getCurrencyForCountryCode(
      locale || (global.navigator ? global.navigator.language : '')
    );
  }
};

const selectionContainsPosition = (selection, position) => {
  if (selection.start === selection.end) {
    return false;
  }

  return selection.start <= position && selection.end > position;
};

class InovuaNumericInput extends Component {
  constructor(props) {
    super(props);
    autoBind(this);

    const value = isControlled(props) ? props.value : props.defaultValue;

    if (props.triggerChangeOnSpinDelay > 0) {
      this.setValueOnSpin = debounce(
        this.setValueOnSpin,
        props.triggerChangeOnSpinDelay
      );
    }

    this.state = {
      value,
      focused: false,
      formattedValue: getFormatedValue(value, props),
      spinDirection: null,
      intermediateValue: null,
    };

    this.input = createRef();
  }

  render() {
    const { props, state } = this;
    const { toolPosition } = props;
    const {
      formattedValue,
      enableSpinnerTools,
      className,
      style,
      enableClearButton,
      wrapperProps,
    } = (this.p = this.getProps(props, state));

    let min = props.mim;
    if (min === undefined && !props.allowNegative) {
      min = 0;
    }

    let currentValue = state.focused ? this.p.value : this.p.formattedValue;

    if (currentValue == null) {
      currentValue = '';
    }

    const inputProps = props.inputProps || emptyObject;
    const inputClassName = join(
      `${props.rootClassName}__input`,
      inputProps.className
    );

    const input = (
      <input
        size={Math.max(1, props.size || 0)} // if not present, FF will not correctly flex the input when the NumericInput is smaller than the default input width
        placeholder={this.props.placeholder}
        {...inputProps}
        ref={this.input}
        type="text"
        key="input"
        className={inputClassName}
        disabled={props.disabled}
        value={currentValue}
        onWheel={this.handleWheel}
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
        onChange={this.handleChange}
        min={min}
      />
    );

    const clearButtonWrapper = this.renderClearButtonWrapper();
    const spinnerToolWrapper = this.renderSpinnerToolsWrapper();

    let inputDisplay = [input, clearButtonWrapper, spinnerToolWrapper];

    if (toolPosition === 'start') {
      inputDisplay = [spinnerToolWrapper, clearButtonWrapper, input];
    }
    if (enableSpinnerTools === false) {
      inputDisplay = [input, spinnerToolWrapper, clearButtonWrapper];
    }
    if (toolPosition === 'start' && enableSpinnerTools === false) {
      inputDisplay = [clearButtonWrapper, input, spinnerToolWrapper];
    }

    const propsToWrapper = cleanProps(
      wrapperProps,
      InovuaNumericInput.propTypes
    );

    return (
      <div
        {...propsToWrapper}
        className={join(
          className,
          wrapperProps ? wrapperProps.className : null
        )}
        style={
          wrapperProps && wrapperProps.style
            ? { ...style, ...wrapperProps.style }
            : style
        }
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
      >
        {inputDisplay}
      </div>
    );
  }

  renderClearButtonWrapper() {
    const { props, state } = this;
    const { enableClearButton } = this.props;
    const { clearButtonColor, clearButtonStyle, clearButtonSize } = this.p;
    const value = isControlled(props) ? props.value : state.value;
    const hasValue =
      state.intermediateValue != null ? true : value !== '' && value != null;
    const clearButtonWrapperClassName = join(
      `${props.rootClassName}__clear-button-wrapper`,
      (!hasValue || !enableClearButton) &&
        `${props.rootClassName}__clear-button-wrapper--hidden`
    );

    return (
      <div key="clearButton" className={clearButtonWrapperClassName}>
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
      result = this.props.renderClearIcon({
        width: svgProps.width,
        height: svgProps.height,
      });
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

  renderSpinnerToolsWrapper() {
    const { props } = this;
    const { enableSpinnerTools, rtl } = props;

    const {
      arrowColor,
      arrowStyle,
      arrowUpStyle,
      arrowDownStyle,
      spinDirection,
      arrowSize,
    } = this.p;

    const spinnerToolsWrapperClassName = enableSpinnerTools
      ? `${props.rootClassName}__spinner-wrapper ${
          props.rootClassName
        }__spinner-wrapper--${rtl ? 'rtl' : 'ltr'}`
      : `${props.rootClassName}__spinner-wrapper-hidden ${
          props.rootClassName
        }__spinner-wrapper-hidden--${rtl ? 'rtl' : 'ltr'}`;

    return (
      <div key="spinnerTool" className={spinnerToolsWrapperClassName}>
        {this.renderSpinnerTools({
          arrowColor,
          arrowStyle,
          arrowUpStyle,
          arrowDownStyle,
          spinDirection,
          arrowSize,
          ...getArrowClasses(spinDirection, props),
        })}
      </div>
    );
  }

  renderSpinnerTools(config) {
    const {
      arrowColor,
      arrowStyle,
      arrowUpStyle,
      arrowDownStyle,
      upArrowClass,
      downArrowClass,
      arrowSize,
    } = config;

    const svgProps = {};

    if (arrowColor) {
      svgProps.fill = arrowColor;
    }

    if (arrowSize) {
      if (Array.isArray(arrowSize)) {
        svgProps.width = arrowSize[0];
        svgProps.height = arrowSize[1];
      } else {
        svgProps.width = arrowSize;
        svgProps.height = arrowSize;
      }
    }

    const arrowEvents = this.getArrowEvents();

    return [
      <span
        key="up"
        {...arrowEvents.upEvents}
        className={upArrowClass}
        style={{ ...arrowStyle, ...arrowUpStyle }}
      >
        {this.renderArrowUpIcon(svgProps)}
      </span>,
      <span
        key="down"
        {...arrowEvents.downEvents}
        className={downArrowClass}
        style={{ ...arrowStyle, ...arrowDownStyle }}
      >
        {this.renderArrowDownIcon(svgProps)}
      </span>,
    ];
  }

  renderArrowUpIcon = svgProps => {
    const { height } = svgProps;
    let result;

    if (
      this.props.renderArrowUpIcon &&
      typeof this.props.renderArrowUpIcon === 'function'
    ) {
      result = this.props.renderArrowUpIcon({ ...svgProps });
    }

    if (result === undefined) {
      result = (
        <svg style={{ ...svgProps, height: height / 2 }} viewBox="0 0 10 5">
          <path
            fillRule="evenodd"
            d="M5.262.262l4.106 4.106c.144.144.144.379 0 .524-.07.069-.164.108-.262.108H.894c-.204 0-.37-.166-.37-.37 0-.099.039-.193.108-.262L4.738.262c.145-.145.38-.145.524 0z"
          />
        </svg>
      );
    }

    return result;
  };

  renderArrowDownIcon = svgProps => {
    const { height } = svgProps;
    let result;

    if (
      this.props.renderArrowDownIcon &&
      typeof this.props.renderArrowDownIcon === 'function'
    ) {
      result = this.props.renderArrowDownIcon({ ...svgProps });
    }

    if (result === undefined) {
      result = (
        <svg style={{ ...svgProps, height: height / 2 }} viewBox="0 0 10 5">
          <path
            fillRule="evenodd"
            d="M4.738 4.738L.632.632C.488.488.488.253.632.108.702.04.796 0 .894 0h8.212c.204 0 .37.166.37.37 0 .099-.039.193-.108.262L5.262 4.738c-.145.145-.38.145-.524 0z"
          />
        </svg>
      );
    }

    return result;
  };

  getArrowEvents() {
    return {
      upEvents: {
        [EVENT_NAMES.onMouseDown]: this.handleArrowDown.bind(this, 1),
      },
      downEvents: {
        [EVENT_NAMES.onMouseDown]: this.handleArrowDown.bind(this, -1),
      },
    };
  }

  handleClearButtonClick(event) {
    this.setState({
      focused: true,
    });

    this.setValue(null);

    this.focus();
  }

  handleArrowDown(shiftStep, event) {
    event.preventDefault();

    const { step } = this.props;

    const target = hasTouch ? event.target : window;
    const eventName = hasTouch ? 'touchend' : 'click';

    const onUpEvent = () => {
      this.handleMouseUp();
      target.removeEventListener(eventName, onUpEvent, true /*useCapture*/);
    };

    // we have to use capture since the click event does not propagate up in time in the bubble phase
    target.addEventListener(eventName, onUpEvent, true /*useCapture*/);

    const { shiftKey } = event;

    const direction = shiftStep > 0 ? 1 : -1;

    const spinConfig = { step: Math.abs(step) };

    // to perform a step, even on quick mousedown/up combination
    this.stepTo(direction, spinConfig);

    this.handleArrowDownTimeoutId = setTimeout(() => {
      this.setState({
        shiftKey,
        spinDirection: direction,
      });

      this.startSpin(direction, spinConfig);
    }, 300);
  }

  handleMouseUp() {
    this.stopSpin();

    this.setState({
      spinDirection: null,
      shiftKey: null,
    });
  }

  getTransformedStringValues(value) {
    const {
      suffix,
      prefix,
      locale,
      precision,
      isControlledPrecision,
      minValue,
      maxValue,
    } = this.p;
    return getTransformedStringValues(value, {
      locale,
      precision: isControlledPrecision && precision,
      min: minValue,
      max: maxValue,
      suffix,
      prefix,
    });
  }

  handleFocus(event) {
    const { onFocus } = this.props;

    if (event.target != this.input.current) {
      return;
    }

    this.setState({
      focused: true,
    });

    if (this.props.inputProps && this.props.inputProps.onFocus) {
      this.props.inputProps.onFocus(event);
    }

    if (onFocus) {
      onFocus(event);
    }
  }

  handleBlur(event) {
    this.setState({
      focused: false,
    });

    if (this.isSpinning()) {
      this.stopSpin();
    }

    if (this.state.intermediateValue != null) {
      let value = clamp(
        parseFloat(this.state.intermediateValue),
        this.props.minValue,
        this.props.maxValue
      );

      if (!this.props.allowEmpty && (isNaN(value) || value == null)) {
        value =
          this.props.valueOnEmpty !== undefined
            ? this.props.valueOnEmpty
            : this.props.minValue || 0;
      }

      this.setValue(value);
    }

    if (this.props.inputProps && this.props.inputProps.onBlur) {
      this.props.inputProps.onBlur(event);
    }

    const { onBlur } = this.props;
    if (onBlur) {
      onBlur(event);
    }
  }

  handleChange(event) {
    event.stopPropagation();

    if (this.props.inputProps && this.props.inputProps.onChange) {
      this.props.inputProps.onChange(event);
    }
    const value = event.target.value;

    this.setValue(value);
  }

  setValue(value, { silent } = {}) {
    if (this.props.allowNegative && value === '-') {
      this.setIntermediateValue(value);
      return;
    }
    if (this.props.allowFloat && value === '.') {
      this.setIntermediateValue(value);
      return;
    }
    if (this.props.allowFloat && this.props.allowNegative && value === '-.') {
      this.setIntermediateValue(value);
      return;
    }
    const parseResult = parseFloat(value);

    const parsedValue = isNaN(parseResult)
      ? null
      : clamp(parseResult, this.props.minValue, this.props.maxValue);

    const isSameRepresentation =
      parsedValue === null || `${value}` === parsedValue.toString();

    if (!this.props.allowEmpty && parsedValue === null) {
      this.setIntermediateValue(value || '');
      return;
    }

    if (isSameRepresentation) {
      this.setIntermediateValue(null);
      this.onChange(parsedValue);
    } else {
      this.setIntermediateValue(value);
    }
  }

  setIntermediateValue(intermediateValue, callback) {
    if (intermediateValue === this.state.intermediateValue) {
      return;
    }
    this.setState({
      intermediateValue,
    });
  }

  onChange(value) {
    if (!isControlled(this.props)) {
      this.setState({
        value,
      });
    }
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  handleBackspaceKeyDown(event) {
    const { isControlledPrecision, currentValue, decimalDelimiter } = this.p;

    if (isControlledPrecision) {
      const currentSelection = getSelectedRange(this.input.current);
      const decimalPosition = getDecimalDelimiterPosition(
        currentValue,
        decimalDelimiter
      );

      if (currentSelection.end - 1 > decimalPosition) {
        this.backspaceOnControlledPrecision = true;
      }

      if (currentSelection.end - 1 === decimalPosition) {
        raf(() => {
          setCaretPosition(this.input.current, currentSelection.end - 1);
        });
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  handleDigitKeyDown() {
    const { isControlledPrecision, currentValue, decimalDelimiter } = this.p;

    if (isControlledPrecision) {
      const currentSelection = getSelectedRange(this.input.current);
      const decimalPosition = getDecimalDelimiterPosition(
        currentValue,
        decimalDelimiter
      );
      if (currentSelection.end > decimalPosition) {
        this.digitInputOnControlledPrecision =
          currentSelection.end > decimalPosition;
      }
    }
  }

  handleDecimalDelimiterKeyDown(event) {
    const { allowFloat, value } = this.p;

    if (!allowFloat) {
      event.preventDefault();
      return;
    }

    const selectedText = this.getSelectedText();
    if (selectedText == '.') {
      return;
    }

    if (isFloatString(selectedText)) {
      return;
    }

    if (isFloatString(value)) {
      event.preventDefault();
      return;
    }
  }

  getSelectedText() {
    const { start, end } = getSelectedRange(this.input.current);
    const value = `${this.getValue()}`;

    return value.substring(start, end);
  }

  handleSelectionOverDecimalDelimiter(event, currentSelection) {
    const {
      decimalDelimiter,
      currentValue,
      isControlledPrecision,
      prefix,
      suffix,
    } = this.p;
    currentSelection = currentSelection || getSelectedRange(this.input.current);

    let selectionStartsAtBeginningOfNumber = currentSelection.start === 0;
    if (prefix) {
      selectionStartsAtBeginningOfNumber =
        currentSelection.start <= prefix.length + 1;
    }

    let selectionEndsAtEndOfNumber =
      currentSelection.end === currentValue.length;
    if (suffix) {
      selectionEndsAtEndOfNumber = currentSelection.end >= suffix.length + 1;
    }

    if (selectionStartsAtBeginningOfNumber && selectionEndsAtEndOfNumber) {
      return;
    }
  }

  handleKeyUp(event) {
    const { key } = event;

    if (this.props.inputProps && this.props.inputProps.onKeyUp) {
      this.props.inputProps.onKeyUp(event);
    }
    const name = `handle${toUpperFirst(key)}KeyUp`;

    if (this[name]) {
      this[name](event);
    }
  }

  handleKeyDown(event) {
    const { key } = event;
    const { decimalDelimiter, decimalDelimiterPosition } = this.p;

    if (this.props.inputProps && this.props.inputProps.onKeyDown) {
      this.props.inputProps.onKeyDown(event);
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }

    if (!key) {
      return;
    }

    const currentSelection = getSelectedRange(this.input.current);

    if (selectionContainsPosition(currentSelection, decimalDelimiterPosition)) {
      this.handleSelectionOverDecimalDelimiter(event, currentSelection);
    }

    if (key.match(/[0-9]/)) {
      this.handleDigitKeyDown(event);

      return;
    }

    if (key === decimalDelimiter) {
      this.handleDecimalDelimiterKeyDown(event);

      return;
    }
    if (key === '-') {
      const caretPos = this.getSelectionStart();
      if (!this.props.allowNegative || caretPos) {
        event.preventDefault();
      }
      return;
    }

    const isPrintableCharacter = key.length == 1;
    if (isPrintableCharacter && !(event.metaKey || event.ctrlKey)) {
      event.preventDefault();
    }

    const name = `handle${toUpperFirst(key)}KeyDown`;

    if (this[name]) {
      this[name](event);
    }
  }

  handleArrowDownKeyDown(event) {
    this.handleArrowKeySpin(-1, event);
  }

  handleArrowUpKeyDown(event) {
    this.handleArrowKeySpin(1, event);
  }

  handleArrowKeySpin(direction, event) {
    if (this.isSpinning()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (this.props.spinOnArrowKeys) {
      event.preventDefault();
      event.stopPropagation();
      if (!this.isSpinning()) {
        const config = {
          shiftKey: event.shiftKey,
          event,
        };

        this.stepTo(direction, config);

        this.spinTimeoutId = setTimeout(() => {
          this.startSpin(direction, config);
        }, 120);
      }
    }
  }

  handleArrowUpKeyUp() {
    this.onSpinKeyUp();
  }
  handleArrowDownKeyUp() {
    this.onSpinKeyUp();
  }

  onSpinKeyUp() {
    this.props.spinOnArrowKeys && this.stopSpin();
  }

  getInput() {
    return this.input.current;
  }

  getNumericValue() {
    return this.p.numericValue;
  }

  getValue() {
    return this.p.value;
  }

  isFocused() {
    return !!this.state.focused;
  }

  getStepValue(props, direction, config) {
    config = config || {};

    const value = this.p.value;
    let stepValue = config.step || props.step;
    if (this.state.shiftKey || (config.shiftKey && props.shiftStep)) {
      stepValue = props.shiftStep;
    }
    const theValue = isNumeric(this.p.value)
      ? value * 1 + direction * stepValue
      : this.props.initialStep || 0;

    return clamp(
      Math.round(theValue * 1000) / 1000,
      this.props.minValue,
      this.props.maxValue
    );
  }

  stepTo(direction, config) {
    config = config || {};

    this.stepToTriggered = true;

    const props = this.props;
    const step = config.step || props.step;

    if (step != null) {
      const stepFn =
        typeof props.stepFn === 'function' ? props.stepFn : this.getStepValue;
      const value = stepFn(props, direction, config);
      this.spinValue = value;

      if (config.triggerChangeOnSpin) {
        if (props.triggerChangeOnSpinDelay > 0) {
          this.setIntermediateValue(value);
        }
        this.setValueOnSpin(value);
      } else {
        this.setIntermediateValue(value);
      }
    }
  }

  setValueOnSpin(value) {
    this.setValue(value);
  }

  stopSpin() {
    clearTimeout(this.spinTimeoutId);
    clearTimeout(this.handleArrowDownTimeoutId);
    clearInterval(this.spinIntervalId);

    this.setValue(this.spinValue);

    this.handleArrowDownTimeoutId = null;
    this.spinTimeoutId = null;
    this.spinIntervalId = null;
  }

  startSpin(direction, config) {
    if (this.spinIntervalId) {
      clearInterval(this.spinIntervalId);
    }

    this.stepToTriggered = false;

    this.spinValue = this.getValue();

    const stepTo = this.stepTo.bind(this, direction, {
      triggerChangeOnSpin: this.props.triggerChangeOnSpin,
      ...config,
    });

    this.spinIntervalId = setInterval(stepTo, this.props.stepDelay);
  }

  isSpinning() {
    return this.spinIntervalId != null;
  }

  handleWheel(event) {
    const props = this.props;

    if (
      ((props.requireFocusOnStep && this.isFocused()) ||
        !props.requireFocusOnStep) &&
      props.stepOnWheel &&
      props.step
    ) {
      event.preventDefault();

      const nativeEvent = event.nativeEvent;
      let y =
        nativeEvent.wheelDeltaY ||
        nativeEvent.wheelDelta ||
        -nativeEvent.deltaY;

      y = y < 0 ? -1 : 1;

      this.stepTo(y, {
        shiftKey: event.shiftKey,
        event,
      });
    }
  }

  focus() {
    this.input.current.focus();
  }

  getSelectionStart() {
    return getSelectionStart(this.input.current);
  }

  getProps(props, state) {
    props = props || this.props;
    state = state || this.state;

    const suffix = getSuffix(props);
    const prefix = getPrefix(props);

    const currentValue = getCurrentValue({ ...props, suffix, prefix }, state);

    const decimalDelimiter = getDecimalDelimiter(props.locale);
    const decimalDelimiterPosition = getDecimalDelimiterPosition(
      currentValue,
      decimalDelimiter
    );

    const className = join(
      props.rootClassName,
      props.theme && `${props.rootClassName}--theme-${props.theme}`,
      `${props.rootClassName}--${props.rtl ? 'rtl' : 'ltr'}`,
      props.disabled && `${props.rootClassName}--disabled`,
      state.focused && `${props.rootClassName}--focused`,
      props.enableSpinnerTools &&
        `${props.rootClassName}--enable-spinner-tools`,
      props.enableClearButton && `${props.rootClassName}--enable-clear-button`,
      props.className
    );

    const controlled = isControlled(props);

    let value = controlled ? props.value : state.value;

    if (state.intermediateValue !== null) {
      value = state.intermediateValue;
    }

    const numericValue = Number(value);

    const p = {
      ...props,
      className,
      isControlled: controlled,
      isControlledPrecision: isControlledPrecision(props),

      value,
      numericValue,

      currentValue,
      suffix,
      prefix,

      decimalDelimiter,
      decimalDelimiterPosition,
    };

    p.formattedValue = getFormatedValue(value, p);

    return p;
  }
}

InovuaNumericInput.defaultProps = {
  rootClassName: 'inovua-react-toolkit-numeric-input',
  spinOnArrowKeys: true,
  numbersOnly: true,
  step: 1,
  shiftStep: 10,
  requireFocusOnStep: true,
  stepOnWheel: true,
  allowNegative: true,
  allowFloat: true,
  triggerChangeOnSpin: true,
  triggerChangeOnSpinDelay: 80,
  stepDelay: 60,
  prefix: '',
  suffix: '',
  theme: 'default',
  format: 'number',
  currencyPosition: 'end',
  enableSpinnerTools: true,
  enableClearButton: true,
  acceptClearToolFocus: false,
  allowEmpty: true,
  toolPosition: 'end',
  arrowSize: 10,
  clearButtonSize: 10,
  inputProps: {},
};

InovuaNumericInput.propTypes = {
  rootClassName: PropTypes.string,
  stepDelay: PropTypes.number,
  step: PropTypes.number,
  initialStep: PropTypes.number,

  valueOnEmpty: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  minValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  onChange: PropTypes.func,

  triggerChangeOnSpin: PropTypes.bool,
  allowEmpty: PropTypes.bool,
  allowFloat: PropTypes.bool,
  requireFocusOnStep: PropTypes.bool,

  spinOnArrowKeys: PropTypes.bool,
  numbersOnly: PropTypes.bool,

  shiftStep: PropTypes.number,
  stepOnWheel: PropTypes.bool,

  allowNegative: PropTypes.bool,

  precision: PropTypes.number,
  format: PropTypes.oneOf(['currency', 'number', 'percentage']),
  locale: PropTypes.string,

  prefix: PropTypes.string,
  suffix: PropTypes.string,
  theme: PropTypes.string,
  arrowColor: PropTypes.string,
  arrowStyle: PropTypes.object,

  currencySymbol: PropTypes.string,
  currencyPosition: PropTypes.oneOf(['start', 'end']),

  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  wrapperProps: PropTypes.object,

  disabled: PropTypes.bool,

  acceptClearToolFocus: PropTypes.bool,

  renderClearIcon: PropTypes.func,

  //clearButton style
  clearButtonSize: PropTypes.number,
  clearButtonColor: PropTypes.string,
  clearButtonStyle: PropTypes.object,
  clearButtonClassName: PropTypes.string,

  // enable
  enableSpinnerTools: PropTypes.bool,
  enableClearButton: PropTypes.bool,
  toolPosition: PropTypes.oneOf(['start', 'end']),
  arrowSize: PropTypes.number,
  arrowDownStyle: PropTypes.object,
  arrowUpStyle: PropTypes.object,
  inputProps: PropTypes.object,
  rtl: PropTypes.bool,
};

global.isNumeric = isNumeric;
export default InovuaNumericInput;
