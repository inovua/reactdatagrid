/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import { render } from 'react-dom';
import Overlay from '../src/Overlay';
import './index.scss';
import '../style/index.scss';

import Menu from '../../Menu';
import '../../Menu/style/index.scss';

const items = [
  { id: 0, label: 'First' },
  { id: 1, label: 'Second' },
  { id: 2, label: 'Third' },
  { id: 3, label: 'Fourth' },
  { id: 4, label: 'Fivth' },
];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      showButtons: true,
    };
  }
  render() {
    return (
      <div className="wrapper">
        <Overlay
          showEvent={['click']}
          hideEvent={['click']}
          width="200"
          height="200"
          positions={['tr-br']}
          xhideOnClickOutside={true}
          xrafOnMount={true}
          xrelativeToViewport
          target={(_, node) => {
            return node ? node.parentNode : null;
          }}
        >
          <div
            style={{
              visibility: 'visible',
              border: '1px solid red',
              width: 200,
              height: 200,
            }}
          >
            dgsgsfdgdsfgdfd
          </div>
        </Overlay>
      </div>
    );
  }
}

const rootTree = render(<App />, document.getElementById('content'));
