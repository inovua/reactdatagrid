/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import VirtualList from '../index';
import { mount } from 'enzyme';

xdescribe('VirtualList', () => {
  it('should have correct className', () => {
    const renderRow = ({ index }) => {
      return <div key={index}>Row {index}.</div>;
    };

    const wrapper = mount(
      <VirtualList count={3} className="xyz" theme="q" renderRow={renderRow} />
    );

    const node = wrapper.find('.inovua-react-virtual-list');
    expect(node).to.have.lengthOf(1);

    expect(node.hasClass('xyz')).to.equal(true);
    expect(node.hasClass('inovua-react-virtual-list')).to.equal(true);
    expect(node.hasClass('inovua-react-virtual-list--theme-q')).to.equal(true);
    expect(node.hasClass('inovua-react-scroll-container--theme-q')).to.equal(
      true
    );
  });
});
