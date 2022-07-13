/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import throttle from '../../../../common/throttle';
import assign from '../../../../common/assign';
import join from '../../../../common/join';

import {
  getSelectionStart,
  getSelectionEnd,
  setCaretPosition,
} from '../TimeInput';

import toMoment, { Moment, DateType } from '../toMoment';

import parseFormat from './parseFormat';
import forwardTime from '../utils/forwardTime';
import {
  TypeCaretPosition,
  TypeDateFormatInputProps,
  TypeDateFormatInputState,
  TypeFormat,
  TypeFormats,
  TypeKeyDownEvent,
  TypeRange,
} from './types';

const emptyFn = () => {};

const BACKWARDS = {
  Backspace: 1,
  ArrowUp: 1,
  ArrowDown: 1,
  PageUp: 1,
  PageDown: 1,
};

const defaultProps = {
  rootClassName: 'inovua-react-toolkit-calendar__input',
  theme: 'default',
  isDateInput: true,
  stopPropagation: true,
  updateOnWheel: true,
  changeDelay: 100,
};

const propTypes = {
  isDateInput: PropTypes.bool,
  rootClassName: PropTypes.string,
  theme: PropTypes.string,
  stopPropagation: PropTypes.bool,
  updateOnWheel: PropTypes.bool,
  dateFormat: PropTypes.string.isRequired,
  value: (props: TypeDateFormatInputProps, propName: string) => {
    if (props[propName as keyof TypeDateFormatInputProps] !== undefined) {
      // console.warn('Due to performance considerations, TimeInput will only be uncontrolled.')
    }
  },
};

class DateFormatInput extends Component<
  TypeDateFormatInputProps,
  TypeDateFormatInputState
> {
  static defaultProps = defaultProps;
  static propTypes = propTypes;

  private throttleSetValue: any;
  private dateFormatInputRef: any;
  private caretPos?: TypeCaretPosition;
  private displayValue?: string;

  constructor(props: TypeDateFormatInputProps) {
    super(props);

    const {
      positions,
      matches,
    }: { positions: string[]; matches: string[] } = parseFormat(
      props.dateFormat
    );
    const defaultValue: DateType = props.defaultValue || Date.now();

    const delay = props.changeDelay;
    this.throttleSetValue =
      delay == -1 ? this.setValue : throttle(this.setValue, delay);

    const { minDate, maxDate } = this.getMinMax(props);

    this.state = {
      positions,
      matches,
      propsValue: props.value !== undefined,
      value: defaultValue,
      minDate,
      maxDate,
    };

    this.dateFormatInputRef = createRef();
  }

  getMinMax = (
    props: TypeDateFormatInputProps
  ): { minDate: Moment | null; maxDate: Moment | null } => {
    props = props || this.props;

    let minDate = null;

    if (props.minDate) {
      minDate = this.toMoment(props.minDate, props);
    }

    let maxDate = null;

    if (props.maxDate) {
      maxDate = this.toMoment(props.maxDate, props);
    }

    return {
      minDate,
      maxDate,
    };
  };

  componentDidUpdate = (prevProps: TypeDateFormatInputProps) => {
    if (this.props.value !== undefined && this.caretPos && this.isFocused()) {
      this.setCaretPosition(this.caretPos);
    }

    const { minDate: prevMinDate, maxDate: prevMaxDate } = this.getMinMax(
      prevProps
    );
    const { minDate: currentMinDate, maxDate: currentMaxDate } = this.getMinMax(
      this.props
    );

    if (prevMinDate !== currentMinDate) {
      this.setState({ minDate: currentMinDate });
    }
    if (prevMaxDate !== currentMaxDate) {
      this.setState({ maxDate: currentMaxDate });
    }
  };

  toMoment = (value: DateType, props?: TypeDateFormatInputProps): Moment => {
    props = props || this.props;

    return toMoment(value, {
      locale: props.locale,
      dateFormat:
        props.dateFormat === undefined
          ? this.props.dateFormat
          : props.dateFormat,
    });
  };

  render = () => {
    const { props } = this;

    const value = this.state.propsValue ? props.value : this.state.value;

    const displayValue = (this.displayValue = this.toMoment(value!).format(
      props.dateFormat
    ));

    const className = join(
      props.className,
      props.rootClassName,
      `${props.rootClassName}--theme-${props.theme}`
    );

    const inputProps = assign({}, props);

    delete inputProps.changeDelay;
    delete inputProps.date;
    delete inputProps.dateFormat;
    delete inputProps.isDateInput;
    delete inputProps.maxDate;
    delete inputProps.minDate;
    delete inputProps.stopPropagation;
    delete inputProps.updateOnWheel;
    delete inputProps.theme;
    delete inputProps.rootClassName;

    if (typeof props.cleanup == 'function') {
      props.cleanup(inputProps);
    }

    return (
      <input
        {...inputProps}
        ref={this.dateFormatInputRef}
        defaultValue={undefined}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        value={displayValue}
        onKeyDown={this.onKeyDown}
        onWheel={this.onWheel}
        onChange={this.onChange}
        className={className}
      />
    );
  };

  focus = (): void => {
    this.dateFormatInputRef.current.focus();
  };

  onFocus = (event: FocusEvent): void => {
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }

    this.setState({
      focused: true,
    });
  };

  onBlur = (event: FocusEvent): void => {
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }

    this.setState({
      focused: false,
    });
  };

  isFocused = (): boolean => {
    return this.state.focused!;
  };

  onChange = (event: MouseEvent): void => {
    event.stopPropagation();
  };

  onDirection = (dir: number, event: any = {}) => {
    this.onKeyDown({
      key: dir > 0 ? 'ArrowUp' : 'ArrowDown',
      type: event.type || 'unknown',
      stopPropagation:
        typeof event.stopPropagation == 'function'
          ? () => event.stopPropagation()
          : emptyFn,
      preventDefault:
        typeof event.preventDefault == 'function'
          ? () => event.preventDefault()
          : emptyFn,
    });
  };

  onWheel = (event: WheelEvent): void => {
    if (this.props.updateOnWheel && this.isFocused()) {
      const deltaY: number = -event.deltaY;
      this.onDirection(deltaY, event);
    }

    if (this.props.onWheel) {
      this.props.onWheel(event);
    }
  };

  onKeyDown = (event: TypeKeyDownEvent): void => {
    const { props } = this;

    let { key, type, which } = event;

    if (key !== 'Unidentified' && which && which >= 65 && which <= 90) {
      key = ' ';
    }

    if (key != ' ' && (key as any) * 1 == key) {
      key = 'Unidentified';
    }

    if (props.stopPropagation) {
      event.stopPropagation();
    }

    const range = this.getSelectedRange();
    const selectedValue = this.getSelectedValue(range);
    const value = this.displayValue;

    const { positions, matches } = this.state;
    const valueStr = `${value}`;

    let currentPosition: any = positions![range.start];

    if (typeof currentPosition == 'string') {
      currentPosition = positions![range.start + (key in BACKWARDS ? -1 : 1)];
    }

    if (!currentPosition) {
      currentPosition = positions![range.start - 1];
    }

    if (props.onKeyDown && type == 'keydown') {
      if (props.onKeyDown(event, currentPosition) === false) {
        this.caretPos = range;
        return;
      }
    }

    let keyName = key;

    if (key == 'ArrowUp' || key == 'ArrowDown') {
      keyName = 'Arrow';
    }

    const handlerName = `handle${keyName}`;

    let preventDefault;
    let newValue;
    let newCaretPos: TypeCaretPosition;

    if (currentPosition && currentPosition[handlerName]) {
      const returnValue: any = currentPosition[handlerName](currentPosition, {
        range,
        selectedValue,
        value,
        positions,
        currentValue: valueStr.substring(
          currentPosition.start,
          currentPosition.end + 1
        ),
        matches,
        event,
        key,
        input: this.getInput(),
        setCaretPosition: (...args: any) => this.setCaretPosition(...args),
      });

      this.caretPos = range;

      if (returnValue && returnValue.value !== undefined) {
        newValue =
          valueStr.substring(0, currentPosition.start) +
          returnValue.value +
          valueStr.substring(currentPosition.end + 1);

        newCaretPos = returnValue.caretPos || range;
        if (newCaretPos === true) {
          newCaretPos = {
            start: currentPosition.start,
            end: currentPosition.end + 1,
          };
        }
        preventDefault = returnValue.preventDefault !== false;
      }
    }

    if (preventDefault || key == 'Backspace' || key == 'Delete' || key == ' ') {
      if (!preventDefault) {
        this.setCaretPosition(
          (this.caretPos = {
            start: range.start + (key == 'Backspace' ? -1 : 1),
          })
        );
      }
      preventDefault = true;
    }

    const config: {
      currentPosition: any;
      preventDefault?: boolean;
      event: TypeKeyDownEvent;
      value: any;
      stop: boolean;
    } = {
      currentPosition,
      preventDefault,
      event,
      value: newValue,
      stop: false,
    };

    if (this.props.afterKeyDown && type == 'keydown') {
      this.props.afterKeyDown(config);
    }

    if (!config.stop && newCaretPos! !== undefined) {
      const updateCaretPos = () => this.setCaretPosition(newCaretPos);
      this.caretPos = newCaretPos;
      this.setStateValue(newValue, updateCaretPos, {
        key,
        oldValue: valueStr,
        currentPosition,
      });
    }

    if (config.preventDefault) {
      event.preventDefault();
    }
  };

  getInput = (): any => {
    return this.dateFormatInputRef.current;
  };

  setCaretPosition = (pos?: TypeCaretPosition): void => {
    const dom = this.getInput();
    if (dom) {
      setCaretPosition(dom, pos);
    }
  };

  format = (mom: Moment, format: string = this.props.dateFormat) => {
    return mom.format(format);
  };

  setStateValue = (
    value: any,
    callback: any,
    {
      key,
      oldValue,
      currentPosition,
    }: {
      key: string | number;
      oldValue: any;
      currentPosition: { format: string };
    }
  ) => {
    let dateMoment: any = this.toMoment(value);

    if (!dateMoment.isValid()) {
      const dir = key == 'ArrowUp' || key == 'PageUp' ? 1 : -1;

      if (currentPosition.format == 'MM') {
        // updating the month
        dateMoment = this.toMoment(oldValue).add(dir, 'month');
      } else {
        // updating the day
        dateMoment =
          dir > 0
            ? // we've gone with +1 beyond max, so reset to 1
              this.toMoment(oldValue).date(1)
            : // we've gone with -1 beyond max, so reset to max of month
              this.toMoment(oldValue).endOf('month');
      }

      if (!dateMoment.isValid()) {
        return;
      }

      value = this.format(dateMoment);
    }

    const { minDate, maxDate }: any = this.state;

    if (minDate && dateMoment.isBefore(minDate)) {
      const clone = this.toMoment(dateMoment);

      // try with time
      dateMoment = forwardTime(clone, this.toMoment(minDate));

      if (dateMoment.isBefore(minDate)) {
        // try without time
        dateMoment = this.toMoment(minDate);
      }

      value = this.format(dateMoment);
    }

    if (maxDate && dateMoment.isAfter(maxDate)) {
      const clone = this.toMoment(dateMoment);
      dateMoment = forwardTime(clone, this.toMoment(maxDate));

      if (dateMoment.isAfter(maxDate)) {
        dateMoment = this.toMoment(maxDate);
      }

      value = this.format(dateMoment);
    }

    this.setState(
      {
        value,
        propsValue: false,
      },
      typeof callback == 'function' && callback
    );

    if (this.props.onChange) {
      this.throttleSetValue(value, dateMoment);
    }
  };

  setValue = (value: DateType, dateMoment: Moment) => {
    if (this.props.value === undefined) {
      this.setState({
        value,
        propsValue: false,
      });
    } else {
      this.setState({
        propsValue: true,
        value: undefined,
      });
    }

    if (this.props.onChange) {
      this.props.onChange(value, {
        dateMoment: dateMoment || this.toMoment(value),
      });
    }
  };

  getSelectedRange = (): TypeRange => {
    const dom = this.getInput();

    return {
      start: getSelectionStart(dom),
      end: getSelectionEnd(dom),
    };
  };

  getSelectedValue = (range: TypeRange) => {
    range = range || this.getSelectedRange();
    const value: string | undefined = this.displayValue;

    return value!.substring(range.start, range.end);
  };
}

export { TypeDateFormatInputProps, TypeFormats, TypeFormat };
export default DateFormatInput;
