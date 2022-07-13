/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ReactElement, ReactNode } from 'react';
import { DateType, Moment } from '../toMoment';

export type TypeDateInputProps = {
  autoFocus?: boolean;
  rootClassName?: string;
  dateFormat: string;
  displayFormat?: string;
  relativeToViewport?: boolean;
  showClock?: boolean;
  strict?: boolean;
  expandOnFocus?: boolean;
  updateOnDateClick?: boolean;
  collapseOnDateClick?: boolean;
  enableMonthDecadeViewAnimation?: boolean;
  showMonthDecadeViewAnimation?: number;
  disabled?: boolean;
  rtl?: boolean;

  className?: string;
  theme?: string;
  footer?: boolean | ReactNode;
  onBlur?: (event: FocusEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  clearIcon?: boolean | ReactNode;
  validateOnBlur?: boolean;
  onExpandChange?: (bool: boolean) => void;
  onCollapse?: () => void;
  onExpand?: () => void;
  renderCalendarIcon?: (props: {
    className: string;
    onMouseDown: (event: any) => void;
  }) => void;

  skipTodayTime?: boolean;
  children?: any;

  date?: DateType;
  value?: DateType;
  defaultValue?: DateType;
  defaultDate?: DateType;
  viewDate?: DateType;
  minDate?: DateType;
  maxDate?: DateType;
  activeDate?: DateType;
  text?: string;
  pickerProps?: any;
  pickerPosition?: any;
  overlayProps?: object;
  constrainTo?: string | (() => void) | object | boolean;

  cleanup?: (props: any) => void;
  expanded?: boolean;
  triggerChangeOnTimeChange?: boolean;
  defaultExpanded?: boolean;
  forceValidDate?: boolean;
  valid?: boolean;
  updateOnWheel?: boolean;
  clearDate?: DateType;
  navBarArrows?: boolean;
  locale?: string;
  focusedClassName?: string;
  expandedClassName?: string;
  invalidClassName?: string;
  placeholder?: string;
  defaultViewDate?: any;

  onTextChange?: (text: string) => void;
  renderPicker?: (props: any, element?: ReactElement) => void;
  onMouseDown?: (event: MouseEvent) => void;
  onViewDateChange?: any;
  onActiveDateChange?: any;
  onChange?: (date: DateType, config?: { dateMoment?: Moment }) => string;
  renderInput?: (inputProps: any) => ReactElement;
  onLazyBlur?: () => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onClick?: (event: MouseEvent) => void;

  position?: 'top' | 'bottom';
  weekNumbers?: boolean;
  highlightWeekends?: boolean;
  calendarProps?: object;
  cancelButtonText?: string;
  clearButtonText?: string;
  okButtonText?: string;
  todayButtonText?: string;
};

export type TypeDateInputState = {
  viewDate?: DateType;
  value?: DateType;
  expanded?: boolean;
  focused?: boolean;
  activeDate?: DateType;
  text?: string;
};
