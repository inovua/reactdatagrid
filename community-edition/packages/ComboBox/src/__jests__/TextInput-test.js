/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import TextInput from '../TextInput';

describe('TextInput', () => {
  describe('placeholder', () => {
    it('should be rendered when there is no value', () => {
      const wrapper = mount(
        <TextInput placeholder={<div id="placeholder"> Hello world </div>} />
      );

      expect(wrapper.find('#placeholder')).toHaveLength(1);
      wrapper.setProps({ value: 30 });
      expect(wrapper.find('#placeholder')).toHaveLength(0);
    });
  });

  describe('throttle', () => {
    xit('calls onChange after throttle ms', () => {
      const clock = jest.useFakeTimers();
      const onChange = jest.fn();
      const wrapper = mount(
        <TextInput throttle={300} value={'hello world'} onChange={onChange} />
      );
      expect(onChange.mock.calls.length).toBe(0);
      wrapper.instance().handleChange({
        target: {
          value: 'hello',
        },
      });
      expect(onChange.mock.calls.length).toBe(0);
      clock.tick(300);
      expect(onChange.mock.calls.length).toBe(1);
      clock.restore();
    });
  });
});
