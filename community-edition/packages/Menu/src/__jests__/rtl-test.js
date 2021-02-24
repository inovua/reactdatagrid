/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import Menu from '../Menu';
import Expander from '../Expander';

const ROOT_CLASS = Menu.defaultProps.rootClassName;

describe('rtl', () => {
  const items = [
    { label: 'test', items: [{ label: 'submenu item' }] },
    { label: 'test2' },
  ];
  const wrapper = mount(<Menu rtl items={items} />);

  it('rtl prop is passed to expender', () => {
    expect(wrapper.find(Expander).prop('rtl')).toBe(true);
  });

  it(`should have ${ROOT_CLASS}--rtl className`, () => {
    expect(
      wrapper
        .find(`.${ROOT_CLASS}`)
        .at(0)
        .hasClass(`${ROOT_CLASS}--rtl`)
    ).toBe(true);
  });
});
