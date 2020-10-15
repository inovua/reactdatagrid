/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { render } from 'react-dom';
import React from 'react';

import RowHeightManager from '../src/RowHeightManager';
import List from '../src';
import VirtualScrollContainer, {
  NativeScrollContainer,
} from '../../react-virtual-scroll-container-pro/src';

import '../style/index.scss';

global.React = React;
global.RowHeightManager = RowHeightManager;
global.rhm = new RowHeightManager(55, {});

const rowHeightManager = new RowHeightManager(40, {
  3: 70,
  5: 90,
  7: 90,
  8: 90,
  18: 90,
  28: 120,
  32: 120,
  39: 120,
  49: 120,
  54: 120,
  71: 100,
  77: 100,
  89: 100,
  98: 100,
  112: 75,
  124: 100,
  131: 90,
  154: 70,
  162: 75,
  169: 90,
  180: 120,
  199: 75,
});
const rowHeightManager1 = new RowHeightManager(20);
global.r = rowHeightManager;

global.React = React;
const countries = [
  'USA',
  'UK',
  'Romania',
  'Spain',
  'Italy',
  'France',
  'Germany',
  'Brazil',
  'Portugal',
  'Denmark',
  'Sweden',
];

const names = [...Array(100)].map(_ => _);
const colors = [...Array(20)].map(_ => _);

class Cell extends React.Component {
  render() {
    const index = this.props.index;
    const size = this.props.size || 1;

    const space = (index % 5) * 3;
    const name = names[index % 20];
    const color = colors[index % 20];
    const secondColor = colors[(index * 2) % 20];

    const part = (
      <div
        style={{
          display: 'inline-block',
          border: '1px solid magenta',
          width: 600,
          marginLeft: 5,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            paddingTop: space,
            paddingBottom: space,
          }}
        >
          {name} - {index} <input defaultValue={space} />
          <div style={{ display: 'inline-block' }}>
            <div style={{ display: 'inline-block' }}>
              Country: {countries[index % countries.length]}
            </div>
            <div style={{ background: color, display: 'inline-block' }}>
              Base color: {color}
            </div>
          </div>
        </div>
        <div
          style={{ display: 'inline-block', color: secondColor, width: 100 }}
        >
          {secondColor}
        </div>
      </div>
    );

    const children = [...Array(size)].map(x => part);

    return (
      <div
        data-index={this.props['data-index']}
        data-key={this.props['data-key']}
        style={{
          ...this.props.style,
          width: '100%',
          paddingTop: space,
          paddingBottom: space,
          minWidth: 300,
          borderTop: index ? '1px solid blue' : 0,
        }}
        children={children}
      />
    );
  }
}
class App extends React.Component {
  constructor(props) {
    super(props);

    this.rr = data => {
      return (
        <div
          style={{
            border: '1px solid red',
            minWidth: 2000,
            height: data.rowHeight,
          }}
          key={data.index}
        >
          Row {data.index}
        </div>
      );
    };

    this.state = {
      from: 0,
      count: 100,
      x: parseInt(Math.random() * 20),
      tempScrollTop: 0,
      renderRow: this.renderRow.bind(this),
      rowHeight: 40,
      scrollTop: 0,
      list: true,
      nativeScroll: false,
      rtl: true,
      sendCounter: true,
      showEmptyRows: false,
      preventRtlInherit: false,
    };

    this.listStyle = {
      border: '1px solid magenta',
      margin: 20,
      height: 550,
    };
  }

  renderRow = data => {
    if (data.index === 3222222) {
      return (
        <List
          tabIndex={5}
          ref={c => {
            window.list = c;
          }}
          style={{
            border: '3px solid blue',
            minWidth: 2000,
            height: data.rowHeight,
          }}
          useTransformPosition={true}
          showEmptyRows
          nativeScroll={this.state.nativeScroll}
          count={this.state.count}
          renderRow={this.rr}
          minRowWidth={2000}
          rowHeightManager={rowHeightManager}
          showEmptyRows={this.state.showEmptyRows}
        />
      );
    }

    return (
      <div
        style={{
          border: '1px solid red',
          minWidth: 1505,
          height: 20 + ((data.index + 5) % 10) * (5 + (this.state.x % 10)),
        }}
        key={data.index}
      >
        Row {data.index} - empty? {`${data.empty}`}
      </div>
    );
  };

  plusOne = () => {
    this.setState({
      counter: this.state.count + 1,
    });
  };

  toggleSendCounter = () => {
    this.setState({
      sendCounter: !this.state.sendCounter,
    });
  };

  onChangeScrollTop = e => {
    this.setState({
      tempScrollTop: e.target.value * 1 || 0,
    });
  };

  go = () => {
    this.setState({
      scrollTop: this.state.tempScrollTop,
    });
  };

  setScrollTop = scrollTop => {
    this.setState({
      scrollTop,
    });
  };

  updateRenderRow = () => {
    this.renderRow = this.constructor.prototype.renderRow.bind(this);
    this.setState({});
  };

  increaseCount = e => {
    e.preventDefault();
    this.setState({
      count: this.state.count + 10,
    });
  };

  setCount10 = () => {
    this.setState({
      count: 10,
    });
  };
  setCount5 = () => {
    this.setState({
      count: 5,
    });
  };
  setCount100 = () => {
    this.setState({
      count: 100,
    });
  };
  setCount20 = () => {
    this.setState({
      count: 20,
    });
  };

  setCount200 = () => {
    this.setState({
      count: 200,
    });
  };

  toggleEmptyRows() {
    this.setState({
      showEmptyRows: !this.state.showEmptyRows,
    });
  }

  decreaseCount = e => {
    e.preventDefault();
    this.setState({
      count: this.state.count - 10,
    });
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

  increaseRowHeight = () => {
    this.setState({
      rowHeight: this.state.rowHeight + 5,
    });
  };

  render() {
    return (
      <div style={{}}>
        <button
          onClick={() => {
            this.setState({
              list: false,
            });
          }}
        >
          hide
        </button>
        Current count: {this.state.count}.
        <button onClick={this.updateRenderRow}>update renderRow</button>
        <button onMouseDown={this.increaseRowHeight}>
          increase row height
        </button>
        <button onMouseDown={this.increaseCount}>increase count</button>
        <button onMouseDown={this.decreaseCount}>decrease count</button>
        <button onMouseDown={this.setCount5}>set count 5</button>
        <button onMouseDown={this.setCount10}>set count 10</button>
        <button onMouseDown={this.setCount20}>set count 20</button>
        <button onMouseDown={this.setCount100}>set count 100</button>
        <button onMouseDown={this.setCount200}>set count 200</button>
        <button onMouseDown={this.toggleEmptyRows}>toggle empty rows</button>
        <button onMouseDown={this.toggleRtl}>toggleRtl</button>
        <button onMouseDown={this.toggleNativeScroll}>
          toggleNativeScroll
        </button>
        <button
          onClick={this.scrollToEnd}
          onClick={() => (list.scrollTop = 10000000000)}
        >
          scrolltoend
        </button>
        <button
          onClick={() => {
            this.setState({
              x: parseInt(Math.random() * 10) + 20,
              renderRow: this.renderRow.bind(this),
            });
          }}
        >
          refresh
        </button>
        <input />
        {this.state.list ? (
          <List
            tabIndex={5}
            ref={c => {
              window.list = c;
            }}
            preventRtlInherit={this.state.preventRtlInherit}
            rowContain
            nativeScroll={this.state.nativeScroll}
            rtl={this.state.rtl}
            showEmptyRows
            style={this.listStyle}
            count={this.state.count}
            renderRow={this.state.renderRow}
            minRowWidth={1505}
            minRowHeight={20}
            naturalRowHeight
            rowHeightManager={rowHeightManager1}
            showEmptyRows={this.state.showEmptyRows}
          />
        ) : null}
        <input />
      </div>
    );
  }
}

render(<App />, document.querySelector('#content'));
