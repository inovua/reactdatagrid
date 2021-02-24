/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Menu from '../Menu';
import MenuItem from '../MenuItem';
import { mount } from 'enzyme';
import getSubMenu from '../utils/getSubMenu';
import { wrap } from 'module';

const ROOT_CLASS = Menu.defaultProps.rootClassName;

describe('keyboard navigation', () => {
  describe('className', () => {
    it('--focused className is applied to the focused item', () => {
      const items = [
        { label: 'test', items: [{ label: 'submenu item' }] },
        { label: 'test2' },
      ];
      const wrapper = mount(<Menu enableKeyboardNavigation items={items} />);

      wrapper.setState({ focusedItem: 0 });
      expect(
        wrapper
          .find(MenuItem)
          .first()
          .find('tr')
          .hasClass(`${ROOT_CLASS}__row--focused`)
      ).toBe(true);

      wrapper.setState({ focusedItem: 1 });
      expect(
        wrapper
          .find(MenuItem)
          .at(1)
          .find('tr')
          .hasClass(`${ROOT_CLASS}__row--focused`)
      ).toBe(true);

      wrapper.setState({ focusedItem: 0 });
      expect(
        wrapper
          .find(MenuItem)
          .first()
          .find('tr')
          .hasClass(`${ROOT_CLASS}__row--focused`)
      ).toBe(true);
    });
  });

  describe('navigation with arrows', () => {
    it('simple navigation', () => {
      const items = [
        {
          label: 'test',
          items: [{ label: 'submenu item' }],
        },
        { label: 'test2' },
        { label: 'test3' },
        { label: 'test5' },
        { label: 'test4' },
      ];
      const wrapper = mount(
        <Menu enableKeyboardNavigation defaultFocusedItem={0} items={items} />
      );

      // 1 down
      wrapper.simulate('keyDown', { key: 'ArrowDown' });
      expect(wrapper.state('focusedItem')).toBe(1);

      // 2 down
      wrapper.simulate('keyDown', { key: 'ArrowDown' });
      wrapper.simulate('keyDown', { key: 'ArrowDown' });
      expect(wrapper.state('focusedItem')).toBe(3);

      // 3 up
      wrapper.simulate('keyDown', { key: 'ArrowUp' });
      wrapper.simulate('keyDown', { key: 'ArrowUp' });
      wrapper.simulate('keyDown', { key: 'ArrowUp' });
      expect(wrapper.state('focusedItem')).toBe(0);
    });

    it('should not excede min limit - focusedItem cannot be < 0', () => {
      const items = [
        { label: 'test', items: [{ label: 'submenu item' }] },
        { label: 'test2' },
        { label: 'test2' },
        { label: 'test3' },
      ];
      const min = 0;
      const wrapper = mount(
        <Menu enableKeyboardNavigation defaultFocusedItem={0} items={items} />
      );

      wrapper.simulate('keyDown', { key: 'ArrowUp' });
      expect(wrapper.state('focusedItem')).toBe(min);

      wrapper.simulate('keyDown', { key: 'ArrowUp' });
      wrapper.simulate('keyDown', { key: 'ArrowUp' });
      expect(wrapper.state('focusedItem')).toBe(min);

      wrapper.simulate('keyDown', { key: 'ArrowUp' });
      wrapper.simulate('keyDown', { key: 'ArrowUp' });
      wrapper.simulate('keyDown', { key: 'ArrowUp' });
      expect(wrapper.state('focusedItem')).toBe(min);
    });

    it('should not excede max limit, focusedItem cannot be < items.length - 1', () => {
      const items = [
        { label: 'test', items: [{ label: 'submenu item' }] },
        { label: 'test2' },
        { label: 'test2' },
        { label: 'test3' },
      ];
      const max = items.length - 1;
      const wrapper = mount(
        <Menu enableKeyboardNavigation defaultFocusedItem={max} items={items} />
      );

      wrapper.simulate('keyDown', { key: 'ArrowDown' });
      expect(wrapper.state('focusedItem')).toBe(max);

      wrapper.simulate('keyDown', { key: 'ArrowDown' });
      wrapper.simulate('keyDown', { key: 'ArrowDown' });
      expect(wrapper.state('focusedItem')).toBe(max);

      wrapper.simulate('keyDown', { key: 'ArrowDown' });
      wrapper.simulate('keyDown', { key: 'ArrowDown' });
      wrapper.simulate('keyDown', { key: 'ArrowDown' });
      expect(wrapper.state('focusedItem')).toBe(max);
    });
  });

  describe('submenu', () => {
    let items;
    let wrapper;
    let submenu;

    beforeEach(() => {
      items = [
        {
          label: 'test',
          items: [
            { label: 'submenu item' },
            { label: 'submenu item 2' },
            { label: 'submenu item 3' },
          ],
        },
        { label: 'test2' },
      ];
      wrapper = mount(
        <Menu defaultFocusedItem={0} enableKeyboardNavigation items={items} />
      );

      // open submenu
      wrapper.simulate('keyDown', { key: 'ArrowRight' });

      // get a reference to submenu
      submenu = getSubMenu(wrapper);
    });

    afterEach(() => {
      wrapper.unmount();
    });

    it('should open on arrow right and close on left', () => {
      wrapper.simulate('keyDown', { key: 'ArrowLeft' });
      expect(getSubMenu(wrapper)).toBe(null);
    });

    it('should be navigable', () => {
      const items = [
        {
          label: 'test',
          items: [
            { label: 'submenu item' },
            { label: 'submenu item 2' },
            { label: 'submenu item 3' },
          ],
        },
        { label: 'test2' },
      ];

      const wrapper = mount(
        <Menu defaultFocusedItem={0} enableKeyboardNavigation items={items} />
      );

      wrapper.simulate('keyDown', { key: 'ArrowRight' });
      wrapper.simulate('keyDown', { key: 'ArrowRight' });
      const menuClass = 'inovua-react-toolkit-menu';
      const menuRowClass = 'inovua-react-toolkit-menu__row';
      // first item should be focused

      const menuItems = wrapper.find(`.${menuRowClass}`);

      expect(menuItems.at(0).props().className).toContain(
        `${menuRowClass}--focused`
      );

      // navigate arrow down
      wrapper.simulate('keyDown', { key: 'ArrowDown' });
      expect(
        wrapper
          .find(`.${menuRowClass}`)
          .at(0)
          .props().className
      ).not.toContain(`${menuRowClass}--focused`);
      expect(
        wrapper
          .find(`.${menuRowClass}`)
          .at(1)
          .props().className
      ).toContain(`${menuRowClass}--focused`);

      // navigate arrow up
      wrapper.simulate('keyDown', { key: 'ArrowUp' });
      expect(
        wrapper
          .find(`.${menuRowClass}`)
          .at(0)
          .props().className
      ).toContain(`${menuRowClass}--focused`);
      expect(
        wrapper
          .find(`.${menuRowClass}`)
          .at(1)
          .props().className
      ).not.toContain(`${menuRowClass}--focused`);
    });

    xit('should close itself on arrow left', () => {
      // shoud close it self on arrow left
      submenu.simulate('keyDown', { key: 'ArrowLeft' });
      submenu = getSubMenu(wrapper);
      expect(submenu).toBe(null);
    });

    xit('should close itself on arrow left, after it was navigated up and down', () => {
      // navigate
      submenu.simulate('keyDown', { key: 'ArrowDown' });
      submenu.simulate('keyDown', { key: 'ArrowUp' });

      // close
      submenu.simulate('keyDown', { key: 'ArrowLeft' });
      submenu = getSubMenu(wrapper);
      expect(submenu).toBe(null);
    });

    it('first item should have --focused className', () => {
      const items = [
        {
          label: 'test',
          items: [
            { label: 'submenu item' },
            { label: 'submenu item 2' },
            { label: 'submenu item 3' },
          ],
        },
        { label: 'test2' },
      ];
      const wrapper = mount(
        <Menu defaultFocusedItem={0} enableKeyboardNavigation items={items} />
      );
      expect(
        wrapper
          .find(MenuItem)
          .first()
          .find(`.${ROOT_CLASS}__row--focused`).length
      ).toBe(1);
    });

    xit('submenu opened with keyboard, is closed on mouseleave', done => {
      submenu.simulate('mouseEnter');
      submenu.simulate('mouseLeave');

      // needs to pass 100ms before it unmounts
      setTimeout(() => {
        // submenu should be null
        submenu = getSubMenu(wrapper);
        expect(submenu).toBe(null);

        done();
      }, 20);
    });

    xit(`
        - menu has focus, and a focusedItem
        - hover over a menu item
        - submenu opens
        - if arrow right is pressed on the same menu item, the first item should
        be focused
      `, () => {
      const items = [
        {
          label: 'test',
          items: [
            { label: 'submenu item' },
            { label: 'submenu item 2' },
            { label: 'submenu item 3' },
          ],
        },
        { label: 'test2' },
      ];
      const wrapper = mount(
        <Menu defaultFocusedItem={0} enableKeyboardNavigation items={items} />
      );

      // open by mouse enter
      wrapper
        .find(MenuItem)
        .first()
        .simulate('mouseEnter');
      submenu = getSubMenu(wrapper);

      expect(submenu).to.exist;

      // submenu should have focusedIndex null
      expect(submenu.get(0).state.focusedItem).toBe(null);

      // simulate open on same menu
      wrapper.simulate('keyDown', { key: 'ArrowRight' });
      expect(submenu.get(0).state.focusedItem).toBe(0);
    });
  });

  describe('rtl', () => {
    let items;
    let wrapper;
    let submenu;

    beforeEach(() => {
      items = [
        {
          label: 'test',
          items: [
            { label: 'submenu item' },
            { label: 'submenu item 2' },
            { label: 'submenu item 3' },
          ],
        },
        { label: 'test2' },
      ];
      wrapper = mount(
        <Menu
          rtl
          defaultFocusedItem={0}
          enableKeyboardNavigation
          items={items}
        />
      );

      // get a reference to submenu
      submenu = getSubMenu(wrapper);
    });

    xit('left opens and right closes submenu', () => {
      submenu = getSubMenu(wrapper);
      expect(submenu).toBe(null);

      wrapper.simulate('keyDown', { key: 'ArrowLeft' });
      submenu = getSubMenu(wrapper);
      expect(submenu).to.exist;

      submenu.simulate('keyDown', { key: 'ArrowRight' });
      submenu = getSubMenu(wrapper);
      expect(submenu).toBe(null);
    });
  });
});
