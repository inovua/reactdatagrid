/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, CSSProperties } from 'react';
import PropTypes from 'prop-types';
import { NotifyResize } from '../../NotifyResize';
import assign from '../../../common/assign';
import join from '../../../common/join';
import toMoment, { Moment } from './toMoment';

type TypeTime = Moment | number | boolean | undefined;

type TypeClockProps = {
  rootClassName?: string;
  centerSize?: number;
  centerOverlaySize?: number;

  seconds?: TypeTime;
  defaultSeconds?: TypeTime;
  time?: TypeTime;
  defaultTime?: TypeTime;

  size?: number | string;
  theme?: string;

  showSecondsHand?: boolean;
  showHoursHand?: boolean;
  showMinutesHand?: boolean;

  run?: boolean;
  updateInterval?: number;

  handWidth?: number;
  secondHandWidth?: number;
  handOffset?: number;
  bigTickOffset?: number;

  hourHandDiff?: number;
  minuteHandDiff?: number;
  secondHandDiff?: number;

  borderColor?: string;
  handHeight?: string | number;

  tickWidth?: number;
  bigTickWidth?: number;
  smallTickWidth?: number;
  tickOffset?: number;
  smallTickOffset?: number;
  smallTickHeight?: number;
  bigTickHeight?: number;
  tickHeight?: number;

  color?: string;
  borderWidth?: number;
  showSmallTicks?: boolean;
  isDatePickerClock?: boolean;

  renderTick?: ({
    tick,
    className,
    style,
  }: {
    tick: number;
    className: string;
    style: CSSProperties;
  }) => void;

  onSecondsChange?: (seconds: number) => void;
  onTimeChange?: (time: number) => void;
  cleanup?: (props: TypeClockProps) => void;
};

type TypeClockState = {
  size?: number;
  rendered?: boolean;
  seconds?: TypeTime;
  defaultSeconds?: TypeTime;
  time?: TypeTime;
  defaultTime?: TypeTime;
};

const MINUTES = Array(...new Array(60)).map((_, index) => index);

const toUpperFirst = (str: string) => {
  return str ? str.charAt(0).toUpperCase() + str.substr(1) : '';
};

const transformStyle = { transform: '' };

const rotateTickStyle = (
  tick: number,
  { width, height }: { width: number; height: number },
  _totalSize: number,
  offset: number
) => {
  const result = assign({}, transformStyle);
  const deg = tick * 6;

  const transform =
    `translate3d(${-width / 2}px, ${-height / 2}px, 0px) ` +
    `rotate(${deg}deg) translate3d(0px, -${offset}px, 0px)`;

  Object.keys(result).forEach(name => {
    result[name] = transform;
  });

  return result;
};

const defaultProps = {
  rootClassName: 'inovua-react-toolkit-calendar__clock',
  centerSize: null,
  centerOverlaySize: null,

  size: 120,
  updateInterval: 1000,
  theme: 'default',

  showSecondsHand: true,
  showHoursHand: true,
  showMinutesHand: true,

  handWidth: 2,
  secondHandWidth: 1,
  handOffset: 10,

  hourHandDiff: 35,
  minuteHandDiff: 25,
  secondHandDiff: 10,

  tickWidth: 1,
  bigTickWidth: 2,
  tickOffset: 2,

  smallTickHeight: 6,
  bigTickHeight: 10,

  color: '',
  borderWidth: 0,
  showSmallTicks: true,
  isDatePickerClock: true,
};

const propTypes = {
  rootClassName: PropTypes.string,
  centerSize: PropTypes.number,
  centerOverlaySize: PropTypes.number,
  defaultSeconds: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  seconds: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  defaultTime: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  time: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),

  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  theme: PropTypes.string,

  showSecondsHand: PropTypes.bool,
  showHoursHand: PropTypes.bool,
  showMinutesHand: PropTypes.bool,

  run: PropTypes.bool,
  updateInterval: PropTypes.number,

  handWidth: PropTypes.number,
  secondHandWidth: PropTypes.number,
  handOffset: PropTypes.number,
  bigTickOffset: PropTypes.number,

  hourHandDiff: PropTypes.number,
  minuteHandDiff: PropTypes.number,
  secondHandDiff: PropTypes.number,

  borderColor: PropTypes.string,
  handHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  tickWidth: PropTypes.number,
  bigTickWidth: PropTypes.number,
  smallTickWidth: PropTypes.number,
  tickOffset: PropTypes.number,
  smallTickOffset: PropTypes.number,
  smallTickHeight: PropTypes.number,
  bigTickHeight: PropTypes.number,
  tickHeight: PropTypes.number,

  color: PropTypes.string,
  borderWidth: PropTypes.number,
  showSmallTicks: PropTypes.bool,
  isDatePickerClock: PropTypes.bool,

  renderTick: PropTypes.func,

  onSecondsChange: PropTypes.func,
  onTimeChange: PropTypes.func,
  cleanup: PropTypes.func,
};

class Clock extends Component<TypeClockProps, TypeClockState> {
  static defaultProps = defaultProps;
  static propTypes = propTypes;

  private p: TypeClockProps = {};
  private ignoreRender?: boolean;
  private startTime?: number;
  private timeoutId?: any;

  constructor(props: TypeClockProps) {
    super(props);

    let time;
    let seconds;

    if (props.defaultSeconds) {
      seconds =
        props.defaultSeconds == true
          ? Date.now() / 1000
          : +props.defaultSeconds;
    }

    if (props.defaultTime) {
      time = props.defaultTime == true ? Date.now() : +props.defaultTime;
    }

    this.state = {
      seconds,
      defaultSeconds: seconds,
      time,
      defaultTime: time,
    };
  }

  shouldRun = (
    props: TypeClockProps
  ): number | string | boolean | undefined => {
    props = props || this.props;

    if (props.run === false) {
      return false;
    }

    return !!(props.defaultSeconds || props.defaultTime);
  };

  componentDidMount = () => {
    if (this.shouldRun(this.props)) {
      this.start();
    }

    if (this.props.size == 'auto') {
      this.setState({
        rendered: true,
      });
    }
  };

  componentDidUpdate = (prevProps: TypeClockProps) => {
    if (
      prevProps.run !== this.props.run ||
      prevProps.defaultSeconds !== this.props.defaultSeconds ||
      prevProps.defaultTime !== this.props.defaultTime
    ) {
      const prevRun = this.shouldRun(prevProps);
      const currentRun = this.shouldRun(this.props);

      if (!prevRun && currentRun) {
        this.start();
      } else if (prevRun && !currentRun) {
        this.stop();
      }
    }
  };

  start = (): void => {
    this.startTime = Date.now ? Date.now() : +new Date();

    this.run();
  };

  stop = (): void => {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  };

  run = (): void => {
    this.timeoutId = setTimeout(() => {
      this.update();
      this.run();
    }, this.props.updateInterval);
  };

  update = (): void => {
    const now = Date.now ? Date.now() : +new Date();
    const diff = now - this.startTime!;

    const seconds = this.getPropsSeconds();

    if (seconds !== undefined) {
      this.setSeconds(+seconds + diff / 1000);
      return;
    }

    const time = this.getPropsTime();

    this.setTime(+time! + diff);
  };

  setSeconds = (seconds: number): void => {
    this.setState({
      seconds,
    });

    if (this.props.onSecondsChange) {
      this.props.onSecondsChange(seconds);
    }
  };

  setTime = (time: number): void => {
    this.setState({
      time,
    });

    if (this.props.onTimeChange) {
      this.props.onTimeChange(time);
    }
  };

  getPropsTime = (): TypeTime => {
    return this.props.time || this.state.defaultTime || 0;
  };

  getPropsSeconds = (): TypeTime => {
    return this.props.seconds || this.state.defaultSeconds;
  };

  getSeconds = (): TypeTime => {
    return this.state.seconds || this.getPropsSeconds();
  };

  getTime = (): TypeTime => {
    return this.state.time || this.getPropsTime();
  };

  render = () => {
    const props = (this.p = assign({}, this.props));
    let size = props.size;

    if (size == 'auto') {
      this.ignoreRender = false;
      if (!this.state.rendered) {
        this.ignoreRender = true;
      }

      size = props.size = this.state.size;
    }

    const valueSeconds: any = this.getSeconds();
    const valueTime: any = this.getTime();

    const width = size;
    const height = size;

    const className = join(
      props.className,
      props.rootClassName,
      `${props.rootClassName}--theme-${props.theme}`
    );

    let seconds;
    let minutes;
    let hours;

    if (valueSeconds != undefined) {
      seconds = Math.floor(valueSeconds % 60);
      minutes = (valueSeconds / 60) % 60;
      hours = (valueSeconds / 3600) % 24;
    } else {
      const mom = toMoment(valueTime);

      seconds = mom.seconds();
      minutes = mom.minutes() + seconds / 60;
      hours = mom.hours() + minutes / 60;
    }

    hours *= 5;

    const defaultStyle: CSSProperties = {};

    if (props.color) {
      defaultStyle.borderColor = props.color;
    }

    const style = assign(defaultStyle, props.style, {
      width,
      height,
      borderWidth: props.borderWidth,
    });

    const divProps = assign({}, props);

    delete divProps.rootClassName;
    delete divProps.bigTickHeight;
    delete divProps.bigTickOffset;
    delete divProps.bigTickWidth;
    delete divProps.borderColor;
    delete divProps.borderWidth;
    delete divProps.centerOverlaySize;
    delete divProps.centerSize;
    delete divProps.cleanup;
    delete divProps.defaultSeconds;
    delete divProps.defaultTime;
    delete divProps.handHeight;
    delete divProps.handOffset;
    delete divProps.handWidth;
    delete divProps.hourHandDiff;
    delete divProps.isDatePickerClock;
    delete divProps.minuteHandDiff;
    delete divProps.seconds;
    delete divProps.secondHandDiff;
    delete divProps.secondHandWidth;
    delete divProps.showHoursHand;
    delete divProps.showMinutesHand;
    delete divProps.showSecondsHand;
    delete divProps.showSmallTicks;
    delete divProps.smallTickHeight;
    delete divProps.smallTickOffset;
    delete divProps.smallTickWidth;
    delete divProps.theme;
    delete divProps.time;
    delete divProps.tickHeight;
    delete divProps.tickOffset;
    delete divProps.tickWidth;
    delete divProps.updateInterval;
    delete divProps.rootClassName;

    if (typeof props.cleanup == 'function') {
      props.cleanup(divProps);
    }

    return (
      <div {...divProps} className={className} style={style}>
        {this.renderCenter()}

        {this.renderHourHand(hours)}
        {this.renderMinuteHand(minutes)}
        {this.renderSecondHand(seconds)}

        {this.renderCenterOverlay()}

        {MINUTES.map(this.renderTick)}
        {this.props.size == 'auto' && (
          <NotifyResize notifyOnMount onResize={this.onResize} />
        )}
      </div>
    );
  };

  renderCenter = () => {
    const props = this.props;
    const centerSize =
      props.centerSize || (props.bigTickHeight! || props.tickHeight!) * 3;

    return (
      <div
        className={`${props.rootClassName}-center`}
        style={{ width: centerSize, height: centerSize }}
      />
    );
  };

  renderCenterOverlay = () => {
    const props = this.props;
    const centerOverlaySize = props.centerOverlaySize || props.handWidth! * 4;

    return (
      <div
        className={`${props.rootClassName}-overlay`}
        style={{
          width: centerOverlaySize,
          height: centerOverlaySize,
          borderWidth: props.handWidth,
        }}
      />
    );
  };

  onResize = ({ width, height }: { width?: number; height?: number }) => {
    if (width != height) {
      console.warn("Clock width != height. Please make sure it's a square.");
    }

    this.setState({
      size: width,
    });
  };

  renderSecondHand = (value: number) => {
    return this.props.showSecondsHand && this.renderHand('second', value);
  };

  renderMinuteHand = (value: number) => {
    return this.props.showMinutesHand && this.renderHand('minute', value);
  };

  renderHourHand = (value: number) => {
    return this.props.showHoursHand && this.renderHand('hour', value);
  };

  renderHand = (name: string, value: number) => {
    if (this.ignoreRender) {
      return null;
    }

    const props: TypeClockProps = this.p;
    const { size, borderWidth } = props;

    const height: any =
      props[`${name}HandHeight` as keyof TypeClockProps] ||
      props.handHeight ||
      +size! / 2 -
        (props as any)[`${name}HandDiff` as keyof TypeClockProps] / 2;

    const width: any =
      props[`${name}HandWidth` as keyof TypeClockProps] ||
      props.handWidth ||
      props.tickWidth;
    let offset: any =
      props[`${name}HandOffset` as keyof TypeClockProps] || props.handOffset;

    if (!offset && offset != 0) {
      offset = 5;
    }

    const style = rotateTickStyle(
      value,
      { width, height },
      +size! - borderWidth!,
      height / 2 - offset
    );
    style.width = width;
    style.height = height;

    if (props.color) {
      style.background = props.color;
    }

    const className = join(
      `${props.rootClassName}-hand`,
      `${props.rootClassName}-hand-${name}`
    );

    const renderName: string = `render${toUpperFirst(name)}Hand`;

    if (props[renderName as keyof TypeClockProps]) {
      return (props as any)[renderName as keyof TypeClockProps]({
        key: name,
        className,
        style,
      });
    }

    return <div key={name} className={className} style={style} />;
  };

  renderTick = (tick: number) => {
    if (this.ignoreRender) {
      return null;
    }

    const {
      size,
      borderWidth,

      tickWidth,
      smallTickWidth,
      bigTickWidth,

      tickHeight,
      smallTickHeight,
      bigTickHeight,

      tickOffset,
      smallTickOffset,
      bigTickOffset,
      rootClassName,
    } = this.p;

    const small = !!(tick % 5);
    const sizeName = small ? 'small' : 'big';

    if (small && !this.props.showSmallTicks) {
      return false;
    }

    const className = join(
      `${rootClassName}-tick`,
      `${rootClassName}-tick--${sizeName}`
    );
    const offset: any = small
      ? smallTickOffset || tickOffset
      : bigTickOffset || tickOffset;
    const tWidth: any = small
      ? smallTickWidth || tickWidth
      : bigTickWidth || tickWidth;
    const tHeight: any = small
      ? smallTickHeight || tickHeight
      : bigTickHeight || tickHeight;
    const totalSize = +size! - borderWidth!;
    const style = rotateTickStyle(
      tick,
      {
        width: tWidth,
        height: tHeight,
      },
      totalSize,
      totalSize / 2 - (tHeight / 2 + offset)
    );

    style.height = tHeight;
    style.width = tWidth;

    if (this.props.color) {
      style.background = this.props.color;
    }

    if (this.props.renderTick) {
      return this.props.renderTick({
        tick,
        className,
        style,
      });
    }

    return <div key={tick} className={className} style={style} />;
  };
}

export { TypeClockProps };
export default Clock;
