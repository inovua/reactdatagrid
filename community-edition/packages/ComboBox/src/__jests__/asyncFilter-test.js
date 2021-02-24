/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import Combo from '../ComboBox';

xdescribe('loadAsyncDataSource', () => {
  it('it is called list expands', done => {
    const loadAsyncDataSource = jest.fn();
    const wrapper = shallow(
      <Combo
        defaultExpanded={false}
        loadAsyncDataSource={loadAsyncDataSource}
      />
    );
    wrapper.instance().expand();
    setTimeout(() => {
      expect(loadAsyncDataSource.mock.calls.length).toBe(1);
      done();
    }, 10);
  });
  it('is called when length of text is more than filterMinLength', done => {
    const loadAsyncDataSource = jest.fn();
    const wrapper = shallow(
      <Combo
        defaultText={''}
        filterMinLength={3}
        loadAsyncDataSource={loadAsyncDataSource}
      />
    );
    expect(loadAsyncDataSource.mock.calls.length).toBe(0);
    wrapper.instance().setText('12');
    expect(loadAsyncDataSource.mock.calls.length).toBe(0);
    wrapper.instance().setText('123');
    setTimeout(() => {
      expect(loadAsyncDataSource.mock.calls.length).toBe(1);
      done();
    }, 100);
  });
  it('replaces datasource when called', () => {
    const data = [{ id: 'hello world' }];
    const wrapper = shallow(<Combo loadAsyncDataSource={() => data} />);
    expect(wrapper.instance().getData()).toBe(null);
    wrapper.instance().loadAsyncDataSource({ action: 'fake' });
    expect(wrapper.instance().getData()).toEqual(data);
  });
});
