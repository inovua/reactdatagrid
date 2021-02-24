/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';

import join from '../../packages/join';

export default class ResizeOverlay extends React.Component {
  constructor(props) {
    super(props);

    this.state = { offset: 0, constrained: false, active: false };
  }

  setConstrained = constrained => {
    if (this.state.constrained != constrained) {
      this.setState({ constrained });
    }

    return this;
  };

  setOffset = offset => {
    this.setState({ offset });

    return this;
  };

  setActive = (active, cfg) => {
    this.setState({ active, offsetTop: cfg ? cfg.offsetTop || 0 : 0 });

    return this;
  };

  render() {
    const props = this.props;
    const state = this.state;
    const constrained = state.constrained;
    const active = props.active !== undefined ? props.active : state.active;

    const { rtl, columnResizeProxyWidth, columnResizeHandleWidth } = props;
    let { style } = props;

    if (active && props.activeStyle) {
      style = Object.assign({}, style, props.activeStyle);
    }

    const className = join(
      props.className,
      'InovuaReactDataGrid__resize-overlay',
      active && 'InovuaReactDataGrid__resize-overlay--active'
    );

    const proxyClassName = join(
      'InovuaReactDataGrid__resize-proxy',
      constrained && 'InovuaReactDataGrid__resize-proxy--constrained'
    );

    let offset =
      this.state.offset +
      (columnResizeHandleWidth - columnResizeProxyWidth) / 2;

    let proxyStyle = {
      transform: `translate3d(${(rtl ? -1 : 1) * offset}px,0px, 0px)`,
      [rtl ? 'right' : 'left']: 0,
      [rtl ? 'left' : 'right']: 'unset',
      width: columnResizeProxyWidth,
      top: this.state.active ? this.state.offsetTop || 0 : 0,
      bottom: 0,
      height: 'initial',
    };

    if (this.props.resizeProxyStyle) {
      proxyStyle = Object.assign({}, this.props.resizeProxyStyle, proxyStyle);
    }

    return (
      <div style={style} className={className}>
        <div className={proxyClassName} style={proxyStyle} />
      </div>
    );
  }
}

ResizeOverlay.propTypes = { resizeProxyStyle: PropTypes.shape({}) };
