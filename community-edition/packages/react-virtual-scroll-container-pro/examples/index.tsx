/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { render } from 'react-dom';
import VirtualScrollContainer, { NativeScrollContainer } from '../src';

import '../style/index.scss';
global.React = React;
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 1000,
      height: 2300,
      nativeScroll: false,
      rtl: true,
    };
  }

  inc = () => {
    this.setState({ width: this.state.width + 100 });
  };

  incHeight = () => {
    this.setState({ height: this.state.height + 1000 });
  };

  onResize = size => {
    console.log('resize', size, '!!!');
  };

  onScrollbarsChange = scrolls => {
    console.log(scrolls);
  };

  onScrollLeftMax = () => {
    console.log('scrollleft max');
  };

  toggleNativeScroll = () => {
    this.setState({
      nativeScroll: !this.state.nativeScroll,
    });
  };
  toggleRtl = () => {
    this.setState({
      rtl: !this.state.rtl,
    });
  };

  render() {
    const ScrollerFactory = this.state.nativeScroll
      ? NativeScrollContainer
      : VirtualScrollContainer;
    return (
      <div style={{ position: 'absolute', top: 40 }}>
        <input />
        <button onClick={this.inc}>inc width</button>
        <button onClick={this.incHeight}>inc height</button>
        <button onClick={this.toggleNativeScroll}>
          toggle native - native {`${this.state.nativeScroll}`}
        </button>
        <button onClick={this.toggleRtl}>
          toggle rtl - rtl {`${this.state.rtl}`}
        </button>

        <ScrollerFactory
          autoHide={false}
          rtl={this.state.rtl}
          nativeScroll={this.state.nativeScroll}
          ref={x => {
            global.scroller = x;
          }}
          style={{
            position: 'relative',
            height: 400,
            width: '60vw',
            border: '1px solid red',
            margin: 20,
          }}
          scrollThumbStyle={{}}
          tabIndex={1}
          renderScroller={props => <div {...props} tabIndex={1} />}
          onResize={this.onResize}
          contain
        >
          <div
            data-name="yyy"
            style={{
              background:
                'linear-gradient(to right, rgba(30, 87, 153, 0.43) 0%, rgba(255, 137, 137, 0.35) 100%)',
            }}
          >
            <div
              style={{
                width: this.state.width,
                height: this.state.height,
                border: '1px solid magenta',
              }}
            >
              <div style={{ minHeight: 200 }} />
              <input />
              <button>test</button>

              <button>test2</button>
            </div>
          </div>
        </ScrollerFactory>
        <input />
        <button onClick={this.inc}>inc width</button>
        <button onClick={this.incHeight}>inc height</button>
        <button onClick={this.toggleNativeScroll}>toggle native</button>
      </div>
    );
  }
}

render(<App />, document.getElementById('content'));
