/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount, shallow } from 'enzyme';
import Combo from '../ComboBox';
import List from '../List';

describe('expanded/collapse', () => {
  describe('controled', () => {
    it('should be used insted of state', () => {
      const wrapper = shallow(<Combo defaultExpanded={false} expanded />);
      expect(wrapper.instance().getExpanded()).toBe(true);
    });
    it("doesn't change when a change is triggered", () => {
      const wrapper = shallow(<Combo defaultExpanded={false} expanded />);
      wrapper.instance().setExpanded(false);
      expect(wrapper.instance().getExpanded()).toBe(true);
      // state should not be changed
      expect(wrapper.state().expanded).toBe(false);
    });
  });

  describe('uncontroled', () => {
    it('changes state when changeExpanded is called', () => {
      const wrapper = shallow(<Combo defaultExpanded={false} />);
      expect(wrapper.instance().getExpanded()).toBe(false);
      wrapper.instance().setExpanded(true);
      expect(wrapper.instance().getExpanded()).toBe(true);
    });
  });

  describe('onExpandedChange', () => {
    it('is called when expanded changes', () => {
      const onExpandedChange = jest.fn();
      const wrapper = shallow(<Combo onExpandedChange={onExpandedChange} />);
      expect(onExpandedChange.mock.calls.length).toBe(0);
      wrapper.instance().setExpanded(true);
      expect(onExpandedChange.mock.calls.length).toBe(1);
    });
  });

  describe('list', () => {
    it('renders only when expanded is true', () => {
      const wrapper = mount(<Combo expanded />);
      expect(wrapper.find(List)).toHaveLength(1);
      wrapper.setProps({ expanded: false });
      expect(wrapper.find(List)).toHaveLength(0);
    });
  });

  describe('expandOnClick', () => {
    it('changes expanded from false to true when combo is clicked', () => {
      const wrapper = mount(<Combo defaultExpanded={false} />);
      expect(wrapper.find(List)).toHaveLength(0);
      wrapper.simulate('click');
      expect(wrapper.find(List)).toHaveLength(1);
    });
  });

  describe('collapseOnEscape', () => {
    it('changes expanded from false to true when combo is clicked', () => {
      const wrapper = mount(<Combo defaultExpanded />);
      expect(wrapper.find(List)).toHaveLength(1);
      wrapper.simulate('keyDown', { key: 'Escape' });
      expect(wrapper.find(List)).toHaveLength(0);
    });
  });

  describe('onCollapse', () => {
    it('is called when exapnded changes from true to false', () => {
      const onCollapse = jest.fn();
      const wrapper = mount(<Combo onCollapse={onCollapse} defaultExpanded />);
      wrapper.instance().collapse();
      expect(onCollapse.mock.calls.length).toBe(1);
    });
  });

  describe('onExpand', () => {
    it('is called when exapnded changes from true to false', () => {
      const onExpand = jest.fn();
      const wrapper = mount(
        <Combo onExpand={onExpand} defaultExpanded={false} />
      );
      wrapper.instance().expand();
      expect(onExpand.mock.calls.length).toBe(1);
    });
  });

  describe('expandOnTextChange', () => {
    xit('expands list when text is changed by input', done => {
      const wrapper = mount(<Combo defaultExpanded={false} />);
      expect(wrapper.find(List)).toHaveLength(0);
      wrapper.instance().handleTextChange('hello');
      setTimeout(() => {
        expect(wrapper.find(List)).toHaveLength(1);
        done();
      }, 10);
    });
  });

  describe('ArrowUp and ArrowDown', () => {
    it('expands list if collapseed', () => {
      const wrapper = shallow(<Combo defaultExpanded={false} />);
      wrapper.instance().navigateToNextItem();
      expect(wrapper.instance().getExpanded()).toBe(true);
    });
  });

  describe('collapseOnSelectWithEnter', () => {
    it('collapses when there is an active item selected, list is expanded', () => {
      const wrapper = shallow(
        <Combo
          collapseOnSelectWithEnter
          enableListNavigation
          defaultExpanded
          enableNavigation
          multiple={false}
          defaultActiveItem={1}
          dataSource={[{ id: 1 }]}
        />
      );
      wrapper.simulate('keyDown', { key: 'Enter' });
      expect(wrapper.instance().getExpanded()).toBe(false);
    });
  });
});
