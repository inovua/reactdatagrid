/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Menu, { CLASS_NAME } from '../Menu';
import MenuItem from '../MenuItem';
import Expander from '../Expander';
import { mount } from 'enzyme';

describe('props passed from items[0] to MenuItem', () => {
  describe('item.style', () => {
    it('item.style gets applied on tr', () => {
      const items = [{ label: 'test', style: { color: 'item color' } }];
      const wrapper = mount(<Menu items={items} />);
      expect(
        wrapper
          .find(MenuItem)
          .find('tr')
          .prop('style').color
      ).toBe(items[0].style.color);
    });

    // overwrite is already tested in cellStyle
    xit('item.overStyle is added on tr when menuitem receives mouseEnter', () => {
      const items = [{ label: 'test', overStyle: { color: 'over color' } }];
      const wrapper = mount(<Menu items={items} />);
      const menuItem = wrapper
        .find(MenuItem)
        .first()
        .find('tr');
      expect(menuItem.prop('style').color).to.not.equal(
        items[0].overStyle.color
      );
      menuItem.simulate('mouseEnter');
      expect(menuItem.prop('style').color).toBe(items[0].overStyle.color);
    });

    xit('item.overClassName is added on tr when menuitem receives mouseEnter', () => {
      const items = [{ label: 'test', overClassName: 'over-className' }];
      const wrapper = mount(<Menu items={items} />);
      const menuItem = wrapper
        .find(MenuItem)
        .first()
        .find('tr');
      expect(menuItem.prop('className')).to.not.contain('over-className');
      menuItem.simulate('mouseEnter');
      expect(menuItem.prop('className')).to.contain('over-className');
    });

    xit('item.overStyle global.overStyle', () => {
      const items = [{ label: 'test', overStyle: { color: '#123456' } }];
      const wrapper = mount(
        <Menu
          overStyle={{ color: '#12345' }}
          xitemStyle={{ color: 'red' }}
          items={items}
        />
      );
      const menuItem = wrapper.find(MenuItem).first();

      menuItem.simulate('mouseEnter');
      expect(menuItem.find('tr').props().style.color).toBe(
        items[0].overStyle.color
      );
    });

    xit('item.disabled is added on tr if item.disabled is true', () => {
      const items = [
        {
          label: 'test',
          disabled: true,
          disabledStyle: { color: 'disabled color' },
        },
      ];
      const wrapper = mount(<Menu items={items} />);
      const menuItem = wrapper
        .find(MenuItem)
        .first()
        .find('tr');
      expect(menuItem.prop('style').color).not.toBeGreaterThan(
        items[0].disabled.color
      );
    });

    xit('item.disabledStyle global.disabledStyle', () => {
      const items = [
        {
          label: 'test',
          disabled: true,
          disabledStyle: { color: 'over color' },
        },
      ];
      const wrapper = mount(
        <Menu disabledStyle={{ color: 'global over color' }} items={items} />
      );
      const menuItem = wrapper
        .find(MenuItem)
        .first()
        .find('tr');

      menuItem.simulate('mouseEnter');
      expect(menuItem.prop('style').color).toBe(items[0].disabledStyle.color);
    });

    it('item.cellStyle is added on td', () => {
      const items = [{ label: 'test', cellStyle: { color: 'cell color' } }];
      const wrapper = mount(<Menu items={items} />);
      expect(
        wrapper
          .find(MenuItem)
          .first()
          .find('td')
          .first()
          .prop('style').color
      ).toBe(items[0].cellStyle.color);
    });

    it('item.expanderStyle style should be aplied on expander', () => {
      const items = [
        {
          label: 'test',
          expanderStyle: { color: 'expander color' },
          items: [{ label: 'test1' }],
        },
      ];
      const wrapper = mount(<Menu items={items} />);
      expect(wrapper.find(Expander).prop('style').color).toBe(
        items[0].expanderStyle.color
      );
    });

    xit('should apply submenuMaxHeight property', () => {
      const items = [
        { label: 'main menu', items: [{ label: 'submenu item' }] },
      ];
      const wrapper = mount(<Menu items={items} submenuMaxHeight={77} />);

      wrapper
        .find(MenuItem)
        .first()
        .simulate('mouseEnter');

      const menu = wrapper.find(Menu).at(1);
      expect(menu.props().maxHeight).toBe(77);
      //testing the rendered html
      expect(menu.html().indexOf('max-height: 77px')).not.toBe(-1);
    });
  });

  describe('item.expander', () => {
    it('should render custom expander', () => {
      const items = [
        {
          label: 'test',
          expander() {
            return <div id="itemExpander" />;
          },
          items: [{ label: 'test 2' }],
        },
      ];
      const wrapper = mount(<Menu items={items} />);
      expect(wrapper.find('#itemExpander').length).toBe(1);
    });
    it('item.expander should overwrite global expander prop', () => {
      const items = [
        {
          label: 'test',
          expander() {
            return <div id="itemExpander" />;
          },
          items: [{ label: 'test 2' }],
        },
      ];
      const wrapper = mount(
        <Menu items={items} expander={() => <div id="globalExapnder" />} />
      );

      expect(wrapper.find('#itemExpander').length).toBe(1);
    });
  });
});
