/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, cloneElement, createRef } from 'react';
import PropTypes from 'prop-types';

import RO from 'resize-observer-polyfill';

import NotifyResize from './packages/NotifyResize';
import autoBind from './packages/react-class/autoBind';

const ResizeObserver = global.ResizeObserver || RO;

const useFragment = !!React.Fragment;
const coverStyle = !useFragment
  ? {
      height: '100%',
      position: 'absolute',
      width: '100%',
      top: 0,
      left: 0,
    }
  : null;

const FLEX_1_STYLE = { flex: 1 };

const nativeFlexCoverStyle = {
  height: '100%',
  position: 'absolute',
  width: '100%',
  top: 0,
  left: 0,
  display: 'flex',
  flexFlow: 'column',
};

class FakeFlex extends Component {
  constructor(props) {
    super(props);

    autoBind(this);
    this.state = {
      flexHeight: null,
    };

    this.flexRef = createRef();
  }
  onResize(size) {
    if (this.props.useNativeFlex) {
      return;
    }
    this.size = size;
    if (size.height === this.availableHeight) {
      return;
    }

    this.availableHeight = size.height;

    requestAnimationFrame(() => {
      this.computeSize();

      requestAnimationFrame(this.resync);
    });
  }

  resync() {
    const node = this.getNode();
    if (!node || this.unmounted) {
      return;
    }
    const { width, height } = node.getBoundingClientRect();
    this.onResize({
      width,
      height,
    });
  }

  onChildResize() {
    this.computeSize();
  }

  computeSize(availableHeight = this.availableHeight) {
    const node = this.getNode();

    if (!node || this.unmounted) {
      return;
    }
    const { flexIndex } = this.props;

    const sum = [].slice.call(node.children).reduce((acc, child, index) => {
      if (index >= this.length) {
        return acc;
      }
      if (index === flexIndex) {
        return acc;
      }
      return acc + child.offsetHeight;
    }, 0);

    const flexHeight = availableHeight - sum;

    if (flexHeight != this.state.flexHeight) {
      this.setState({
        flexHeight,
      });
    }
  }

  getNode() {
    if (this.node) {
      return this.node;
    }

    if (this.props.getNode) {
      this.node = this.props.getNode();
    } else {
      this.node = this.flexRef.current;
    }

    return this.node;
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      this.setupObservers();
    });
  }

  componentDidUpdate() {
    if (this.prevLength && this.prevLength !== this.length) {
      this.clearObservers();
      this.setupObservers();
    }
    this.prevLength = this.length;
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.clearObservers();
  }

  setupObservers() {
    if (this.props.useNativeFlex) {
      return;
    }
    const node = this.getNode();

    if (!node) {
      return;
    }

    const { flexIndex } = this.props;

    this.observers = [].slice
      .call(node.children)
      .map((child, index) => {
        if (index >= this.length) {
          return null;
        }
        if (index === flexIndex) {
          return null;
        }

        if (child.__observer) {
          return child.__observer;
        }

        const observer = new ResizeObserver(entries => {
          const first = entries[0];

          if (first) {
            this.onChildResize(first.contentRect);
          }
        });

        observer.observe(child);
        observer.__obsTarget = child;
        child.__observer = observer;

        return observer;
      })
      .filter(Boolean);
  }

  clearObservers() {
    const node = this.getNode();

    if (!node) {
      return;
    }

    [].slice.call(node.children).map(child => {
      if (child && child.__observer) {
        child.__observer.__obsTarget = null;
        child.__observer = null;
      }
    });

    if (this.observers) {
      this.observers.forEach(o => {
        if (o.unobserve && o.__obsTarget) {
          o.__obsTarget.__observer = null;
          o.unobserve(o.__obsTarget);
        }
        if (o.disconnect) {
          o.disconnect();
        }
      });
    }

    delete this.observers;
  }

  render() {
    const { props } = this;
    const { flexIndex, useNativeFlex } = props;
    const { flexHeight } = this.state;

    const children = React.Children.toArray(props.children)
      .filter(Boolean)
      .map((x, i) => {
        if (i === flexIndex && (useNativeFlex || flexHeight)) {
          const additionalStyle = useNativeFlex
            ? FLEX_1_STYLE
            : { height: flexHeight };
          x = cloneElement(x, {
            style: x.props.style
              ? { ...x.props.style, ...additionalStyle }
              : additionalStyle,
          });
        }

        return x;
      });

    this.length = children.length;

    const resizer = !useNativeFlex ? (
      <NotifyResize
        key="fakeflexresizer"
        onResize={this.onResize}
        notifyOnMount
        ResizeObserver={ResizeObserver}
      />
    ) : null;

    if (useFragment && !useNativeFlex) {
      return (
        <React.Fragment key="fragment">
          {children}
          {resizer}
        </React.Fragment>
      );
    }

    return (
      <div
        ref={this.flexRef}
        style={useNativeFlex ? nativeFlexCoverStyle : coverStyle}
      >
        {children}
        {resizer}
      </div>
    );
  }
}

FakeFlex.propTypes = {
  flexIndex: PropTypes.number.isRequired,
  getNode: PropTypes.func.isRequired,
  useNativeFlex: PropTypes.bool,
};

export default FakeFlex;
