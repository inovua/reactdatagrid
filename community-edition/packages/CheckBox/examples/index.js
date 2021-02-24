/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import { render } from 'react-dom';
import Checkbox from '../src';

import style from './index.scss';

var checked = true;

function nextValue(value, oldValue, info) {
  if (oldValue === 1) {
    //from checked to indeterminate
    return 0;
  }

  if (oldValue === 0) {
    //from  indeterminate to unchecked
    return -1;
  }

  if (oldValue === -1) {
    return 0;
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: -1,
    };
  }

  onChange(value, event) {
    console.log('onChange', event, value);
    this.setState({ checked: value });
  }

  render() {
    function focus() {
      console.log('focused');
    }

    const { checked } = this.state;

    return (
      <form className="App" style={{ padding: 20 }}>
        <Checkbox
          supportIndeterminate
          checked={this.state.checked}
          browserNative
          onFocus={focus}
          onChange={checked => {
            this.setState({
              checked,
            });
          }}
        >
          test
        </Checkbox>
        <Checkbox supportIndeterminate onFocus={focus} focusable={false}>
          test
        </Checkbox>
        <Checkbox supportIndeterminate onFocus={focus} checked={true}>
          test
        </Checkbox>
        <Checkbox supportIndeterminate onFocus={focus} checked={null}>
          test
        </Checkbox>
      </form>
    );
  }
}

render(<App />, document.getElementById('content'));
