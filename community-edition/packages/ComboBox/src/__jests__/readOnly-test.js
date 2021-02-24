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

describe('readOnly', () => {
  it('value cannot be changed', () => {
    const onChange = jest.fn();
    const wrapper = shallow(
      <Combo
        dataSource={dataSource}
        defaultValue={1}
        readOnly
        onChange={onChange}
      />
    );
    const instance = wrapper.instance();
    expect(instance.getValue()).toEqual(1);
    instance.setValue(2);
    expect(instance.getValue()).toEqual(1);
    expect(onChange.mock.calls.length).toBe(0);
  });
});
