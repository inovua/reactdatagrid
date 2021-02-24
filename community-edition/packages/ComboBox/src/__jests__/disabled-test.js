/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import Combo from '../ComboBox';
import TextInput from '../TextInput';

const dataSource = [
  {
    label: 'test',
    id: 1,
  },
  {
    label: 'test2',
    id: 2,
  },
];

describe('disabled', () => {
  it('activeItem cannot change', () => {
    const onActiveItemChange = jest.fn();
    const wrapper = shallow(
      <Combo
        dataSource={dataSource}
        defaultActiveItem={1}
        disabled
        onActiveItemChange={onActiveItemChange}
      />
    );
    const instance = wrapper.instance();
    expect(instance.getActiveItem()).toEqual(1);
    instance.setActiveItem(2);
    expect(instance.getActiveItem()).toEqual(1);
    expect(onActiveItemChange.mock.calls.length).toBe(0);
  });
  it('search input is not rendered', () => {
    const wrapper = mount(<Combo searchable disabled />);
    expect(wrapper.find(TextInput)).toHaveLength(0);
  });
  it('activetag cannot change', () => {
    const onActiveTagChange = jest.fn();
    const wrapper = shallow(
      <Combo
        dataSource={dataSource}
        defaultActiveTag={1}
        disabled
        onActiveTagChange={onActiveTagChange}
      />
    );
    const instance = wrapper.instance();
    expect(instance.getActiveTag()).toEqual(1);
    instance.setActiveTag(2);
    expect(instance.getActiveTag()).toEqual(1);
    expect(onActiveTagChange.mock.calls.length).toBe(0);
  });
  it('value cannot be changed', () => {
    const onChange = jest.fn();
    const wrapper = shallow(
      <Combo
        dataSource={dataSource}
        defaultValue={1}
        disabled
        onChange={onChange}
      />
    );
    const instance = wrapper.instance();
    expect(instance.getValue()).toEqual(1);
    instance.setValue(2);
    expect(instance.getValue()).toEqual(1);
    expect(onChange.mock.calls.length).toBe(0);
  });
  it('expanded cannot be changed', () => {
    const onExpandedChange = jest.fn();
    const wrapper = shallow(
      <Combo
        dataSource={dataSource}
        defaultExpanded
        disabled
        onExpandedChange={onExpandedChange}
      />
    );
    const instance = wrapper.instance();
    expect(instance.getExpanded()).toBe(true);
    instance.setExpanded(false);
    expect(instance.getExpanded()).toBe(true);
    expect(onExpandedChange.mock.calls.length).toBe(0);
  });
});
