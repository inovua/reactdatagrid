/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import Menu from '../Menu';

describe('selected', () => {
  describe('renderCheckInput', () => {
    const items = [
      { name: 'name1', label: 'test1' },
      { name: 'name2', label: 'test3' },
      { name: 'name2', value: 'name3', label: 'test2' },
    ];

    it('renders a custom input', () => {
      const renderCheckInput = jest.fn(() => (
        <div className="customCheckInput" />
      ));
      const wrapper = mount(
        <Menu
          items={items}
          renderCheckInput={renderCheckInput}
          enableSelection
        />
      );
      expect(renderCheckInput).toHaveBeenCalled();
      expect(wrapper.find('.customCheckInput').length).toBe(1);
    });
    it('renders an input with mutated props', () => {
      const wrapper = mount(
        <Menu
          items={items}
          enableSelection
          renderCheckInput={({ domProps }) => {
            domProps.id = 'customCheckInput';
            domProps.className = 'customCheckInput';
          }}
        />
      );
      expect(wrapper.find('div#customCheckInput.customCheckInput').length).toBe(
        1
      );
    });
  });
  describe('renderRadioInput', () => {
    const items = [
      { name: 'name1', label: 'test1' },
      { name: 'name2', label: 'test3' },
      { name: 'name2', value: 'name3', label: 'test2' },
    ];

    it('renders a custom input', () => {
      const renderRadioInput = jest.fn(() => (
        <div className="customRadioInput" />
      ));

      const wrapper = mount(
        <Menu
          items={items}
          renderRadioInput={renderRadioInput}
          enableSelection
        />
      );
      expect(renderRadioInput).toHaveBeenCalled();
      expect(wrapper.find('div.customRadioInput').length).toBe(2);
    });
    it('renders with mutated props', () => {
      const wrapper = mount(
        <Menu
          items={items}
          renderRadioInput={({ domProps }) => {
            domProps.className = 'customRadioInput';
          }}
          enableSelection
        />
      );
      expect(wrapper.find('div.customRadioInput').length).toBe(2);
    });
  });
});
