/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';

import Combo from '../ComboBox';

describe('activeTag', () => {
  it('should work controlled and uncontrolled behaviour of active tag', () => {
    const onActiveTagChange = jest.fn();
    const wrapper = mount(
      <Combo defaultActiveTag={20} onActiveTagChange={onActiveTagChange} />
    );
    expect(wrapper.instance().getActiveTag()).toEqual(20);
    expect(onActiveTagChange.mock.calls).toHaveLength(0);
    wrapper.instance().setActiveTag(30);
    expect(onActiveTagChange.mock.calls).not.toHaveLength(0);
    expect(onActiveTagChange.mock.calls[0][0]).toEqual(30);
    expect(wrapper.instance().getActiveTag()).toEqual(30);
    wrapper.setProps({ activeTag: 25 });
    expect(wrapper.instance().getActiveTag()).toEqual(25);
    wrapper.instance().setActiveTag(30);
    expect(wrapper.instance().getActiveTag()).toEqual(25);
  });
});

describe('tagNavigation', () => {
  it('should update correct activeTag when arrowLeft and arrowRight are pressed', () => {
    const wrapper = mount(
      <Combo
        enableTagNavigation
        multiple
        defaultActiveTag={4}
        value={[1, 2, 3, 4, 5]}
      />
    );
    const instance = wrapper.instance();

    instance.navigateToNextTag(-1);
    expect(instance.getActiveTag()).toEqual(3);
    instance.navigateToNextTag(-1);
    expect(instance.getActiveTag()).toEqual(2);
    instance.navigateToNextTag(-1);
    expect(instance.getActiveTag()).toEqual(1);
    instance.navigateToNextTag(-1);
    expect(instance.getActiveTag()).toEqual(null);
    instance.navigateToNextTag(-1);
    expect(instance.getActiveTag()).toEqual(5);

    instance.setActiveTag(3);
    instance.navigateToNextTag(1);
    expect(instance.getActiveTag()).toEqual(4);
    instance.navigateToNextTag(1);
    expect(instance.getActiveTag()).toEqual(5);
    instance.navigateToNextTag(1);
    expect(instance.getActiveTag()).toEqual(null);
    instance.navigateToNextTag(1);
    expect(instance.getActiveTag()).toEqual(null);
  });
  it('should remove active tag when Escape is pressed and list is already closed', () => {
    const wrapper = mount(
      <Combo
        enableTagNavigation
        multiple
        expanded={false}
        defaultActiveTag={4}
        value={[1, 2, 3, 4, 5]}
      />
    );
    wrapper.simulate('keyDown', { key: 'Escape' });
    expect(wrapper.instance().getActiveTag()).toBe(null);
  });
});
