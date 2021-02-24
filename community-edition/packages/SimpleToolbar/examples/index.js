/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import { render } from 'react-dom';

import 'typeface-roboto';

import ToolBar, { Separator } from '../src';
import '../style/index.scss';

global.React = React;
class App extends Component {
  render() {
    return (
      <div
        style={{
          xbackground: '#5e9a2c',
          fontSize: 14,
          fontFamily: 'Roboto',

          border: '1px solid magenta',
          boxSizing: 'border-box',
        }}
      >
        <ToolBar>
          <div>xxx</div>
          <div>yyy</div>
        </ToolBar>
      </div>
    );
  }
}

render(<App />, document.getElementById('content'));
