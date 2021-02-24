/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Menu from '../Menu';
import Expander from '../Expander';

import { mount, shallow } from 'enzyme';

describe('expander', () => {
  it('should render expander if an item has items', () => {
    const items = [
      {
        label: 'test',
        items: [{ label: 'submenuItem' }],
      },
    ];
    const wrapper = mount(<Menu items={items} />);
    expect(wrapper.find(Expander).length).toBe(1);
  });

  it('custom render from expander', () => {
    const items = [
      {
        label: 'test',
        items: [{ label: 'submenuItem' }],
      },
    ];
    const wrapper = mount(
      <Menu
        items={items}
        expander={() => <div id="customExpander">Hello world</div>}
      />
    );

    expect(wrapper.find(Expander).length).toBe(0);
    expect(wrapper.find('#customExpander').length).toBe(1);
  });
});
