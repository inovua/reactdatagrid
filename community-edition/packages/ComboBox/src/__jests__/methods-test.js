/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import Combo from '../ComboBox';

describe('methods', () => {
  it('addItem appends at the end of the dataSource an item', () => {
    const wrapper = shallow(<Combo dataSource={[{ id: 1 }]} />);
    wrapper.instance().addItem({ id: 2 });
    expect(wrapper.instance().getData()).toEqual([{ id: 1 }, { id: 2 }]);
  });
  it('clear - clears value and text', () => {
    const wrapper = shallow(<Combo defaultText="hello" defaultValue={3} />);
    const instance = wrapper.instance();
    instance.clear();
    expect(instance.getText()).toBe(null);
    expect(instance.getValue()).toBe(null);
  });

  describe('getItem', () => {
    it('returns the correct item', () => {
      const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const wrapper = shallow(<Combo dataSource={data} idProperty="id" />);
      expect(wrapper.instance().getItem(2)).toEqual(data[1]);
    });
  });
  describe('getItemCount', () => {
    it('returns the correct item', () => {
      const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const wrapper = shallow(<Combo dataSource={data} idProperty="id" />);
      expect(wrapper.instance().getItemCount()).toEqual(3);
    });
  });
  describe('insertItem', () => {
    it('inserts an item at given index', () => {
      const data = [{ id: 1 }, { id: 3 }];
      const wrapper = shallow(<Combo dataSource={data} idProperty="id" />);
      wrapper.instance().insertItem({ index: 1, item: { id: 2 } });
      expect(wrapper.instance().getData()[1]).toEqual({ id: 2 });
    });
  });
  describe('removeItems', () => {
    it('removes items with given ids', () => {
      const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const wrapper = shallow(<Combo dataSource={data} idProperty="id" />);
      wrapper.instance().removeItems([1, 3]);
      expect(wrapper.instance().getData()).toEqual([{ id: 2 }]);
    });
  });
  describe('toggle', () => {
    it('toggles visibility', done => {
      const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const wrapper = shallow(
        <Combo defaultExpanded dataSource={data} idProperty="id" />
      );
      const instance = wrapper.instance();
      expect(instance.getExpanded()).toBe(true);
      expect(instance.toggle).not.toBe(undefined);
      instance.toggle();
      expect(instance.getExpanded()).toBe(false);
      instance.toggle();
      setTimeout(() => {
        expect(instance.getExpanded()).toBe(true);
        done();
      }, 10);
    });
  });
});
