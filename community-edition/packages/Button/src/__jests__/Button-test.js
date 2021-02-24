/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Button from '../Button';
import { shallow } from 'enzyme';

describe('Button', () => {
  it('onClick is called when button is clicked', () => {
    const onClick = jest.fn();
    const wrapper = shallow(<Button onClick={onClick} />);
    wrapper.simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  it('toggles between pressed true and false onclick when pressed has value', () => {
    const onToggle = jest.fn();
    const wrapper = shallow(
      <Button onToggle={onToggle} defaultPressed={false} />
    );
    expect(wrapper.instance().isPressed()).toBe(false);
    wrapper.simulate('click');
    expect(wrapper.instance().isPressed()).toBe(true);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
  it('onActivate is called when the button receives mouse down', () => {
    const onActivate = jest.fn();
    const wrapper = shallow(<Button onActivate={onActivate} />);
    wrapper.simulate('mouseDown');
    expect(onActivate).toHaveBeenCalledTimes(1);
  });
  it('onDeactivate is called whe button is active and registeres a mouseUp on global', () => {
    const mouseupEvent = new CustomEvent('mouseup', { bubbles: true });
    const onDeactivate = jest.fn();
    const wrapper = shallow(<Button onDeactivate={onDeactivate} />);
    wrapper.simulate('mouseDown');
    global.dispatchEvent(mouseupEvent);
    expect(onDeactivate).toHaveBeenCalledTimes(1);
  });
  it('style is applied on buton', () => {
    const wrapper = shallow(<Button id="button" style={{ color: 'red' }} />);
    expect(wrapper.find('#button').props().style.color).toEqual('red');
  });
  it('calls style if a function and applies the style on button', () => {
    const wrapper = shallow(
      <Button id="button" style={() => ({ color: 'red' })} />
    );
    expect(wrapper.find('#button').props().style.color).toEqual('red');
  });
});
