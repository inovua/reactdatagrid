/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import MonthView from './src/MonthView';

import TimePicker from './src/TimePicker';
import TimeInput from './src/TimeInput';

import TransitionView from './src/TransitionView';
import MultiMonthView from './src/MultiMonthView';

import MonthDecadeView from './src/MonthDecadeView';
import YearView from './src/YearView';
import DecadeView from './src/DecadeView';

import NavBar from './src/NavBar';
import Footer from './src/Footer';

import Clock from './src/Clock';
import ClockInput from './src/ClockInput';

import DateInput from './src/DateInput';
import Calendar from './src/Calendar';
import DateFormatInput from './src/DateFormatInput';
import DateFormatSpinnerInput from './src/DateFormatSpinnerInput';

export default Calendar;

// allow people to import with other aliases as well
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
