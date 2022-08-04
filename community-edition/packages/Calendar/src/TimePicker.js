/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Flex } from '../../Flex';
import assign from '../../../common/assign';
import join from '../../../common/join';
import TimeInput from './TimeInput';
import Clock from './Clock';
const defaultProps = {
    rootClassName: 'inovua-react-toolkit-calendar__time-picker',
    format: 'HH:mm:ss a',
    theme: 'default',
    isTimePicker: true,
};
const propTypes = {
    format: PropTypes.string,
    theme: PropTypes.string,
    isTimePicker: PropTypes.bool,
};
class TimePicker extends Component {
    static defaultProps = defaultProps;
    static propTypes = propTypes;
    p = {};
    constructor(props) {
        super(props);
        this.state = {};
    }
    render = () => {
        const props = (this.p = assign({}, this.props));
        const { rootClassName } = props;
        props.children = React.Children.toArray(props.children);
        const timeFormat = props.timeFormat.toLowerCase();
        props.hasTime =
            props.hasTime ||
                timeFormat.indexOf('k') != -1 ||
                timeFormat.indexOf('h') != -1;
        const className = join(props.className, rootClassName, props.theme && `${rootClassName}--theme-${props.theme}`);
        return (React.createElement(Flex, { inline: true, column: true, wrap: false, ...this.props, className: className },
            this.renderClock(),
            this.renderInput()));
    };
    renderInput = () => {
        return (React.createElement(TimeInput, { className: `${this.props.rootClassName}__time-picker-input`, format: this.props.timeFormat || this.props.format, defaultValue: this.props.value || this.props.defaultValue, onChange: this.onTimeChange }));
    };
    onTimeChange = (value) => {
        const time = value.split(':');
        let seconds = +time[0] * 3600 + parseInt(time[1], 10) * 60;
        if (time[2]) {
            seconds += parseInt(time[2], 10);
        }
        this.setState({ seconds });
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    };
    renderClock = () => {
        const props = this.p;
        const clock = props.children.filter((child) => child && child.props && child.props.isTimePickerClock)[0];
        const clockProps = {
            seconds: this.state.seconds,
            showSecondsHand: true,
        };
        if (clock) {
            return React.cloneElement(clock, clockProps);
        }
        return React.createElement(Clock, { ...clockProps });
    };
}
export default TimePicker;
