/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow, mount } from 'enzyme';

import List from '../List';

describe('List', () => {
  it('adds empty text', () => {
    const wrapper = shallow(
      <List data={[]} emptyText={<div id="emptyText" />} />
    );

    expect(wrapper.find('#emptyText')).toHaveLength(1);
  });
  it('adds loading text', () => {
    const wrapper = shallow(
      <List loading data={[]} loadingText={<div id="loadingtext" />} />
    );

    expect(wrapper.find('#loadingtext')).toHaveLength(1);
  });

  it('renders what renderHeader returns', () => {
    const wrapper = shallow(
      <List
        data={[]}
        emptyText={<div id="emptyText" />}
        renderHeader={() => <div id="customHeader" />}
      />
    );
    expect(wrapper.find('#customHeader')).toHaveLength(1);
  });

  it('renders what renderFooter returns', () => {
    const wrapper = shallow(
      <List
        data={[]}
        emptyText={<div id="emptyText" />}
        renderFooter={() => <div id="customFooter" />}
      />
    );
    expect(wrapper.find('#customFooter')).toHaveLength(1);
  });
});
