/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { createRef } from 'react';
import PropTypes from 'prop-types';

import LoadMask from './packages/LoadMask';
import cleanupProps from './packages/react-clean-props';

import join from './packages/join';
import renderEmptyContent from './renderEmptyContent';

const stop = e => {
  if (e.cancelable === false) {
    return;
  }
  e.preventDefault();
};

const DEFAULT_CLASSNAME = 'InovuaReactDataGrid__load-mask';

export default class DataGridLoadMask extends React.Component {
  constructor(props) {
    super(props);

    this.visible = props.visible;

    this.maskRef = createRef();
  }

  setVisible(visible) {
    if (this.props.livePagination) {
      this.visible = visible;
      const fn = () => {
        const node = this.maskRef.current;
        if (!node || !this.scroller) {
          return;
        }

        node.style.visibility = visible ? 'visible' : 'hidden';
        if (visible === false) {
          this.scroller.scrollTop = 0;
        }
      };

      if (!visible) {
        global.requestAnimationFrame(fn);
      } else {
        fn();
      }
    }
  }

  componentDidMount() {
    this.setVisible(this.props.visible);
  }

  render() {
    const props = this.props;
    const { livePagination, loadingText, visible } = props;

    let style = props.style;

    const cleanProps = cleanupProps(props, DataGridLoadMask.propTypes);

    const className = join(
      DEFAULT_CLASSNAME,
      props.className,
      livePagination && `${DEFAULT_CLASSNAME}--live-pagination`
    );

    return (
      <LoadMask
        {...cleanProps}
        ref={this.maskRef}
        style={style}
        visible={visible}
        className={className}
        onWheel={livePagination ? stop : null}
      >
        {renderEmptyContent(loadingText, 'loading')}
      </LoadMask>
    );
  }
}

DataGridLoadMask.defaultProps = { livePagination: false, visible: false };

DataGridLoadMask.propTypes = {
  visible: PropTypes.bool,
  loadingText: PropTypes.node,
  livePagination: PropTypes.bool,
};
