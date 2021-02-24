/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import { render } from 'react-dom';
import SplitButton from '../src';
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

const themeOptions = ['light', 'default'].map(value => {
  return { value, label: value };
});

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
  { label: 'Export as' },
  { label: 'Document' },
];

const overStyle = {
  color: 'aqua',
  background: 'red',
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { showSplit: false, theme: 'default' };
  }
  showSplit() {
    this.setState({ showSplit: !this.state.showSplit });
  }

  render() {
    return (
      <div style={{ margin: 100 }}>
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
        <SplitButton
          onDropdownButtonClick={() => console.log('dropdown button click')}
          onExpandedChange={expanded => console.log('expand change')}
          onMenuClick={() => console.log('onMenuClick')}
          onClick={() => console.log('button clicked')}
          dropdownButtonProps={{ children: 'hello world' }}
          theme={this.state.theme}
          menuProps={{
            maxHeight: 150,
            submenuMaxHeight: 75,
            enableAnimation: true,
            columns: ['icon', { name: 'label', colspan: 10 }],
          }}
          items={items}
        >
          Hello
        </SplitButton>
      </div>
    );
  }
}

render(<App />, document.getElementById('content'));
