/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import { render } from 'react-dom';

import LoadMask from '../src';
import '../style/index.scss';

class App extends Component {
  render() {
    return (
      <div>
        <div style={{ position: 'relative', height: 300 }}>
          hello <input />
          <LoadMask svgLoader={true} />
        </div>
      </div>
    );
  }
}
render(<App />, document.getElementById('content'));
