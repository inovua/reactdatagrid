/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import throttle from 'lodash.throttle';

export default class ColumnResizer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      over: false,
    };

    this.domRef = React.createRef();

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.setOver = throttle(this.setOver, 50, { leading: false });
  }

  onMouseEnter() {
    const parent = this.domRef.current.parentElement;
    const filterWrapper = parent
      ? parent.querySelector(
          '.InovuaReactDataGrid__column-header__filter-wrapper'
        )
      : null;

    const overHeight = filterWrapper
      ? parent.offsetHeight - filterWrapper.offsetHeight
      : null;

    this.overHeight = overHeight;
    this.setOver(true);
  }

  setOver(value) {
    if (value) {
      this.setState({
        over: true,
        overHeight: this.overHeight,
      });
    } else {
      this.setState({
        over: false,
      });
    }
  }

  onMouseLeave() {
    this.setOver(false);
  }

  onMouseDown(event) {
    event.preventDefault();

    if (this.props.onMouseDown) {
      this.props.onMouseDown(event);
    }
    this.setState({
      over: false,
    });
  }
  onTouchStart(event) {
    event.preventDefault();

    if (this.props.onTouchStart) {
      this.props.onTouchStart(event);
    }

    this.setState({
      over: false,
    });
  }

  render() {
    const { props } = this;
    const {
      className,

      resizeHandleClassName,
    } = this.props;

    let style = props.style;

    const resizeHandleStyle = {
      ...props.resizeHandleStyle,
    };

    if (this.state.over) {
      resizeHandleStyle.visibility = 'visible';
    } else {
      resizeHandleStyle.visibility = 'hidden';
    }

    return (
      <div
        ref={this.domRef}
        draggable="false"
        className={className}
        onMouseDown={this.onMouseDown}
        onTouchStart={this.onTouchStart}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        style={style}
      >
        <div style={resizeHandleStyle} className={resizeHandleClassName} />
      </div>
    );
  }
}

ColumnResizer.propTypes = {
  onMouseDown: PropTypes.func.isRequired,
  onTouchStart: PropTypes.func.isRequired,
  resizeHandleClassName: PropTypes.string.isRequired,
};
