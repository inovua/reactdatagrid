/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Menu from '../Menu';
import MenuItem from '../MenuItem';
import { mount, shallow } from 'enzyme';
import getSubMenu from '../utils/getSubMenu';

describe('click events', () => {
  describe('onClick', () => {
    it('should work on direct children', () => {
      const items = [{ label: 'test' }];
      const onClick = jest.fn();
      const wrapper = mount(<Menu onClick={onClick} items={items} />);

      wrapper
        .find(MenuItem)
        .first()
        .simulate('click');

      expect(onClick).toHaveBeenCalled();
      expect(onClick.mock.calls[0].length).toBe(3);
      expect(onClick.mock.calls[0][1].index).toBe(0);
    });

    xit('should not be called when a submenu item had been clicked', () => {
      const items = [{ label: 'test', items: [{ label: 'submenu item' }] }];
      const onClick = jest.fn();
      const wrapper = mount(<Menu items={items} onClick={onClick} />);

      wrapper
        .find(MenuItem)
        .first()
        .simulate('mouseEnter');

      const subMenu = getSubMenu(wrapper);

      expect(subMenu).to.exist;
      subMenu.find(MenuItem).simulate('click');

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('onChildClick', () => {
    xit('should be called only from items from submenus', () => {
      const items = [{ label: 'test', items: [{ label: 'submenu item' }] }];
      const onClick = jest.fn();
      const onChildClick = jest.fn();
      const wrapper = mount(
        <Menu items={items} onClick={onClick} onChildClick={onChildClick} />
      );

      wrapper
        .find(MenuItem)
        .first()
        .simulate('mouseEnter');

      const subMenu = getSubMenu(wrapper);

      expect(subMenu).to.exist;
      subMenu.find(MenuItem).simulate('click');

      expect(onClick).not.toHaveBeenCalled();
      expect(onChildClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('item.onClick', () => {
    it('should be called', () => {
      const onClick = jest.fn();
      const items = [{ label: 'test', onClick }];
      const wrapper = mount(<Menu items={items} />);
      wrapper
        .find(MenuItem)
        .first()
        .simulate('click');
      expect(onClick).toHaveBeenCalled();
    });
  });
});
