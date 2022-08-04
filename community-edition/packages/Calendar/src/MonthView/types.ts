/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ReactNode } from 'react';
import { TypeNavBarProps } from '../NavBar';
import { DateType, Moment } from '../toMoment';

export type TypeRenderDayProps = {
  day?: string;
  dateMoment?: Moment;
  timestamp?: number;
  key?: string;
  rootClassName?: string;
  className?: string;
  disabled?: boolean;
  children?: any;
  onMouseEnter?: (renderProps: TypeRenderDayProps) => void;
  onClick?: (event: any) => void;
};

export type TypeDayPropsMap = {
  disabled?: boolean;
};

export type GetNavigationDate = (
  dir: -1 | 1 | ((mom: Moment) => null | undefined | Moment),
  date: DateType,
  dateFormat?: string
) => null | undefined | Moment;

export type TypeMonthViewProps = {
  rootClassName?: string;
  navOnDateClick?: boolean;
  isDisabledDay?: (
    renderDayProps: TypeRenderDayProps,
    props: TypeMonthViewProps
  ) => boolean;

  onChange?: (
    dateString: string,
    {
      dateMoment,
      timestamp,
      noCollapse,
    }: {
      dateMoment?: Moment | null;
      timestamp?: number;
      noCollapse?: boolean;
      dateString?: string;
    },
    event?: Event
  ) => void;
  onViewDateChange?: (
    date: string | undefined,
    {
      dateMoment,
      dateString,
      timestamp,
    }: {
      dateMoment?: Moment | null;
      dateString?: string;
      timestamp?: number | null;
    }
  ) => void;
  onActiveDateChange?: (
    date: string | undefined,
    {
      dateMoment,
      timestamp,
      dateString,
    }: {
      dateMoment?: Moment | null;
      timestamp?: number | null;
      dateString?: string;
    }
  ) => void;

  dateFormat?: string;
  date?: DateType | null;

  theme?: string;
  className?: string | null;

  onBlur?: (event: MouseEvent) => void;
  onFocus?: (event: MouseEvent) => void;

  footerClearDate?: object;

  partialRange?: boolean;

  activateOnHover?: boolean;
  constrainActiveInView?: boolean;

  showDaysBeforeMonth?: boolean;
  showDaysAfterMonth?: boolean;

  highlightWeekends?: boolean;
  highlightToday?: boolean;

  navigation?: boolean;

  constrainViewDate?: boolean;
  highlightRangeOnMouseMove?: boolean;

  isDatePicker?: boolean;
  onRenderDay?: (renderProps: TypeRenderDayProps) => void;
  getTransitionTime?: () => void;
  cleanup?: () => void;
  navigate?: (
    dir: -1 | 1,
    event: any,
    getNavigationDate: GetNavigationDate
  ) => null | undefined | Moment;
  onRangeChange?: (
    formatted: string[],
    newRange: DateType | null,
    event?: Event
  ) => void;
  onHoverRangeChange?: (hoverRange: DateType[] | null) => void;
  renderNavBar?: (navBarProps: TypeNavBarProps) => void;
  select?: (
    {
      dateMoment,
      timestamp,
    }: { dateMoment?: Moment | null; timestamp?: number },
    event?: Event
  ) => void;
  renderChildren?: (children: any) => void;
  onFooterTodayClick?: () => boolean;
  onFooterClearClick?: () => boolean;
  onFooterCancelClick?: () => boolean;
  onFooterOkClick?: () => boolean;
  onMouseLeave?: any;

  clockTabIndex?: number;
  index?: number;

  dayPropsMap?: TypeDayPropsMap;

  insideMultiView?: boolean;
  insideField?: boolean;
  enableMonthDecadeView?: boolean;
  focusOnNavMouseDown?: boolean;
  focusOnFooterMouseDown?: boolean;
  maxConstrained?: boolean;
  minConstrained?: boolean;
  enableMonthDecadeViewAnimation?: boolean;
  showMonthDecadeViewAnimation?: number;

  disabled?: boolean;
  footer?: boolean;
  navBarArrows?: {
    prev: ReactNode;
    next: ReactNode;
    right: ReactNode;
    left: ReactNode;
  };

  cancelButton?: boolean;
  cancelButtonText?: ReactNode | string;
  okButton?: boolean;
  okButtonText?: ReactNode | string;
  showClock?: boolean;

  defaultDate?: DateType | null;
  activeDate?: DateType;
  defaultActiveDate?: DateType;
  rangeStart?: DateType | null;
  range?: DateType[] | null;
  defaultRange?: DateType[] | null;
  hoverRange?: DateType[] | null;
  defaultHoverRange?: DateType[] | null;
  minDate?: DateType;
  maxDate?: DateType;
  viewDate?: DateType;
  defaultViewDate?: DateType;
  daysInView?: Moment[];
  moment?: Moment;
  renderFooter?: (props: TypeMonthViewProps) => void;
  children?: any;
  todayButton?: () => void;
  todayButtonText?: () => void;
  clearButton?: () => void;
  clearButtonText?: () => void;
  clearDate?: DateType;
  selectDate?: DateType;
  locale?: string;
  size?: { width: number; height: number };
  viewMonthStart?: number;
  viewMonthEnd?: number;
  timestamp?: number;
  renderDay?: () => void;
  viewMoment?: Moment;
  confirm?: (date: DateType, event: MouseEvent) => void;
  minDateMoment?: Moment;
  maxDateMoment?: Moment;
};

export type TypeMonthViewState = {
  range?: DateType[] | null;
  date?: DateType | null;
  hoverRange?: DateType[] | null;
  activeDate?: DateType | null;
  viewDate?: DateType | null;
  rangeStart?: DateType | null;
  focused?: boolean;
};
