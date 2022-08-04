/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component, createRef, } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import assign from '../../../../common/assign';
import join from '../../../../common/join';
import clampRange from '../clampRange';
import toMoment from '../toMoment';
import isInRange from '../utils/isInRange';
import NavBar from '../NavBar';
import Footer from '../Footer';
import joinFunctions from '../joinFunctions';
import assignDefined from '../assignDefined';
import BasicMonthView, { getDaysInMonthView } from '../BasicMonthView';
import ON_KEY_DOWN from './onKeyDown';
import NAV_KEYS from './navKeys';
const defaultProps = {
    rootClassName: 'inovua-react-toolkit-calendar__month-view',
    dateFormat: 'YYYY-MM-DD',
    theme: 'default',
    onBlur: () => { },
    onFocus: () => { },
    footerClearDate: null,
    okButton: true,
    partialRange: true,
    activateOnHover: false,
    constrainActiveInView: false,
    showDaysBeforeMonth: true,
    showDaysAfterMonth: true,
    highlightWeekends: true,
    highlightToday: true,
    navOnDateClick: true,
    navigation: true,
    constrainViewDate: true,
    highlightRangeOnMouseMove: false,
    isDatePicker: true,
    enableMonthDecadeView: true,
    focusOnNavMouseDown: true,
    focusOnFooterMouseDown: true,
    enableMonthDecadeViewAnimation: true,
    showMonthDecadeViewAnimation: 300,
};
const DateType = PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.string,
]);
const propTypes = {
    rootClassName: PropTypes.string,
    navOnDateClick: PropTypes.bool,
    isDisabledDay: PropTypes.func,
    onChange: PropTypes.func,
    onViewDateChange: PropTypes.func,
    onActiveDateChange: PropTypes.func,
    dateFormat: PropTypes.string,
    date: DateType,
    theme: PropTypes.string,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    footerClearDate: PropTypes.object,
    partialRange: PropTypes.bool,
    activateOnHover: PropTypes.bool,
    constrainActiveInView: PropTypes.bool,
    showDaysBeforeMonth: PropTypes.bool,
    showDaysAfterMonth: PropTypes.bool,
    highlightWeekends: PropTypes.bool,
    highlightToday: PropTypes.bool,
    navigation: PropTypes.bool,
    constrainViewDate: PropTypes.bool,
    highlightRangeOnMouseMove: PropTypes.bool,
    isDatePicker: PropTypes.bool,
    onRenderDay: PropTypes.func,
    getTransitionTime: PropTypes.func,
    cleanup: PropTypes.func,
    navigate: PropTypes.func,
    onRangeChange: PropTypes.func,
    onHoverRangeChange: PropTypes.func,
    renderNavBar: PropTypes.func,
    select: PropTypes.func,
    renderChildren: PropTypes.func,
    onFooterTodayClick: PropTypes.func,
    onFooterClearClick: PropTypes.func,
    onFooterCancelClick: PropTypes.func,
    onMouseLeave: PropTypes.any,
    clockTabIndex: PropTypes.number,
    index: PropTypes.number,
    dayPropsMap: PropTypes.object,
    insideMultiView: PropTypes.bool,
    insideField: PropTypes.bool,
    enableMonthDecadeView: PropTypes.bool,
    focusOnNavMouseDown: PropTypes.bool,
    focusOnFooterMouseDown: PropTypes.bool,
    maxConstrained: PropTypes.bool,
    minConstrained: PropTypes.bool,
    enableMonthDecadeViewAnimation: PropTypes.bool,
    showMonthDecadeViewAnimation: PropTypes.number,
    disabled: PropTypes.bool,
    footer: PropTypes.bool,
    navBarArrows: PropTypes.shape({
        prev: PropTypes.node,
        next: PropTypes.node,
        right: PropTypes.node,
        left: PropTypes.node,
    }),
    cancelButton: PropTypes.bool,
    cancelButtonText: PropTypes.node,
    okButton: PropTypes.bool,
    okButtonText: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    showClock: PropTypes.bool,
    defaultDate: DateType,
    activeDate: DateType,
    defaultActiveDate: DateType,
    rangeStart: DateType,
    range: PropTypes.arrayOf(DateType),
    defaultRange: PropTypes.arrayOf(DateType),
    hoverRange: PropTypes.arrayOf(DateType),
    defaultHoverRange: PropTypes.arrayOf(DateType),
    minDate: DateType,
    maxDate: DateType,
    viewDate: DateType,
    defaultViewDate: DateType,
};
let TODAY;
const RENDER_DAY = (props) => {
    const divProps = assign({}, props);
    delete divProps.date;
    delete divProps.dateMoment;
    delete divProps.day;
    delete divProps.isAfterMaxDate;
    delete divProps.isBeforeMinDate;
    delete divProps.inRange;
    delete divProps.timestamp;
    return React.createElement("div", { ...divProps });
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
    const dayProps = props.dayPropsMap[timestamp];
    if (dayProps && dayProps.disabled) {
        return false;
    }
    return isDateInMinMax(timestamp, props);
};
const isInView = function (mom, props) {
    if (!props) {
        throw new Error('props is mandatory in isInView');
    }
    const daysInView = props.daysInView;
    return isInRange(mom, { range: daysInView, inclusive: true });
};
const prepareViewDate = (props, state) => {
    const viewDate = props.viewDate === undefined ? state.viewDate : props.viewDate;
    if (!viewDate && props.moment) {
        return toMoment(props.moment);
    }
    return viewDate;
};
const prepareDate = (props, state) => {
    if (props.range) {
        return null;
    }
    return props.date === undefined ? state.date : props.date;
};
const prepareRange = (props, state) => {
    if (props.moment) {
        return null;
    }
    return props.partialRange
        ? props.range || state.range
        : state.range || props.range;
};
const prepareActiveDate = function (props, state) {
    const fallbackDate = prepareDate(props, state) || (prepareRange(props, state) || [])[0];
    const activeDate = props.activeDate === undefined
        ? // only fallback to date if activeDate not specified
            state.activeDate || fallbackDate
        : props.activeDate;
    const daysInView = props.daysInView;
    if (activeDate && daysInView && props.constrainActiveInView) {
        const activeMoment = this.toMoment(activeDate);
        if (!isInView(activeMoment, props)) {
            const date = fallbackDate;
            const dateMoment = this.toMoment(date);
            if (date &&
                isInView(dateMoment, props) &&
                isValidActiveDate(+dateMoment, props)) {
                return date;
            }
            return null;
        }
    }
    return isValidActiveDate(+activeDate, props) ? activeDate : null;
};
const renderFooter = (props, buttonHandlers) => {
    if (!props.footer) {
        return null;
    }
    buttonHandlers = buttonHandlers || props;
    const renderFooter = props.renderFooter;
    const footerFnProps = {
        onTodayClick: buttonHandlers.onFooterTodayClick,
        onClearClick: buttonHandlers.onFooterClearClick,
        onOkClick: buttonHandlers.onFooterOkClick,
        onCancelClick: buttonHandlers.onFooterCancelClick,
    };
    const childFooter = React.Children.toArray(props.children).filter((c) => c && c.props && c.props.isDatePickerFooter)[0];
    const childFooterProps = childFooter ? childFooter.props : null;
    if (childFooterProps) {
        // also take into account the props on childFooter
        // so we merge those with the other props already built
        Object.keys(footerFnProps).forEach(key => {
            if (childFooter.props[key]) {
                footerFnProps[key] = joinFunctions(footerFnProps[key], childFooter.props[key]);
            }
        });
    }
    const footerProps = assignDefined({}, footerFnProps, {
        key: 'footer_props_key',
        todayButton: props.todayButton,
        todayButtonText: props.todayButtonText,
        clearButton: props.clearButton,
        clearButtonText: props.clearButtonText,
        theme: props.theme,
        okButton: props.okButton === undefined && !props.insideField
            ? false
            : props.okButton,
        okButtonText: props.okButtonText,
        cancelButton: props.cancelButton === undefined && !props.insideField
            ? false
            : props.cancelButton,
        cancelButtonText: props.cancelButtonText,
        clearDate: props.clearDate || props.footerClearDate,
        selectDate: props.selectDate,
    });
    if (childFooter) {
        if (renderFooter) {
            return renderFooter(assign({}, childFooter.props, footerProps));
        }
        return React.cloneElement(childFooter, footerProps);
    }
    if (renderFooter) {
        return renderFooter(footerProps);
    }
    return React.createElement(Footer, { ...footerProps });
};
class MonthView extends Component {
    static defaultProps = defaultProps;
    static propTypes = propTypes;
    toMoment;
    p = {};
    monthViewRef;
    navBar;
    isInView(mom, props) {
        return isInView(mom, props || this.p);
    }
    constructor(props) {
        super(props);
        this.state = {
            range: props.defaultRange,
            date: props.defaultDate,
            hoverRange: props.defaultHoverRange,
            activeDate: props.defaultActiveDate,
            viewDate: props.defaultViewDate,
        };
        this.monthViewRef = createRef();
        this.updateToMoment(props);
    }
    componentDidUpdate = (prevProps) => {
        if (prevProps.locale !== this.props.locale ||
            prevProps.dateFormat !== this.props.dateFormat) {
            this.updateToMoment(this.props);
        }
    };
    updateToMoment = (props) => {
        this.toMoment = (value, dateFormat) => {
            return toMoment(value, {
                locale: props.locale,
                dateFormat: dateFormat || props.dateFormat,
            });
        };
        TODAY = +this.toMoment().startOf('day');
    };
    prepareClassName = (props) => {
        return join(props.className, props.rootClassName, `${props.rootClassName}--theme-${props.theme}`, props.size === undefined ? `${props.rootClassName}-relative` : null);
    };
    prepareProps = (thisProps, state) => {
        const props = (this.p = assign({}, thisProps));
        state = state || this.state;
        props.hoverRange =
            props.hoverRange === undefined ? this.state.hoverRange : props.hoverRange;
        props.dayPropsMap = {};
        props.className = this.prepareClassName && this.prepareClassName(props);
        const { minDate, maxDate } = props;
        if (minDate) {
            props.minDateMoment = this.toMoment(props.minDate).startOf('day');
            props.minDate = +props.minDateMoment;
        }
        if (maxDate) {
            props.maxDateMoment = this.toMoment(props.maxDate);
            props.maxDate = +props.maxDateMoment;
        }
        const date = prepareDate(props, state);
        if (date) {
            props.moment =
                props.moment ||
                    (props.range ? null : this.toMoment(date).startOf('day'));
            props.timestamp = props.moment ? +props.moment : null;
        }
        props.viewMoment =
            props.viewMoment || this.toMoment(prepareViewDate(props, state));
        if (props.constrainViewDate &&
            props.minDate &&
            props.viewMoment.isBefore(props.minDate)) {
            props.minConstrained = true;
            props.viewMoment = this.toMoment(props.minDate);
        }
        if (props.constrainViewDate &&
            props.maxDate &&
            props.viewMoment.isAfter(props.maxDate)) {
            props.maxConstrained = true;
            props.viewMoment = this.toMoment(props.maxDate);
        }
        props.viewMonthStart = this.toMoment(props.viewMoment).startOf('month');
        props.viewMonthEnd = this.toMoment(props.viewMoment).endOf('month');
        const range = prepareRange(props, state);
        if (range) {
            props.range = range.map(d => this.toMoment(d).startOf('day'));
            props.rangeStart =
                state.rangeStart || (props.range.length == 1 ? props.range[0] : null);
        }
        props.daysInView = getDaysInMonthView(props.viewMoment, props);
        const activeDate = prepareActiveDate.call(this, props, state);
        if (activeDate) {
            props.activeDate = +this.toMoment(activeDate).startOf('day');
        }
        return props;
    };
    getViewMoment = () => {
        return this.p.viewMoment;
    };
    getViewSize = () => {
        return 1;
    };
    preparePrevNextClassName = (timestamp, props) => {
        const { viewMonthStart, viewMonthEnd, rootClassName } = props;
        const before = timestamp < viewMonthStart;
        const after = timestamp > viewMonthEnd;
        const thisMonth = !before && !after;
        return join(timestamp == TODAY && `${rootClassName}-day--today`, props.highlightToday &&
            timestamp == TODAY &&
            `${rootClassName}-day--today-highlight`, before && `${rootClassName}-day--prev-month`, before && !props.showDaysBeforeMonth && `${rootClassName}-day--hidden`, after && `${rootClassName}-day--next-month`, after && !props.showDaysAfterMonth && `${rootClassName}-day--hidden`, thisMonth && `${rootClassName}-day--this-month`);
    };
    prepareMinMaxProps = (timestamp, props) => {
        const classes = [];
        const { rootClassName } = this.props;
        let isBeforeMinDate = false;
        let isAfterMaxDate = false;
        const { minDate, maxDate } = props;
        if (minDate && timestamp < minDate) {
            classes.push(`${rootClassName}-day--disabled-min`);
            isBeforeMinDate = true;
        }
        if (maxDate && timestamp > maxDate) {
            classes.push(`${rootClassName}-day--disabled-max`);
            isAfterMaxDate = true;
        }
        return {
            className: join(classes),
            isBeforeMinDate,
            isAfterMaxDate,
            disabled: isBeforeMinDate || isAfterMaxDate,
        };
    };
    prepareWeekendClassName = (dateMoment, { highlightWeekends }) => {
        const weekDay = dateMoment.day();
        const { rootClassName } = this.props;
        if (weekDay === 0 /* Sunday */ || weekDay === 6 /* Saturday */) {
            return join(`${rootClassName}-day--weekend`, highlightWeekends && `${rootClassName}-day--weekend-highlight`);
        }
        return '';
    };
    prepareRangeProps = (dateMoment, props) => {
        let inRange = false;
        const className = [];
        const { hoverRange, range, rootClassName } = props;
        if (range) {
            let [rangeStart, rangeEnd] = range;
            if (!range.length) {
                rangeStart = props.rangeStart;
            }
            const rangeName = 'range';
            if (rangeStart && dateMoment.isSame(rangeStart)) {
                className.push(`${rootClassName}-day--${rangeName}-start`);
                className.push(`${rootClassName}-day--in-${rangeName}`);
                if (!rangeEnd) {
                    className.push(`${rootClassName}-day--${rangeName}-end`);
                }
                inRange = true;
            }
            if (rangeEnd && dateMoment.isSame(rangeEnd)) {
                className.push(`${rootClassName}-day--${rangeName}-end`);
                className.push(`${rootClassName}-day--in-${rangeName}`);
                inRange = true;
            }
            if (!inRange && isInRange(dateMoment, range)) {
                className.push(`${rootClassName}-day--in-${rangeName}`);
                inRange = true;
            }
        }
        if (range &&
            range.length < 2 &&
            hoverRange &&
            isInRange(dateMoment, hoverRange)) {
            className.push(`${rootClassName}-day--in-hover-range`);
            if (dateMoment.isSame(hoverRange[0])) {
                className.push(`${rootClassName}-day--hover-range-start`);
            }
            if (dateMoment.isSame(hoverRange[1])) {
                className.push(`${rootClassName}-day--hover-range-end`);
            }
        }
        return {
            inRange,
            className: join(className),
        };
    };
    prepareDayProps = (renderDayProps, props) => {
        const { timestamp, dateMoment, className } = renderDayProps;
        props = props || this.p;
        const { rootClassName } = props;
        const result = {};
        const minMaxProps = this.prepareMinMaxProps(timestamp, props);
        const rangeProps = this.prepareRangeProps(dateMoment, props);
        const weekendClassName = this.prepareWeekendClassName(dateMoment, props);
        const prevNextClassName = this.preparePrevNextClassName(timestamp, props);
        const currentTimestamp = props.timestamp;
        assign(result, minMaxProps, rangeProps, {
            children: (React.createElement("div", { className: `${rootClassName}-day-text` }, renderDayProps.day)),
            className: join([
                minMaxProps.className,
                rangeProps.className,
                prevNextClassName,
                weekendClassName,
                timestamp == currentTimestamp ? `${rootClassName}-day--value` : null,
                timestamp == props.activeDate ? `${rootClassName}-day--active` : null,
                className,
            ]),
        });
        if (!result.disabled && props.isDisabledDay) {
            result.disabled = props.isDisabledDay(renderDayProps, props);
        }
        return result;
    };
    focus = () => {
        const domNode = this.getDOMNode();
        if (domNode) {
            domNode.focus();
        }
    };
    getDOMNode = () => {
        return this.monthViewRef.current;
    };
    onDayTextMouseEnter = ({ dateMoment, timestamp, }) => {
        if (!this.state.focused) {
            this.focus();
        }
        this.onActiveDateChange({ dateMoment, timestamp });
    };
    renderDay = (renderProps) => {
        const props = this.p;
        const { dateMoment, timestamp } = renderProps;
        const rootClassName = renderProps.rootClassName || this.props.rootClassName;
        assign(renderProps, this.prepareDayProps(renderProps, props));
        if (props.range && props.highlightRangeOnMouseMove) {
            renderProps.onMouseEnter = this.handleDayMouseEnter.bind(this, renderProps);
        }
        if (typeof props.onRenderDay === 'function') {
            const newRenderProps = props.onRenderDay(renderProps);
            if (newRenderProps !== undefined) {
                renderProps = newRenderProps;
            }
        }
        if (renderProps.disabled) {
            renderProps.className = join(`${rootClassName}-day--disabled`, renderProps.className);
        }
        else {
            const eventParam = { dateMoment, timestamp };
            const onClick = this.handleClick.bind(this, eventParam);
            const prevOnClick = renderProps.onClick;
            renderProps.onClick = prevOnClick
                ? (...args) => {
                    prevOnClick(...args);
                    onClick(...args);
                }
                : onClick;
            if (props.activateOnHover && this.props.activeDate !== null) {
                const onMouseEnter = this.onDayTextMouseEnter.bind(this, eventParam);
                const prevOnMouseEnter = renderProps.onMouseEnter;
                renderProps.onMouseEnter = prevOnMouseEnter
                    ? (...args) => {
                        prevOnMouseEnter(...args);
                        onMouseEnter(...args);
                    }
                    : onMouseEnter;
            }
        }
        props.dayPropsMap[timestamp] = renderProps;
        const renderFunction = props.renderDay || RENDER_DAY;
        let result = renderFunction(renderProps);
        if (result === undefined) {
            result = RENDER_DAY(renderProps);
        }
        return result;
    };
    render = () => {
        const props = (this.p = this.prepareProps(this.props));
        const basicViewProps = assign({}, props);
        delete basicViewProps.activeDate;
        delete basicViewProps.activateOnHover;
        delete basicViewProps.arrows;
        delete basicViewProps.cleanup;
        delete basicViewProps.clockTabIndex;
        delete basicViewProps.constrainViewDate;
        delete basicViewProps.constrainActiveInView;
        delete basicViewProps.dayPropsMap;
        delete basicViewProps.date;
        delete basicViewProps.defaultActiveDate;
        delete basicViewProps.defaultDate;
        delete basicViewProps.defaultRange;
        delete basicViewProps.defaultViewDate;
        delete basicViewProps.enableMonthDecadeView;
        delete basicViewProps.focusOnFooterMouseDown;
        delete basicViewProps.focusOnNavMouseDown;
        delete basicViewProps.footer;
        delete basicViewProps.footerClearDate;
        delete basicViewProps.getTransitionTime;
        delete basicViewProps.highlightRangeOnMouseMove;
        delete basicViewProps.highlightToday;
        delete basicViewProps.highlightWeekends;
        delete basicViewProps.hoverRange;
        delete basicViewProps.insideField;
        delete basicViewProps.insideMultiView;
        delete basicViewProps.isDatePicker;
        delete basicViewProps.isDisabledDay;
        delete basicViewProps.maxConstrained;
        delete basicViewProps.maxDate;
        delete basicViewProps.maxDateMoment;
        delete basicViewProps.minConstrained;
        delete basicViewProps.minDate;
        delete basicViewProps.minDateMoment;
        delete basicViewProps.navBarArrows;
        delete basicViewProps.navNext;
        delete basicViewProps.navigation;
        delete basicViewProps.navigate;
        delete basicViewProps.navOnDateClick;
        delete basicViewProps.navPrev;
        delete basicViewProps.onActiveDateChange;
        delete basicViewProps.onChange;
        delete basicViewProps.onHoverRangeChange;
        delete basicViewProps.onRangeChange;
        delete basicViewProps.onViewDateChange;
        delete basicViewProps.onTransitionStart;
        delete basicViewProps.partialRange;
        delete basicViewProps.range;
        delete basicViewProps.rangeStart;
        delete basicViewProps.renderNavBar;
        delete basicViewProps.select;
        delete basicViewProps.showDaysAfterMonth;
        delete basicViewProps.showDaysBeforeMonth;
        delete basicViewProps.showClock;
        delete basicViewProps.theme;
        delete basicViewProps.viewDate;
        delete basicViewProps.viewMonthEnd;
        delete basicViewProps.viewMonthStart;
        delete basicViewProps.okButtonText;
        delete basicViewProps.okButton;
        delete basicViewProps.enableMonthDecadeViewAnimation;
        delete basicViewProps.showMonthDecadeViewAnimation;
        if (typeof props.cleanup == 'function') {
            props.cleanup(basicViewProps);
        }
        return (React.createElement(BasicMonthView, { key: "basic_month", tabIndex: 0, innerRef: this.monthViewRef, ...basicViewProps, renderChildren: this.renderChildren, onKeyDown: this.onViewKeyDown, onFocus: this.onFocus, onBlur: this.onBlur, renderDay: this.renderDay, viewMoment: props.viewMoment, onMouseLeave: props.highlightRangeOnMouseMove ? this.handleViewMouseLeave : null }));
    };
    handleViewMouseLeave = (event) => {
        if (this.props.onMouseLeave) {
            this.props.onMouseLeave(event);
        }
        if (this.state.hoverRange) {
            this.setHoverRange(null);
        }
    };
    renderChildren = (children) => {
        const props = this.p;
        const navBar = this.renderNavBar(props);
        const footer = this.renderFooter(props);
        const result = [navBar, children, footer];
        if (props.renderChildren) {
            return props.renderChildren(result);
        }
        return result;
    };
    focusFromFooter = () => {
        if (!this.isFocused() && this.props.focusOnFooterMouseDown) {
            this.focus();
        }
    };
    onFooterTodayClick = () => {
        this.focusFromFooter();
        if (this.props.onFooterTodayClick) {
            if (this.props.onFooterTodayClick() === false) {
                return;
            }
        }
        this.select({ dateMoment: this.toMoment(Date.now()) });
    };
    onFooterClearClick = () => {
        this.focusFromFooter();
        if (this.props.onFooterClearClick) {
            if (this.props.onFooterClearClick() === false) {
                return;
            }
        }
        this.select({ dateMoment: null });
    };
    onFooterOkClick = () => {
        this.focusFromFooter();
        if (this.props.onFooterOkClick) {
            this.props.onFooterOkClick();
        }
    };
    onFooterCancelClick = () => {
        if (this.props.onFooterCancelClick) {
            this.props.onFooterCancelClick();
        }
    };
    renderFooter = (props) => {
        return renderFooter(assign({}, props, {
            selectDate: this.select,
            owner: this,
        }), this);
    };
    renderNavBar = (props) => {
        const theme = props.theme;
        const childNavBar = React.Children.toArray(props.children).filter((c) => c && c.props && c.props.isDatePickerNavBar)[0];
        const ref = (navBar) => {
            this.navBar = navBar;
        };
        const { okButtonText, cancelButtonText, locale } = props;
        const defaultProps = assignDefined({}, {
            okButtonText,
            cancelButtonText,
            locale,
        });
        if (!childNavBar) {
            if (props.navigation || props.renderNavBar) {
                return this.renderNavBarComponent(assignDefined({
                    ...defaultProps,
                    minDate: props.minDate,
                    maxDate: props.maxDate,
                    theme,
                    secondary: true,
                    date: props.moment,
                    viewMoment: props.viewMoment,
                    onViewDateChange: this.onNavViewDateChange,
                    onMouseDown: this.onNavMouseDown,
                    arrows: props.navBarArrows,
                    ref,
                    enableMonthDecadeViewAnimation: props.enableMonthDecadeViewAnimation,
                    showMonthDecadeViewAnimation: props.showMonthDecadeViewAnimation,
                }, {
                    enableMonthDecadeView: props.enableMonthDecadeView,
                }));
            }
            return null;
        }
        const navBarProps = assign({}, childNavBar.props, assignDefined({
            ...defaultProps,
            viewMoment: props.viewMoment,
            date: props.moment,
            theme,
            ref,
            minDate: props.minDate,
            maxDate: props.maxDate,
        }, {
            enableMonthDecadeView: props.enableMonthDecadeView,
        }));
        const prevOnViewDateChange = navBarProps.onViewDateChange;
        let onViewDateChange = this.onViewDateChange;
        if (prevOnViewDateChange) {
            onViewDateChange = (...args) => {
                prevOnViewDateChange(...args);
                this.onNavViewDateChange(...args);
            };
        }
        navBarProps.onViewDateChange = onViewDateChange;
        const prevOnMouseDown = navBarProps.onMouseDown;
        let onMouseDown = this.onNavMouseDown;
        if (prevOnMouseDown) {
            onMouseDown = (...args) => {
                prevOnMouseDown(...args);
                this.onNavMouseDown(...args);
            };
        }
        navBarProps.onMouseDown = onMouseDown;
        if (navBarProps) {
            return this.renderNavBarComponent(navBarProps);
        }
        return null;
    };
    onNavMouseDown = (_event) => {
        if (this.props.focusOnNavMouseDown && !this.isFocused()) {
            this.focus();
        }
    };
    renderNavBarComponent = (navBarProps) => {
        if (this.props.renderNavBar) {
            return this.props.renderNavBar(navBarProps);
        }
        return (React.createElement(NavBar, { key: "month_navBar", showClock: this.props.showClock, ...navBarProps }));
    };
    isFocused = () => {
        return this.state.focused;
    };
    onFocus = (event) => {
        this.setState({
            focused: true,
        });
        this.props.onFocus(event);
    };
    onBlur = (event) => {
        this.setState({
            focused: false,
        });
        this.hideMonthDecadeView();
        this.props.onBlur(event);
    };
    showMonthDecadeView = () => {
        if (this.navBar) {
            this.navBar.showMonthDecadeView();
        }
    };
    hideMonthDecadeView = () => {
        if (this.navBar) {
            this.navBar.hideMonthDecadeView();
        }
    };
    isMonthDecadeViewVisible = () => {
        if (this.navBar) {
            return this.navBar.isMonthDecadeViewVisible();
        }
        return false;
    };
    tryNavBarKeyDown = (event) => {
        if (this.navBar && this.navBar.getMonthDecadeView) {
            const monthDecadeViewView = this.navBar.getMonthDecadeView();
            if (monthDecadeViewView && monthDecadeViewView.onKeyDown) {
                monthDecadeViewView.onKeyDown(event);
                return true;
            }
        }
        return false;
    };
    onViewKeyDown = (event) => {
        if (this.tryNavBarKeyDown(event)) {
            return;
        }
        return ON_KEY_DOWN.call(this, event);
    };
    confirm = (date, event) => {
        event.preventDefault();
        if (this.props.confirm) {
            return this.props.confirm(date, event);
        }
        const dateMoment = this.toMoment(date);
        this.select({ dateMoment, timestamp: +dateMoment }, event);
        return undefined;
    };
    navigate = (dir, event) => {
        const props = this.p;
        const getNavigationDate = (dir, date, dateFormat) => {
            const mom = moment.isMoment(date)
                ? date
                : this.toMoment(date, dateFormat);
            return typeof dir == 'function' ? dir(mom) : mom.add(dir, 'day');
        };
        if (props.navigate) {
            return props.navigate(dir, event, getNavigationDate);
        }
        event.preventDefault();
        if (props.activeDate) {
            const nextMoment = getNavigationDate(dir, props.activeDate);
            this.gotoViewDate({ dateMoment: nextMoment });
        }
        return undefined;
    };
    handleDayMouseEnter = (dayProps) => {
        const props = this.p;
        const { rangeStart, range } = props;
        const partial = !!(rangeStart && range.length < 2);
        if (partial) {
            this.setHoverRange(clampRange([rangeStart, dayProps.dateMoment]));
        }
    };
    handleClick = ({ timestamp, dateMoment }, event) => {
        const props = this.p;
        if (props.minDate && timestamp < props.minDate) {
            return;
        }
        if (props.maxDate && timestamp > props.maxDate) {
            return;
        }
        event.target.value = timestamp;
        this.select({ dateMoment, timestamp }, event);
    };
    select = ({ dateMoment, timestamp, }, event) => {
        if (dateMoment && timestamp === undefined) {
            timestamp = +dateMoment;
        }
        if (this.props.select) {
            return this.props.select({ dateMoment, timestamp }, event);
        }
        if (!timestamp) {
            timestamp = +dateMoment;
        }
        this.gotoViewDate({ dateMoment, timestamp });
        const props = this.p;
        const range = props.range;
        if (range) {
            this.selectRange({ dateMoment, timestamp }, event);
        }
        else {
            this.onChange({ dateMoment, timestamp }, event);
        }
        return undefined;
    };
    selectRange = ({ dateMoment }, event) => {
        const props = this.p;
        const range = props.range;
        const rangeStart = props.rangeStart;
        if (dateMoment == null) {
            this.setState({
                rangeStart: null,
            });
            this.onRangeChange([], event);
            return;
        }
        if (!rangeStart) {
            this.setState({
                rangeStart: dateMoment,
            });
            if (range.length == 2) {
                this.onRangeChange([], event);
            }
        }
        else {
            this.setState({
                rangeStart: null,
            });
            this.onRangeChange(clampRange([rangeStart, dateMoment]), event);
        }
    };
    format = (mom) => {
        return mom == null ? '' : mom.format(this.props.dateFormat);
    };
    setHoverRange = (hoverRange) => {
        if (this.props.hoverRange === undefined) {
            this.setState({
                hoverRange,
            });
        }
        if (this.props.onHoverRangeChange) {
            this.props.onHoverRangeChange(hoverRange);
        }
    };
    onRangeChange = (range, event) => {
        this.setState({
            range: this.props.range === undefined ? range : null,
        });
        this.setHoverRange(null);
        if (this.props.onRangeChange) {
            const newRange = range.map(m => {
                const dateMoment = this.toMoment(m);
                return {
                    dateString: dateMoment.format(this.props.dateFormat),
                    dateMoment,
                    timestamp: +dateMoment,
                };
            });
            const formatted = newRange.map(o => o.dateString);
            this.props.onRangeChange(formatted, newRange, event);
        }
    };
    onChange = ({ dateMoment, timestamp, noCollapse, }, event) => {
        if (this.props.date === undefined) {
            this.setState({
                date: timestamp,
            });
        }
        if (this.props.onChange) {
            const dateString = this.format(dateMoment);
            this.props.onChange(dateString, { dateMoment, timestamp, dateString, noCollapse }, event);
        }
    };
    onNavViewDateChange = (_dateString, { dateMoment, timestamp } = {}) => {
        this.onViewDateChange({ dateMoment, timestamp });
    };
    onViewDateChange = ({ dateMoment, timestamp, }) => {
        let minDate;
        let maxDate;
        if (this.p.minDateMoment) {
            minDate = +this.toMoment(this.p.minDateMoment).startOf('month');
        }
        if (this.p.maxDateMoment) {
            maxDate = +this.toMoment(this.p.maxDateMoment).endOf('month');
        }
        if (this.props.constrainViewDate &&
            !isDateInMinMax(timestamp, {
                minDate,
                maxDate,
            })) {
            return;
        }
        if (this.props.viewDate === undefined && this.props.navOnDateClick) {
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
    isValidActiveDate = (date, props) => {
        return isValidActiveDate(date, props || this.p);
    };
    onActiveDateChange = ({ dateMoment, timestamp, }) => {
        if (!isValidActiveDate(timestamp, this.p)) {
            return;
        }
        const props = this.p;
        const range = props.range;
        if (range && props.rangeStart) {
            const newRange = clampRange([props.rangeStart, dateMoment]);
            if (props.partialRange) {
                this.onRangeChange(newRange);
            }
            this.setState({
                rangeStart: props.rangeStart,
                range: newRange,
            });
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
    gotoViewDate = ({ dateMoment, timestamp, }) => {
        if (!timestamp) {
            timestamp = dateMoment == null ? null : +dateMoment;
        }
        this.onViewDateChange({ dateMoment, timestamp });
        this.onActiveDateChange({ dateMoment, timestamp });
    };
}
export { NAV_KEYS, renderFooter };
export default MonthView;
