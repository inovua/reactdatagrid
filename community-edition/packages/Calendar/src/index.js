/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import MonthView from './MonthView';

import TimePicker from './TimePicker';
import TimeInput from './TimeInput';

import TransitionView from './TransitionView';
import MultiMonthView from './MultiMonthView';

import MonthDecadeView from './MonthDecadeView';
import YearView from './YearView';
import DecadeView from './DecadeView';

import NavBar from './NavBar';
import Footer from './Footer';

import Clock from './Clock';
import ClockInput from './ClockInput';

import DateInput from './DateInput';
import Calendar from './Calendar';
import DateFormatInput from './DateFormatInput';
import DateFormatSpinnerInput from './DateFormatSpinnerInput';

export default MonthView;

// allow people to import with other aliases as well
export const DatePicker = Calendar;
export const DateEditor = DateInput;

export {
  MonthView,
  YearView,
  DecadeView,
  MonthDecadeView,
  DateFormatInput,
  DateFormatSpinnerInput,
  TransitionView,
  MultiMonthView,
  NavBar,
  Footer,
  Clock,
  ClockInput,
  DateInput,
  Calendar,
  TimePicker,
  TimeInput,
};
