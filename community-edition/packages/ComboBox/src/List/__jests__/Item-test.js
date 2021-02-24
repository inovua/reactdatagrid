/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import Item from '../Item';

describe('Item', () => {
  it('calls onclick with id', () => {
    const onClick = jest.fn();
    const wrapper = mount(<Item className="item" id={20} onClick={onClick} />);
    wrapper
      .find('.item')
      .at(0)
      .simulate('click');
    expect(onClick.mock.calls.length).toBe(1);
    expect(onClick.mock.calls[0][0]).toEqual(20);
  });

  describe('selectedClassName and selectedStyle', () => {
    it('adds className and style only on selected items', () => {
      const wrapper = mount(
        <Item
          selected
          selectedClassName="selected"
          rootClassName="root"
          selectedStyle={{ color: 'red' }}
        />
      );
      expect(wrapper.find('.root--selected')).toHaveLength(1);
      expect(
        wrapper
          .find('.root--selected')
          .at(0)
          .props().style.color
      ).toEqual('red');
    });
  });

  describe('className', () => {
    it('adds correct state classnames and style', () => {
      const wrapper = mount(<Item active rootClassName="root" />);
      expect(wrapper.find('.root--active')).toHaveLength(1);
    });
  });

  describe('disabled', () => {
    it('adds correct className', () => {
      const wrapper = mount(
        <Item item={{ disabled: true }} rootClassName="root" />
      );
      expect(wrapper.find('.root--disabled')).toHaveLength(1);
    });

    it("does't call onClick", () => {
      const onClick = jest.fn();
      const wrapper = mount(
        <Item item={{ disabled: true }} onClick={onClick} />
      );
      wrapper.simulate('click');
      expect(onClick.mock.calls.length).toBe(0);
    });
  });
});
