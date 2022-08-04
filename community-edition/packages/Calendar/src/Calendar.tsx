/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Flex } from '../../Flex';

import assign from '../../../common/assign';
import join from '../../../common/join';
import assignDefined from './assignDefined';

import MonthView, { NAV_KEYS, TypeMonthViewProps } from './MonthView';
import toMoment, { DateType, Moment } from './toMoment';
import ClockInput, { TypeClockInputProps } from './ClockInput';
import forwardTime from './utils/forwardTime';

type TypeCalendarProps = {
  rootClassName?: string;
  dateFormat?: string;
  theme?: string;
  clockTabIndex?: number;
  updateOnWheel?: boolean;
  isDatePicker?: boolean;
  wrap?: boolean;
  wrapTime?: boolean;
  viewIndex?: number;
  showClock?: boolean;
  onTimeChange?: (value: DateType, timeFormat?: string) => void;
  onClockEnterKey?: () => void;
  onClockInputBlur?: () => void;
  onClockInputFocus?: () => void;
  onFooterTodayClick?: () => void;
  onFooterCancelClick?: () => void;
  onFooterClearClick?: () => void;
  onClockInputMouseDown?: () => void;
  onClockEscapeKey?: () => void;
  onFooterOkClick?: () => void;
  onChange?: (
    date: string,
    {
      dateMoment,
      timestamp,
      dateString,
      noCollapse,
    }: {
      dateMoment: Moment;
      timestamp?: number;
      dateString?: string;
      noCollapse?: boolean;
    },
    event?: any
  ) => void;
  cleanup?: (monthViewProps: TypeMonthViewProps) => void;
  triggerChangeOnTimeChange?: boolean;
  showMonthDecadeViewAnimation?: number;
  enableMonthDecadeViewAnimation?: boolean;
  date?: DateType;
  readOnly?: boolean;
  timeFormat?: string;
  locale?: string;
};

type TypeCalendarState = {
  timeFocused?: boolean;
};

const defaultProps = {
  rootClassName: 'inovua-react-toolkit-calendar__calendar',
  dateFormat: 'YYYY-MM-DD',
  theme: 'default-light',
  isDatePicker: true,
  triggerChangeOnTimeChange: true,
  enableMonthDecadeViewAnimation: true,
  showMonthDecadeViewAnimation: 300,
  wrapTime: false,
  onTimeChange: () => {},
  onClockEnterKey: () => {},
  onClockInputBlur: () => {},
  onClockInputFocus: () => {},
  onFooterTodayClick: () => {},
  onFooterCancelClick: () => {},
  onFooterClearClick: () => {},
  onFooterOkClick: () => {},
};

const propTypes = {
  rootClassName: PropTypes.string,
  dateFormat: PropTypes.string,
  theme: PropTypes.string,
  clockTabIndex: PropTypes.number,
  updateOnWheel: PropTypes.bool,
  isDatePicker: PropTypes.bool,
  wrap: PropTypes.bool,
  wrapTime: PropTypes.bool,
  viewIndex: PropTypes.number,
  showClock: PropTypes.bool,
  onTimeChange: PropTypes.func,
  onClockEnterKey: PropTypes.func,
  onClockInputBlur: PropTypes.func,
  onClockInputFocus: PropTypes.func,
  onFooterTodayClick: PropTypes.func,
  onFooterCancelClick: PropTypes.func,
  onFooterClearClick: PropTypes.func,
  onClockInputMouseDown: PropTypes.func,
  onClockEscapeKey: PropTypes.func,
  onFooterOkClick: PropTypes.func,
  onChange: PropTypes.func,
  cleanup: PropTypes.func,
  triggerChangeOnTimeChange: PropTypes.bool,
  showMonthDecadeViewAnimation: PropTypes.number,
  enableMonthDecadeViewAnimation: PropTypes.bool,
};

const hasTime = (dateFormat: string | undefined) => {
  dateFormat = dateFormat ? dateFormat.toLowerCase() : '';

  return dateFormat.indexOf('k') != -1 || dateFormat.indexOf('h') != -1;
};

class Calendar extends Component<TypeCalendarProps, TypeCalendarState> {
  static defaultProps = defaultProps;
  static propTypes = propTypes;

  private view: any;
  private clockInput: any;
  private p: TypeCalendarProps = {};
  private time?: DateType;

  constructor(props: TypeCalendarProps) {
    super(props);

    this.state = { timeFocused: false };
  }

  getDOMNode = (): ReactNode | null => {
    return this.view ? this.view.getDOMNode() : null;
  };

  prepareDate = (props: TypeCalendarProps): Moment => {
    return toMoment(props.date, props);
  };

  render = () => {
    const props = (this.p = assign({}, this.props));
    const dateFormat = props.dateFormat.toLowerCase();

    props.date = this.prepareDate(props);
    if (props.showClock === undefined) {
      props.showClock =
        dateFormat.indexOf('k') != -1 || dateFormat.indexOf('h') != -1;
    }

    let startTimeIndex = dateFormat.toLowerCase().indexOf('h');
    if (startTimeIndex === -1) {
      startTimeIndex = dateFormat.toLowerCase().indexOf('k');
    }

    const timeFormat = dateFormat.substring(startTimeIndex);

    props.timeFormat = timeFormat;

    const { rootClassName } = props;
    const className = join(
      props.className,
      rootClassName,
      props.theme && `${rootClassName}--theme-${props.theme}`
    );

    const monthViewProps = assign({}, this.props);
    // const keys = monthViewProps.date / 7;

    delete monthViewProps.onTimeChange;
    delete monthViewProps.updateOnWheel;
    delete monthViewProps.wrapTime;
    delete monthViewProps.rootClassName;
    delete monthViewProps.showClock;

    if (typeof this.props.cleanup == 'function') {
      this.props.cleanup(monthViewProps);
    }

    const monthView = (
      <MonthView
        {...monthViewProps}
        onChange={this.onChange}
        className={null}
        style={null}
        ref={view => {
          this.view = view;
        }}
        renderChildren={this.renderChildren}
        showClock={props.showClock}
      />
    );

    return (
      <Flex inline row wrap={false} className={className} style={props.style}>
        {monthView}
      </Flex>
    );
  };

  isMonthDecadeViewVisible = (): boolean => {
    if (this.view && this.view.isMonthDecadeViewVisible) {
      return this.view.isMonthDecadeViewVisible();
    }

    return false;
  };

  renderChildren = ([navBar, inner, footer]: any[]): ReactNode => {
    const props = this.p;
    const clockInput = props.showClock ? this.renderClockInput() : null;

    return (
      <Flex key="date_picker_comp" column wrap={false} alignItems="stretch">
        {[
          navBar
            ? React.cloneElement(navBar, { key: 'calendar_navBar' })
            : null,
          <Flex
            key="calendar_inner"
            justifyContent="center"
            wrap={this.props.wrap || this.props.wrapTime}
          >
            <Flex
              flexGrow="1"
              flexShrink="0"
              flexBasis="auto"
              column
              wrap={false}
              alignItems="stretch"
              children={inner}
            />
            {clockInput}
          </Flex>,
          footer
            ? React.cloneElement(footer, { key: 'calendar_footer' })
            : null,
        ]}
      </Flex>
    );
  };

  focus = (): void => {
    if (this.view) {
      this.view.focus();
    }
  };

  isFocused = (): boolean => {
    if (this.view) {
      return this.view.isFocused();
    }

    return false;
  };

  onViewKeyDown = (...args: any): void => {
    if (this.view) {
      this.view.onViewKeyDown(...args);
    }
  };

  isTimeInputFocused = (): boolean | undefined => {
    return this.state.timeFocused;
  };

  renderClockInput = (): ReactElement => {
    const clockInput = null;
    const readOnly = this.props.readOnly;
    const clockInputProps: TypeClockInputProps = {
      ref: (clkInput: any) => {
        this.clockInput = clkInput;
      },
      theme: this.props.theme,
      viewIndex: this.props.viewIndex,
      dateFormat: this.p.dateFormat,
      [readOnly ? 'value' : 'defaultValue']: this.p.date,
      onFocus: this.onClockInputFocus,
      onBlur: this.onClockInputBlur,
      onChange: this.onTimeChange,
      onMouseDown: this.onClockInputMouseDown,
    };

    assignDefined(clockInputProps, {
      onEnterKey: this.props.onClockEnterKey,
      onEscapeKey: this.props.onClockEscapeKey,
      readOnly,
      tabIndex: readOnly ? null : this.props.clockTabIndex,
      theme: this.props.theme,
      updateOnWheel: this.props.updateOnWheel,
    });

    if (clockInput) {
      return React.cloneElement(clockInput, clockInputProps);
    }

    return <ClockInput {...clockInputProps} />;
  };

  onClockInputFocus = (): void => {
    this.setState({
      timeFocused: true,
    });

    this.props.onClockInputFocus!();
  };

  onClockInputBlur = (): void => {
    this.setState({
      timeFocused: false,
    });

    this.props.onClockInputBlur!();
  };

  onClockInputMouseDown = (event: any): void => {
    event.stopPropagation();
    if (event.target && event.target.type != 'text') {
      // in order not to blur - in case we're in a date field
      event.preventDefault();
    }

    this.clockInput!.focus();
  };

  onTimeChange = (value: DateType, timeFormat?: string): void => {
    this.time = value;
    this.props.onTimeChange!(value, timeFormat);

    const view = this.view;
    const moment = view.p.moment;

    if (moment == null) {
      return;
    }

    if (this.props.triggerChangeOnTimeChange) {
      view.onChange({
        dateMoment: moment,
        timestamp: +moment,
        noCollapse: this.props.triggerChangeOnTimeChange,
      });
    }
  };

  onChange = (
    dateString: string,
    {
      dateMoment,
      timestamp,
      noCollapse,
    }: {
      dateMoment: Moment;
      timestamp?: number;
      noCollapse?: boolean;
    },
    event?: any
  ) => {
    const props = this.p;

    if (props.showClock) {
      const time = toMoment(this.time || this.clockInput.getValue(), {
        dateFormat: props.timeFormat,
        locale: props.locale,
      });

      forwardTime(time, dateMoment);
      timestamp = +dateMoment;
      dateString = this.view.format(dateMoment);
    } else if (hasTime(props.dateFormat)) {
      forwardTime(props.date, dateMoment);
      timestamp = +dateMoment;
      dateString = this.view.format(dateMoment);
    }

    if (this.props.onChange) {
      this.props.onChange(
        dateString,
        { dateMoment, timestamp, dateString, noCollapse },
        event
      );
    }
  };
}

export { TypeCalendarProps };
export { NAV_KEYS };
export default Calendar;
