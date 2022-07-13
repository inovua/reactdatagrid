/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, createRef, ReactNode, RefObject } from 'react';
import PropTypes from 'prop-types';

import { Flex } from '../../../Flex';
import DateFormatInput from '../DateFormatInput';

import assign from '../../../../common/assign';
import joinFunctions from '../joinFunctions';
import assignDefined from '../assignDefined';
import join from '../../../../common/join';
import { getGlobal } from '../../../../getGlobal';
import {
  TypeDateFormatSpinnerInputProps,
  TypeDateFormatSpinnerInputState,
} from './types';

const globalObject = getGlobal();

const defaultProps = {
  rootClassName: 'inovua-react-toolkit-calendar__date-format-spinner',
  firstStepDelay: 150,
  secondStepDelay: 100,
  stepDelay: 50,
  changeDelay: undefined,
  theme: 'default',
  disabled: false,
  arrowSize: 10,
  isDateInput: true,
  stopPropagation: true,
  updateOnWheel: true,
};

const propTypes = {
  rootClassName: PropTypes.string,
  firstStepDelay: PropTypes.number,
  secondStepDelay: PropTypes.number,
  stepDelay: PropTypes.number,
  changeDelay: PropTypes.number,
  theme: PropTypes.string,
  disabled: PropTypes.bool,
  arrowSize: PropTypes.number,
  isDateInput: PropTypes.bool,
  stopPropagation: PropTypes.bool,
  updateOnWheel: PropTypes.bool,
};

class DateFormatSpinnerInput extends Component<
  TypeDateFormatSpinnerInputProps,
  TypeDateFormatSpinnerInputState
> {
  static defaultProps = defaultProps;
  static propTypes = propTypes;

  private input: RefObject<any>;
  private started?: boolean;
  private inputChild: any;
  private startTime?: number;
  inputProps: any;
  arrows?: { 1: ReactNode; '-1': ReactNode };
  timeoutId?: any;

  constructor(props: TypeDateFormatSpinnerInputProps) {
    super(props);
    this.state = { focused: false };

    this.input = createRef();
  }

  componentWillUnmount = () => {
    this.started = false;
  };

  render = () => {
    const props = this.props;
    const { rootClassName } = props;
    const children = React.Children.toArray(props.children);

    const input: any = (this.inputChild = children.filter(
      (c: any) => c && c.type == 'input'
    )[0]);
    const inputProps = input ? assign({}, input.props) : {};

    const onKeyDown = joinFunctions(props.onKeyDown, inputProps.onKeyDown);
    const onChange = joinFunctions(props.onChange, inputProps.onChange);
    const disabled = props.disabled || inputProps.disabled;

    assignDefined(inputProps, {
      size: props.size || inputProps.size,
      minDate: props.minDate || inputProps.minDate,
      maxDate: props.maxDate || inputProps.maxDate,

      changeDelay:
        props.changeDelay === undefined
          ? inputProps.changeDelay
          : props.changeDelay,

      tabIndex: props.tabIndex,

      onKeyDown,
      onChange,
      disabled,

      dateFormat:
        props.dateFormat === undefined
          ? inputProps.dateFormat
          : props.dateFormat,
      stopPropagation: props.stopPropagation,
      updateOnWheel: props.updateOnWheel,

      onBlur: this.onBlur,
      onFocus: this.onFocus,
    });

    this.inputProps = inputProps;

    const arrowSize = this.props.arrowSize;

    this.arrows = {
      1: (
        <svg height={arrowSize! / 2} width={arrowSize} viewBox="0 0 10 5">
          <path
            fillRule="evenodd"
            d="M5.262.262l4.106 4.106c.144.144.144.379 0 .524-.07.069-.164.108-.262.108H.894c-.204 0-.37-.166-.37-.37 0-.099.039-.193.108-.262L4.738.262c.145-.145.38-.145.524 0z"
          />
        </svg>
      ),

      '-1': (
        <svg height={arrowSize! / 2} width={arrowSize} viewBox="0 0 10 5">
          <path
            fillRule="evenodd"
            d="M4.738 4.738L.632.632C.488.488.488.253.632.108.702.04.796 0 .894 0h8.212c.204 0 .37.166.37.37 0 .099-.039.193-.108.262L5.262 4.738c-.145.145-.38.145-.524 0z"
          />
        </svg>
      ),
    };

    const className: string = join(
      props.className,
      rootClassName,
      this.state.focused
        ? `${rootClassName}-spinner--focused`
        : `${rootClassName}-spinner`,
      disabled && `${rootClassName}--disabled`,
      this.isFocused() && `${rootClassName}--focused`,
      `${rootClassName}--theme-${props.theme}`
    );

    return (
      <Flex inline row className={className} disabled={props.disabled}>
        <DateFormatInput
          ref={this.input}
          theme={props.theme}
          value={props.value}
          {...inputProps}
        />
        {this.renderArrows()}
      </Flex>
    );
  };

  renderArrows = (): ReactNode => {
    if (this.props.renderArrows) {
      return this.props.renderArrows(this.props);
    }

    return (
      <div className={`${this.props.rootClassName}-spinner-arrow-wrapper`}>
        {this.renderArrow(1)}
        {this.renderArrow(-1)}
      </div>
    );
  };

  renderArrow = (dir: -1 | 1): ReactNode => {
    const { rootClassName } = this.props;
    const direction = dir === 1 ? 'up' : 'down';
    const className = join(
      `${rootClassName}-spinner-arrow`,
      `${rootClassName}-spinner-arrow--${direction}`
    );

    return (
      <div
        className={className}
        onMouseDown={this.onMouseDown.bind(this, dir)}
        onMouseUp={this.stop}
        onMouseLeave={this.stop}
      >
        {this.arrows![dir]}
      </div>
    );
  };

  onMouseDown = (dir: -1 | 1, event?: any): void => {
    if (this.props.disabled) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    if (this.isFocused()) {
      this.start(dir);
    } else {
      this.focus();

      setTimeout(() => {
        this.increment(dir);
      }, 1);
    }
  };

  start = (dir: -1 | 1): void => {
    this.started = true;
    this.startTime = Date.now();

    this.step(dir);

    this.timeoutId = setTimeout(() => {
      this.step(dir);

      this.timeoutId = setTimeout(() => {
        const lazyStep = () => {
          const delay =
            this.props.stepDelay! - (Date.now() - this.startTime!) / 500;
          this.step(dir, lazyStep, delay);
        };

        lazyStep();
      }, this.props.secondStepDelay);
    }, this.props.firstStepDelay);
  };

  isStarted = (): boolean => {
    return !!(this.started && this.input);
  };

  increment = (dir: -1 | 1): void => {
    if (this.input && this.input.current) {
      this.input.current.onDirection(dir);
    }
  };

  step = (dir: -1 | 1, callback?: () => void, delay?: number): void => {
    if (this.isStarted()) {
      this.increment(dir);

      if (typeof callback == 'function') {
        this.timeoutId = setTimeout(
          () => {
            if (this.isStarted()) {
              callback();
            }
          },
          delay === undefined ? this.props.stepDelay : delay
        );
      }
    }
  };

  stop = (): void => {
    this.started = false;
    if (this.timeoutId) {
      globalObject.clearTimeout(this.timeoutId);
    }
  };

  focus = (): void => {
    if (this.input && this.input.current) {
      this.input.current.focus();
    }
  };

  isFocused = (): boolean => {
    return this.state.focused!;
  };

  onBlur = (event: FocusEvent): void => {
    const { props } = this;
    const onBlur = joinFunctions(
      props.onBlur,
      this.inputChild && this.inputChild.props && this.inputChild.props.onBlur
    );

    if (onBlur) {
      onBlur(event);
    }

    this.setState({
      focused: false,
    });
  };

  onFocus = (event: FocusEvent): void => {
    const { props } = this;
    const onFocus = joinFunctions(
      props.onFocus,
      this.inputChild && this.inputChild.props && this.inputChild.props.onFocus
    );

    if (onFocus) {
      onFocus(event);
    }

    this.setState({
      focused: true,
    });
  };
}

export { TypeDateFormatSpinnerInputProps };
export default DateFormatSpinnerInput;
