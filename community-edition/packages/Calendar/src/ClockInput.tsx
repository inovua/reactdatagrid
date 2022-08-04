/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, ReactElement } from 'react';
import PropTypes from 'prop-types';
import autoBind from '../../react-class/autoBind';
import { Flex } from '../../Flex';
import throttle from '../../../common/throttle';
import assign from '../../../common/assign';
import join from '../../../common/join';
import toMoment, { DateType } from './toMoment';

import Clock from './Clock';
import DateFormatSpinnerInput from './DateFormatSpinnerInput';

type TypeValue = DateType;

type TypeClockInputProps = {
  rootClassName?: string;
  className?: string;
  value?: TypeValue;
  defaultValue?: TypeValue;
  viewIndex?: number;
  dateFormat?: string;
  format?: string;
  theme?: string;
  changeDelay?: number;
  updateOnWheel?: boolean;
  wrapTime?: boolean;
  isClockInput?: boolean;
  readOnly?: boolean;
  tabIndex?: number;
  size?: number;

  cleanup?: (props: TypeClockInputProps) => void;
  onEnterKey?: (event: any) => void;
  onEscapeKey?: (event: any) => void;
  onTimeChange?: () => void;
  onChange?: (value: DateType, dateFormat?: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onMouseDown?: (event?: any) => void;
  ref?: any;
};

type TypeClockInputState = {
  value: TypeValue;
};

const defaultProps = {
  rootClassName: 'inovua-react-toolkit-calendar__clock-input',
  changeDelay: 50,
  dateFormat: 'YYYY-MM-DD',
  updateOnWheel: true,
  theme: 'default',
  wrapTime: false,
  isClockInput: true,
  onTimeChange: () => {},
};

const propTypes = {
  rootClassName: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  viewIndex: PropTypes.number,
  dateFormat: PropTypes.string,
  format: PropTypes.string,
  theme: PropTypes.string,
  changeDelay: PropTypes.number,
  updateOnWheel: PropTypes.bool,
  wrapTime: PropTypes.bool,
  isClockInput: PropTypes.bool,
  cleanup: PropTypes.func,
  onEnterKey: PropTypes.func,
  onEscapeKey: PropTypes.func,
  onTimeChange: PropTypes.func,
};

class ClockInput extends Component<TypeClockInputProps, TypeClockInputState> {
  static defaultProps = defaultProps;
  static propTypes = propTypes;

  private value?: TypeValue;
  private throttleSetValue?: any;
  private dateFormat?: string;
  private field?: any;

  constructor(props: TypeClockInputProps) {
    super(props);

    autoBind(this);

    const delay = props.changeDelay;
    this.throttleSetValue =
      delay == -1 ? this.setValue : throttle(this.setValue, delay);

    this.state = {
      value: props.defaultValue || Date.now(),
    };
  }

  getValue = () => {
    return this.value;
  };

  render = () => {
    const props = this.props;
    const format = props.dateFormat || props.format;

    let startIndex = format!.toLowerCase().indexOf('h');
    if (startIndex === -1) {
      startIndex = format!.toLowerCase().indexOf('k');
    }
    const dateFormat = format!.substring(startIndex);

    this.dateFormat = dateFormat;

    this.value = props.value !== undefined ? props.value : this.state.value;

    const { rootClassName } = props;
    const className = join(
      props.className,
      rootClassName,
      props.theme && `${rootClassName}--theme-${props.theme}`
    );

    const flexProps = assign({}, this.props);

    delete flexProps.changeDelay;
    delete flexProps.cleanup;
    delete flexProps.dateFormat;
    delete flexProps.isClockInput;
    delete flexProps.onEnterKey;
    delete flexProps.onEscapeKey;
    delete flexProps.onTimeChange;
    delete flexProps.updateOnWheel;
    delete flexProps.theme;
    delete flexProps.viewIndex;
    delete flexProps.wrapTime;
    delete flexProps.rootClassName;

    if (typeof this.props.cleanup == 'function') {
      this.props.cleanup(flexProps);
    }

    return (
      <Flex
        column
        {...flexProps}
        value={null}
        defaultValue={null}
        className={className}
      >
        {this.renderClock()}
        {this.renderTimeInput()}
      </Flex>
    );
  };

  renderTimeInput = (): ReactElement => {
    const props = this.props;
    const dateInput: any = React.Children.toArray(props.children).filter(
      (child: any) => child && child.props && child.props.isDateInput
    )[0];

    const dateInputProps = assign({}, this.props, {
      ref: (field: any) => {
        this.field = field;
      },
      tabIndex: props.readOnly ? -1 : props.tabIndex || 0,
      readOnly: props.readOnly,
      value: this.value,
      dateFormat: this.dateFormat,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
      size: props.size || this.dateFormat!.length + 2,
      theme: props.theme,
    });

    if (dateInput) {
      return React.cloneElement(dateInput, dateInputProps);
    }

    return <DateFormatSpinnerInput {...dateInputProps} style={null} />;
  };

  focus = (): void => {
    if (this.field) {
      this.field.focus();
    }
  };

  onKeyDown = (event: any): void => {
    if (this.props.onEnterKey && event.key == 'Enter') {
      this.props.onEnterKey(event);
    }

    if (this.props.onEscapeKey && event.key == 'Escape') {
      this.props.onEscapeKey(event);
    }
  };

  onChange = (value: TypeValue): void => {
    if (this.props.value === undefined) {
      this.setState({
        value,
      });
    }

    if (this.props.onChange) {
      this.throttleSetValue(value);
    }
  };

  setValue = (value: TypeValue): void => {
    if (this.props.value === undefined) {
      this.setState({
        value,
      });
    }

    if (this.props.onChange) {
      this.props.onChange(value, this.dateFormat);
    }
  };

  renderClock = (): ReactElement => {
    const props = this.props;
    const clock: any = React.Children.toArray(props.children).filter(
      (child: any) => child && child.props && child.props.isDatePickerClock
    )[0];

    const dateFormat = this.dateFormat;
    const time = toMoment(this.value, { dateFormat });

    const clockProps = {
      time,
      theme: props.theme,
      showMinutesHand: dateFormat!.indexOf('mm') != -1,
      showSecondsHand: dateFormat!.indexOf('ss') != -1,
    };

    if (clock) {
      return React.cloneElement(clock, clockProps);
    }

    return <Clock {...clockProps} />;
  };
}

export { TypeClockInputProps };
export default ClockInput;
