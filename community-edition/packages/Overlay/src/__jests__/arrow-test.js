/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';

import Overlay from '../Overlay';

describe('arrow', () => {
  describe('arrowStyle', () => {
    it('should be used as inline style', () => {
      const wrapper = mount(<Overlay arrowStyle={{ color: 'red' }} />);
      wrapper.setState({ arrowConfig: {} });
      expect(
        wrapper
          .find('.inovua-react-toolkit-overlay__arrow')
          .at(0)
          .props().style.color
      ).toEqual('red');
    });
  });
  describe('arrowClassName', () => {
    it('should be used as inline style', () => {
      const wrapper = mount(<Overlay arrowClassName="customArrow" />);
      wrapper.setState({ arrowConfig: {} });
      expect(wrapper.find('div.customArrow')).toHaveLength(1);
    });
  });
  describe('border', () => {
    it('should be added', () => {
      const wrapper = mount(<Overlay border="1px solid red" />);
      wrapper.setState({ arrowConfig: {} });
      expect(
        wrapper
          .find('.inovua-react-toolkit-overlay__arrow')
          .at(0)
          .props().style.border
      ).toEqual('1px solid red');
    });
  });
  describe('arrow', () => {
    it('should be rendered only if is true', () => {
      const wrapper = mount(<Overlay arrow border="1px solid red" />);
      wrapper.setState({ arrowConfig: {} });
      expect(
        wrapper.find('div.inovua-react-toolkit-overlay__arrow')
      ).toHaveLength(1);
      wrapper.setProps({ arrow: false });
      expect(wrapper.find('.inovua-react-toolkit-overlay__arrow')).toHaveLength(
        0
      );
    });
  });
  describe('arrowSize', () => {
    it('numeric sets both width and height to same value', () => {
      const wrapper = mount(<Overlay border="1px solid red" />);
      wrapper.setState({ arrowConfig: {} });

      wrapper.setProps({ arrowSize: 20 });
      expect(
        wrapper
          .find('.inovua-react-toolkit-overlay__arrow')
          .at(0)
          .props().size
      ).toEqual(20);
    });

    it('if object is applied on style', () => {
      const wrapper = mount(<Overlay border="1px solid red" />);
      wrapper.setState({ arrowConfig: {} });
      wrapper.setProps({ arrowSize: { width: 20, height: 30 } });
      expect(
        wrapper
          .find('.inovua-react-toolkit-overlay__arrow')
          .at(0)
          .props().size.width
      ).toEqual(20);
      expect(
        wrapper
          .find('.inovua-react-toolkit-overlay__arrow')
          .at(0)
          .props().size.height
      ).toEqual(30);
    });
  });
});
