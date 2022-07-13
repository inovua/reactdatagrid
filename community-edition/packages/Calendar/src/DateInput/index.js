/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Flex } from '../../../Flex';
import assign from '../../../../common/assign';
import Input from '../../../Field';
import DateFormatInput from '../DateFormatInput';
import InlineBlock from '../InlineBlock';
import Overlay from '../../../Overlay';
import { CLEAR_ICON, CALENDAR_ICON } from './icons';
import join from '../../../../common/join';
import toMoment from '../toMoment';
import Calendar, { NAV_KEYS } from '../Calendar';
import joinFunctions from '../joinFunctions';
import assignDefined from '../assignDefined';
import forwardTime from '../utils/forwardTime';
const defaultProps = {
    rootClassName: 'inovua-react-toolkit-date-input',
    showClock: undefined,
    relativeToViewport: true,
    enableMonthDecadeViewAnimation: true,
    showMonthDecadeViewAnimation: 300,
    overlayProps: undefined,
    forceValidDate: false,
    strict: false,
    expandOnFocus: true,
    updateOnDateClick: true,
    collapseOnDateClick: true,
    theme: 'default-light',
    footer: true,
    okButton: false,
    onBlur: () => { },
    onFocus: () => { },
    clearIcon: true,
    validateOnBlur: true,
    onExpandChange: () => { },
    onCollapse: () => { },
    onExpand: () => { },
    minDate: moment('1000-01-01', 'YYYY-MM-DD'),
    maxDate: moment('9999-12-31 HH:mm:ss', 'YYYY-MM-DD 23:59:59'),
    skipTodayTime: false,
};
const DateType = PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.string,
]);
const propTypes = {
    autoFocus: PropTypes.bool,
    rootClassName: PropTypes.string,
    dateFormat: PropTypes.string.isRequired,
    displayFormat: PropTypes.string,
    relativeToViewport: PropTypes.bool,
    showClock: PropTypes.bool,
    strict: PropTypes.bool,
    expandOnFocus: PropTypes.bool,
    updateOnDateClick: PropTypes.bool,
    collapseOnDateClick: PropTypes.bool,
    enableMonthDecadeViewAnimation: PropTypes.bool,
    showMonthDecadeViewAnimation: PropTypes.number,
    theme: PropTypes.string,
    footer: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    clearIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
    validateOnBlur: PropTypes.bool,
    onExpandChange: PropTypes.func,
    onCollapse: PropTypes.func,
    onExpand: PropTypes.func,
    skipTodayTime: PropTypes.bool,
    date: DateType,
    value: DateType,
    defaultDate: DateType,
    viewDate: DateType,
    minDate: DateType,
    maxDate: DateType,
    activeDate: DateType,
    text: PropTypes.string,
    pickerProps: PropTypes.object,
    overlayProps: PropTypes.object,
    constrainTo: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.object,
        PropTypes.bool,
    ]),
    cleanup: PropTypes.func,
    expanded: PropTypes.bool,
    triggerChangeOnTimeChange: PropTypes.bool,
    defaultExpanded: PropTypes.bool,
    forceValidDate: PropTypes.bool,
    valid: PropTypes.bool,
    updateOnWheel: PropTypes.bool,
    clearDate: DateType,
    navBarArrows: PropTypes.bool,
    locale: PropTypes.string,
    focusedClassName: PropTypes.string,
    expandedClassName: PropTypes.string,
    invalidClassName: PropTypes.string,
    placeholder: PropTypes.string,
    onTextChange: PropTypes.func,
    renderPicker: PropTypes.func,
    onMouseDown: PropTypes.func,
    onViewDateChange: PropTypes.func,
    onActiveDateChange: PropTypes.func,
    defaultViewDate: PropTypes.any,
    onChange: PropTypes.func,
    renderInput: PropTypes.func,
    onLazyBlur: PropTypes.func,
    onKeyDown: PropTypes.func,
    position: PropTypes.oneOf(['top', 'bottom']),
    weekNumbers: PropTypes.bool,
    highlightWeekends: PropTypes.bool,
    calendarProps: PropTypes.object,
    cancelButtonText: PropTypes.string,
    clearButtonText: PropTypes.string,
    okButtonText: PropTypes.string,
    todayButtonText: PropTypes.string,
};
const POSITIONS = { top: 'top', bottom: 'bottom' };
const defaultOverlayProps = {
    updatePositionOnScroll: true,
    rootClassName: 'inovua-react-toolkit-date-input__overlay',
    positions: ['tl-bl', 'bl-tl'],
    offset: 2,
    theme: null,
    visible: true,
};
const getPicker = (props, _instance) => {
    const { calendarProps } = props;
    return (React.Children.toArray(props.children).filter((c) => c && c.props && c.props.isDatePicker)[0] || React.createElement(Calendar, { ...calendarProps }));
};
const FIND_INPUT = (c) => c && (c.type === 'input' || (c.props && c.isDateInput));
const preventDefault = (event) => {
    event.preventDefault();
};
class DateInput extends Component {
    static defaultProps = defaultProps;
    static propTypes = propTypes;
    unmounted;
    p;
    lastValidDate;
    field;
    picker;
    pickerView;
    onTransitionStart;
    time;
    constructor(props) {
        super(props);
        this.state = {
            viewDate: props.viewDate || props.defaultViewDate,
            value: props.defaultValue === undefined ? '' : props.defaultValue,
            expanded: props.defaultExpanded || false,
            focused: false,
        };
    }
    componentWillUnmount = () => {
        this.unmounted = true;
    };
    render = () => {
        const props = this.prepareProps(this.props);
        const flexProps = assign({}, props);
        delete flexProps.activeDate;
        delete flexProps.rootClassName;
        delete flexProps.cleanup;
        delete flexProps.clearIcon;
        delete flexProps.cancelButton;
        delete flexProps.collapseOnDateClick;
        delete flexProps.date;
        delete flexProps.dateFormat;
        delete flexProps.displayFormat;
        delete flexProps.expanded;
        delete flexProps.defaultExpanded;
        delete flexProps.expandOnFocus;
        delete flexProps.footer;
        delete flexProps.forceValidDate;
        delete flexProps.locale;
        delete flexProps.onExpand;
        delete flexProps.onExpandChange;
        delete flexProps.onCollapse;
        delete flexProps.minDate;
        delete flexProps.maxDate;
        delete flexProps.pickerProps;
        delete flexProps.position;
        delete flexProps.showClock;
        delete flexProps.skipTodayTime;
        delete flexProps.strict;
        delete flexProps.valid;
        delete flexProps.validateOnBlur;
        delete flexProps.viewDate;
        delete flexProps.value;
        delete flexProps.text;
        delete flexProps.theme;
        delete flexProps.updateOnDateClick;
        delete flexProps.defaultViewDate;
        delete flexProps.onViewDateChange;
        delete flexProps.onActiveDateChange;
        delete flexProps.renderInput;
        delete flexProps.renderClearIcon;
        delete flexProps.renderCalendarIcon;
        delete flexProps.renderPicker;
        delete flexProps.overlayProps;
        delete flexProps.relativeToViewport;
        delete flexProps.enableMonthDecadeViewAnimation;
        delete flexProps.showMonthDecadeViewAnimation;
        delete flexProps.updateOnWheel;
        delete flexProps.onTextChange;
        delete flexProps.focusedClassName;
        delete flexProps.expandedClassName;
        delete flexProps.invalidClassName;
        delete flexProps.onTimeChange;
        delete flexProps.okButton;
        delete flexProps.constrainTo;
        delete flexProps.defaultDate;
        delete flexProps.weekNumbers;
        delete flexProps.highlightWeekends;
        delete flexProps.calendarProps;
        delete flexProps.cancelButtonText;
        delete flexProps.clearButtonText;
        delete flexProps.okButtonText;
        delete flexProps.todayButtonText;
        delete flexProps.rtl;
        delete flexProps.pickerPosition;
        delete flexProps.onLazyBlur;
        if (typeof props.cleanup == 'function') {
            props.cleanup(flexProps);
        }
        return (React.createElement(Flex, { inline: true, row: true, wrap: false, ...flexProps, onClick: this.handleClick },
            this.renderInput(),
            this.renderClearIcon(),
            this.renderCalendarIcon(),
            this.renderPicker()));
    };
    handleClick = (event) => {
        if (this.props.onClick) {
            this.props.onClick(event);
        }
        if (!this.isLazyFocused()) {
            this.focus();
        }
    };
    renderInput = () => {
        const props = this.p;
        const inputProps = this.prepareInputProps(props);
        let input;
        if (props.renderInput) {
            input = props.renderInput(inputProps);
        }
        if (input === undefined) {
            input = props.children.filter(FIND_INPUT)[0];
            const FieldInput = props.forceValidDate ? DateFormatInput : Input;
            const propsForInput = assign({}, inputProps);
            if (!props.forceValidDate) {
                delete propsForInput.date;
                delete propsForInput.maxDate;
                delete propsForInput.minDate;
                delete propsForInput.dateFormat;
            }
            input = input ? (React.cloneElement(input, propsForInput)) : (React.createElement(FieldInput, { ...propsForInput }));
        }
        return input;
    };
    renderClearIcon = () => {
        const props = this.p;
        const { rootClassName, disabled, text } = props;
        if (!props.clearIcon || props.forceValidDate) {
            return undefined;
        }
        const clearIcon = props.clearIcon === true ? CLEAR_ICON : props.clearIcon;
        const clearIconProps = {
            className: join(`${rootClassName}__clear-icon`, text === '' || text == null
                ? `${rootClassName}__clear-icon--hidden`
                : `${rootClassName}__clear-icon--animation`, disabled && `${rootClassName}__clear-icon--disabled`),
            onMouseDown: preventDefault,
            onClick: this.onClearClick,
            children: clearIcon,
        };
        let result;
        if (props.renderClearIcon) {
            result = props.renderClearIcon(clearIconProps);
        }
        if (result === undefined) {
            result = React.createElement(InlineBlock, { ...clearIconProps });
        }
        return result;
    };
    onClearClick = () => {
        this.onFieldChange('');
        if (!this.isFocused()) {
            this.focus();
        }
    };
    renderCalendarIcon = () => {
        let result;
        const renderIcon = this.props.renderCalendarIcon;
        const { rootClassName, disabled } = this.props;
        const calendarIconProps = {
            className: join(`${rootClassName}__calendar-icon`, disabled ? `${rootClassName}__calendar-icon--disabled` : ''),
            onMouseDown: this.onCalendarIconMouseDown,
        };
        if (renderIcon) {
            result = renderIcon(calendarIconProps);
        }
        if (result === undefined) {
            result = React.createElement("div", { ...calendarIconProps }, CALENDAR_ICON);
        }
        return result;
    };
    onCalendarIconMouseDown = (event) => {
        if (this.props.disabled) {
            return;
        }
        event.preventDefault();
        this.toggleExpand();
    };
    prepareExpanded = (props) => {
        return props.expanded === undefined ? this.state.expanded : props.expanded;
    };
    prepareDate = (props, pickerProps) => {
        props = props || this.p;
        pickerProps = pickerProps || props.pickerProps;
        const locale = props.locale || pickerProps.locale;
        const dateFormat = props.dateFormat === undefined
            ? pickerProps.dateFormat
            : props.dateFormat;
        let value = props.value === undefined ? this.state.value : props.value;
        const date = this.toMoment(value);
        const valid = date.isValid();
        if (value && typeof value != 'string' && valid) {
            value = this.format(date);
        }
        if (date && valid) {
            this.lastValidDate = date;
        }
        else {
            value = this.state.value;
        }
        const viewDate = this.props.viewDate ||
            this.state.viewDate ||
            this.lastValidDate ||
            new Date();
        const activeDate = this.state.activeDate || this.lastValidDate || new Date();
        return {
            viewDate,
            activeDate,
            dateFormat,
            locale,
            valid,
            date,
            value,
        };
    };
    preparePickerProps = (props) => {
        const picker = getPicker(props, this);
        if (!picker) {
            return null;
        }
        return picker.props || {};
    };
    prepareProps = (thisProps) => {
        const props = (this.p = assign({}, thisProps));
        props.children = React.Children.toArray(props.children);
        props.expanded = this.prepareExpanded(props);
        props.pickerProps = this.preparePickerProps(props);
        const input = props.children.filter(FIND_INPUT)[0];
        if (input && input.type === 'input') {
            props.rawInput = true;
            props.forceValidDate = false;
        }
        const dateInfo = this.prepareDate(props, props.pickerProps);
        assign(props, dateInfo);
        if (props.text === undefined) {
            props.text = this.state.text;
            if (!props.text) {
                props.text =
                    props.valid && props.date
                        ? props.value
                        : this.props.value != null
                            ? this.props.value
                            : this.state.text || '';
            }
        }
        if (props.text === undefined) {
            props.text = '';
        }
        props.className = this.prepareClassName(props);
        if (props.calendarProps) {
            props.cancelButtonText = props.calendarProps.cancelButtonText;
            props.clearButtonText = props.calendarProps.clearButtonText;
            props.okButtonText = props.calendarProps.okButtonText;
            props.todayButtonText = props.calendarProps.todayButtonText;
        }
        return props;
    };
    prepareClassName = (props) => {
        const { rootClassName } = props;
        const position = POSITIONS[props.pickerProps.position ||
            props.pickerPosition] || 'bottom';
        return join([
            rootClassName,
            props.className,
            props.disabled && `${rootClassName}--disabled`,
            props.theme && `${rootClassName}--theme-${props.theme}`,
            props.rtl ? `${rootClassName}--rtl` : `${rootClassName}--ltr`,
            `${rootClassName}--picker-position-${position}`,
            this.isLazyFocused() &&
                join(`${rootClassName}--focused`, props.focusedClassName),
            this.isExpanded() &&
                join(`${rootClassName}--expanded`, props.expandedClassName),
            !props.valid && join(props.invalidClassName, `${rootClassName}--invalid`),
        ]);
    };
    prepareInputProps = (props) => {
        const input = props.children.filter(FIND_INPUT)[0];
        const inputProps = (input && input.props) || {};
        const { rootClassName } = this.props;
        const onBlur = joinFunctions(inputProps.onBlur, this.onFieldBlur);
        const onFocus = joinFunctions(inputProps.onFocus, this.onFieldFocus);
        const onChange = joinFunctions(inputProps.onChange, this.onFieldChange);
        const onKeyDown = joinFunctions(inputProps.onKeyDown, this.onFieldKeyDown);
        const newInputProps = assign({}, inputProps, {
            ref: (f) => {
                this.field = f;
            },
            date: props.date,
            onFocus,
            onBlur,
            onChange,
            dateFormat: props.dateFormat,
            value: props.text || '',
            onKeyDown,
            placeholder: props.placeholder,
            className: join(`${rootClassName}__input`, inputProps.className),
        });
        assignDefined(newInputProps, {
            placeholder: props.placeholder,
            autoFocus: props.autoFocus,
            disabled: props.disabled,
            minDate: props.minDate,
            maxDate: props.maxDate,
        });
        return newInputProps;
    };
    renderPicker = () => {
        const props = this.p;
        const { renderPicker } = this.props;
        if (this.isExpanded()) {
            const newExpand = !this.picker;
            const picker = getPicker(props, this);
            const pickerProps = props.pickerProps;
            const onMouseDown = joinFunctions(pickerProps.onMouseDown, this.onPickerMouseDown);
            const onChange = joinFunctions(pickerProps.onChange, this.onPickerChange);
            const date = props.valid && props.date;
            const footer = pickerProps.footer !== undefined ? pickerProps.footer : props.footer;
            const viewDate = props.viewDate || this.state.viewDate || props.defaultViewDate;
            const activeDate = newExpand && date ? date : props.activeDate;
            const pickerElement = React.cloneElement(picker, assignDefined({
                ref: (p) => {
                    this.picker = this.pickerView = p;
                    if (p) {
                        const pickerView = p.getView ? p.getView() : p.view;
                        if (pickerView) {
                            this.pickerView = pickerView;
                        }
                    }
                    if (!this.state.viewDate) {
                        this.setViewDate(props.viewDate);
                    }
                },
                footer,
                okButton: props.okButton,
                okButtonText: props.okButtonText,
                cancelButton: props.cancelButton,
                weekNumbers: props.weekNumbers,
                highlightWeekends: props.highlightWeekends,
                enableMonthDecadeViewAnimation: props.enableMonthDecadeViewAnimation,
                showMonthDecadeViewAnimation: props.showMonthDecadeViewAnimation,
                focusOnNavMouseDown: false,
                focusOnFooterMouseDown: false,
                insideField: true,
                showClock: props.showClock,
                getTransitionTime: this.getTime,
                updateOnWheel: props.updateOnWheel,
                onClockInputBlur: this.onClockInputBlur,
                onClockEnterKey: this.onClockEnterKey,
                onClockEscapeKey: this.onClockEscapeKey,
                footerClearDate: props.clearDate || props.minDate,
                onFooterCancelClick: this.onFooterCancelClick,
                onFooterTodayClick: this.onFooterTodayClick,
                onFooterOkClick: this.onFooterOkClick,
                onFooterClearClick: this.onFooterClearClick,
                dateFormat: props.dateFormat,
                theme: props.theme || pickerProps.theme,
                arrows: props.navBarArrows,
                className: join(pickerProps.className, `${this.props.rootClassName}__picker`),
                date: date || null,
                tabIndex: -1,
                viewDate,
                activeDate,
                locale: props.locale,
                triggerChangeOnTimeChange: this.props.triggerChangeOnTimeChange === undefined
                    ? false
                    : this.props.triggerChangeOnTimeChange,
                onViewDateChange: joinFunctions(pickerProps.onViewDateChange, this.onViewDateChange),
                onActiveDateChange: joinFunctions(pickerProps.onActiveDateChange, this.onActiveDateChange),
                onTimeChange: this.onTimeChange,
                onTransitionStart: this.onTransitionStart,
                onMouseDown,
                onChange,
            }, {
                minDate: props.minDate,
                maxDate: props.maxDate,
            }));
            let result = pickerElement;
            if (props.relativeToViewport) {
                result = (React.createElement(Overlay, { ...defaultOverlayProps, ...props.overlayProps, constrainTo: props.constrainTo }, pickerElement));
            }
            if (renderPicker) {
                const renderPickerResult = renderPicker(result, pickerElement);
                if (renderPickerResult !== undefined) {
                    return renderPickerResult;
                }
            }
            return result;
        }
        this.time = null;
        if (renderPicker) {
            return renderPicker(null);
        }
        return null;
    };
    getValue = () => {
        return this.state.value || this.props.value;
    };
    onTimeChange = (value, timeFormat) => {
        const timeMoment = this.toMoment(value, { dateFormat: timeFormat });
        const time = ['hour', 'minute', 'second', 'millisecond'].reduce((acc, part) => {
            acc[part] = timeMoment.get(part);
            return acc;
        }, {});
        this.time = time;
    };
    getTime = () => {
        return this.time;
    };
    setValue = (value, config = {}) => {
        const dateMoment = this.toMoment(value);
        const dateString = this.format(dateMoment);
        this.setDate(dateString, assign(config, { dateMoment }));
    };
    onFooterOkClick = () => {
        const activeDate = this.p.activeDate;
        if (activeDate) {
            const date = this.toMoment(activeDate);
            forwardTime(this.time, date);
            this.setValue(date, { skipTime: !!this.time });
        }
        this.setExpanded(false);
    };
    onFooterCancelClick = () => {
        this.setExpanded(false);
    };
    onFooterTodayClick = () => {
        const today = this.toMoment(new Date()).startOf('day');
        this.onPickerChange(this.format(today), { dateMoment: today });
        if (this.pickerView && this.pickerView.gotoViewDate) {
            this.pickerView.gotoViewDate({ dateMoment: today });
        }
        return false;
    };
    onFooterClearClick = () => {
        const clearDate = this.props.clearDate === undefined
            ? this.props.minDate
            : this.props.clearDate;
        if (clearDate !== undefined) {
            this.setValue(clearDate, {
                skipTime: true,
            });
        }
        this.setExpanded(false);
        return false;
    };
    toMoment = (value, props) => {
        if (moment.isMoment(value)) {
            return value;
        }
        props = props || this.p;
        let dateFormat = props.displayFormat;
        if (dateFormat === undefined) {
            dateFormat = props.dateFormat;
        }
        if (dateFormat === undefined) {
            dateFormat = this.p.dateFormat;
        }
        let date = toMoment(value, {
            strict: props.strict,
            locale: props.locale,
            dateFormat,
        });
        if (!date.isValid() && props.displayFormat) {
            date = toMoment(value, {
                strict: props.strict,
                locale: props.locale,
                dateFormat: props.dateFormat === undefined
                    ? this.p.dateFormat
                    : props.dateFormat,
            });
        }
        return date;
    };
    isValid = (text) => {
        if (text === undefined) {
            text = this.p.text;
        }
        return this.toMoment(text).isValid();
    };
    onViewDateChange = (viewDate) => {
        this.setState({
            viewDate,
        });
        if (this.props.onViewDateChange) {
            this.props.onViewDateChange();
        }
    };
    setViewDate = (viewDate) => {
        if (this.pickerView) {
            this.pickerView.gotoViewDate({ dateMoment: this.toMoment(viewDate) });
        }
    };
    onActiveDateChange = (activeDate) => {
        this.setState({
            activeDate,
        });
        if (this.props.onActiveDateChange) {
            this.props.onActiveDateChange();
        }
    };
    onViewKeyDown = (event) => {
        if (this.pickerView) {
            this.onPickerViewKeyDown(event);
        }
    };
    onPickerViewKeyDown = (event) => {
        this.pickerView.onViewKeyDown(event);
    };
    onPickerMouseDown = (event) => {
        preventDefault(event);
        if (!this.isFocused()) {
            this.focus();
        }
    };
    isMonthDecadeViewVisible = () => {
        if (this.picker && this.picker.isMonthDecadeViewVisible) {
            return this.picker.isMonthDecadeViewVisible();
        }
        return false;
    };
    onFieldKeyDown = (event) => {
        const key = event.key;
        const expanded = this.isExpanded();
        const monthDecadeVisible = this.isMonthDecadeViewVisible();
        if (key == 'Enter' && !monthDecadeVisible) {
            this.onViewKeyDown(event);
            this.toggleExpand();
            return false;
        }
        if (monthDecadeVisible && (key == 'Escape' || key == 'Enter')) {
            this.onViewKeyDown(event);
            return false;
        }
        if (key == 'Escape') {
            if (expanded) {
                this.setExpanded(false);
                return false;
            }
        }
        if (expanded) {
            if (key in NAV_KEYS) {
                this.onViewKeyDown(event);
                return false;
            }
        }
        return true;
    };
    getInput = () => {
        return this.field;
    };
    isFocused = () => {
        return this.state.focused;
    };
    isLazyFocused = () => {
        return this.isFocused() || this.isTimeInputFocused();
    };
    isTimeInputFocused = () => {
        if (this.picker && this.picker.isTimeInputFocused) {
            return this.picker.isTimeInputFocused();
        }
        return false;
    };
    onFieldFocus = (event) => {
        if (this.state.focused) {
            return;
        }
        this.setState({
            focused: true,
        });
        if (this.props.expandOnFocus) {
            this.setExpanded(true);
        }
        this.props.onFocus(event);
    };
    onFieldBlur = (event) => {
        if (!this.isFocused()) {
            return;
        }
        this.setState({
            focused: false,
        });
        this.props.onBlur(event);
        if (!this.picker || !this.picker.isTimeInputFocused) {
            this.onLazyBlur();
            return;
        }
        setTimeout(() => this.onLazyBlur(), 0);
    };
    onClockEnterKey = () => {
        if (!this.isFocused()) {
            this.focus();
        }
        this.onFooterOkClick();
    };
    onClockEscapeKey = () => {
        if (!this.isFocused()) {
            this.focus();
        }
        this.onFooterCancelClick();
    };
    onClockInputBlur = () => {
        setTimeout(() => {
            if (!this.isFocused()) {
                this.onLazyBlur();
            }
        }, 0);
    };
    onLazyBlur = () => {
        if (this.unmounted) {
            return;
        }
        if (this.isTimeInputFocused()) {
            return;
        }
        this.setExpanded(false);
        if (this.props.onLazyBlur) {
            this.props.onLazyBlur();
        }
        if (!this.isValid() && this.props.validateOnBlur) {
            const value = this.lastValidDate && this.p.text != ''
                ? this.format(this.lastValidDate)
                : '';
            setTimeout(() => {
                this.onFieldChange(value);
            }, 0);
        }
    };
    onInputChange = () => { };
    isExpanded = () => {
        return this.p.expanded;
    };
    toggleExpand = () => {
        this.setExpanded(!this.p.expanded);
    };
    setExpanded = (bool) => {
        const props = this.p;
        if (bool === props.expanded) {
            return;
        }
        if (!bool) {
            this.onCollapse();
        }
        else {
            this.setState({}, () => {
                this.onExpand();
            });
        }
        if (bool && props.valid) {
            this.setState({
                activeDate: props.date,
            });
        }
        if (this.props.expanded === undefined) {
            this.setState({
                expanded: bool,
            });
        }
        this.props.onExpandChange(bool);
    };
    onCollapse = () => {
        this.props.onCollapse();
    };
    onExpand = () => {
        this.props.onExpand();
    };
    onFieldChange = (value) => {
        if (this.p.rawInput && typeof value != 'string') {
            const event = value;
            value = event.target.value;
        }
        const dateMoment = value == '' ? null : this.toMoment(value);
        if (dateMoment === null || dateMoment.isValid()) {
            this.onChange(dateMoment);
        }
        this.onTextChange(value);
    };
    onTextChange = (text) => {
        if (this.props.text === undefined) {
            this.setState({
                text,
            });
        }
        if (this.props.onTextChange) {
            this.props.onTextChange(text);
        }
    };
    onPickerChange = (dateString, { dateMoment, forceUpdate, noCollapse, }, event) => {
        const isEnter = event && event.key == 'Enter';
        const updateOnDateClick = forceUpdate
            ? true
            : this.props.updateOnDateClick || isEnter;
        let shouldCollapse = this.props.collapseOnDateClick || isEnter;
        if (noCollapse) {
            shouldCollapse = false;
        }
        if (updateOnDateClick) {
            forwardTime(this.time, dateMoment);
            this.setDate(dateString, {
                dateMoment,
                skipTime: true /* we already have time info, so keep this, and skip updating the time*/,
            });
            if (shouldCollapse) {
                this.setExpanded(false);
            }
        }
    };
    setDate = (_dateString, { dateMoment, skipTime = false, }) => {
        const props = this.p;
        const currentDate = props.date;
        if (props.valid && currentDate) {
            const dateFormat = props.dateFormat ? props.dateFormat.toLowerCase() : '';
            const hasTime = dateFormat.indexOf('k') != -1 || dateFormat.indexOf('h') != -1;
            if (hasTime && !skipTime) {
                ['hour', 'minute', 'second', 'millisecond'].forEach((part) => {
                    dateMoment.set(part, currentDate.get(part));
                });
            }
        }
        this.onTextChange(this.format(dateMoment));
        this.onChange(dateMoment);
    };
    onChange = (dateMoment) => {
        if (dateMoment != null && !moment.isMoment(dateMoment)) {
            dateMoment = this.toMoment(dateMoment);
        }
        forwardTime(this.time, dateMoment);
        const newState = {};
        if (this.props.value === undefined) {
            assign(newState, {
                text: null,
                value: dateMoment,
            });
        }
        newState.activeDate = dateMoment;
        if (dateMoment) {
            if (!this.pickerView ||
                !this.pickerView.isInView ||
                !this.pickerView.isInView(dateMoment)) {
                newState.viewDate = dateMoment;
            }
        }
        if (this.props.onChange) {
            this.props.onChange(this.format(dateMoment), { dateMoment });
        }
        this.setState(newState);
    };
    format = (mom, format) => {
        let theFormat = format;
        if (format === undefined) {
            theFormat = this.p.displayFormat;
        }
        if (format === undefined) {
            theFormat = this.p.dateFormat;
        }
        return mom == null ? '' : mom.format(theFormat);
    };
    focusField = () => {
        const input = this.field;
        if (input) {
            input.focus();
        }
    };
    focus = () => {
        this.focusField();
    };
}
export default DateInput;
