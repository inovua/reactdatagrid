/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Flex, Item } from '../../Flex';
import InlineBlock from './InlineBlock';
import assign from '../../../common/assign';
import join from '../../../common/join';
import assignDefined from './assignDefined';
import toMoment, { DateType, Moment } from './toMoment';
import MonthDecadeView, { TypeMonthDecadeViewProps } from './MonthDecadeView';

type TypeNavBarArrows = {
  prev?: ReactNode;
  next?: ReactNode;
  right?: ReactNode;
  left?: ReactNode;
};

type TypeNavProps = {
  dir?: number;
  name?: string;
  disabled?: boolean | null;
  onClick?: any;
  className?: string;
  children?: any;
};

type TypeNavBarProps = {
  rootClassName?: string;
  secondary?: boolean;
  showClock?: boolean;
  enableMonthDecadeViewAnimation?: boolean;
  showMonthDecadeViewAnimation?: number;

  arrows?: TypeNavBarArrows;
  doubleArrows?: object;
  navDateFormat?: string;

  defaultViewDate?: DateType;
  viewDate?: DateType;
  locale?: string;
  dateFormat?: string;

  prevDisabled?: boolean;
  nextDisabled?: boolean;

  viewMoment?: DateType;
  theme?: string;
  minDate?: DateType;
  maxDate?: DateType;
  size?: number;
  okButtonText?: ReactNode | string;
  cancelButtonText?: ReactNode | string;

  style?: any;

  onClick?: any;
  renderNav?: (navProps: TypeNavProps) => void;
  renderNavPrev?: (navProps: TypeNavProps) => void;
  renderNavNext?: (navProps: TypeNavProps) => void;

  renderNavDate?: (viewMoment: DateType, text: string) => string;

  onUpdate?: (dateMoment: DateType | undefined, dir: number) => Moment;
  onNavClick?: (
    dir: number,
    viewMoment: DateType | undefined,
    event?: Event
  ) => void;
  onViewDateChange?: (
    date: string | undefined,
    {
      dateString,
      dateMoment,
      timestamp,
    }: {
      dateString?: string;
      dateMoment?: Moment | null;
      timestamp?: number | null;
    }
  ) => void;
  renderMonthDecadeView?: (
    monthDecadeViewProps: TypeMonthDecadeViewProps
  ) => ReactNode;
  onShowMonthDecadeView?: () => void;
  onHideMonthDecadeView?: () => void;
};

type TypeNavBarState = {
  viewDate?: DateType | null;
  monthDecadeView?: boolean;
};

const defaultProps = {
  rootClassName: 'inovua-react-toolkit-calendar__nav-bar',
  arrows: {},
  doubleArrows: {},
  theme: 'default',
  isDatePickerNavBar: true,
  navDateFormat: 'MMM YYYY',
  enableMonthDecadeView: true,
  onNavClick: (_dir: -1 | 1, _viewMoment: Moment) => {},
  onViewDateChange: () => {},
};

const propTypes = {
  rootClassName: PropTypes.string,
  secondary: PropTypes.bool,
  showClock: PropTypes.bool,
  enableMonthDecadeViewAnimation: PropTypes.bool,
  showMonthDecadeViewAnimation: PropTypes.number,

  renderNav: PropTypes.func,
  renderNavPrev: PropTypes.func,
  renderNavNext: PropTypes.func,

  arrows: PropTypes.object,
  doubleArrows: PropTypes.object,
  navDateFormat: PropTypes.string,

  onUpdate: PropTypes.func,
  onNavClick: PropTypes.func,
  onViewDateChange: PropTypes.func,
  onClick: PropTypes.any,
};

const ARROWS: TypeNavBarArrows = {
  prev: (
    <svg width="6" height="10" viewBox="0 0 6 10">
      <path
        fillRule="evenodd"
        d="M2.197 5l2.865-2.866c.311-.31.311-.814 0-1.125-.31-.31-.814-.31-1.125 0L.477 4.47c-.293.294-.293.769 0 1.061l3.46 3.46c.311.311.815.311 1.125 0 .311-.31.311-.814 0-1.124L2.197 5z"
      />
    </svg>
  ),

  next: (
    <svg width="6" height="10" viewBox="0 0 6 10">
      <path
        fillRule="evenodd"
        d="M3.803 5L.938 7.866c-.311.31-.311.814 0 1.125.31.31.814.31 1.125 0l3.46-3.46c.293-.294.293-.769 0-1.061l-3.46-3.46c-.311-.311-.815-.311-1.126 0-.31.31-.31.814 0 1.124L3.803 5z"
      />
    </svg>
  ),
  right: (
    <svg width="12" height="10" viewBox="0 0 12 10">
      <g fillRule="evenodd">
        <path
          d="M3.803 4.5L.938 7.366c-.311.31-.311.814 0 1.125.31.31.814.31 1.125 0l3.46-3.46c.293-.294.293-.769 0-1.061L2.063.51C1.751.198 1.247.198.936.51c-.31.31-.31.814 0 1.124L3.803 4.5zM9.803 4.5L6.937 7.366c-.31.31-.31.814 0 1.125.311.31.815.31 1.125 0l3.461-3.46c.293-.294.293-.769 0-1.061L8.063.51c-.311-.311-.815-.311-1.126 0-.31.31-.31.814 0 1.124L9.803 4.5z"
          transform="translate(0 .5)"
        />
      </g>
    </svg>
  ),
  left: (
    <svg width="12" height="10" viewBox="0 0 12 10">
      <g fillRule="evenodd">
        <path
          d="M3.803 4.5L.938 7.366c-.311.31-.311.814 0 1.125.31.31.814.31 1.125 0l3.46-3.46c.293-.294.293-.769 0-1.061L2.063.51C1.751.198 1.247.198.936.51c-.31.31-.31.814 0 1.124L3.803 4.5zM9.803 4.5L6.937 7.366c-.31.31-.31.814 0 1.125.311.31.815.31 1.125 0l3.461-3.46c.293-.294.293-.769 0-1.061L8.063.51c-.311-.311-.815-.311-1.126 0-.31.31-.31.814 0 1.124L9.803 4.5z"
          transform="rotate(180 6 4.75)"
        />
      </g>
    </svg>
  ),
};

class NavBar extends Component<TypeNavBarProps, TypeNavBarState> {
  static defaultProps = defaultProps;
  static propTypes = propTypes;

  private p: TypeNavBarProps = {};
  private monthDecadeView?: ReactNode;

  constructor(props: TypeNavBarProps) {
    super(props);

    this.state = {
      viewDate: props.defaultViewDate,
    };
  }

  prepareViewDate = (props: TypeNavBarProps): DateType | undefined | null => {
    return props.viewDate === undefined ? this.state.viewDate : props.viewDate;
  };

  render = () => {
    const props = (this.p = assign({}, this.props));
    const { rootClassName } = props;
    const viewMoment = (props.viewMoment =
      props.viewMoment || this.toMoment(this.prepareViewDate(props)!));
    props.monthDecadeViewEnabled =
      props.expandedMonthDecadeView || props.enableMonthDecadeView;
    const secondary = props.secondary;
    const className = join(
      props.className,
      rootClassName,
      `${rootClassName}--theme-${props.theme}`,
      `${rootClassName}--with-month-decade-view`
    );

    const monthDecadeView = props.monthDecadeViewEnabled
      ? this.renderMonthDecadeView()
      : null;

    const flexProps = assign({}, props);

    delete flexProps.rootClassName;
    delete flexProps.arrows;
    delete flexProps.doubleArrows;
    delete flexProps.date;
    delete flexProps.enableMonthDecadeView;
    delete flexProps.monthDecadeViewEnabled;
    delete flexProps.isDatePickerNavBar;
    delete flexProps.minDate;
    delete flexProps.maxDate;
    delete flexProps.mainNavBar;
    delete flexProps.multiView;
    delete flexProps.navDateFormat;
    delete flexProps.onNavClick;
    delete flexProps.onUpdate;
    delete flexProps.onViewDateChange;
    delete flexProps.renderNavNext;
    delete flexProps.renderNavPrev;
    delete flexProps.secondary;
    delete flexProps.theme;
    delete flexProps.viewDate;
    delete flexProps.viewMoment;
    delete flexProps.showClock;
    delete flexProps.enableMonthDecadeViewAnimation;
    delete flexProps.showMonthDecadeViewAnimation;
    delete flexProps.cancelButtonText;
    delete flexProps.clearButtonText;
    delete flexProps.okButtonText;

    if (typeof props.cleanup == 'function') {
      props.cleanup(flexProps);
    }

    return (
      <Flex key="navBar" inline row {...flexProps} className={className}>
        {secondary && this.renderNav(-2, viewMoment, 'left')}
        {this.renderNav(-1, viewMoment, 'prev')}

        <Item
          key="month_year"
          className={join(
            `${rootClassName}-date`,
            props.monthDecadeViewEnabled ? '' : `${rootClassName}-date-disabled`
          )}
          style={{ textAlign: 'center' }}
          onMouseDown={
            props.monthDecadeViewEnabled ? this.toggleMonthDecadeView : null
          }
        >
          {this.renderNavDate(viewMoment)}
        </Item>
        {this.renderNav(1, viewMoment, 'next')}
        {secondary && this.renderNav(2, viewMoment, 'right')}

        {monthDecadeView}
      </Flex>
    );
  };

  renderMonthDecadeView = (): ReactNode => {
    if (!this.state.monthDecadeView) {
      return null;
    }
    const {
      viewMoment,
      theme,
      locale,
      minDate,
      maxDate,
      rootClassName,
      size,
      okButtonText,
      cancelButtonText,
      showClock,
      enableMonthDecadeViewAnimation,
      showMonthDecadeViewAnimation,
    } = this.p;
    const className = join(
      `${rootClassName}-month-decade-view`,
      (size! <= 1 || size === undefined) &&
        `${rootClassName}-month-decade-view-month`,
      showClock && `${rootClassName}-month-decade-view-calendar`
    );

    const modalClassName = join(
      `${rootClassName}-month-decade-view-modal`,
      enableMonthDecadeViewAnimation &&
        `${rootClassName}-month-decade-view-show-animation`
    );
    const modalWrapperClassName: any =
      size || size === undefined ? modalClassName : null;

    const monthDecadeViewProps: TypeMonthDecadeViewProps = assignDefined(
      {
        defaultViewDate: viewMoment,
        defaultDate: viewMoment,

        ref: (view: ReactNode) => {
          this.monthDecadeView = view;
        },
        focusDecadeView: false,

        className,
        theme,

        okButtonText,
        cancelButtonText,
        onOkClick: this.onMonthDecadeViewOk,
        onCancelClick: this.onMonthDecadeViewCancel,
      },
      {
        minDate,
        maxDate,
        locale,
      }
    );

    if (this.props.renderMonthDecadeView) {
      return this.props.renderMonthDecadeView(monthDecadeViewProps);
    }

    return (
      <div
        style={{ animationDuration: `${showMonthDecadeViewAnimation}ms` }}
        className={modalWrapperClassName}
      >
        <MonthDecadeView {...monthDecadeViewProps} />
      </div>
    );
  };

  toggleMonthDecadeView = (event: Event): void => {
    if (this.isMonthDecadeViewVisible()) {
      this.hideMonthDecadeView(event);
    } else {
      this.showMonthDecadeView(event);
    }
  };

  getMonthDecadeViewView = (): ReactNode => {
    return this.monthDecadeView;
  };

  isMonthDecadeViewVisible = (): boolean => {
    return !!this.monthDecadeView;
  };

  onMonthDecadeViewOk = (
    _dateString: string | undefined,
    {
      dateMoment,
      timestamp,
    }: { dateMoment?: Moment | null; timestamp?: number | null }
  ): void => {
    this.hideMonthDecadeView();
    this.onViewDateChange({ dateMoment, timestamp });
  };

  onMonthDecadeViewCancel = (): void => {
    this.hideMonthDecadeView();
  };

  showMonthDecadeView = (event: Event): void => {
    event.preventDefault();

    this.setState({
      monthDecadeView: true,
    });

    if (this.props.onShowMonthDecadeView) {
      this.props.onShowMonthDecadeView();
    }
  };

  hideMonthDecadeView = (event?: Event): void => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    this.setState({
      monthDecadeView: false,
    });

    if (this.props.onHideMonthDecadeView) {
      this.props.onHideMonthDecadeView();
    }
  };

  toMoment = (value: DateType | undefined, props?: TypeNavBarProps): Moment => {
    props = props || this.props;

    return toMoment(value, {
      locale: props.locale,
      dateFormat: props.dateFormat,
    });
  };

  renderNav = (dir: number, viewMoment: DateType, name: string): ReactNode => {
    const props = this.p;

    let disabled = dir < 0 ? props.prevDisabled : props.nextDisabled;
    const secondary = Math.abs(dir) == 2;

    if (dir < 0 && props.minDate) {
      const gotoMoment = this.getGotoMoment(dir, viewMoment).endOf('month');

      if (gotoMoment.isBefore(this.toMoment(props.minDate))) {
        disabled = true;
      }
    }

    if (dir > 0 && props.maxDate) {
      const gotoMoment = this.getGotoMoment(dir, viewMoment).startOf('month');

      if (gotoMoment.isAfter(this.toMoment(props.maxDate))) {
        disabled = true;
      }
    }

    if (this.state.monthDecadeView) {
      disabled = true;
    }

    const { rootClassName } = props;
    const className = join(
      `${rootClassName}-arrow`,
      `${rootClassName}-arrow--${name}`,
      secondary && `${rootClassName}-secondary-arrow`,
      disabled && `${rootClassName}-arrow--disabled`
    );

    const arrowClass = `${rootClassName}-arrows-pos`;
    const arrowDivClass = `${rootClassName}-arrows-div`;

    const arrow =
      (props.arrows as any)[dir as number] ||
      props.arrows![name as keyof TypeNavBarArrows] ||
      ARROWS[name as keyof TypeNavBarArrows];

    let children;

    const dirArrow = (props.arrows as any)[dir];

    if (dirArrow) {
      children = dirArrow;
    } else {
      const doubleArrows = dir < -1 ? arrow : dir > 1 ? arrow : null;
      children =
        dir < 0 ? (
          <div className={arrowDivClass}>
            {secondary ? (
              <div className={arrowClass}>{doubleArrows}</div>
            ) : (
              <div className={arrowClass}>{arrow}</div>
            )}
          </div>
        ) : (
          <div className={arrowDivClass}>
            {secondary ? (
              <div className={arrowClass}>{doubleArrows}</div>
            ) : (
              <div className={arrowClass}>{arrow}</div>
            )}
          </div>
        );
    }

    const navProps: TypeNavProps = {
      dir,
      name,
      disabled,
      onClick: !disabled ? this.onNavClick(dir, viewMoment) : null,
      className,
      children,
    };

    if (props.renderNav) {
      return props.renderNav(navProps);
    }

    if (dir < 0 && props.renderNavPrev) {
      return props.renderNavPrev(navProps);
    }

    if (dir > 0 && props.renderNavNext) {
      return props.renderNavNext(navProps);
    }

    return <InlineBlock key={name} {...navProps} disabled={null} name={null} />;
  };

  getGotoMoment = (dir: number, viewMoment: DateType | undefined): Moment => {
    viewMoment = viewMoment || this.p.viewMoment;

    const sign = dir < 0 ? -1 : 1;
    const abs = Math.abs(dir);

    const mom = this.toMoment(viewMoment);

    mom.add(sign, abs == 1 ? 'month' : 'year');

    return mom;
  };

  onNavClick = (
    dir: number,
    viewMoment: DateType | undefined,
    event?: Event
  ): void | null => {
    const props = this.props;

    let dateMoment = this.toMoment(viewMoment);

    if (props.onUpdate) {
      dateMoment = props.onUpdate(dateMoment, dir);
    } else {
      const sign = dir < 0 ? -1 : 1;
      const abs = Math.abs(dir);

      dateMoment.add(sign, abs == 1 ? 'month' : 'year');
    }

    const timestamp = +dateMoment;

    props.onNavClick!(dir, viewMoment, event);

    const disabled = dir < 0 ? props.prevDisabled : props.nextDisabled;

    if (disabled) {
      return;
    }

    this.onViewDateChange({
      dateMoment,
      timestamp,
    });
  };

  renderNavDate = (viewMoment: Moment): string => {
    const props = this.props;
    const text = viewMoment!.format(props.navDateFormat);

    if (props.renderNavDate) {
      return props.renderNavDate(viewMoment, text);
    }

    return text;
  };

  onViewDateChange = ({
    dateMoment,
    timestamp,
  }: {
    dateMoment?: Moment | null;
    timestamp?: number | null;
  }) => {
    if (this.props.viewDate === undefined) {
      this.setState({
        viewDate: timestamp,
      });
    }

    if (this.props.onViewDateChange) {
      const dateString = dateMoment!.format(this.props.dateFormat);
      this.props.onViewDateChange(dateString, {
        dateString,
        dateMoment,
        timestamp,
      });
    }
  };
}

export { TypeNavBarProps, TypeNavProps };
export default NavBar;
