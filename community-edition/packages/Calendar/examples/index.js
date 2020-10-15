/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import DateFormatInput from '../src/DateFormatInput';
import MonthView from '../src/MonthView';

import TimePicker from '../src/TimePicker';
import TimeInput from '../src/TimeInput';

import DecadeView from '../src/DecadeView';
import YearView from '../src/YearView';
import NavBar from '../src/NavBar';
import MonthDecadeView from '../src/MonthDecadeView';
import Calendar from '../src/Calendar';
import Footer from '../src/Footer';
import MultiMonthView from '../src/MultiMonthView';
import BasicMonthView from '../src/BasicMonthView';
import DateInput from '../src/DateInput';
import Clock from '../src/Clock';
import DateFormatSpinnerInput from '../src/DateFormatSpinnerInput';
import { Flex, Item } from '../../Flex';

import '../../Overlay/style/index.scss';

import moment from 'moment';
import React from 'react';

import { render } from 'react-dom';

import './index.scss';
require('../style/index.scss');

var range = ['2016-05-01', '2016-05-09'];
var date = moment().add(-10, 'days');

const isDisabledDay = dayProps => {
  return ['1', '2', '20'].indexOf(dayProps.day) !== -1;
};

const arrowStyle = {
  fontSize: 20,
  fontWeight: 400,
};
const navBarArrows = {
  prev: (
    <div>
      <svg fill="#ff0000" height="24" viewBox="0 0 24 24" width="24">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    </div>
  ),
  next: (
    <div>
      <svg fill="#ff0000" height="24" viewBox="0 0 24 24" width="24">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    </div>
  ),
  left: (
    <div>
      <svg width="13" height="11" viewBox="0 0 13 11">
        <g fill="#008000" fillRule="evenodd">
          <polyline points="6.793 9.707 2.594 5.5 6.793 1.292 5.5 0 0 5.5 5.5 11 6.793 9.707" />
          <polyline points="12.793 9.707 8.594 5.5 12.793 1.292 11.5 0 6 5.5 11.5 11 12.793 9.707" />
        </g>
      </svg>
    </div>
  ),
  right: (
    <div>
      <svg width="13" height="11" viewBox="0 0 13 11">
        <g fill="#008000" fillRule="evenodd">
          <polygon points="4.198 5.5 0 1.292 1.292 0 6.793 5.5 1.292 11 0 9.707" />
          <polyline points="6 9.707 10.198 5.5 6 1.292 7.293 0 12.793 5.5 7.293 11 6 9.707" />
        </g>
      </svg>
    </div>
  ),
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      text: 'atext',
      time: '03:45:21 pm',
      range: [],
      disabled: false,
      forceValidDate: false,
      value: '2012-01-26T00:00:00',
      valueToShow: null,
      dateInputText: '11-10-2017',
    };
  }

  render() {
    range = this.props.range || range;
    date = this.props.date || date;

    return (
      <div style={{ margin: 10, display: 'inline-flex' }}>
        <div>
          test
          <DateInput>
            <Calendar okButtonText="Select..." cancelButtonText="Close..." />
          </DateInput>
        </div>
        <div>DateInput:</div>
        <div>
          <DateInput
            dateFormat="YYYY-MM-DD HH:mm:ss"
            triggerChangeOnTimeChange
            onChange={value => {
              console.log(value, '!!!');
              this.setState({ value });
            }}
            onFocus={() => console.log('focused')}
            onBlur={() => console.log('blurred')}
          />{' '}
        </div>
        <div style={{ marginLeft: 50 }}>Calendar:</div>
        <Calendar
          navigation={false}
          weekDayNames={[
            ' <SUNDAY> ',
            ' <MONDAY> ',
            ' <TUESDAY> ',
            ' <WEDNESDAY> ',
            ' <THURSDAY> ',
            ' <FRIDAY> ',
            ' <SATURDAY> ',
          ]}
          isDisabledDay={({ dateMoment }) => {
            return (
              dateMoment.isBefore(moment().add(-10, 'days')) ||
              dateMoment.isAfter(moment().add(10, 'days'))
            );
          }}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById('content'));
