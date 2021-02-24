/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import { render } from 'react-dom';
import DropDownButton from '../src';
import '../style/index.scss';
import RadioButtonGroup from '../../RadioButtonGroup';
import '../../RadioButtonGroup/style/index.scss';
const PREVIEW_ICON = (
  <svg
    fill="#000000"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M11.5 9C10.12 9 9 10.12 9 11.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5S12.88 9 11.5 9zM20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-3.21 14.21l-2.91-2.91c-.69.44-1.51.7-2.39.7C9.01 16 7 13.99 7 11.5S9.01 7 11.5 7 16 9.01 16 11.5c0 .88-.26 1.69-.7 2.39l2.91 2.9-1.42 1.42z" />
  </svg>
);

const items = [
  {
    label: 'New',
    icon: PREVIEW_ICON,
    cellStyle: { color: 'red' },
  },
  {
    label: 'Options',
    disabled: true,
  },
  {
    label: 'Format',
  },
  { label: 'Save' },
  '-',
  { label: 'Export as', items: [{ label: 'PDF' }, { label: 'Docx' }] },
  { label: 'Document' },
];
const themeOptions = ['light', 'default'].map(value => {
  return { value, label: value };
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { showDD: true, theme: 'default' };
  }

  render() {
    return (
      <div>
        <div style={{ margin: 20 }}>
          Button theme:
          <RadioButtonGroup
            style={{ marginLeft: 20 }}
            orientation="horizontal"
            radioOptions={themeOptions}
            radioValue={this.state.theme}
            onChange={({ checkedItemValue: theme }) => this.setState({ theme })}
          />
        </div>
        <h1>Dropdown button</h1>
        {this.state.showDD && (
          <DropDownButton
            renderMenuWhenCollapsed
            theme={this.state.theme}
            items={items}
            style={{ position: 'absolute', right: 10 }}
            icon={<div>x</div>}
          >
            Hello
          </DropDownButton>
        )}
        <div style={{ height: '140vh' }} />
      </div>
    );
  }
}

render(<App />, document.getElementById('content'));
