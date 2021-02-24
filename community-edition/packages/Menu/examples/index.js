/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import { render } from 'react-dom';
import Menu from '../src';
import NumericInput from '../../NumericInput';
import '../../NumericInput/style/index.scss';

import '../../../lib/Menu/index.css';
import Icon from './Icon';
import submenuExpandBugProps from './submenuExpandBugProps';
import 'typeface-roboto';

import checkIcon from './check-icon.png';

const radioItems = [
  { label: 'Apples' },
  { label: 'Strawberries', items: [{ label: 'x' }, { label: 'y' }] },
  '-',
  { label: 'Potatoes' },
  { label: 'Tomatoes' },
  { label: 'Onions' },
];
const items = [
  { name: 'fruit', value: 'orange', label: 'Oranges' },
  { name: 'fruit', value: 'banana', label: 'Bananas' },
  { name: 'fruit', value: 'apple', label: 'Apples' },
  { name: 'fruit', value: 'strawberry', label: 'Strawberries' },
  '-',
  {
    id: 'hello',
    label: 'Extra Child Items',
    items: [
      {
        id: 'test',
        label: 'Test',
      },
    ],
  },
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: { fruit: 'orange' } };
  }
  render() {
    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          <b>Selected:</b>
          <code>{JSON.stringify(this.state.selected, null, 2)}</code>
        </div>
        <Menu
          enableSelection
          selected={this.state.selected}
          nameProperty="name"
          valueProperty="value"
          items={items}
          onSelectionChange={selected => this.setState({ selected })}
          columns={[
            {
              name: 'label',
              align: 'start',
            },
          ]}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById('content'));
