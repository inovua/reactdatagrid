/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import Component from '../../react-class';
import { Flex, Item } from '../../Flex';
import assign from '../../../common/assign';
import join from '../../../common/join';
import times from './utils/times';
import toMoment from './toMoment';
import bemFactory from './bemFactory';

import {
  prepareDateProps,
  getInitialState,
  onKeyDown,
  onViewDateChange,
  onActiveDateChange,
  onChange,
  navigate,
  select,
  confirm,
  gotoViewDate,
} from './DecadeView';

const bem = bemFactory('react-calendar__year-view');

const NAV_KEYS = {
  ArrowUp(mom) {
    if (mom.get('month') >= 4) {
      mom.add(-4, 'month');
    }
    return mom;
  },
  ArrowDown(mom) {
    if (mom.get('month') <= 7) {
      mom.add(4, 'month');
    }
    return mom;
  },
  ArrowLeft(mom) {
    if (mom.get('month') >= 1) {
      mom.add(-1, 'month');
    }
    return mom;
  },
  ArrowRight(mom) {
    if (mom.get('month') <= 10) {
      mom.add(1, 'month');
    }
    return mom;
  },
  Home(mom) {
    return mom.startOf('year').startOf('month');
  },
  End(mom) {
    return mom.endOf('year').startOf('month');
  },

  PageUp(mom) {
    const month = mom.get('month') - 4;
    const extra4 = month - 4;
    if (month >= 0) {
      if (extra4 >= 0) {
        return mom.set('month', extra4);
      }
      return mom.set('month', month);
    }
    return mom;
  },

  PageDown(mom) {
    const month = mom.get('month') + 4;
    const extra4 = month + 4;
    if (month <= 11) {
      if (extra4 <= 11) {
        return mom.set('month', extra4);
      }
      return mom.set('month', month);
    }
    return mom;
  },
};

export default class YearView extends Component {
  constructor(props) {
    super(props);
    this.state = getInitialState(props);

    this.yearViewRef = createRef();
  }

  /**
   * Returns all the days in the specified month.
   *
   * @param  {Moment/Date/Number} value
   * @return {Moment[]}
   */
  getMonthsInYear(value) {
    const start = this.toMoment(value).startOf('year');

    return times(12).map(i => this.toMoment(start).add(i, 'month'));
  }

  toMoment(date) {
    return toMoment(date, this.props);
  }

  render() {
    const props = (this.p = assign({}, this.props));
    const { rootClassName } = props;

    const dateProps = prepareDateProps(props, this.state);

    assign(props, dateProps);

    const className = join(
      props.className,
      rootClassName,
      props.theme && `${rootClassName}--theme-${props.theme}`
    );

    const monthsInView = this.getMonthsInYear(props.viewMoment);

    const flexProps = assign({}, props);

    delete flexProps.rootClassName;
    delete flexProps.activeDate;
    delete flexProps.activeMoment;
    delete flexProps.adjustDateStartOf;
    delete flexProps.adjustMaxDateStartOf;
    delete flexProps.adjustMinDateStartOf;
    delete flexProps.cleanup;
    delete flexProps.constrainViewDate;

    delete flexProps.date;
    delete flexProps.dateFormat;
    delete flexProps.isYearView;
    delete flexProps.maxConstrained;
    delete flexProps.maxDate;
    delete flexProps.maxDateMoment;
    delete flexProps.minConstrained;
    delete flexProps.minDate;
    delete flexProps.minDateMoment;
    delete flexProps.moment;
    delete flexProps.monthFormat;
    delete flexProps.navKeys;
    delete flexProps.onActiveDateChange;
    delete flexProps.onViewDateChange;
    delete flexProps.onlyCompareMonth;

    delete flexProps.timestamp;
    delete flexProps.theme;

    delete flexProps.viewDate;
    delete flexProps.viewMoment;

    if (typeof props.cleanup == 'function') {
      props.cleanup(flexProps);
    }

    return (
      <Flex
        inline
        column
        ref={this.yearViewRef}
        alignItems="stretch"
        tabIndex={0}
        {...flexProps}
        onKeyDown={this.onKeyDown}
        className={className}
      >
        {this.renderMonths(props, monthsInView)}
      </Flex>
    );
  }

  renderMonths(props, months) {
    const nodes = months.map(monthMoment =>
      this.renderMonth(props, monthMoment)
    );
    const buckets = times(Math.ceil(nodes.length / 4)).map(i => {
      return nodes.slice(i * 4, (i + 1) * 4);
    });
    const className = `${this.props.rootClassName}-row`;
    return buckets.map((bucket, i) => (
      <Flex
        alignItems="center"
        flex
        row
        inline
        key={`row_${i}`}
        className={className}
      >
        {bucket}
      </Flex>
    ));
  }

  format(mom, format) {
    format = format || this.props.monthFormat;
    return mom.format(format);
  }

  renderMonth(props, dateMoment) {
    const index = dateMoment.get('month');

    const monthText = props.monthNames
      ? props.monthNames[index] || this.format(dateMoment)
      : this.format(dateMoment);

    const timestamp = +dateMoment;

    const isActiveDate =
      props.onlyCompareMonth && props.activeMoment
        ? dateMoment.get('month') == props.activeMoment.get('month')
        : timestamp === props.activeDate;

    const isValue =
      props.onlyCompareMonth && props.moment
        ? dateMoment.get('month') == props.moment.get('month')
        : timestamp === props.timestamp;
    const disabled =
      (props.minDate != null && timestamp < props.minDate) ||
      (props.maxDate != null && timestamp > props.maxDate);

    const { rootClassName } = props;
    const className = join(
      `${rootClassName}-month`,
      !disabled && isActiveDate && `${rootClassName}-month--active`,
      !disabled && isValue && `${rootClassName}-month--value`,
      disabled && `${rootClassName}-month--disabled`
    );

    const onClick = disabled
      ? null
      : this.handleClick.bind(this, {
          dateMoment,
          timestamp,
        });

    return (
      <Item key={monthText} className={className} onClick={onClick}>
        {monthText}
      </Item>
    );
  }

  handleClick({ timestamp, dateMoment }, event) {
    event.target.value = timestamp;

    this.select({ dateMoment, timestamp }, event);
  }

  onKeyDown(event) {
    return onKeyDown.call(this, event);
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

  focus() {
    this.yearViewRef.current.focus();
  }

  getDOMNode() {
    return this.yearViewRef.current;
  }
}

YearView.defaultProps = {
  rootClassName: 'inovua-react-toolkit-calendar__year-view',
  isYearView: true,
  navKeys: NAV_KEYS,
  constrainViewDate: true,
  theme: 'default',
  monthFormat: 'MMM',
  dateFormat: 'YYYY-MM-DD',
  onlyCompareMonth: true,
  adjustDateStartOf: 'month',
  adjustMinDateStartOf: 'month',
  adjustMaxDateStartOf: 'month',
};

YearView.propTypes = {
  rootClassName: PropTypes.string,
  navKeys: PropTypes.object,
  isYearView: PropTypes.bool,
  constrainViewDate: PropTypes.bool,
  onlyCompareMonth: PropTypes.bool,
  theme: PropTypes.string,
  monthFormat: PropTypes.string,
  dateFormat: PropTypes.string,
  adjustDateStartOf: PropTypes.string,
  adjustMinDateStartOf: PropTypes.string,
  adjustMaxDateStartOf: PropTypes.string,
};
