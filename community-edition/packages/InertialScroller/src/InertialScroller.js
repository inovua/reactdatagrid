/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import join from '../../../common/join';
import cleanProps from '../../../common/cleanProps';
import isMobile from '../../../common/isMobile';
import clamp from '../../../common/clamp';

function ypos(e) {
  // touch event
  if (e.targetTouches && e.targetTouches.length >= 1) {
    return e.targetTouches[0].clientY;
  }

  // mouse event
  return e.clientY;
}

class InovuaInertialScroller extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.setRootRef = ref => {
      this.node = ref;
    };

    this.setViewRef = ref => {
      this.viewNode = ref;
    };

    this.tap = this.tap.bind(this);
    this.drag = this.drag.bind(this);
    this.release = this.release.bind(this);
    this.track = this.track.bind(this);
    this.autoScroll = this.autoScroll.bind(this);

    this.min = 0;
    this.max = null;
    this.pressed = null;
    this.reference = null;
    this.offset = 0;
  }

  componentDidMount() {
    this.updateMaxScroll();
  }

  render() {
    const { props } = this;
    const className = join(
      props.rootClassName,
      props.className,
      `${props.rootClassName}--theme-${props.theme}`
    );

    let events;
    if (isMobile && this.props.enableTouchDrag) {
      events = {
        onTouchStart: this.tap,
        onTouchEnd: this.release,
        onTouchMove: this.drag,
      };
    }

    if (!isMobile && props.enableMouseDrag) {
      events = {
        onMouseDown: this.tap,
        onMouseUp: this.release,
        onMouseMove: this.drag,
      };
    }

    return (
      <div
        {...cleanProps(props, InovuaInertialScroller.propTypes)}
        className={className}
        ref={this.setRootRef}
        {...events}
      >
        <div ref={this.setViewRef} className={`${props.rootClassName}__view`}>
          {props.children}
        </div>
      </div>
    );
  }

  tap(event) {
    this.pressed = true;
    this.reference = ypos(event);

    this.timeStamp = Date.now();
    this.frame = this.offset;
    this.velocity = 0;
    this.amplitude = 0;

    clearInterval(this.ticker);
    this.ticker = setInterval(this.track, 16);

    event.stopPropagation();
    event.preventDefault();
  }

  drag(event) {
    if (this.pressed) {
      const y = ypos(event);
      let delta = this.reference - y;
      if (delta > this.props.threshold || delta < -this.props.threshold) {
        this.reference = y;
        this.scrollTo(this.offset + delta);
      }
    }
  }

  release(event) {
    this.pressed = false;
    this.updateMaxScroll();
    event.stopPropagation();
    event.preventDefault();

    clearInterval(this.ticker);
    if (this.velocity > 10 || this.velocity < -10) {
      this.amplitude = this.props.initialAmplitude * this.velocity;
      this.target = Math.round(this.offset + this.amplitude);
      this.timestamp = Date.now();
      requestAnimationFrame(this.autoScroll);
    }
  }

  scrollTo(offset) {
    if (!this.viewNode) {
      return null;
    }

    this.offset = clamp(offset, 0, this.max);
    this.viewNode.style.transform = `translateY(${-this.offset}px)`;
  }

  autoScroll() {
    let elapsed, delta;
    const timeConstant = this.props.timeConstant; // ms
    if (this.amplitude) {
      elapsed = Date.now() - this.timestamp;
      delta = -this.amplitude * Math.exp(-elapsed / timeConstant);
      if (delta > 0.1 || delta < -0.1) {
        this.scrollTo(this.target + delta);
        requestAnimationFrame(this.autoScroll);
      } else {
        this.scrollTo(this.target);
      }
    }
  }

  updateMaxScroll() {
    this.max =
      this.viewNode && this.viewNode.offsetHeight - this.node.offsetHeight;
  }

  track() {
    let now, elapsed, delta, v;

    now = Date.now();
    elapsed = now - this.timeStamp;
    this.timeStamp = now;
    delta = this.offset - this.frame;
    this.frame = this.offset;

    v = (1000 * delta) / (1 + elapsed);
    this.velocity = 0.8 * v + 0.2 * this.velocity;
  }
}

function emptyFn() {}

InovuaInertialScroller.defaultProps = {
  theme: 'default',
  rootClassName: 'react-toolkit-inertial-scroller',
  threshold: 5,
  timeConstant: 360,
  initialAmplitude: 0.5,
  enableMouseDrag: true,
  enableTouchDrag: true,
};

InovuaInertialScroller.propTypes = {
  theme: PropTypes.string,
  rootClassName: PropTypes.string,
  threshold: PropTypes.number,
  timeConstant: PropTypes.number,
  initialAmplitude: PropTypes.number,
  enableMouseDrag: PropTypes.bool,
  enableTouchDrag: PropTypes.bool,
};

export default InovuaInertialScroller;
