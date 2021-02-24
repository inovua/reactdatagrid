/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import Overlay from '../Overlay';

describe('visible', () => {
  it('renders correct className', () => {
    const wrapper = shallow(<Overlay visible />);
    expect(wrapper.find('.inovua-react-toolkit-overlay--visible')).toHaveLength(
      1
    );
    wrapper.setProps({ visible: false });
    expect(wrapper.find('.inovua-react-toolkit-overlay--visible')).toHaveLength(
      0
    );
  });
  it('controlled visible is not changed by setVisible', () => {
    const wrapper = shallow(<Overlay visible />);
    expect(wrapper.instance().getVisible()).toBe(true);
    wrapper.instance().setVisible(false);
    expect(wrapper.instance().getVisible()).toBe(true);
  });
  it('calls onVisibleChange', () => {
    const onVisibleChange = jest.fn();
    const wrapper = shallow(<Overlay onVisibleChange={onVisibleChange} />);
    wrapper.instance().setVisible(true);
    expect(onVisibleChange).toHaveBeenCalled();
  });
  it('visible state changes when uncontrolled', () => {
    const wrapper = shallow(<Overlay />);
    wrapper.instance().setVisible(true);
    expect(wrapper.instance().getVisible()).toBe(true);
  });
  it('defaultVisible it is used as initial uncontrolled value', () => {
    const wrapper = shallow(<Overlay defaultVisible />);
    expect(wrapper.instance().getVisible()).toBe(true);
    wrapper.instance().setVisible(false);
    expect(wrapper.instance().getVisible()).toBe(false);
  });
});
