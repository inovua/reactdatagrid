/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, createRef, ReactNode } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Flex, Item } from '../../Flex';
import assign from '../../../common/assign';
import join from '../../../common/join';

import times from './utils/times';
import toMoment, { Moment, DateType } from './toMoment';
import { TypeYearViewProps } from './YearView';
import ON_KEY_DOWN from './MonthView/onKeyDown';
import { GetNavigationDate } from './MonthView/types';

type TypeArrows = {
  prev: ReactNode;
  next: ReactNode;
};

type TypeArrowProps = {
  className?: string;
  onClick?: any;
  children?: ReactNode;
  disabled?: boolean | 0;
};

type TypeNavKeys = {
  ArrowUp: (mom: Moment) => Moment;
  ArrowDown: (mom: Moment) => Moment;
  ArrowLeft: (mom: Moment) => Moment;
  ArrowRight: (mom: Moment) => Moment;
  Home: (mom: Moment) => Moment;
  End: (mom: Moment) => Moment;
  PageUp: (mom: Moment) => Moment;
  PageDown: (mom: Moment) => Moment;
};

type TypeDecadeViewProps = {
  isDecadeView?: boolean;
  rootClassName?: string;
  navigation?: boolean;
  constrainViewDate?: boolean;
  arrows?: TypeArrows;
  navKeys?: TypeNavKeys;
  theme?: string;
  yearFormat?: string;
  dateFormat?: string;
  perRow?: number;

  minDate?: DateType;
  maxDate?: DateType;
  viewDate?: DateType;
  date?: DateType;
  defaultDate?: DateType;

  tabIndex?: number | null;

  viewMoment?: DateType;
  moment?: Moment;
  minDateMoment?: Moment;
  maxDateMoment?: Moment;

  onlyCompareYear?: boolean;
  adjustDateStartOf?: any;
  adjustMinDateStartOf?: any;
  adjustMaxDateStartOf?: any;

  activeDate?: DateType;
  defaultActiveDate?: DateType;
  defaultViewDate?: DateType;
  activeMoment?: Moment;
  timestamp?: number;

  onMouseDown?: (e: Event) => void;
  select?: (
    {
      dateMoment,
      timestamp,
    }: { dateMoment?: Moment; timestamp?: number | null },
    event?: any
  ) => void;
  confirm?: (date: DateType, event: any) => void;
  onConfirm?: ({
    dateMoment,
    timestamp,
  }: {
    dateMoment?: Moment;
    timestamp?: number | null;
  }) => void;
  onActiveDateChange?: (
    date: string,
    {
      dateMoment,
      timestamp,
      dateString,
    }: {
      dateMoment?: Moment;
      timestamp?: number | null;
      dateString?: string;
    }
  ) => void;
  onViewDateChange?: (
    date: string,
    {
      dateMoment,
      dateString,
      timestamp,
    }: {
      dateMoment?: Moment;
      dateString?: string;
      timestamp?: number | null;
    }
  ) => void;
  cleanup?: () => void;
  onChange?: (
    date: string,
    {
      dateMoment,
      timestamp,
      dateString,
    }: { dateMoment?: Moment; timestamp?: number | null; dateString?: string },
    event?: any
  ) => void;
  renderNavigation?: (
    arrowProps: TypeArrowProps,
    props?: TypeDecadeViewProps
  ) => void;
  navigate?: (
    direction: -1 | 1 | ((mom: Moment) => Moment),
    event: any,
    getNavigationDate?: GetNavigationDate
  ) => void;
};

type TypeDecadeViewState = {
  date?: DateType;
  viewDate?: DateType;
  activeDate?: DateType;
};

const NAV_KEYS: TypeNavKeys = {
  ArrowUp(mom: Moment) {
    return mom.add(-5, 'year');
  },
  ArrowDown(mom: Moment) {
    return mom.add(5, 'year');
  },
  ArrowLeft(mom: Moment) {
    return mom.add(-1, 'year');
  },
  ArrowRight(mom: Moment) {
    return mom.add(1, 'year');
  },
  Home(mom: Moment) {
    return mom.set('year', getDecadeStartYear(mom));
  },
  End(mom: Moment) {
    return mom.set('year', getDecadeEndYear(mom));
  },
  PageUp(mom: Moment) {
    return mom.add(-10, 'year');
  },
  PageDown(mom: Moment) {
    return mom.add(10, 'year');
  },
};

const defaultProps = {
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

const propTypes = {
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

const ARROWS: TypeArrows = {
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

const getDecadeStartYear = (mom: Moment): number => {
  const year = mom.get('year');

  return year - (year % 10);
};

const getDecadeEndYear = (mom: Moment): number => {
  return getDecadeStartYear(mom) + 9;
};

const isDateInMinMax = (
  timestamp: Moment | undefined,
  props: TypeDecadeViewProps | TypeYearViewProps
): boolean => {
  if (props.minDate && timestamp! < props.minDate) {
    return false;
  }
  if (props.maxDate && timestamp! > props.maxDate) {
    return false;
  }

  return true;
};

const isValidActiveDate = (
  timestamp: Moment | undefined,
  props: TypeDecadeViewProps | TypeYearViewProps
): boolean => {
  if (!props) {
    throw new Error('props is mandatory in isValidActiveDate');
  }
  return isDateInMinMax(timestamp, props);
};

const select = function(
  this: any,
  { dateMoment, timestamp }: { dateMoment?: Moment; timestamp?: number | null },
  event?: any
) {
  if (this.props.select) {
    return this.props.select({ dateMoment, timestamp }, event);
  }
  if (!timestamp) {
    timestamp = +dateMoment!;
  }
  this.gotoViewDate({ dateMoment, timestamp });
  this.onChange({ dateMoment, timestamp }, event);

  return undefined;
};

const confirm = function(this: any, date: DateType, event: any) {
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

const onActiveDateChange = function(
  this: any,
  {
    dateMoment,
    timestamp,
  }: {
    dateMoment?: Moment;
    timestamp?: any;
  }
) {
  if (!isValidActiveDate(timestamp, this.p)) {
    return;
  }

  if (this.props.activeDate === undefined) {
    this.setState({
      activeDate: timestamp,
    });
  }

  if (this.props.onActiveDateChange) {
    const dateString = this.format(dateMoment!);
    this.props.onActiveDateChange(dateString, {
      dateMoment,
      timestamp,
      dateString,
    });
  }
};

const onViewDateChange = function(
  this: any,
  { dateMoment, timestamp }: { dateMoment?: Moment; timestamp?: any }
) {
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
    const dateString = this.format(dateMoment!);
    this.props.onViewDateChange(dateString, {
      dateMoment,
      dateString,
      timestamp,
    });
  }
};

const onChange = function(
  this: any,
  { dateMoment, timestamp }: { dateMoment?: Moment; timestamp?: number | null },
  event?: any
) {
  if (this.props.date === undefined) {
    this.setState({
      date: timestamp,
    });
  }

  if (this.props.onChange) {
    const dateString = this.format(dateMoment!);
    this.props.onChange(
      dateString,
      { dateMoment, timestamp, dateString },
      event
    );
  }
};

const navigate = function(this: any, direction: -1 | 1, event?: any) {
  const props = this.p;

  const getNavigationDate: GetNavigationDate = (dir, date, dateFormat) => {
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

    this.gotoViewDate({ dateMoment: nextMoment, timestamp: undefined });
  }

  return undefined;
};

const gotoViewDate = function(
  this: any,
  {
    dateMoment,
    timestamp,
  }: {
    dateMoment?: Moment;
    timestamp?: any;
  }
) {
  if (!timestamp) {
    timestamp = dateMoment == null ? null : +dateMoment;
  }

  this.onViewDateChange({ dateMoment, timestamp });
  this.onActiveDateChange({ dateMoment, timestamp });
};

const prepareDate = (
  props: TypeDecadeViewProps,
  state: TypeDecadeViewState
): DateType | undefined => {
  return props.date === undefined ? state.date : props.date;
};

const prepareViewDate = function(
  props: TypeDecadeViewProps,
  state: TypeDecadeViewState
): DateType | undefined {
  const viewDate =
    props.viewDate === undefined ? state.viewDate : props.viewDate;

  if (!viewDate && props.date) {
    return props.date;
  }

  return viewDate;
};

type TypeMinMaxDate = {
  minDateMoment?: number | Moment;
  maxDateMoment?: number | Moment;
  minDate?: DateType;
  maxDate?: DateType;
};

const prepareActiveDate = (
  props: TypeDecadeViewProps,
  state: TypeDecadeViewState
): DateType | undefined => {
  const activeDate =
    props.activeDate === undefined
      ? state.activeDate || prepareDate(props, state)
      : props.activeDate;

  return activeDate;
};

const prepareMinMax = function(props: TypeDecadeViewProps): TypeMinMaxDate {
  const { minDate, maxDate } = props;

  const result: TypeMinMaxDate = {};

  if (minDate != null) {
    result.minDateMoment = toMoment(props.minDate, props).startOf(
      props.adjustMinDateStartOf!
    );

    result.minDate = +result.minDateMoment;
  }

  if (maxDate != null) {
    result.maxDateMoment = toMoment(props.maxDate, props).endOf(
      props.adjustMaxDateStartOf!
    );

    result.maxDate = +result.maxDateMoment;
  }

  return result;
};

type TypeDateProps = {
  date?: DateType;
  viewDate?: DateType;
  moment?: Moment;
  timestamp?: number;
  activeMoment?: Moment;
  activeDate?: DateType;
  minDate?: DateType;
  maxDate?: DateType;
  minConstrained?: boolean;
  maxConstrained?: boolean;
  viewMoment?: Moment;
};

const prepareDateProps = function(
  props: any,
  state: TypeDecadeViewState
): TypeDateProps {
  const result: TypeDateProps = {};

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

const getInitialState = (
  props: any
): {
  date?: DateType;
  activeDate?: DateType;
  viewDate?: DateType;
} => {
  return {
    date: props.defaultDate,
    activeDate: props.defaultActiveDate,
    viewDate: props.defaultViewDate,
  };
};

class DecadeView extends Component<TypeDecadeViewProps, TypeDecadeViewState> {
  static defaultProps = defaultProps;
  static propTypes = propTypes;

  public p: TypeDecadeViewProps = {};
  public decadeViewRef: any;

  constructor(props: TypeDecadeViewProps) {
    super(props);

    this.decadeViewRef = createRef();

    this.state = getInitialState(props);
  }

  getYearsInDecade = (value: DateType): Moment[] => {
    const year = getDecadeStartYear(this.toMoment(value));

    const start = this.toMoment(`${year}`, 'YYYY').startOf('year');

    return times(10).map(i => {
      return this.toMoment(start).add(i, 'year');
    });
  };

  toMoment = (date: DateType, format?: string): Moment => {
    return toMoment(date, format, this.props);
  };

  render = () => {
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
  };

  renderNav = (dir: -1 | 1): any => {
    const props = this.p;

    const name = dir == -1 ? 'prev' : 'next';
    const navMoment = this.toMoment(props.viewMoment!).add(dir * 10, 'year');
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

    const arrow: ReactNode = props.arrows![name] || ARROWS[name];

    const arrowProps: TypeArrowProps = {
      className,
      onClick: !disabled
        ? () =>
            this.onViewDateChange({
              dateMoment: navMoment,
              timestamp: this.toMoment(props.viewMoment!),
            })
        : null,
      children: arrow,
      disabled,
    };

    if (props.renderNavigation) {
      return props.renderNavigation(arrowProps, props);
    }

    return <div key={`nav_arrow_${dir}`} {...arrowProps} />;
  };

  renderYears = (props: TypeDecadeViewProps, years: Moment[]) => {
    const nodes = years.map(this.renderYear);
    const perRow = props.perRow;
    const buckets = times(Math.ceil(nodes.length / perRow!)).map(i => {
      return nodes.slice(i * perRow!, (i + 1) * perRow!);
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
  };

  renderYear = (dateMoment: Moment) => {
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
  };

  format = (mom: Moment, format?: string): string => {
    format = format || this.props.yearFormat;

    return mom.format(format);
  };

  handleClick = (
    {
      timestamp,
      dateMoment,
    }: { timestamp?: number | null; dateMoment?: Moment },
    event?: any
  ) => {
    event.target.value = timestamp;
    const props = this.p;
    if (props.minDate && timestamp! < props.minDate) {
      return;
    }
    if (props.maxDate && timestamp! > props.maxDate) {
      return;
    }
    this.select({ dateMoment, timestamp }, event);
  };

  onKeyDown = (event: KeyboardEvent) => {
    return ON_KEY_DOWN.call(this, event);
  };

  confirm = (date: DateType, event?: any) => {
    return confirm.call(this, date, event);
  };

  navigate = (direction: -1 | 1, event?: any) => {
    return navigate.call(this, direction, event);
  };

  select = (
    {
      dateMoment,
      timestamp,
    }: { dateMoment?: Moment; timestamp?: number | null },
    event?: any
  ) => {
    return select.call(this, { dateMoment, timestamp }, event);
  };

  onViewDateChange = ({
    dateMoment,
    timestamp,
  }: {
    dateMoment?: any;
    timestamp?: any;
  }) => {
    return onViewDateChange.call(this, { dateMoment, timestamp });
  };

  gotoViewDate = ({
    dateMoment,
    timestamp,
  }: {
    dateMoment?: Moment;
    timestamp?: number | null;
  }) => {
    return gotoViewDate.call(this, { dateMoment, timestamp });
  };
  onActiveDateChange = ({
    dateMoment,
    timestamp,
  }: {
    dateMoment?: Moment;
    timestamp?: Moment;
  }) => {
    return onActiveDateChange.call(this, { dateMoment, timestamp });
  };

  onChange = (
    {
      dateMoment,
      timestamp,
    }: {
      dateMoment?: Moment;
      timestamp?: number | null;
    },
    event?: any
  ) => {
    return onChange.call(this, { dateMoment, timestamp }, event);
  };

  getDOMNode = () => {
    return this.decadeViewRef.current;
  };

  focus = () => {
    this.decadeViewRef.current.focus();
  };
}

export { TypeDecadeViewProps };
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

export default DecadeView;
