/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { findDOMNode } from 'react-dom';
import getSubMenu from '../utils/getSubMenu';
import Menu from '../Menu';
import MenuItem from '../MenuItem';
import MenuSeparator from '../MenuSeparator';
import { mount, shallow } from 'enzyme';

import { render, simulateMouseEvent } from '../../../common/testUtils';

const ROOT_CLASS_NAME = Menu.defaultProps.rootClassName;

describe('items', () => {
  describe('menuProps', () => {
    it('should be supported on item object', done => {
      const items = [
        {
          country: 'USA',
          menuProps: {
            columns: ['city'],
            padding: 50,
          },
          items: [{ city: 'NY' }],
        },
      ];

      // NOTE: could not get submenu reference with enzyme, so fallback to pure React/DOM rendering
      const wrapper = render(<Menu items={items} columns={['country']} />);
      const dom = findDOMNode(wrapper);

      const cells = dom.querySelectorAll('td');

      simulateMouseEvent('mouseover', cells[0]);

      setTimeout(() => {
        const subMenu = dom.querySelector(`.${ROOT_CLASS_NAME}`);
        expect(subMenu.textContent).toBe('NY');
        expect(subMenu.style.padding).toBe('50px');
        wrapper.unmount();
        done();
      }, 150);
    });
  });
  describe('children length', () => {
    it('correct number of items', () => {
      const items = [
        { label: 'test' },
        { label: 'test2' },
        { label: 'test3' },
        { label: 'test4' },
        { label: 'test5' },
        { label: 'test6' },
        { label: 'test7' },
      ];

      const wrapper = shallow(<Menu items={items} />);
      expect(wrapper.find('tbody').children().length).toBe(items.length);
    });

    it('correct number of items with separator', () => {
      const items = [
        { label: 'test' },
        { label: 'test2' },
        { label: 'test3' },
        '-',
        { label: 'test4' },
        { label: 'test5' },
        { label: 'test6' },
        '-',
        { label: 'test7' },
      ];

      const wrapper = shallow(<Menu items={items} />);
      expect(wrapper.find('tbody').children().length).toBe(items.length);
    });
  });

  describe('separator', () => {
    it('1 should be rendered', () => {
      const items = ['-'];
      const wrapper = shallow(<Menu items={items} />);
      expect(wrapper.find(MenuSeparator).length).toBe(1);
    });
    it('separator should be rendered between items', () => {
      const items = [{ label: 'test1' }, '-', { label: 'test1' }, '-'];
      const wrapper = shallow(<Menu items={items} />);
      expect(wrapper.find(MenuSeparator).length).toBe(2);
    });
  });
});
