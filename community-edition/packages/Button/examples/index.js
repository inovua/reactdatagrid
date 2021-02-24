/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import { render } from 'react-dom';
import Button from '../src/Button';
import RadioButtonGroup from '../../RadioButtonGroup';
import DropDownButton from '../../DropdownButton';

import SplitButton from '../../SplitButton';
import CheckBox from '../../CheckBox';
import '../../CheckBox/style/index.scss';
import '../../RadioButtonGroup/style/index.scss';
import '../../DropdownButton/style/index.scss';

import '../../SplitButton/style/index.scss';
import '../style/index.scss';

import 'typeface-roboto';

const icon = (
  <svg style={{ width: 24, height: 24 }}>
    <path
      fill="#000000"
      d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
    />
  </svg>
);

const widthOptions = ['auto', 100, 200, 300].map(value => {
  return { value, label: typeof value == 'number' ? value + 'px' : value };
});
const themeOptions = ['light', 'default'].map(value => {
  return { value, label: value };
});

const alignOptions = ['center', 'start', 'end'].map(value => {
  return { value, label: value };
});

const verticalAlignOptions = ['middle', 'top', 'bottom'].map(value => {
  return { value, label: value };
});

const iconPositionOptions = ['start', 'end', 'top', 'bottom'].map(value => {
  return { value, label: value };
});

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
  { label: 'Export as' },
  { label: 'Document' },
];

let pressedIndex = 0;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      widthValue: '300',
      heightValue: '300',
      iconPosition: 'top',
      align: 'start',
      theme: 'default',
      verticalAlign: 'middle',
      showIcon: true,
      disabled: false,
    };
  }

  render() {
    const style = {};

    const { widthValue, heightValue } = this.state;
    if (widthValue != 'auto') {
      style.width = widthValue;
    }
    if (heightValue != 'auto') {
      style.height = heightValue;
    }
    return (
      <div style={{ fontFamily: 'Roboto', fontSize: 14, margin: 50 }}>
        <div style={{ margin: 20 }}>
          <div style={{ marginBottom: 30 }}>
            Button theme:
            <RadioButtonGroup
              style={{ marginLeft: 20 }}
              orientation="horizontal"
              radioOptions={themeOptions}
              radioValue={this.state.theme}
              onChange={({ checkedItemValue: theme }) =>
                this.setState({ theme })
              }
            />{' '}
            |{' '}
            <input
              type="checkbox"
              checked={this.state.disabled}
              onChange={ev => this.setState({ disabled: ev.target.checked })}
            />
            disabled
          </div>
          <Button
            icon={icon}
            tagName="div"
            theme={this.state.theme}
            pressed
            onClick={() => {
              console.log('click', Date.now());
            }}
          >
            simple text button
          </Button>
          <Button
            disabled={this.state.disabled}
            icon={icon}
            tagName="div"
            theme={this.state.theme}
            pressed={false}
          >
            simple text button
          </Button>
          <Button
            disabled={this.state.disabled}
            icon={icon}
            tagName="div"
            theme={'light'}
            pressed
          >
            simple text button
          </Button>
          <Button icon={icon} tagName="div" theme={'light'}>
            simple text button
          </Button>
        </div>
        <div style={{ margin: 30 }}>
          <h3>DropDownButton</h3>
          <DropDownButton renderMenuWhenCollapsed items={items}>
            Hello
          </DropDownButton>
        </div>

        <div style={{ margin: 30 }}>
          <h3>SplitButton</h3>
          <SplitButton
            dropdownButtonProps={{ children: 'hello world' }}
            items={items}
          >
            Hello
          </SplitButton>
        </div>
        <div style={{ fontFamily: 'Roboto', fontSize: 14 }}>
          <Button tagName="div">simple text button</Button>
          <Button
            align={this.state.align}
            verticalAlign={this.state.verticalAlign}
            icon={
              this.state.showIcon ? (
                <img
                  src="https://facebook.github.io/react/img/logo.svg"
                  height="30"
                  width="30"
                />
              ) : null
            }
            iconPosition={this.state.iconPosition}
            style={style}
          >
            Export as React Component
          </Button>
          <div style={{ marginTop: 20 }}>
            Button width:
            <RadioButtonGroup
              style={{ marginLeft: 20 }}
              orientation="horizontal"
              radioOptions={widthOptions}
              radioValue={this.state.widthValue}
              onChange={({ checkedItemValue: widthValue }) =>
                this.setState({ widthValue })
              }
            />
          </div>
          <div style={{ marginTop: 20 }}>
            Button height:
            <RadioButtonGroup
              style={{ marginLeft: 20 }}
              orientation="horizontal"
              radioOptions={widthOptions}
              radioValue={this.state.heightValue}
              onChange={({ checkedItemValue: heightValue }) =>
                this.setState({ heightValue })
              }
            />
          </div>
          <div style={{ marginTop: 20 }}>
            Align:
            <RadioButtonGroup
              style={{ marginLeft: 20 }}
              orientation="horizontal"
              radioOptions={alignOptions}
              radioValue={this.state.align}
              onChange={({ checkedItemValue: align }) =>
                this.setState({ align })
              }
            />
          </div>
          <div style={{ marginTop: 20 }}>
            Vertical align:
            <RadioButtonGroup
              style={{ marginLeft: 20 }}
              orientation="horizontal"
              radioOptions={verticalAlignOptions}
              radioValue={this.state.verticalAlign}
              onChange={({ checkedItemValue: verticalAlign }) =>
                this.setState({ verticalAlign })
              }
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <CheckBox
              checked={this.state.showIcon}
              onChange={showIcon => {
                this.setState({
                  showIcon,
                });
              }}
            >
              Show icon
            </CheckBox>
          </div>
          <div style={{ marginTop: 20 }}>
            Icon position:
            <RadioButtonGroup
              style={{ marginLeft: 20 }}
              orientation="horizontal"
              radioOptions={iconPositionOptions}
              radioValue={this.state.iconPosition}
              onChange={({ checkedItemValue: iconPosition }) =>
                this.setState({ iconPosition })
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

class App1 extends Component {
  render() {
    return (
      <div className="App" style={{ padding: 10 }}>
        <App />
        <Button
          overflow
          activeStyle={{ background: 'blue' }}
          onClick={() => console.log('blue active button')}
        >
          hello
        </Button>
        <Button type="big" onClick={() => console.log('big button')}>
          Save as
        </Button>
        <Button href="#test">world</Button>
        <Button>primary no theme</Button>
        <Button disabled={true}>primary disabled</Button>
        <Button defaultPressed={true}>toggle button</Button>
        <Button disabled={true}>disabled</Button>
        <Button ellipsis style={{ width: 100 }}>
          ellipsis ellipsis ellipsis ellipsis ellipsis ellipsis
        </Button>

        <Button style={{ width: 100 }} align={'start'}>
          left
        </Button>
        <Button style={{ width: 100 }} align={'end'}>
          right
        </Button>

        <Button style={{ width: 100 }} rtl align={'start'}>
          rtl
        </Button>
        <h1>Vertical align</h1>
        <Button
          style={{ height: 200, width: 650 }}
          icon={() => 'x'}
          iconPosition="top"
        >
          A long line here
        </Button>

        <h1>icons</h1>
        <Button icon={icon} style={{ width: 100 }}>
          icon default very long text
        </Button>
        <Button icon={icon} iconPosition="start">
          icon start default
        </Button>
        <Button icon={icon} iconPosition="end">
          icon end default
        </Button>
        <Button style={{ minWidth: 400 }} icon={icon} iconPosition="left">
          icon left default
        </Button>
        <Button icon={icon} iconPosition="right">
          icon right default
        </Button>
        <Button icon={icon} tagName="div" iconPosition="top">
          icon top default
        </Button>
        <Button icon={icon} iconPosition="bottom">
          icon bottom default
        </Button>

        <h1>icons with ellipsis</h1>
        <Button icon={icon} style={{ width: 70 }} iconPosition="bottom">
          icon bottom default
        </Button>
      </div>
    );
  }
}

render(<App1 />, document.getElementById('content'));
