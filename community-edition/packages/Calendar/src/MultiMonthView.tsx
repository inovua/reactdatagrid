/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { Flex } from '../../Flex';
import InlineBlock from './InlineBlock';
import assign from '../../../common/assign';
import join from '../../../common/join';
import clampRange from './clampRange';
import NavBar, { TypeNavBarProps } from './NavBar';
import toMoment, { DateType, Moment } from './toMoment';
import isInRange from './utils/isInRange';

import { getDaysInMonthView } from './BasicMonthView';
import MonthView, { renderFooter, TypeMonthViewProps } from './MonthView';
import { GetNavigationDate } from './MonthView/types';

type TypeMultiMonthViewProps = {
  rootClassName?: string;
  className?: string;
  theme?: string;
  dateFormat?: string;
  locale?: string;

  perRow?: number;
  size?: number;
  daysInView?: Moment[][];
  clockTabIndex?: number;

  enableMonthDecadeView?: boolean;
  footerClearDate?: boolean;
  isDatePicker?: boolean;
  forceViewUpdate?: boolean;
  navigation?: boolean;
  constrainActiveInView?: boolean;
  constrainViewDate?: boolean;
  inViewStart?: Moment;
  inViewEnd?: Moment;
  footer?: boolean;
  highlightRangeOnMouseMove?: boolean;
  enableMonthDecadeViewAnimation?: boolean;

  viewStart?: DateType;
  viewEnd?: DateType;
  date?: DateType;
  defaultDate?: DateType;
  minDate?: DateType;
  maxDate?: DateType;
  viewDate?: DateType;
  viewMoment?: DateType;
  viewMoments?: Moment[];
  defaultViewDate?: DateType;
  activeDate?: DateType;
  defaultActiveDate?: DateType;

  range?: any[];
  defaultRange?: any[];
  rangeStart?: number;

  onViewDateChange?: (
    date: string,
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
    date: string,
    {
      dateMoment,
      dateString,
      timestamp,
    }: {
      dateMoment?: Moment | null;
      timestamp?: number | null;
      dateString?: string;
    }
  ) => void;
  onChange?: (
    date: string,
    {
      dateMoment,
      dateString,
      timestamp,
    }: {
      dateMoment?: Moment | null;
      dateString?: string;
      timestamp?: number;
    },
    event?: Event
  ) => void;
  renderNavBar?: any;
};

type TypeMultiMonthViewState = {
  date?: DateType;
  viewDate?: DateType | null;
  propViewDate?: DateType;
  activeDate?: DateType | null;
  range?: any[];
  hoverRange?: DateType[] | null;
  rangeStart?: number;
};

type NavBarConfig = {
  index?: number;
  viewMoment?: Moment;
  minDate?: DateType;
  maxDate?: DateType;
  renderHiddenNav?: (props: any) => void;
  onViewDateChange?: (
    dateString: string,
    { dateMoment, timestamp }: { dateMoment?: Moment; timestamp?: number }
  ) => void;
  onUpdate?: (dateMoment: Moment, dir: -1 | 1) => void;
};

const defaultProps = {
  rootClassName: 'inovua-react-toolkit-calendar__multi-month-view',
  perRow: 2,
  size: 2,

  enableMonthDecadeView: true,
  enableMonthDecadeViewAnimation: true,
  showMonthDecadeViewAnimation: 300,

  footerClearDate: null,
  okButton: true,

  isDatePicker: true,
  forceViewUpdate: false,

  navigation: true,
  theme: 'default',

  constrainActiveInView: true,

  dateFormat: 'YYYY-MM-DD',
};

const propTypes = {
  rootClassName: PropTypes.string,
  theme: PropTypes.string,
  dateFormat: PropTypes.string,
  locale: PropTypes.string,
  perRow: PropTypes.number,
  size: PropTypes.number,
  daysInView: PropTypes.number,
  clockTabIndex: PropTypes.number,
  enableMonthDecadeView: PropTypes.bool,
  footerClearDate: PropTypes.bool,
  isDatePicker: PropTypes.bool,
  forceViewUpdate: PropTypes.bool,
  navigation: PropTypes.bool,
  constrainActiveInView: PropTypes.bool,
  constrainViewDate: PropTypes.bool,
  inViewStart: PropTypes.bool,
  inViewEnd: PropTypes.bool,
  footer: PropTypes.bool,
  highlightRangeOnMouseMove: PropTypes.bool,
  enableMonthDecadeViewAnimation: PropTypes.bool,
  viewStart: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
  ]),
  viewEnd: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
  ]),
  date: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
  ]),
  defaultDate: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
  ]),
  minDate: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
  ]),
  maxDate: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
  ]),
  viewDate: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
  ]),
  viewMoment: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
  ]),
  viewMoments: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.number])
  ),
  defaultViewDate: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
  ]),
  activeDate: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
  ]),
  defaultActiveDate: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
  ]),
  range: PropTypes.array,
  defaultRange: PropTypes.array,
};

const times = (count: number): any[] => [...new Array(count)].map((_v, i) => i);

const prepareDate = (
  props: TypeMultiMonthViewProps,
  state: TypeMultiMonthViewState
): DateType | null | undefined => {
  if (props.range) {
    return null;
  }

  return props.date === undefined ? state.date : props.date;
};

const prepareViewDate = (
  props: TypeMultiMonthViewProps,
  state: TypeMultiMonthViewState
): DateType | undefined | null => {
  return props.viewDate === undefined
    ? state.viewDate
    : state.propViewDate || props.viewDate;
};

const prepareRange = (
  props: TypeMultiMonthViewProps,
  state: TypeMultiMonthViewState
): any[] | undefined => {
  return props.range && props.range.length ? props.range : state.range;
};

const prepareActiveDate = function(
  this: any,
  props: TypeMultiMonthViewProps,
  state: TypeMultiMonthViewState
) {
  const fallbackDate =
    prepareDate(props, state) || (prepareRange(props, state) || [])[0];

  const activeDate =
    props.activeDate === undefined
      ? // only fallback to date if activeDate not specified
        state.activeDate || fallbackDate
      : props.activeDate;

  if (
    activeDate &&
    props.inViewStart &&
    props.inViewEnd &&
    props.constrainActiveInView
  ) {
    const activeMoment = this.toMoment(activeDate);

    if (!isInRange(activeMoment, [props.inViewStart, props.inViewEnd])) {
      const date = fallbackDate;
      const dateMoment = this.toMoment(date);

      if (date && isInRange(dateMoment, [props.inViewStart, props.inViewEnd])) {
        return date;
      }

      return null;
    }
  }

  return activeDate;
};

const prepareViews = function(this: any, props: TypeMultiMonthViewProps) {
  const daysInView = [];

  const viewMoments = [];

  const viewMoment = props.viewMoment;

  let index = 0;
  const size = props.size;

  while (index < size!) {
    const mom = this.toMoment(viewMoment)
      .startOf('day')
      .add(index, 'month');
    const days = getDaysInMonthView(mom, props);

    viewMoments.push(mom);
    daysInView.push(days);

    index++;
  }

  props.daysInView = daysInView;
  props.viewMoments = viewMoments;

  const lastViewDays = daysInView[size! - 1];

  props.inViewStart = daysInView[0][0];
  props.inViewEnd = lastViewDays[lastViewDays.length - 1];
};

const renderNavBar = function(
  this: any,
  config: NavBarConfig,
  navBarProps: TypeNavBarProps
) {
  const props = this.props;
  const { index, viewMoment } = config;

  navBarProps = assign({}, navBarProps, {
    secondary: true,

    minDate: config.minDate || props.minDate,
    maxDate: config.maxDate || props.maxDate,

    renderNavNext: config.renderHiddenNav || this.renderHiddenNav,
    renderNavPrev: config.renderHiddenNav || this.renderHiddenNav,

    viewMoment,
    size: props.size,

    onViewDateChange: config.onViewDateChange || this.onNavViewDateChange,
    onUpdate: config.onUpdate || this.updateViewMoment,

    enableMonthDecadeView: props.enableMonthDecadeView,
  });

  if (index == 0) {
    delete navBarProps.renderNavPrev;
  }

  if (index == props.perRow - 1) {
    delete navBarProps.renderNavNext;
  }

  let marginStyle: { marginRight?: number } | null = {};
  if (index! % 2 == 0) {
    marginStyle = { marginRight: 1 };
  } else {
    marginStyle = null;
  }

  return (
    <NavBar key="multi_month_nav_bar" style={marginStyle} {...navBarProps} />
  );
};

class MultiMonthView extends Component<
  TypeMultiMonthViewProps,
  TypeMultiMonthViewState
> {
  static defaultProps = defaultProps;
  static propTypes = propTypes;

  private toMoment?: any;
  private views?: any[];
  private p: TypeMultiMonthViewProps = {};

  constructor(props: TypeMultiMonthViewProps) {
    super(props);

    this.state = {
      hoverRange: null,
      range: props.defaultRange,
      date: props.defaultDate,
      activeDate: props.defaultActiveDate,
      viewDate: props.defaultViewDate,
    };
  }

  componentDidMount = () => {
    this.updateToMoment(this.props);
  };

  componentDidUpdate = (prevProps: TypeMultiMonthViewProps) => {
    if (
      prevProps.locale !== this.props.locale ||
      prevProps.dateFormat !== this.props.dateFormat
    ) {
      this.updateToMoment(this.props);
    }
  };

  updateToMoment = (props: TypeMultiMonthViewProps): void => {
    this.toMoment = (value: DateType, dateFormat: string) => {
      return toMoment(value, {
        locale: props.locale,
        dateFormat: dateFormat || props.dateFormat,
      });
    };
  };

  prepareProps = (
    thisProps: TypeMultiMonthViewProps,
    state: TypeMultiMonthViewState
  ): TypeMultiMonthViewProps => {
    const props = assign({}, thisProps);
    state = state || this.state;

    props.viewMoment = this.toMoment(prepareViewDate(props, state));

    // viewStart is the first day of the first month displayed
    // viewEnd is the last day of the last month displayed
    props.viewStart = this.toMoment(props.viewMoment).startOf('month');
    props.viewEnd = this.toMoment(props.viewStart)
      .add(props.size - 1, 'month')
      .endOf('month');

    // but we also have inViewStart, which can be a day before viewStart
    // which is in displayed as belonging to the prev month
    // but is displayed in the current view since it's on the same week
    // as viewStart
    //
    // same for inViewEnd, which is a day after viewEnd - the last day in the same week
    prepareViews.call(this, props);
    const activeDate = prepareActiveDate.call(this, props, state);

    if (activeDate) {
      props.activeDate = +this.toMoment(activeDate);
    }

    props.date = prepareDate(props, state);
    if (!props.date) {
      const range = prepareRange(props, state);
      if (range) {
        props.range = range.map(d => this.toMoment(d).startOf('day'));
        props.rangeStart =
          state.rangeStart || (props.range.length == 1 ? props.range[0] : null);
      }
    }

    return props;
  };

  render = () => {
    this.views = [];
    const props = (this.p = this.prepareProps(this.props, this.state));
    const size = props.size;

    const rowCount = Math.ceil(size! / props.perRow!);
    const children = times(rowCount)
      .map(this.renderRow)
      .filter(x => !!x);

    const { rootClassName } = props;
    const className = join(
      props.className,
      rootClassName,
      props.theme && `${rootClassName}--theme-${props.theme}`
    );

    const footer = renderFooter(props, this);

    if (footer) {
      children.push(footer);
    }

    const flexProps = assign({}, props);

    delete flexProps.activeDate;
    delete flexProps.clockTabIndex;
    delete flexProps.constrainActiveInView;
    delete flexProps.constrainViewDate;
    delete flexProps.date;
    delete flexProps.dateFormat;
    delete flexProps.daysInView;
    delete flexProps.defaultRange;
    delete flexProps.enableMonthDecadeView;
    delete flexProps.footer;
    delete flexProps.footerClearDate;
    delete flexProps.forceViewUpdate;
    delete flexProps.highlightRangeOnMouseMove;
    delete flexProps.inViewEnd;
    delete flexProps.inViewStart;
    delete flexProps.isDatePicker;
    delete flexProps.locale;
    delete flexProps.navigation;
    delete flexProps.onViewDateChange;
    delete flexProps.perRow;
    delete flexProps.range;
    delete flexProps.rangeStart;
    delete flexProps.renderNavBar;
    delete flexProps.theme;
    delete flexProps.viewDate;
    delete flexProps.viewEnd;
    delete flexProps.viewMoment;
    delete flexProps.viewMoments;
    delete flexProps.viewStart;
    delete flexProps.rootClassName;
    delete flexProps.enableMonthDecadeViewAnimation;
    delete flexProps.showMonthDecadeViewAnimation;
    delete flexProps.okButton;

    return (
      <Flex
        key="multi_month_view"
        column
        inline
        alignItems="stretch"
        wrap={false}
        {...flexProps}
        className={className}
      >
        {children}
      </Flex>
    );
  };

  renderRow = (rowIndex: number): ReactElement => {
    const props = this.p;
    const viewProps = assign({}, this.p);

    delete viewProps.rootClassName;
    delete viewProps.forceViewUpdate;
    delete viewProps.index;
    delete viewProps.inViewEnd;
    delete viewProps.inViewStart;
    delete viewProps.navigate;
    delete viewProps.perRow;
    delete viewProps.viewEnd;
    delete viewProps.viewMoments;
    delete viewProps.viewStart;

    const children = times(props.perRow!).map(i => {
      const index = rowIndex * props.perRow! + i;
      const keys = `row_${index * i}`;
      const numberKeys = index * i;

      if (index >= props.size!) {
        return null;
      }
      return this.renderView(viewProps, index, props.size, keys, numberKeys);
    });

    return (
      <Flex
        key={`row_index_${rowIndex}`}
        inline
        row
        wrap={false}
        children={children}
      />
    );
  };

  renderView = (
    viewProps: TypeMonthViewProps,
    index: number,
    size: number | undefined,
    keys: string,
    numberKeys: number
  ): ReactElement => {
    const props = this.p;
    const viewMoment = props.viewMoments![index];

    let range;

    if (props.range) {
      range =
        props.rangeStart && props.range.length == 0
          ? [props.rangeStart]
          : props.range;
    }

    const navBarKeys = numberKeys * 8;

    return (
      <MonthView
        ref={view => {
          this.views![index] = view;
        }}
        constrainViewDate={false}
        {...viewProps}
        className={null}
        index={index}
        key={keys}
        footer={false}
        constrainActiveInView={false}
        navigate={this.onMonthNavigate.bind(this)}
        hoverRange={this.state.hoverRange}
        onHoverRangeChange={this.setHoverRange}
        activeDate={props.activeDate}
        onActiveDateChange={this.onActiveDateChange}
        onViewDateChange={this.onAdjustViewDateChange}
        date={props.date}
        defaultDate={null}
        onChange={this.onChange}
        range={range}
        defaultRange={null}
        onRangeChange={this.onRangeChange}
        viewMoment={viewMoment}
        insideMultiView
        daysInView={props.daysInView![index]}
        showDaysBeforeMonth={index == 0}
        showDaysAfterMonth={index == size! - 1}
        select={this.select}
        renderNavBar={
          this.props.navigation &&
          (this.props.renderNavBar || this.renderNavBar).bind(this, {
            index,
            viewMoment,
            navBarKeys,
          })
        }
      />
    );
  };

  onFooterTodayClick = (): void => {
    this.views![0].onFooterTodayClick();
  };

  onFooterClearClick = (): void => {
    this.views![0].onFooterClearClick();
  };

  onFooterOkClick = (): void => {
    this.views![0].onFooterOkClick();
  };

  onFooterCancelClick = (): void => {
    this.views![0].onFooterCancelClick();
  };

  isFocused = (): boolean => {
    const firstView = this.views![0];

    if (firstView) {
      return firstView.isFocused();
    }

    return false;
  };

  focus = (): void => {
    const firstView = this.views![0];

    if (firstView) {
      firstView.focus();
    }
  };

  setHoverRange = (hoverRange: DateType[] | null): void => {
    this.setState({
      hoverRange,
    });
  };

  select = (
    {
      dateMoment,
      timestamp,
    }: { dateMoment?: Moment | null; timestamp?: number },
    event?: Event
  ): void => {
    const props = this.p;

    // const visibleRange = [props.inViewStart, props.inViewEnd];

    this.onAdjustViewDateChange(undefined, { dateMoment, timestamp });
    this.onActiveDateChange(undefined, { dateMoment, timestamp });

    const range = props.range;

    if (range) {
      this.selectRange({ dateMoment, timestamp });
    } else {
      this.onChange(undefined, { dateMoment, timestamp }, event);
    }
  };

  selectRange = ({
    dateMoment,
    timestamp,
  }: {
    dateMoment?: Moment | null;
    timestamp?: number;
  }): void => {
    return MonthView.prototype.selectRange.call(this, {
      dateMoment,
      timestamp,
    });
  };

  onRangeChange = (range: any[]): void => {
    return MonthView.prototype.onRangeChange.call(this, range);
  };

  onViewKeyDown = (...args: any[]): void => {
    const view = this.views![0];
    if (view) {
      view.onViewKeyDown(...args);
    }
  };

  renderNavBar = (
    config: NavBarConfig,
    navBarProps: TypeNavBarProps
  ): ReactElement => {
    return renderNavBar.call(this, config, navBarProps);
  };

  onMonthNavigate = (
    dir: -1 | 1,
    event: any,
    getNavigationDate: GetNavigationDate
  ): null | undefined | Moment => {
    const props = this.p;
    event.preventDefault();

    if (!props.activeDate) {
      return;
    }

    const key = event.key;
    const homeEndDate = key == 'Home' ? props.viewStart : props.viewEnd;
    const mom = key == 'Home' || key == 'End' ? homeEndDate : props.activeDate;
    const nextMoment = getNavigationDate(dir, this.toMoment(mom));

    const viewMoment = this.toMoment(nextMoment);

    this.onActiveDateChange(undefined, {
      dateMoment: nextMoment!,
      timestamp: +nextMoment!,
    });

    if (this.isInRange(viewMoment)) {
      return;
    }

    if (viewMoment.isAfter(props.viewEnd)) {
      viewMoment.add(-props.size! + 1, 'month');
    }

    this.onViewDateChange({
      dateMoment: viewMoment,
      timestamp: +viewMoment,
    });
  };

  onAdjustViewDateChange = (
    _dateString: string | undefined,
    {
      dateMoment,
      timestamp,
    }: {
      dateMoment?: Moment | null;
      timestamp?: number | null;
      dateString?: string;
    }
  ): void => {
    const props = this.p;

    let update = dateMoment == null;

    if (dateMoment && dateMoment.isAfter(props.viewEnd)) {
      dateMoment = this.toMoment(dateMoment).add(-props.size! + 1, 'month');
      timestamp = +dateMoment!;
      update = true;
    } else if (dateMoment && dateMoment.isBefore(props.viewStart)) {
      update = true;
    }

    if (update) {
      this.onViewDateChange({ dateMoment, timestamp });
    }
  };

  updateViewMoment = (_dateMoment: Moment, dir: -1 | 1): Moment => {
    const sign = dir < 0 ? -1 : 1;
    const abs = Math.abs(dir);
    const newMoment = this.toMoment(this.p.viewStart);
    newMoment.add(sign, abs == 1 ? 'month' : 'year');
    return newMoment;
  };

  renderHiddenNav = (props: TypeMultiMonthViewProps): ReactElement => {
    return <InlineBlock {...props} style={{ visibility: 'hidden' }} />;
  };

  isInRange = (moment: Moment): boolean => {
    return isInRange(moment, [this.p.viewStart, this.p.viewEnd]);
  };

  isInView = (moment: Moment): boolean => {
    return this.isInRange(moment);
  };

  onNavViewDateChange = (
    _dateString: string,
    { dateMoment, timestamp }: { dateMoment?: Moment; timestamp?: number }
  ): void => {
    this.onViewDateChange({ dateMoment, timestamp });
  };

  onViewDateChange = ({
    dateMoment,
    timestamp,
  }: {
    dateMoment?: Moment | null;
    timestamp?: number | null;
  }): void => {
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

  onActiveDateChange = (
    _dateString: string | undefined,
    {
      dateMoment,
      timestamp,
    }: {
      dateMoment?: Moment | null;
      timestamp?: number | null;
      dateString?: string;
    }
  ): void => {
    const valid = this.views!.reduce((isValid, view) => {
      return isValid && view.isValidActiveDate(timestamp);
    }, true);

    if (!valid) {
      return;
    }

    const props = this.p;
    const range = props.range;

    if (range && props.rangeStart) {
      this.setState({
        rangeStart: props.rangeStart,
        range: clampRange([props.rangeStart, dateMoment]),
      });
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
        dateString,
        timestamp,
      });
    }
  };

  gotoViewDate = ({
    dateMoment,
    timestamp,
  }: {
    dateMoment?: Moment;
    timestamp?: number;
  }): void => {
    if (!timestamp) {
      timestamp = +dateMoment!;
    }

    this.onViewDateChange({ dateMoment, timestamp });
    this.onActiveDateChange(undefined, { dateMoment, timestamp });
  };

  format = (mom: Moment): string => {
    return mom == null ? '' : mom.format(this.props.dateFormat);
  };

  onChange = (
    _dateString: string | undefined,
    {
      dateMoment,
      timestamp,
    }: {
      dateMoment?: Moment | null;
      timestamp?: number;
      dateString?: string;
      noCollapse?: boolean;
    },
    event?: Event
  ): void => {
    if (this.props.date === undefined) {
      this.setState({
        date: timestamp,
      });
    }

    if (this.props.onChange) {
      const dateString = this.format(dateMoment!);
      this.props.onChange(
        dateString,
        { dateMoment, dateString, timestamp },
        event
      );
    }
  };

  getViewSize = () => {
    return this.props.size;
  };
}

export { TypeMultiMonthViewProps, NavBarConfig };
export { renderNavBar };
export default MultiMonthView;
