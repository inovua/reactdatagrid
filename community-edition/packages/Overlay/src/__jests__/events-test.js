/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';

import Overlay from '../Overlay';

describe('events', () => {
  it('onShow called when visibile changes to true', () => {
    const onShow = jest.fn();
    const wrapper = shallow(<Overlay onShow={onShow} defaultVisible={false} />);
    wrapper.instance().setVisible(true);
    expect(onShow.mock.calls.length).toBe(1);
  });
  it('onHide called when visibile changes to false', () => {
    const onHide = jest.fn();
    const wrapper = shallow(<Overlay onHide={onHide} defaultVisible />);
    wrapper.instance().setVisible(false);
    expect(onHide.mock.calls.length).toBe(1);
  });
  it('onVisibleChange is called whenever visibile changes, it is called with new state', () => {
    const onVisibleChange = jest.fn();
    const wrapper = shallow(
      <Overlay onVisibleChange={onVisibleChange} defaultVisible />
    );
    wrapper.instance().setVisible(false);
    expect(onVisibleChange.mock.calls.length).toBe(1);
    expect(onVisibleChange.mock.calls[0][0]).toBe(false);
  });
});
