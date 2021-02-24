/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';

import '../../style/index.scss';
import './index.scss';
import countries from './countries';

import InovuaComboBox from '../../src/ComboBox';
import NumericInput from '../../../NumericInput';
import TextInput from '../../../TextInput';
import CheckBox from '../../../CheckBox';
import '../../../CheckBox/style/index.scss';
import '../../../NumericInput/style/index.scss';
import '../../../TextInput/style/index.scss';
import { setTimeout } from 'timers';

const themes = ['default', 'amber-800', 'green-800', 'red-800'].map(
  (name, index) => {
    return {
      label: name,
      id: index,
    };
  }
);

const testDataSource = [
  { id: 'test', label: 'a very long text comes in here that will cause' },
  { id: 'test2', label: 'text2' },
  { id: 'test3', label: 'text3' },
  { id: 7, label: 'seven' },
  { id: true, label: 'true' },
  { id: false, label: 'false' },
];

const namedCountries = countries.map(c => ({
  id: c.id,
  name: c.label,
}));
const colors = countries;

let expands = 0;

function renderItem({ domProps, item, data, index }) {
  return (
    <div {...domProps}>
      {item.id} - {domProps.children}
    </div>
  );
}
const renderScroller = props => {
  delete props.tabIndex;
  return <div {...props} />;
};

class Demo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      theme: 'default',
      maxTags: 3,
      text: '',
      index: 1,
      dataSource: colors,
      item: 'test',
      searchable: true,
      comboValue: 'RO',
      expanded: true,
      comboBoxValue: 'Algeria',
    };
    this.loadLazyDataSource = this.loadLazyDataSource.bind(this);
  }
  loadLazyDataSource({ text }) {
    console.warn('load@', text);
    const lowerText = text ? (text = text.toLowerCase()) : '';
    const filteredCountries = lowerText
      ? countries.filter(
          country => country.label.toLowerCase().indexOf(lowerText) != -1
        )
      : countries;

    return new Promise(resolve => {
      setTimeout(() => resolve(filteredCountries), 350);
    });
  }

  render() {
    return (
      <div
        className="master_wrapper"
        style={{
          height: '50vh',

          paddingTop: 100,
        }}
      >
        <div style={{ marginBottom: 30 }}>
          <button
            onClick={() =>
              this.setState({
                loading: !this.state.loading,
              })
            }
          >
            toggle loading
          </button>
          <InovuaComboBox
            style={{ width: 150 }}
            multiple
            itemEllipsis
            dataSource={countries}
            value={this.state.comboBoxValue}
            loading={this.state.loading}
            onChange={comboBoxValue =>
              this.setState({ index: this.state.index + 1, comboBoxValue })
            }
          />
        </div>
        <div style={{ transform: 'translate3d(0px, 0px, 0px)' }}>
          <div
            style={{
              border: '1px solid red',
              paddingTop: 500,
              paddingBottom: 200,
              width: 600,
              overflow: 'hidden',
            }}
          >
            <InovuaComboBox
              collapseOnSelect
              constrainTo={node => node.parentNode}
              displayProperty="label"
              style={{ width: 400 }}
              positions={['top', 'bottom']}
              dataSource={countries}
            />
          </div>
        </div>
        <input
          type="checkbox"
          checked={this.state.searchable}
          onChange={ev => this.setState({ searchable: ev.target.checked })}
        />
        searchable
        <br />
        <InovuaComboBox
          collapseOnSelect
          changeValueOnNavigation
          onChange={value => {
            this.setState({
              theme: value,
            });
          }}
          placeholder="AAA"
          defaultValue={null}
          dataSource={themes}
        />
        <br />
        <button
          onClick={() => {
            this.setState({
              dataSource: () =>
                new Promise(resolve => {
                  setTimeout(() => resolve(countries), 3000);
                }),
            });
          }}
        >
          load data source
        </button>
        <br />
        <br />
        <div
          id="constrain"
          style={{ height: 300, border: '1px dashed gray', overflow: 'auto' }}
        >
          <div style={{ height: 140 }} />
          <InovuaComboBox
            rtl={false}
            constrainTo="#constrain"
            style={{ width: 'auto', position: 'relative' }}
            renderItem={({ domProps }) => {
              domProps.style = {
                ...domProps.style,
                display: 'flex',
                flexFlow: 'row',
                alignItems: 'center',
              };
            }}
            multiple
            placeholder="Enter Country"
            dataSource={this.state.dataSource}
          />
        </div>
      </div>
    );
  }
}
export default Demo;
