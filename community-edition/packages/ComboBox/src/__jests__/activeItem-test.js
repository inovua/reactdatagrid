/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount, shallow } from 'enzyme';
import Combo from '../ComboBox';
import TextInput from '../TextInput';

describe('activeItem', () => {
  it('should work controlled and uncontrolled behaviour of active tag', () => {
    const onActiveItemChange = jest.fn();
    const wrapper = mount(
      <Combo defaultActiveItem={20} onActiveItemChange={onActiveItemChange} />
    );
    expect(wrapper.instance().getActiveItem()).toEqual(20);
    expect(onActiveItemChange.mock.calls.length).toBe(0);
    wrapper.instance().setActiveItem(30);
    expect(onActiveItemChange.mock.calls.length).not.toBe(0);
    expect(onActiveItemChange.mock.calls[0][0]).toEqual(30);
    expect(wrapper.instance().getActiveItem()).toEqual(30);
    wrapper.setProps({ activeItem: 25 });
    expect(wrapper.instance().getActiveItem()).toEqual(25);
    wrapper.instance().setActiveItem(30);
    expect(wrapper.instance().getActiveItem()).toEqual(25);
  });

  it('ArrowDown it should make first item active if the list is open and there is no active item', () => {
    const dataSource = [
      { id: 1, label: 'test1' },
      { id: 2, label: 'test2' },
      { id: 3, label: 'test3' },
    ];
    const wrapper = shallow(
      <Combo dataSource={dataSource} expanded defaultActiveItem={null} />
    );
    wrapper.simulate('keyDown', { key: 'ArrowDown' });
    expect(wrapper.instance().getActiveItem()).toEqual(1);
  });

  it('ArrowUp it should make first item active if the list is open and there is no active item', () => {
    const dataSource = [
      { id: 1, label: 'test1' },
      { id: 2, label: 'test2' },
      { id: 3, label: 'test3' },
    ];
    const wrapper = shallow(
      <Combo dataSource={dataSource} expanded defaultActiveItem={null} />
    );
    wrapper.simulate('keyDown', { key: 'ArrowUp' });
    expect(wrapper.instance().getActiveItem()).toEqual(3);
  });

  it('ArrowDown navigates to next item', () => {
    const dataSource = [
      { id: 1, label: 'test1' },
      { id: 2, label: 'test2' },
      { id: 3, label: 'test3' },
    ];
    const wrapper = shallow(
      <Combo dataSource={dataSource} expanded defaultActiveItem={1} />
    );
    wrapper.simulate('keyDown', { key: 'ArrowDown' });
    expect(wrapper.instance().getActiveItem()).toEqual(2);
  });

  it('ArrowUp navigates to previous item', () => {
    const dataSource = [
      { id: 1, label: 'test1' },
      { id: 2, label: 'test2' },
      { id: 3, label: 'test3' },
    ];
    const wrapper = shallow(
      <Combo dataSource={dataSource} expanded defaultActiveItem={2} />
    );
    wrapper.simulate('keyDown', { key: 'ArrowUp' });
    expect(wrapper.instance().getActiveItem()).toEqual(1);
  });

  it('highlightFirst selects first item when none is selected', () => {
    const dataSource = [
      { id: 1, label: 'test1' },
      { id: 2, label: 'test2' },
      { id: 3, label: 'test3' },
    ];
    const wrapper = shallow(
      <Combo dataSource={dataSource} expanded={false} highlightFirst={false} />
    );
    expect(wrapper.instance().getActiveItem()).toBe(null);
    wrapper.setProps({ expanded: true });
    expect(wrapper.instance().getActiveItem()).toBe(null);
    wrapper.setProps({ expanded: false, highlightFirst: true });
    expect(wrapper.instance().getActiveItem()).toBe(null);
    wrapper.setProps({ expanded: true });
    expect(wrapper.instance().getActiveItem()).toEqual(1);
  });

  it('selects the active item with Entery key press only when the list is expanded', () => {
    const dataSource = [
      { id: 1, label: 'test1' },
      { id: 2, label: 'test2' },
      { id: 3, label: 'test3' },
    ];
    const wrapper = shallow(
      <Combo dataSource={dataSource} expanded={false} activeItem={2} />
    );
    const instance = wrapper.instance();
    expect(instance.getValue()).toBe(null);
    wrapper.simulate('keyDown', { key: 'Enter' });
    expect(instance.getValue()).toBe(null);
    wrapper.setProps({ expanded: true });
    wrapper.simulate('keyDown', { key: 'Enter' });
    expect(instance.getValue()).toEqual(2);
  });
});
