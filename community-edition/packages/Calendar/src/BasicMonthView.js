/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Component from '../../react-class';
import { Flex } from '../../Flex';
import moment from 'moment';

import assign from '../../../common/assign';
import WHITESPACE from '../../../common/whitespace';
import join from '../../../common/join';
import FORMAT from './utils/format';
import toMoment from './toMoment';
import weekDayNamesFactory from './utils/getWeekDayNames';

const RENDER_DAY = props => {
  const divProps = assign({}, props);

  delete divProps.date;
  delete divProps.dateMoment;
  delete divProps.day;
  delete divProps.timestamp;

  return <div {...divProps} />;
};

const getWeekStartDay = props => {
  const locale = props.locale;
  let weekStartDay = props.weekStartDay;

  if (weekStartDay == null) {
    const localeData = props.localeData || moment.localeData(locale);
    weekStartDay = localeData._week ? localeData._week.dow : null;
  }

  return weekStartDay;
};

/**
 * Gets the number for the first day of the weekend
 *
 * @param  {Object} props
 * @param  {Number/String} props.weekStartDay
 *
 * @return {Number}
 */
const getWeekendStartDay = props => {
  const { weekendStartDay } = props;

  if (weekendStartDay == null) {
    return getWeekStartDay(props) + (5 % 7);
  }

  return weekendStartDay;
};

/**
 * Gets a moment that points to the first day of the week
 *
 * @param  {Moment/Date/String} value]
 * @param  {Object} props
 * @param  {String} props.dateFormat
 * @param  {String} props.locale
 * @param  {Number/String} props.weekStartDay
 *
 * @return {Moment}
 */
const getWeekStartMoment = (value, props) => {
  const locale = props.locale;
  const dateFormat = props.dateFormat;

  const weekStartDay = getWeekStartDay(props);

  return toMoment(value, {
    locale,
    dateFormat,
  }).day(weekStartDay);
};

/**
 * Returns an array of moments with the days in the month of the value
 *
 * @param  {Moment/Date/String} value
 *
 * @param  {Object} props
 * @param  {String} props.locale
 * @param  {String} props.dateFormat
 * @param  {String} props.weekStartDay
 * @param  {Boolean} props.alwaysShowPrevWeek
 *
 * @return {Moment[]}
 */
const getDaysInMonthView = (value, props) => {
  const { locale, dateFormat } = props;
  const toMomentParam = { locale, dateFormat };

  const first = toMoment(value, toMomentParam).startOf('month');
  const beforeFirst = toMoment(value, toMomentParam)
    .startOf('month')
    .add(-1, 'days');

  const start = getWeekStartMoment(first, props);

  const result = [];

  let i = 0;

  if (
    beforeFirst.isBefore(start) &&
    // and it doesn't start with a full week before and the
    // week has at least 1 day from current month (default)
    (props.alwaysShowPrevWeek || !start.isSame(first))
  ) {
    start.add(-1, 'weeks');
  }

  for (; i < 42; i++) {
    result.push(toMoment(start, toMomentParam));
    start.add(1, 'days');
  }

  return result;
};

/**
 * @param  {Object} props
 * @param  {String} props.locale
 * @param  {Number} props.weekStartDay
 * @param  {Array/Function} props.weekDayNames
 *
 * @return {String[]}
 */
const getWeekDayNames = props => {
  const { weekStartDay, weekDayNames, locale } = props;

  let names = weekDayNames;

  if (typeof names == 'function') {
    names = names(weekStartDay, locale);
  } else if (Array.isArray(names)) {
    names = [...names];

    let index = weekStartDay;

    while (index > 0) {
      names.push(names.shift());
      index--;
    }
  }

  return names;
};

class BasicMonthView extends Component {
  UNSAFE_componentWillMount() {
    this.updateToMoment(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.updateToMoment(nextProps);
  }

  updateToMoment(props) {
    this.toMoment = (value, dateFormat) => {
      return toMoment(value, {
        locale: props.locale,
        dateFormat: dateFormat || props.dateFormat,
      });
    };
  }

  prepareProps(thisProps) {
    const props = assign({}, thisProps);
    props.viewMoment = props.viewMoment || this.toMoment(props.viewDate);
    props.weekStartDay = getWeekStartDay(props);
    props.className = this.prepareClassName(props);

    return props;
  }

  prepareClassName(props) {
    return join(props.className, props.rootClassName);
  }

  render() {
    const props = (this.p = this.prepareProps(this.props));

    const { viewMoment } = props;

    const daysInView =
      props.daysInView || getDaysInMonthView(viewMoment, props);

    let children = [
      this.renderWeekDayNames(),
      this.renderDays(props, daysInView),
    ];

    if (props.renderChildren) {
      children = props.renderChildren(children, props);
    }

    const flexProps = assign({}, props);

    delete flexProps.alwaysShowPrevWeek;
    delete flexProps.rootClassName;
    delete flexProps.cleanup;
    delete flexProps.dateFormat;
    delete flexProps.daysInView;
    delete flexProps.defaultDate;
    delete flexProps.defaultValue;
    delete flexProps.forceValidDate;
    delete flexProps.locale;
    delete flexProps.moment;
    delete flexProps.onClockEnterKey;
    delete flexProps.onClockEscapeKey;
    delete flexProps.onClockInputBlur;
    delete flexProps.onClockInputFocus;
    delete flexProps.onClockInputMouseDown;
    delete flexProps.onFooterCancelClick;
    delete flexProps.onFooterClearClick;
    delete flexProps.onFooterOkClick;
    delete flexProps.onFooterTodayClick;
    delete flexProps.onRenderDay;
    delete flexProps.renderChildren;
    delete flexProps.renderDay;
    delete flexProps.timestamp;
    delete flexProps.todayButton;
    delete flexProps.todayButtonText;
    delete flexProps.value;
    delete flexProps.viewDate;
    delete flexProps.viewMoment;
    delete flexProps.weekDayNames;
    delete flexProps.weekNumbers;
    delete flexProps.weekNumberName;
    delete flexProps.weekStartDay;
    delete flexProps.index;
    delete flexProps.cancelButton;
    delete flexProps.expanded;
    delete flexProps.clearIcon;
    delete flexProps.showClock;
    delete flexProps.enableMonthDecadeViewAnimation;
    delete flexProps.showMonthDecadeViewAnimation;
    delete flexProps.triggerChangeOnTimeChange;
    delete flexProps.cancelButtonText;
    delete flexProps.clearButtonText;
    delete flexProps.clearButton;
    delete flexProps.innerRef;

    if (typeof props.cleanup == 'function') {
      props.cleanup(flexProps);
    }

    return (
      <Flex
        column
        ref={props.innerRef}
        wrap={false}
        inline
        alignItems="stretch"
        {...flexProps}
        children={children}
      />
    );
  }

  /**
   * Render the week number cell
   * @param  {Moment[]} days The days in a week
   * @return {React.DOM}
   */
  renderWeekNumber(props, days) {
    const firstDayOfWeek = days[0];
    const week = firstDayOfWeek.weeks();

    const weekNumberProps = {
      key: `week_${days}`,

      className: `${props.rootClassName}-cell ${props.rootClassName}-week-number`,

      // week number
      week,

      // the days in this week
      days,

      date: firstDayOfWeek,

      children: week,
    };

    const renderWeekNumber = props.renderWeekNumber;

    let result;

    if (renderWeekNumber) {
      result = renderWeekNumber(weekNumberProps);
    }

    if (result === undefined) {
      const divProps = assign({}, weekNumberProps);

      delete divProps.date;
      delete divProps.days;
      delete divProps.week;
      delete divProps.showClock;
      delete divProps.rootClassName;

      result = <div key={weekNumberProps.key} {...divProps} />;
    }

    return result;
  }

  /**
   * Render the given array of days
   * @param  {Moment[]} days
   *
   * @return {React.DOM}
   */
  renderDays(props, days) {
    const nodes = days.map(date => this.renderDay(props, date));

    const len = days.length;
    const buckets = [];
    const bucketsLen = Math.ceil(len / 7);

    let i = 0;
    let weekStart;
    let weekEnd;

    for (; i < bucketsLen; i++) {
      weekStart = i * 7;
      weekEnd = (i + 1) * 7;

      buckets.push(
        [
          props.weekNumbers &&
            this.renderWeekNumber(props, days.slice(weekStart, weekEnd)),
        ].concat(nodes.slice(weekStart, weekEnd))
      );
    }

    const { rootClassName } = props;
    return buckets.map((bucket, index) => (
      <div
        key={`row_${index}`}
        className={`${rootClassName}-row`}
        children={bucket}
      />
    ));
  }

  renderDay(props, dateMoment) {
    const dayText = FORMAT.day(dateMoment, props.dayFormat);
    const className = join(
      `${props.rootClassName}-cell`,
      `${props.rootClassName}-day`
    );

    let renderDayProps = {
      day: dayText,
      dateMoment,
      timestamp: +dateMoment,

      key: dayText,
      className,
      children: dayText,
    };

    if (typeof props.onRenderDay === 'function') {
      const newRenderDayProps = props.onRenderDay(renderDayProps);
      if (newRenderDayProps !== undefined) {
        renderDayProps = newRenderDayProps;
      }
    }

    const renderFunction = props.renderDay || RENDER_DAY;

    let result = renderFunction(renderDayProps);

    if (result === undefined) {
      result = RENDER_DAY(renderDayProps);
    }

    return result;
  }

  renderWeekDayNames() {
    const props = this.p;
    const {
      weekNumbers,
      weekNumberName,
      weekDayNames,
      renderWeekDayNames,
      renderWeekDayName,
      weekStartDay,
      rootClassName,
    } = props;
    if (weekDayNames === false) {
      return null;
    }
    const names = weekNumbers
      ? [weekNumberName].concat(getWeekDayNames(props))
      : getWeekDayNames(props);
    const className = `${rootClassName}-row ${rootClassName}-week-day-names`;
    const renderProps = {
      className,
      names,
    };

    if (renderWeekDayNames) {
      return renderWeekDayNames(renderProps);
    }

    return (
      <div key="week_day_names" className={className}>
        {names.map((name, index) => {
          const props = {
            weekStartDay,
            index,
            name,
            className: `${rootClassName}-cell ${rootClassName}-week-day-name`,
            children: name,
          };

          if (renderWeekDayName) {
            return renderWeekDayName(props);
          }
          const divProps = assign({}, props);
          const keys = `week_${index}`;

          delete divProps.index;
          delete divProps.weekStartDay;
          delete divProps.name;
          delete divProps.showClock;
          delete divProps.rootClassName;
          return <div key={keys} {...divProps} />;
        })}
      </div>
    );
  }
}

BasicMonthView.propTypes = {
  rootClassName: PropTypes.string,
  defaultClassName: PropTypes.string,
  className: PropTypes.string,
  dateFormat: PropTypes.string,
  alwaysShowPrevWeek: PropTypes.bool,
  viewDate: PropTypes.any,
  viewMoment: PropTypes.any,
  index: PropTypes.number,
  showClock: PropTypes.bool,
  onMouseLeave: PropTypes.any,

  locale: PropTypes.string,
  weekStartDay: PropTypes.number, // 0 is Sunday in the English locale

  // boolean prop to show/hide week numbers
  weekNumbers: PropTypes.bool,

  // the name to give to the week number column
  weekNumberName: PropTypes.string,

  weekDayNames(props, propName) {
    const value = props[propName];

    if (
      typeof value != 'function' &&
      value !== false &&
      !Array.isArray(value)
    ) {
      return new Error(
        '"weekDayNames" should be a function, an array or the boolean "false"'
      );
    }

    return undefined;
  },

  renderWeekDayNames: PropTypes.func,
  renderWeekDayName: PropTypes.func,

  renderWeekNumber: PropTypes.func,
  renderDay: PropTypes.func,
  onRenderDay: PropTypes.func,
};

BasicMonthView.defaultProps = {
  rootClassName: 'inovua-react-toolkit-calendar__basic-month-view',
  dateFormat: 'YYYY-MM-DD',
  alwaysShowPrevWeek: false,
  weekNumbers: true,
  weekNumberName: `${WHITESPACE}${WHITESPACE}`,

  weekDayNames: weekDayNamesFactory,
};

export default forwardRef((props, ref) => (
  <BasicMonthView innerRef={ref} {...props} />
));

export {
  getWeekStartDay,
  getWeekStartMoment,
  getWeekendStartDay,
  getDaysInMonthView,
};
