/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Button from '../Button';
import { shallow } from 'enzyme';

describe('style', () => {
  it('adds pressedStyle when button is pressed', () => {
    const wrapper = shallow(
      <Button id="button" pressed pressedStyle={{ color: 'red' }} />
    );
    expect(wrapper.find('#button').props().style.color).toEqual('red');
  });
  it('adds focusedStyle when button is focused', () => {
    const wrapper = shallow(
      <Button id="button" pressed focusedStyle={{ color: 'red' }} />
    );
    wrapper.setState({ focused: true });
    expect(wrapper.find('#button').props().style.color).toEqual('red');
  });
  it('adds overStyle when button is over', () => {
    const wrapper = shallow(
      <Button id="button" pressed overStyle={{ color: 'red' }} />
    );
    wrapper.setState({ mouseOver: true });
    expect(wrapper.find('#button').props().style.color).toEqual('red');
  });
  it('adds activeStyle when button is active', () => {
    const wrapper = shallow(
      <Button id="button" pressed activeStyle={{ color: 'red' }} />
    );
    wrapper.setState({ active: true });
    expect(wrapper.find('#button').props().style.color).toEqual('red');
  });
});
