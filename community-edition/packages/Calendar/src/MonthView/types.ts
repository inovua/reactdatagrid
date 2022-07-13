/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { DateType, Moment } from '../toMoment';

export type TypeMonthViewProps = {
  rootClassName: string;
  navOnDateClick: boolean;
  isDisabledDay: () => void;

  onChange: (
    {
      dateMoment,
      timestamp,
      noCollapse,
    }: {
      dateMoment?: Moment;
      timestamp?: number;
      noCollapse?: boolean;
    },
    event?: any
  ) => void;
  onViewDateChange: () => void;
  onActiveDateChange: () => void;

  dateFormat: string;
  date: DateType;

  theme: string;

  onBlur: () => void;
  onFocus: () => void;

  footerClearDate: object;

  partialRange: boolean;

  activateOnHover: boolean;
  constrainActiveInView: boolean;

  showDaysBeforeMonth: boolean;
  showDaysAfterMonth: boolean;

  highlightWeekends: boolean;
  highlightToday: boolean;

  navigation: boolean;

  constrainViewDate: boolean;
  highlightRangeOnMouseMove: boolean;

  isDatePicker: boolean;
  onRenderDay: () => void;
  getTransitionTime: () => void;
  cleanup: () => void;
  navigate: () => void;
  onRangeChange: () => void;
  onHoverRangeChange: () => void;
  renderNavBar: () => void;
  select: () => void;
  renderChildren: () => void;
  onFooterTodayClick: () => void;
  onFooterClearClick: () => void;
  onFooterCancelClick: () => void;
  onMouseLeave: any;

  clockTabIndex: number;
  index: number;

  dayPropsMap: object;

  insideMultiView: boolean;
  insideField: boolean;
  enableMonthDecadeView: boolean;
  focusOnNavMouseDown: boolean;
  focusOnFooterMouseDown: boolean;
  maxConstrained: boolean;
  minConstrained: boolean;
  enableMonthDecadeViewAnimation: boolean;
  showMonthDecadeViewAnimation: number;

  disabled: boolean;
  footer: boolean;
  // navBarArrows: PropTypes.shape({
  //   prev: PropTypes.node,
  //   next: PropTypes.node,
  //   right: PropTypes.node,
  //   left: PropTypes.node,
  // }),

  cancelButton: boolean;
  // cancelButtonText: PropTypes.node,
  okButton: boolean;
  // okButtonText: PropTypes.oneOfType([object, string]),
  showClock: boolean;

  defaultDate: DateType;
  activeDate: DateType;
  defaultActiveDate: DateType;
  rangeStart: DateType;
  // range: PropTypes.arrayOf(DateType),
  // defaultRange: PropTypes.arrayOf(DateType),
  // hoverRange: PropTypes.arrayOf(DateType),
  // defaultHoverRange: PropTypes.arrayOf(DateType),
  minDate: DateType;
  maxDate: DateType;
  viewDate: DateType;
  defaultViewDate: DateType;
};

export type TypeMonthViewState = {};
