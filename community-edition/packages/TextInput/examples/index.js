/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import { render } from 'react-dom';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div>
        <Menu />
        <hr style={{ width: '100%', height: 3 }} />
        {this.props.children}
      </div>
    );
  }
}

const Menu = () => (
  <ul>
    <li>
      <Link to="/">Home</Link>
    </li>
    <li>
      <Link to="/text-input-example">TextInput Example</Link>
    </li>
    <li>
      <Link to="/editors-example">Editors Example</Link>
    </li>
  </ul>
);

import TextInputExamples from './textInputExamples';
import EditorsExample from './editors';

render(
  <Router>
    <div>
      <Route path="/" component={App} />
      <Route path="/text-input-example" component={TextInputExamples} />
      <Route path="/editors-example" component={EditorsExample} />
    </div>
  </Router>,
  document.getElementById('content')
);
