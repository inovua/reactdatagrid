/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import Component from '../../react-class';
import { Flex } from '../../Flex';

import assign from '../../../common/assign';
import join from '../../../common/join';
import toMoment from './toMoment';
import forwardTime from './utils/forwardTime';

import getTransitionEnd from './getTransitionEnd';
import assignDefined from './assignDefined';

import { renderFooter } from './MonthView';
import NavBar from './NavBar';
import times from './utils/times';

import InlineBlock from './InlineBlock';

const renderHiddenNav = props => (
  <InlineBlock {...props} style={{ visibility: 'hidden' }} />
);

const joinFunctions = (a, b) => {
  if (a && b) {
    return (...args) => {
      a(...args);
      b(...args);
    };
  }

  return a || b;
};

const TRANSITION_DURATION = '0.4s';

export default class TransitionView extends Component {
  constructor(props) {
    super(props);

    const child = React.Children.toArray(this.props.children)[0];
    const childProps = child.props;

    const viewDate =
      props.viewDate ||
      props.defaultViewDate ||
      props.defaultDate ||
      props.date ||
      childProps.viewDate ||
      childProps.defaultViewDate ||
      childProps.defaultDate ||
      childProps.date;

    const dateFormat = props.dateFormat || childProps.dateFormat;
    const locale = props.locale || childProps.locale;

    this.state = {
      rendered: false,
      viewDate: this.toMoment(viewDate, { dateFormat, locale }),
    };

    this.view = createRef();
  }

  toMoment(value, props) {
    props = props || this.props;

    return toMoment(value, {
      locale: props.locale,
      dateFormat: props.dateFormat,
    });
  }

  format(mom, props) {
    props = props || this.props;
    return mom.format(props.dateFormat);
  }

  componentDidMount() {
    this.setState({
      rendered: true,
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.viewDate) {
      // this is in order to transition when the prop changes
      // if we were to simply do setState({ viewDate }) it wouldn't have had a transition
      this.transitionTo(nextProps.viewDate, nextProps);
    }
  }

  transitionTo(date, props) {
    props = props || this.props;

    const dateMoment = this.toMoment(date, props);

    this.doTransition(dateMoment);
  }

  getViewChild() {
    return React.Children.toArray(this.props.children).filter(
      c => c && c.props && c.props.isDatePicker
    )[0];
  }

  prepareChildProps(child, extraProps) {
    if (this.view.current) {
      return this.view.current.p;
    }

    child = child || this.getViewChild();

    return assign({}, child.props, extraProps);
  }

  render() {
    const props = this.props;
    const { rootClassName } = props;
    const child = (this.child = this.getViewChild());
    let viewDate = this.state.viewDate || props.viewMoment || props.viewDate;
    const renderedChildProps = (this.renderedChildProps = this.prepareChildProps(
      child,
      assignDefined({
        viewDate,
      })
    ));

    viewDate =
      this.state.viewDate ||
      renderedChildProps.viewMoment ||
      renderedChildProps.viewDate;
    if (!this.state.transition) {
      this.viewDate = viewDate;
    }

    const multiView = !!(child.props.size && child.props.size >= 2);
    const onViewDateChange = joinFunctions(
      this.onViewDateChange,
      props.onViewDateChange
    );

    // TODO make transition view pass all props, as is to child component
    const newProps = {
      key: 'picker',
      ref: this.view,

      viewDate: this.viewDate,
      onViewDateChange,
      navigation: multiView,
      constrainActiveInView: props.constrainActiveInView,

      className: join(
        child.props.className,
        'inovua-react-toolkit-calendar__center'
      ),
    };

    // only pass those down if they have been specified
    // as props on this TransitionView
    assignDefined(newProps, {
      range: props.range,
      date: props.date,
      activeDate: props.activeDate,
      footer: false,
      insideField: props.insideField,

      defaultRange: props.defaultRange,
      defaultDate: props.defaultDate,
      defaultActiveDate: props.defaultActiveDate,

      // this is here in order to ensure time changes are reflected
      // when using a TransitionView inside a DateInput
      onTimeChange: props.onTimeChange,
      onClockInputBlur: props.onClockInputBlur,
      onClockInputFocus: props.onClockInputFocus,
      onClockEnterKey: props.onClockEnterKey,
      onClockEscapeKey: props.onClockEscapeKey,
      showClock: props.showClock,

      tabIndex: props.tabIndex,

      dateFormat: props.dateFormat,
      locale: props.locale,
      theme: props.theme,

      minDate: props.minDate,
      maxDate: props.maxDate,
      onKeyDown: this.onKeyDown,
      onBlur: this.onBlur,
    });

    if (props.onChange) {
      newProps.onChange = joinFunctions(
        props.onChange,
        renderedChildProps.onChange
      );
    }
    if (props.onRangeChange) {
      newProps.onRangeChange = joinFunctions(
        props.onRangeChange,
        renderedChildProps.onRangeChange
      );
    }

    if (props.onActiveDateChange) {
      newProps.onActiveDateChange = joinFunctions(
        props.onActiveDateChange,
        renderedChildProps.onActiveDateChange
      );
    }

    if (this.state.transition) {
      this.transitionDurationStyle = {
        transitionDuration: props.transitionDuration || TRANSITION_DURATION,
      };

      newProps.style = assign(
        {},
        child.props.style,
        this.transitionDurationStyle
      );

      newProps.className = join(
        newProps.className,
        'inovua-react-toolkit-calendar--transition',
        `inovua-react-toolkit-calendar--transition-${
          this.state.transition == -1 ? 'left' : 'right'
        }`
      );
    }

    let navBar;

    const navBarProps = {
      minDate: props.minDate || renderedChildProps.minDate,
      maxDate: props.maxDate || renderedChildProps.maxDate,
      enableMonthDecadeView:
        props.enableMonthDecadeView === undefined
          ? renderedChildProps.enableMonthDecadeView
          : props.enableMonthDecadeView,
      secondary: true,
      viewDate: this.nextViewDate || this.viewDate,
      onViewDateChange,
      multiView,
      enableMonthDecadeViewAnimation: props.enableMonthDecadeViewAnimation,
      showMonthDecadeViewAnimation: props.showMonthDecadeViewAnimation,
    };

    if (props.navigation) {
      navBar = this.renderNavBar(assign({}, navBarProps, { mainNavBar: true }));
    }

    let footer;

    if (props.footer) {
      footer = renderFooter(
        props,
        props.insideField ? props : this.view.current
      );
    }

    if (multiView) {
      newProps.renderNavBar = this.renderMultiViewNavBar.bind(
        this,
        navBarProps
      );
    }

    const clone = React.cloneElement(child, newProps);
    const flexProps = assign({}, props);

    delete flexProps.constrainActiveInView;
    delete flexProps.enableMonthDecadeView;
    delete flexProps.focusOnNavMouseDown;
    delete flexProps.focusOnTransitionEnd;
    delete flexProps.footerClearDate;
    delete flexProps.isDatePicker;
    delete flexProps.navigation;
    delete flexProps.onTransitionEnd;
    delete flexProps.onTransitionStart;
    delete flexProps.theme;
    delete flexProps.rootClassName;
    delete flexProps.enableMonthDecadeViewAnimation;
    delete flexProps.showMonthDecadeViewAnimation;
    delete flexProps.footer;

    return (
      <Flex
        column
        inline
        wrap={false}
        alignItems="stretch"
        {...flexProps}
        className={join(
          props.className,
          rootClassName,
          props.theme && `${rootClassName}--theme-${props.theme}`
        )}
      >
        {navBar}
        <Flex inline row style={{ position: 'relative', overflow: 'hidden' }}>
          {this.renderAt(-1, { multiView, navBarProps })}
          {clone}
          {this.renderAt(1, { multiView, navBarProps })}
        </Flex>
        {footer}
      </Flex>
    );
  }

  tryNavBarKeyDown(event) {
    if (this.navBar && this.navBar.getMonthDecadeView) {
      const monthDecadeView = this.navBar.getMonthDecadeView();

      if (monthDecadeView && monthDecadeView.onKeyDown) {
        monthDecadeView.onKeyDown(event);
        return true;
      }
    }

    return false;
  }

  onKeyDown(event) {
    const initialKeyDown = this.child.onKeyDown;

    if (this.tryNavBarKeyDown(event)) {
      return false;
    }

    if (initialKeyDown) {
      return initialKeyDown(event);
    }
  }

  isMonthDecadeViewVisible() {
    if (this.navBar && this.navBar.isMonthDecadeViewVisible) {
      return this.navBar.isMonthDecadeViewVisible();
    }

    return false;
  }

  showMonthDecadeView() {
    if (this.navBar) {
      this.navBar.showMonthDecadeView();
    }
  }

  hideMonthDecadeView() {
    if (this.navBar) {
      this.navBar.hideMonthDecadeView();
    }
  }

  onBlur(event) {
    const initialBlur = this.child.onBlur;

    this.hideMonthDecadeView();

    if (initialBlur) {
      initialBlur(event);
    }

    return true;
  }

  /**
   * This method is only called when rendering the NavBar of the MonthViews
   * that are not on the first row of the MultiMonthView
   *
   * @param  {Object} navBarProps
   * @param  {Object} config
   * @return {ReactNode}
   */
  renderMultiViewNavBar(navBarProps, config) {
    const { index } = config;
    const count = this.child.props.perRow;

    if (index >= count) {
      const viewDate = this.toMoment(navBarProps.viewDate).add(index, 'month');

      return (
        <NavBar
          {...navBarProps}
          renderNavNext={renderHiddenNav}
          renderNavPrev={renderHiddenNav}
          onViewDateChange={null}
          viewDate={this.toMoment(viewDate)}
        />
      );
    }

    return null;
  }

  renderNavBar(navBarProps) {
    navBarProps = assign({}, navBarProps);

    if (navBarProps.mainNavBar) {
      navBarProps.ref = navBar => {
        this.navBar = navBar;
      };
      navBarProps.onMouseDown = this.onNavMouseDown;
    }

    const props = this.props;
    const { multiView } = navBarProps;

    const navBar = React.Children.toArray(props.children).filter(
      c => c && c.props && c.props.isDatePickerNavBar
    )[0];

    let newProps = navBarProps;

    if (navBar) {
      newProps = assign({}, navBarProps, navBar.props);

      // have viewDate & onViewDateChange win over initial navBar.props
      newProps.viewDate = navBarProps.viewDate;
      newProps.onViewDateChange = navBarProps.onViewDateChange;
    }

    if (multiView) {
      const count = this.child.props.perRow;
      const viewSize = this.getViewSize();

      const bars = times(count).map(index => {
        const onUpdate = (dateMoment, dir) => {
          const mom = this.toMoment(newProps.viewDate);

          if (Math.abs(dir) == 1) {
            mom.add(dir * viewSize, 'month');
          } else {
            const sign = dir > 0 ? 1 : -1;

            mom.add(sign, 'year');
          }

          return mom;
        };

        const barProps = assign({}, newProps, {
          onUpdate,
          renderNavNext: renderHiddenNav,
          renderNavPrev: renderHiddenNav,
          viewDate: this.toMoment(newProps.viewDate).add(index, 'month'),
        });

        delete barProps.rootClassName;

        if (index == 0) {
          delete barProps.renderNavPrev;
        }
        if (index == count - 1) {
          delete barProps.renderNavNext;
        }

        return <NavBar flex {...barProps} />;
      });

      return <Flex row children={bars} />;
    }

    return navBar ? (
      React.cloneElement(navBar, newProps)
    ) : (
      <NavBar {...newProps} />
    );
  }

  getViewSize() {
    return this.view.current && this.view.current.getViewSize
      ? this.view.current.getViewSize() || 1
      : 1;
  }

  renderAt(index, { multiView, navBarProps }) {
    if (!this.state.rendered || !this.view.current) {
      return null;
    }

    const viewSize = this.getViewSize();
    const viewDiff = viewSize * index;

    const childProps = this.child.props;
    const renderedProps = this.renderedChildProps;

    let viewDate = this.toMoment(this.viewDate).add(viewDiff, 'month');

    if (this.nextViewDate && this.state.prepareTransition == -index) {
      // we're transitioning to this viewDate, so make sure
      // it renders the date we'll need at the end of the transition
      viewDate = this.nextViewDate;
    }

    let date = renderedProps.date || renderedProps.moment;

    if (this.state.transitionTime) {
      date = forwardTime(this.state.transitionTime, this.toMoment(date));
    }

    const newProps = assign({
      date,
      readOnly: true,
      range: renderedProps.range,
      activeDate: renderedProps.activeDate,
      dateFormat: renderedProps.dateFormat,
      locale: renderedProps.locale,
      tabIndex: -1,
      clockTabIndex: -1,
      navigation: multiView,
      viewDate,
      key: index,
      footer: false,
      className: join(
        childProps.className,
        `inovua-react-toolkit-calendar__${index == -1 ? 'prev' : 'next'}`
      ),
    });

    assignDefined(newProps, {
      showClock: renderedProps.showClock,
      minDate: renderedProps.minDate,
      maxDate: renderedProps.maxDate,
    });

    if (this.state.transition && this.state.transition != index) {
      newProps.style = assign(
        {},
        childProps.style,
        this.transitionDurationStyle
      );
      newProps.className = join(
        newProps.className,
        'inovua-react-toolkit-calendar--transition',
        `inovua-react-toolkit-calendar--transition-${
          this.state.transition == -1 ? 'left' : 'right'
        }`
      );
    }

    if (multiView) {
      newProps.renderNavBar = this.renderMultiViewNavBar.bind(
        this,
        assign({}, navBarProps, { viewDate, onViewDateChange: null })
      );
    }

    return React.cloneElement(this.child, newProps);
  }

  getView() {
    return this.view.current;
  }

  isInView(...args) {
    return this.view.current.isInView(...args);
  }

  onViewDateChange(dateString, { dateMoment }) {
    this.doTransition(dateMoment);
  }

  doTransition(dateMoment) {
    if (this.state.transition) {
      return;
    }
    // to protect of null, which will default to current date
    dateMoment = this.toMoment(dateMoment);

    const newMoment = this.toMoment(dateMoment).startOf('month');
    const viewMoment = this.toMoment(this.viewDate).startOf('month');

    if (newMoment.format('YYYY-MM') == viewMoment.format('YYYY-MM')) {
      return;
    }

    const navNext = newMoment.isAfter(viewMoment);
    const transition = navNext ? -1 : 1;
    const viewSize = this.getViewSize();

    if (Math.abs(viewSize) > 1) {
      const temp = this.toMoment(viewMoment).add(
        viewSize * -transition,
        'month'
      );

      if (navNext) {
        dateMoment = dateMoment.isAfter(temp) ? dateMoment : temp;
      } else {
        dateMoment = dateMoment.isBefore(temp) ? dateMoment : temp;
      }
    }

    const transitionTime = this.props.getTransitionTime
      ? this.props.getTransitionTime()
      : null;

    this.setState(
      {
        transitionTime,
        prepareTransition: transition,
      },
      () => {
        setTimeout(() => {
          // in order to allow this.view.current.p to update
          if (!this.view.current) {
            return;
          }

          this.nextViewDate = dateMoment;

          this.addTransitionEnd();

          this.setState({
            transition,
          });
        });
      }
    );
  }

  addTransitionEnd() {
    const dom = this.view.current;

    if (dom) {
      dom.addEventListener(getTransitionEnd(), this.onTransitionEnd, false);
    }
  }

  removeTransitionEnd(dom) {
    dom = dom || this.view.current;

    if (dom) {
      dom.removeEventListener(getTransitionEnd(), this.onTransitionEnd);
    }
  }

  onTransitionEnd() {
    this.removeTransitionEnd();

    if (!this.nextViewDate) {
      return;
    }

    this.setState({
      viewDate: this.nextViewDate,
      transition: 0,
      prepareTransition: 0,
    });

    if (this.props.focusOnTransitionEnd) {
      this.focus();
    }

    delete this.nextViewDate;
  }

  onNavMouseDown() {
    if (this.props.focusOnNavMouseDown && !this.isFocused()) {
      this.focus();
    }
  }

  isFocused() {
    const view = this.getView();

    if (view) {
      return view.isFocused();
    }

    return false;
  }

  focus() {
    this.getView().focus();
  }
}

TransitionView.propTypes = {
  children: PropTypes.node.isRequired,
  rootClassName: PropTypes.string,

  focusOnNavMouseDown: PropTypes.bool,

  onTransitionStart: PropTypes.func,
  onTransitionEnd: PropTypes.func,

  footerClearDate: PropTypes.bool,
  enableMonthDecadeView: PropTypes.bool,
  constrainActiveInView: PropTypes.bool,
  focusOnTransitionEnd: PropTypes.bool,
  navigation: PropTypes.bool,
  theme: PropTypes.string,
  isDatePicker: PropTypes.bool,
  enableMonthDecadeViewAnimation: PropTypes.bool,
  showMonthDecadeViewAnimation: PropTypes.number,
};

TransitionView.defaultProps = {
  rootClassName: 'inovua-react-toolkit-calendar__transition-month-view',
  focusOnNavMouseDown: true,
  enableMonthDecadeViewAnimation: true,
  showMonthDecadeViewAnimation: 300,

  onTransitionStart: () => {},
  onTransitionEnd: () => {},

  footerClearDate: null,
  enableMonthDecadeView: true,
  constrainActiveInView: false,
  focusOnTransitionEnd: false,
  navigation: true,
  theme: 'default-light',
  isDatePicker: true,
};
