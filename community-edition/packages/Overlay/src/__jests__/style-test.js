/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import Overlay from '../Overlay';

describe('style and classnames', () => {
  describe('border', () => {
    it('should add border on outer wrapper', () => {
      const wrapper = mount(<Overlay border="1px solid red" />);
      expect(
        wrapper
          .find('.inovua-react-toolkit-overlay')
          .at(0)
          .props().style.border
      ).toEqual('1px solid red');
    });
  });
  describe('height', () => {
    xit('should be added on inline style', () => {
      const wrapper = mount(<Overlay height={100} />);

      expect(
        wrapper
          .find('.inovua-react-toolkit-overlay')
          .at(0)
          .props().height
      ).toEqual(100);
    });
  });
  describe('width', () => {
    xit('should be added on inline style', () => {
      const wrapper = mount(<Overlay width={100} />);
      expect(
        wrapper
          .find('.inovua-react-toolkit-overlay')
          .at(0)
          .props().width
      ).toEqual(100);
    });
  });
});
