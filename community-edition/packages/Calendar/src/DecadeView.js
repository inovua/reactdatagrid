/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import Component from '../../react-class';
import moment from 'moment';
import { Flex, Item } from '../../Flex';
import assign from '../../../common/assign';
import join from '../../../common/join';

import times from './utils/times';
import toMoment from './toMoment';
import bemFactory from './bemFactory';

import ON_KEY_DOWN from './MonthView/onKeyDown';

const ARROWS = {
  prev: (
    <svg width="5" height="10" viewBox="0 0 5 10">
      <path
        fillRule="evenodd"
        d="M.262 4.738L4.368.632c.144-.144.379-.144.524 0C4.96.702 5 .796 5 .894v8.212c0 .204-.166.37-.37.37-.099 0-.193-.039-.262-.108L.262 5.262c-.145-.145-.145-.38 0-.524z"
      />
    </svg>
  ),

  next: (
    <svg width="5" height="10" viewBox="0 0 5 10">
      <path
        fillRule="evenodd"
        d="M4.738 5.262L.632 9.368c-.144.144-.379.144-.524 0C.04 9.298 0 9.204 0 9.106V.894C0 .69.166.524.37.524c.099 0 .193.039.262.108l4.106 4.106c.145.145.145.38 0 .524z"
      />
    </svg>
  ),
};

const getDecadeStartYear = mom => {
  const year = mom.get('year');

  return year - (year % 10);
};

const getDecadeEndYear = mom => {
  return getDecadeStartYear(mom) + 9;
};

const NAV_KEYS = {
  ArrowUp(mom) {
    return mom.add(-5, 'year');
  },
  ArrowDown(mom) {
    return mom.add(5, 'year');
  },
  ArrowLeft(mom) {
    return mom.add(-1, 'year');
  },
  ArrowRight(mom) {
    return mom.add(1, 'year');
  },
  Home(mom) {
    return mom.set('year', getDecadeStartYear(mom));
  },
  End(mom) {
    return mom.set('year', getDecadeEndYear(mom));
  },
  PageUp(mom) {
    return mom.add(-10, 'year');
  },
  PageDown(mom) {
    return mom.add(10, 'year');
  },
};

const isDateInMinMax = (timestamp, props) => {
  if (props.minDate && timestamp < props.minDate) {
    return false;
  }
  if (props.maxDate && timestamp > props.maxDate) {
    return false;
  }

  return true;
};

const isValidActiveDate = (timestamp, props) => {
  if (!props) {
    throw new Error('props is mandatory in isValidActiveDate');
  }
  return isDateInMinMax(timestamp, props);
};

const select = function({ dateMoment, timestamp }, event) {
  if (this.props.select) {
    return this.props.select({ dateMoment, timestamp }, event);
  }
  if (!timestamp) {
    timestamp = +dateMoment;
  }
  this.gotoViewDate({ dateMoment, timestamp });
  this.onChange({ dateMoment, timestamp }, event);

  return undefined;
};

const confirm = function(date, event) {
  event.preventDefault();

  if (this.props.confirm) {
    return this.props.confirm(date, event);
  }

  const dateMoment = this.toMoment(date);
  const timestamp = +dateMoment;

  this.select({ dateMoment, timestamp }, event);

  if (this.props.onConfirm) {
    this.props.onConfirm({ dateMoment, timestamp });
  }

  return undefined;
};

const onActiveDateChange = function({ dateMoment, timestamp }) {
  if (!isValidActiveDate(timestamp, this.p)) {
    return;
  }

  if (this.props.activeDate === undefined) {
    this.setState({
      activeDate: timestamp,
    });
  }

  if (this.props.onActiveDateChange) {
    const dateString = this.format(dateMoment);
    this.props.onActiveDateChange(dateString, {
      dateMoment,
      timestamp,
      dateString,
    });
  }
};

const onViewDateChange = function({ dateMoment, timestamp }) {
  if (dateMoment && timestamp === undefined) {
    timestamp = +dateMoment;
  }
  if (this.props.constrainViewDate && !isDateInMinMax(timestamp, this.p)) {
    return;
  }

  if (this.props.viewDate === undefined) {
    this.setState({
      viewDate: timestamp,
    });
  }

  if (this.props.onViewDateChange) {
    const dateString = this.format(dateMoment);
    this.props.onViewDateChange(dateString, {
      dateMoment,
      dateString,
      timestamp,
    });
  }
};

const onChange = function({ dateMoment, timestamp }, event) {
  if (this.props.date === undefined) {
    this.setState({
      date: timestamp,
    });
  }

  if (this.props.onChange) {
    const dateString = this.format(dateMoment);
    this.props.onChange(
      dateString,
      { dateMoment, timestamp, dateString },
      event
    );
  }
};

const navigate = function(direction, event) {
  const props = this.p;

  const getNavigationDate = (dir, date, dateFormat) => {
    const mom = moment.isMoment(date) ? date : this.toMoment(date, dateFormat);

    if (typeof dir == 'function') {
      return dir(mom);
    }

    return mom;
  };

  if (props.navigate) {
    return props.navigate(direction, event, getNavigationDate);
  }

  event.preventDefault();

  if (props.activeDate) {
    const nextMoment = getNavigationDate(direction, props.activeDate);

    this.gotoViewDate({ dateMoment: nextMoment });
  }

  return undefined;
};

const gotoViewDate = function({ dateMoment, timestamp }) {
  if (!timestamp) {
    timestamp = dateMoment == null ? null : +dateMoment;
  }

  this.onViewDateChange({ dateMoment, timestamp });
  this.onActiveDateChange({ dateMoment, timestamp });
};

const prepareDate = function(props, state) {
  return props.date === undefined ? state.date : props.date;
};

const prepareViewDate = function(props, state) {
  const viewDate =
    props.viewDate === undefined ? state.viewDate : props.viewDate;

  if (!viewDate && props.date) {
    return props.date;
  }

  return viewDate;
};

const prepareActiveDate = function(props, state) {
  const activeDate =
    props.activeDate === undefined
      ? state.activeDate || prepareDate(props, state)
      : props.activeDate;

  return activeDate;
};

const prepareMinMax = function(props) {
  const { minDate, maxDate } = props;

  const result = {};

  if (minDate != null) {
    result.minDateMoment = toMoment(props.minDate, props).startOf(
      props.adjustMinDateStartOf
    );

    result.minDate = +result.minDateMoment;
  }

  if (maxDate != null) {
    result.maxDateMoment = toMoment(props.maxDate, props).endOf(
      props.adjustMaxDateStartOf
    );

    result.maxDate = +result.maxDateMoment;
  }

  return result;
};

const prepareDateProps = function(props, state) {
  const result = {};

  assign(result, prepareMinMax(props));

  result.date = prepareDate(props, state);
  result.viewDate = prepareViewDate(props, state);

  const activeDate = prepareActiveDate(props, state);

  if (result.date != null) {
    result.moment = toMoment(result.date, props);
    if (props.adjustDateStartOf) {
      result.moment.startOf(props.adjustDateStartOf);
    }
    result.timestamp = +result.moment;
  }

  if (activeDate) {
    result.activeMoment = toMoment(activeDate, props);
    if (props.adjustDateStartOf) {
      result.activeMoment.startOf(props.adjustDateStartOf);
    }
    result.activeDate = +result.activeMoment;
  }

  let viewMoment = toMoment(result.viewDate, props);

  if (
    props.constrainViewDate &&
    result.minDate != null &&
    viewMoment.isBefore(result.minDate)
  ) {
    result.minConstrained = true;
    viewMoment = toMoment(result.minDate, props);
  }

  if (
    props.constrainViewDate &&
    result.maxDate != null &&
    viewMoment.isAfter(result.maxDate)
  ) {
    result.maxConstrained = true;
    viewMoment = toMoment(result.maxDate, props);
  }

  if (props.adjustDateStartOf) {
    viewMoment.startOf(props.adjustDateStartOf);
  }

  result.viewMoment = viewMoment;

  return result;
};

const getInitialState = props => {
  return {
    date: props.defaultDate,
    activeDate: props.defaultActiveDate,
    viewDate: props.defaultViewDate,
  };
};

export default class DecadeView extends Component {
  constructor(props) {
    super(props);

    this.decadeViewRef = createRef();

    this.state = getInitialState(props);
  }

  getYearsInDecade(value) {
    const year = getDecadeStartYear(this.toMoment(value));

    const start = this.toMoment(`${year}`, 'YYYY').startOf('year');

    return times(10).map(i => {
      return this.toMoment(start).add(i, 'year');
    });
  }

  toMoment(date, format) {
    return toMoment(date, format, this.props);
  }

  render() {
    const props = (this.p = assign({}, this.props));

    if (props.onlyCompareYear) {
    }

    const dateProps = prepareDateProps(props, this.state);

    assign(props, dateProps);

    const yearsInView = this.getYearsInDecade(props.viewMoment);

    const { rootClassName } = props;
    const className = join(
      props.className,
      rootClassName,
      props.theme && `${rootClassName}--theme-${props.theme}`
    );

    let children = this.renderYears(props, yearsInView);
    let align = 'stretch';
    let column = true;

    if (props.navigation) {
      column = false;
      align = 'center';

      children = [
        this.renderNav(-1),
        <Flex
          key="year_view"
          inline
          flex
          column
          alignItems="stretch"
          children={children}
        />,
        this.renderNav(1),
      ];
    }

    const flexProps = assign({}, this.props);

    delete flexProps.activeDate;
    delete flexProps.adjustDateStartOf;
    delete flexProps.adjustMaxDateStartOf;
    delete flexProps.adjustMinDateStartOf;
    delete flexProps.arrows;
    delete flexProps.cleanup;
    delete flexProps.constrainViewDate;
    delete flexProps.date;
    delete flexProps.dateFormat;
    delete flexProps.isDecadeView;
    delete flexProps.maxDate;
    delete flexProps.minDate;
    delete flexProps.navigation;
    delete flexProps.navKeys;
    delete flexProps.onActiveDateChange;
    delete flexProps.onConfirm;
    delete flexProps.onlyCompareYear;
    delete flexProps.onViewDateChange;
    delete flexProps.perRow;
    delete flexProps.theme;
    delete flexProps.viewDate;
    delete flexProps.yearFormat;
    delete flexProps.rootClassName;

    if (typeof props.cleanup == 'function') {
      props.cleanup(flexProps);
    }

    return (
      <Flex
        inline
        ref={this.decadeViewRef}
        column={column}
        alignItems={align}
        tabIndex={0}
        {...flexProps}
        onKeyDown={this.onKeyDown}
        className={className}
        children={children}
      />
    );
  }

  renderNav(dir) {
    const props = this.p;

    const name = dir == -1 ? 'prev' : 'next';
    const navMoment = this.toMoment(props.viewMoment).add(dir * 10, 'year');
    const disabled =
      dir == -1
        ? props.minDateMoment &&
          getDecadeEndYear(navMoment) < getDecadeEndYear(props.minDateMoment)
        : props.maxDateMoment &&
          getDecadeEndYear(navMoment) > getDecadeEndYear(props.maxDateMoment);
    const { rootClassName } = props;
    const className = join(
      `${rootClassName}-arrow`,
      `${rootClassName}-arrow--${name}`,
      disabled && `${rootClassName}-arrow--disabled`
    );

    const arrow = props.arrows[name] || ARROWS[name];

    const arrowProps = {
      className,
      onClick: !disabled
        ? () =>
            this.onViewDateChange({
              dateMoment: navMoment,
              timestamp: this.toMoment(props.viewMoment),
            })
        : null,
      children: arrow,
      disabled,
    };

    if (props.renderNavigation) {
      return props.renderNavigation(arrowProps, props);
    }

    return <div key={`nav_arrow_${dir}`} {...arrowProps} />;
  }

  renderYears(props, years) {
    const nodes = years.map(this.renderYear);
    const perRow = props.perRow;
    const buckets = times(Math.ceil(nodes.length / perRow)).map(i => {
      return nodes.slice(i * perRow, (i + 1) * perRow);
    });

    return buckets.map((bucket, i) => (
      <Flex
        alignItems="center"
        flex
        row
        inline
        key={`row_${i}`}
        className={`${props.rootClassName}-row`}
      >
        {bucket}
      </Flex>
    ));
  }

  renderYear(dateMoment) {
    const props = this.p;
    const yearText = this.format(dateMoment);

    const timestamp = +dateMoment;

    const isActiveDate =
      props.onlyCompareYear && props.activeMoment
        ? dateMoment.get('year') == props.activeMoment.get('year')
        : timestamp === props.activeDate;

    const isValue =
      props.onlyCompareYear && props.moment
        ? dateMoment.get('year') == props.moment.get('year')
        : timestamp === props.timestamp;

    const { rootClassName } = props;
    const className = join(
      `${rootClassName}-year`,
      isActiveDate && `${rootClassName}-year--active`,
      isValue && `${rootClassName}-year--value`,
      props.minDate != null &&
        timestamp < props.minDate &&
        `${rootClassName}-year--disabled`,
      props.maxDate != null &&
        timestamp > props.maxDate &&
        `${rootClassName}-year--disabled`
    );

    const onClick = this.handleClick.bind(this, {
      dateMoment,
      timestamp,
    });

    return (
      <Item key={yearText} className={className} onClick={onClick}>
        {yearText}
      </Item>
    );
  }

  format(mom, format) {
    format = format || this.props.yearFormat;

    return mom.format(format);
  }

  handleClick({ timestamp, dateMoment }, event) {
    event.target.value = timestamp;
    const props = this.p;
    if (props.minDate && timestamp < props.minDate) {
      return;
    }
    if (props.maxDate && timestamp > props.maxDate) {
      return;
    }
    this.select({ dateMoment, timestamp }, event);
  }

  onKeyDown(event) {
    return ON_KEY_DOWN.call(this, event);
  }

  confirm(date, event) {
    return confirm.call(this, date, event);
  }

  navigate(direction, event) {
    return navigate.call(this, direction, event);
  }

  select({ dateMoment, timestamp }, event) {
    return select.call(this, { dateMoment, timestamp }, event);
  }

  onViewDateChange({ dateMoment, timestamp }) {
    return onViewDateChange.call(this, { dateMoment, timestamp });
  }

  gotoViewDate({ dateMoment, timestamp }) {
    return gotoViewDate.call(this, { dateMoment, timestamp });
  }

  onActiveDateChange({ dateMoment, timestamp }) {
    return onActiveDateChange.call(this, { dateMoment, timestamp });
  }

  onChange({ dateMoment, timestamp }, event) {
    return onChange.call(this, { dateMoment, timestamp }, event);
  }

  getDOMNode() {
    return this.decadeViewRef.current;
  }

  focus() {
    this.decadeViewRef.current.focus();
  }
}

DecadeView.defaultProps = {
  rootClassName: 'inovua-react-toolkit-calendar__decade-view',
  isDecadeView: true,
  arrows: {},
  navigation: true,
  constrainViewDate: true,
  navKeys: NAV_KEYS,
  theme: 'default',
  yearFormat: 'YYYY',
  dateFormat: 'YYYY-MM-DD',
  perRow: 5,
  onlyCompareYear: true,
  adjustDateStartOf: 'year',
  adjustMinDateStartOf: 'year',
  adjustMaxDateStartOf: 'year',
};

DecadeView.propTypes = {
  isDecadeView: PropTypes.bool,
  rootClassName: PropTypes.string,
  navigation: PropTypes.bool,
  constrainViewDate: PropTypes.bool,
  arrows: PropTypes.object,
  navKeys: PropTypes.object,
  theme: PropTypes.string,
  yearFormat: PropTypes.string,
  dateFormat: PropTypes.string,
  perRow: PropTypes.number,
  minDate: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  maxDate: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  viewDate: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  date: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  defaultDate: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  viewMoment: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  moment: PropTypes.object,
  minDateMoment: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  maxDateMoment: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),

  onlyCompareYear: PropTypes.bool,
  adjustDateStartOf: PropTypes.string,
  adjustMinDateStartOf: PropTypes.string,
  adjustMaxDateStartOf: PropTypes.string,

  activeDate: PropTypes.number,

  select: PropTypes.func,
  confirm: PropTypes.func,
  onConfirm: PropTypes.func,
  onActiveDateChange: PropTypes.func,
  onViewDateChange: PropTypes.func,
  cleanup: PropTypes.func,
  onChange: PropTypes.func,
  renderNavigation: PropTypes.func,
  navigate: PropTypes.func,
};

export {
  onChange,
  onViewDateChange,
  onActiveDateChange,
  select,
  confirm,
  gotoViewDate,
  navigate,
  ON_KEY_DOWN as onKeyDown,
  prepareActiveDate,
  prepareViewDate,
  prepareMinMax,
  prepareDateProps,
  prepareDate,
  isDateInMinMax,
  isValidActiveDate,
  getInitialState,
};
