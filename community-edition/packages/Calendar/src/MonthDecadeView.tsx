/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { Flex } from '../../Flex';
import assign from '../../../common/assign';
import join from '../../../common/join';
import toMoment, { DateType, Moment } from './toMoment';
import joinFunctions from './joinFunctions';
import Footer from './Footer';
import YearView, { TypeYearViewProps } from './YearView';
import assignDefined from './assignDefined';

import DecadeView, {
  prepareDateProps,
  getInitialState,
  onViewDateChange,
  onActiveDateChange,
  onChange,
  navigate,
  select,
  confirm,
  gotoViewDate,
  TypeDecadeViewProps,
} from './DecadeView';

type TypeMonthDecadeViewProps = {
  rootClassName?: string;
  className?: string;

  okOnEnter?: boolean;
  navigation?: boolean;
  focusYearView?: boolean;
  focusDecadeView?: boolean;
  footer?: boolean;

  minDate?: number | object | string;
  maxDate?: number | object | string;
  viewMoment?: number | object | string;
  activeDate?: number | object | string;
  date?: number | object | string;
  defaultDate?: number | object | string;
  defaultViewDate?: number | object | string;

  moment?: object;

  locale?: string;
  theme?: string;
  dateFormat?: string;
  adjustDateStartOf?: string;
  adjustMinDateStartOf?: string;
  adjustMaxDateStartOf?: string;

  cleanup?: (props: TypeMonthDecadeViewProps) => void;
  onCancelClick?: () => void;
  onOkClick?: (
    dateString: string,
    { dateMoment, timestamp }: { dateMoment?: Moment; timestamp?: number }
  ) => void;
  onChange?: () => void;
};

type TypeMonthDecadeViewState = {};

type TypeNewFooterProps = {
  onOkClick: Function;
  onCancelClick: Function;
  centerButtons?: boolean;
  todayButton?: boolean;
  clearButton?: boolean;
};

const defaultProps = {
  rootClassName: 'inovua-react-toolkit-calendar__month-decade-view',
  okOnEnter: true,

  footer: true,
  theme: 'default',
  navigation: true,

  focusYearView: false,
  focusDecadeView: true,

  dateFormat: 'YYYY-MM-DD',

  adjustDateStartOf: 'month',
  adjustMinDateStartOf: 'month',
  adjustMaxDateStartOf: 'month',
};

const propTypes = {
  okOnEnter: PropTypes.bool,
  navigation: PropTypes.bool,
  focusYearView: PropTypes.bool,
  focusDecadeView: PropTypes.bool,
  footer: PropTypes.bool,

  minDate: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.string,
  ]),
  maxDate: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.string,
  ]),
  viewMoment: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.string,
  ]),
  activeDate: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.string,
  ]),
  date: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.string,
  ]),
  defaultDate: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.string,
  ]),
  defaultViewDate: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.string,
  ]),
  dateFormat: PropTypes.string,
  moment: PropTypes.object,

  locale: PropTypes.string,
  theme: PropTypes.string,
  adjustDateStartOf: PropTypes.string,
  adjustMinDateStartOf: PropTypes.string,
  adjustMaxDateStartOf: PropTypes.string,

  cleanup: PropTypes.func,
  onCancelClick: PropTypes.func,
  onOkClick: PropTypes.func,
  onChange: PropTypes.func,
};

const preventDefault = (e: Event) => {
  e.preventDefault();
};

class MonthDecadeView extends Component<
  TypeMonthDecadeViewProps,
  TypeMonthDecadeViewState
> {
  static defaultProps = defaultProps;
  static propTypes = propTypes;

  private p: any;
  private decadeView: any;
  unmounted?: boolean;

  constructor(props: TypeMonthDecadeViewProps) {
    super(props);

    this.state = getInitialState(props);
  }

  componentWillUnmount = () => {
    this.unmounted = true;
  };

  toMoment = (date: DateType, format: string): Moment => {
    return toMoment(date, format, this.props);
  };

  render = () => {
    const dateProps = prepareDateProps(this.props, this.state);

    const props = (this.p = { ...this.props, ...dateProps });

    props.children = React.Children.toArray(props.children);

    const { rootClassName } = props;
    const className = join(
      props.className,
      rootClassName,
      props.theme && `${rootClassName}--theme-${props.theme}`
    );

    const separatorClassName = `${rootClassName}__separator`;

    const commonProps = assignDefined(
      {},
      {
        locale: props.locale,
        theme: props.theme,
        minDate: props.minDate,
        maxDate: props.maxDate,

        viewDate: props.viewMoment,
        activeDate: props.activeDate,
        date: props.date,

        dateFormat: props.dateFormat,
      }
    );

    const yearViewProps = assign({}, commonProps);

    const decadeViewProps = assign({}, commonProps, {
      ref: (view: any) => {
        this.decadeView = view;
      },
    });

    const flexProps = assign({}, this.props);

    delete flexProps.rootClassName;
    delete flexProps.activeDate;
    delete flexProps.adjustDateStartOf;
    delete flexProps.adjustMaxDateStartOf;
    delete flexProps.adjustMinDateStartOf;
    delete flexProps.cleanup;
    delete flexProps.date;
    delete flexProps.dateFormat;
    delete flexProps.defaultDate;
    delete flexProps.defaultViewDate;
    delete flexProps.focusDecadeView;
    delete flexProps.focusYearView;
    delete flexProps.okButtonText;
    delete flexProps.cancelButtonText;
    delete flexProps.footer;
    delete flexProps.locale;
    delete flexProps.maxDate;
    delete flexProps.minDate;
    delete flexProps.onOkClick;
    delete flexProps.onCancelClick;
    delete flexProps.okOnEnter;
    delete flexProps.navigation;
    delete flexProps.theme;
    delete flexProps.viewMoment;

    if (typeof props.cleanup == 'function') {
      props.cleanup(flexProps);
    }

    return (
      <Flex
        inline
        column
        alignItems="stretch"
        {...flexProps}
        className={className}
      >
        {this.renderYearView(yearViewProps)}
        <div className={separatorClassName} />
        {this.renderDecadeView(decadeViewProps)}
        <div className={separatorClassName} />
        {this.renderFooter()}
      </Flex>
    );
  };

  renderFooter = (): ReactElement | null => {
    const props = this.p;
    const children = props.children;

    if (!props.footer) {
      return null;
    }

    const { okButtonText, cancelButtonText } = props;

    const defaultFooterProps = assignDefined(
      {},
      { okButtonText, cancelButtonText, theme: props.theme }
    );

    const footerChild = children.filter(
      (c: any) => c && c.props && c.props.isDatePickerFooter
    )[0];

    if (footerChild) {
      const newFooterProps: TypeNewFooterProps = {
        onOkClick: joinFunctions(this.onOkClick, footerChild.props.onOkClick),
        onCancelClick: joinFunctions(
          this.onCancelClick,
          footerChild.props.onCancelClick
        ),
      };

      assignDefined(newFooterProps, defaultFooterProps);

      if (footerChild.props.centerButtons === undefined) {
        newFooterProps.centerButtons = true;
      }
      if (footerChild.props.todayButton === undefined) {
        newFooterProps.todayButton = false;
      }
      if (footerChild.props.clearButton === undefined) {
        newFooterProps.clearButton = false;
      }

      return React.cloneElement(footerChild, newFooterProps);
    }

    return (
      <Footer
        key="month_decade_footer"
        {...defaultFooterProps}
        todayButton={false}
        clearButton={false}
        onOkClick={this.onOkClick}
        onCancelClick={this.onCancelClick}
        centerButtons
      />
    );
  };

  onOkClick = (): void => {
    if (this.props.onOkClick) {
      const dateMoment = this.p.activeMoment;
      const dateString = this.format(dateMoment);
      const timestamp = +dateMoment;

      this.props.onOkClick(dateString, { dateMoment, timestamp });
    }
  };

  onCancelClick = (): void => {
    if (this.props.onCancelClick) {
      this.props.onCancelClick();
    }
  };

  renderYearView = (yearViewProps: TypeYearViewProps): ReactElement => {
    const props = this.p;
    const children = props.children;

    const yearViewChild = children.filter(
      (c: any) => c && c.props && c.props.isYearView
    )[0];
    const yearViewChildProps = yearViewChild ? yearViewChild.props : {};

    const tabIndex =
      yearViewChildProps.tabIndex == null ? null : yearViewChildProps.tabIndex;

    yearViewProps.tabIndex = tabIndex;

    if (props.focusYearView === false || tabIndex == null) {
      yearViewProps.tabIndex = null;
      yearViewProps.onFocus = this.onYearViewFocus;
      yearViewProps.onMouseDown = this.onYearViewMouseDown;
    }

    assign(yearViewProps, {
      onViewDateChange: joinFunctions(
        this.onViewDateChange,
        yearViewChildProps.onViewDateChange
      ),
      onActiveDateChange: joinFunctions(
        this.onActiveDateChange,
        yearViewChildProps.onActiveDateChange
      ),
      onChange: joinFunctions(
        this.handleYearViewOnChange,
        yearViewChildProps.onChange
      ),
    });

    if (yearViewChild) {
      return React.cloneElement(yearViewChild, yearViewProps);
    }

    return <YearView {...yearViewProps} />;
  };

  renderDecadeView = (decadeViewProps: TypeDecadeViewProps) => {
    const props = this.p;
    const children = props.children;
    const decadeViewChild = children.filter(
      (c: any) => c && c.props && c.props.isDecadeView
    )[0];

    const decadeViewChildProps = decadeViewChild ? decadeViewChild.props : {};

    const tabIndex =
      decadeViewChildProps.tabIndex == null
        ? null
        : decadeViewChildProps.tabIndex;

    decadeViewProps.tabIndex = tabIndex;

    if (props.focusDecadeView === false || tabIndex == null) {
      decadeViewProps.tabIndex = null;
      decadeViewProps.onMouseDown = this.onDecadeViewMouseDown;
    }

    assign(decadeViewProps, {
      onConfirm: joinFunctions(
        this.handleDecadeViewOnConfirm,
        decadeViewChildProps.onConfirm
      ),
      onViewDateChange: joinFunctions(
        this.handleDecadeOnViewDateChange,
        decadeViewChildProps.onViewDateChange
      ),
      onActiveDateChange: joinFunctions(
        this.handleDecadeOnActiveDateChange,
        decadeViewChildProps.onActiveDateChange
      ),
      onChange: joinFunctions(
        this.handleDecadeOnChange,
        decadeViewChildProps.onChange
      ),
    });

    if (decadeViewChild) {
      return React.cloneElement(decadeViewChild, decadeViewProps);
    }

    return <DecadeView {...decadeViewProps} />;
  };

  onYearViewFocus = (): void => {
    if (this.props.focusYearView === false) {
      this.focus();
    }
  };

  focus = (): void => {
    if (this.decadeView && this.props.focusDecadeView) {
      this.decadeView.focus();
    }
  };

  getDOMNode = (): any => {
    return this.decadeView;
  };

  onYearViewMouseDown = (e: Event): void => {
    preventDefault(e);

    this.focus();
  };

  onDecadeViewMouseDown = (e: Event): void => {
    preventDefault(e);
  };

  format = (mom: Moment, format?: string): string => {
    format = format || this.props.dateFormat;

    return mom.format(format);
  };

  handleDecadeViewOnConfirm = (): void => {
    if (this.props.okOnEnter) {
      this.onOkClick();
    }
  };

  onKeyDown = (event: KeyboardEvent): void => {
    if (event.key == 'Escape') {
      return this.onCancelClick();
    }

    if (this.decadeView) {
      this.decadeView.onKeyDown(event);
    }

    return undefined;
  };

  confirm = (date: DateType, event: Event): void => {
    return confirm.call(this, date, event);
  };

  navigate = (direction: -1 | 1, event: Event): void => {
    return navigate.call(this, direction, event);
  };

  select = (
    { dateMoment, timestamp }: { dateMoment?: Moment; timestamp?: number },
    event?: Event
  ): void => {
    return select.call(this, { dateMoment, timestamp }, event);
  };

  handleDecadeOnViewDateChange = (
    dateString: string,
    { dateMoment, timestamp }: { dateMoment?: Moment; timestamp?: number }
  ): void => {
    const props = this.p;
    const currentViewMoment = props.viewMoment;

    if (currentViewMoment) {
      dateMoment!.set('month', currentViewMoment.get('month'));
      dateString = this.format(dateMoment!);
      timestamp = +dateMoment!;
    }

    this.onViewDateChange(dateString, { dateMoment, timestamp });
  };

  handleDecadeOnActiveDateChange = (
    dateString: string,
    { dateMoment, timestamp }: { dateMoment?: Moment; timestamp?: number }
  ): void => {
    const props = this.p;
    const currentViewMoment = props.viewMoment;

    if (currentViewMoment) {
      dateMoment!.set('month', currentViewMoment.get('month'));
      dateString = this.format(dateMoment!);
      timestamp = +dateMoment!;
    }

    this.onActiveDateChange(dateString, { dateMoment, timestamp });
  };

  handleDecadeOnChange = (
    dateString: string,
    {
      dateMoment,
      timestamp,
    }: {
      dateMoment?: Moment;
      timestamp?: number;
    },
    event?: Event
  ): void => {
    const props = this.p;
    const currentViewMoment = props.viewMoment;

    if (currentViewMoment) {
      dateMoment!.set('month', currentViewMoment.get('month'));
      dateString = this.format(dateMoment!);
      timestamp = +dateMoment!;
    }

    this.onChange(dateString, { dateMoment, timestamp }, event);
  };

  handleYearViewOnChange = (
    dateString: string,
    { dateMoment, timestamp }: { dateMoment?: Moment; timestamp?: number },
    event?: Event
  ): void => {
    const props = this.p;
    const currentMoment = props.moment;

    if (currentMoment) {
      dateMoment!.set('year', currentMoment.get('year'));
      dateString = this.format(dateMoment!);
      timestamp = +dateMoment!;
    }

    this.onChange(dateString, { dateMoment, timestamp }, event);
  };

  onViewDateChange = (
    _dateString: string,
    { dateMoment, timestamp }: { dateMoment?: Moment; timestamp?: number }
  ): void => {
    return onViewDateChange.call(this, { dateMoment, timestamp });
  };

  gotoViewDate = ({
    dateMoment,
    timestamp,
  }: {
    dateMoment?: Moment;
    timestamp?: number;
  }): void => {
    return gotoViewDate.call(this, { dateMoment, timestamp });
  };

  onActiveDateChange = (
    _dateString: string,
    { dateMoment, timestamp }: { dateMoment?: Moment; timestamp?: number }
  ): void => {
    return onActiveDateChange.call(this, { dateMoment, timestamp });
  };

  onChange = (
    _dateString: string,
    { dateMoment, timestamp }: { dateMoment?: Moment; timestamp?: number },
    event?: Event
  ): void => {
    return onChange.call(this, { dateMoment, timestamp }, event);
  };
}

export { TypeMonthDecadeViewProps };
export default MonthDecadeView;
