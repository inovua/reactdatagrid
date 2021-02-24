/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Menu from '../Menu';
import { mount } from 'enzyme';
import '../../style/index.scss';

const ROOT_CLASS = Menu.defaultProps.rootClassName;

describe('autoFocus', () => {
  xit('it should have focus after it was rendered', done => {
    const component = mount(<Menu autoFocus items={[{ label: 'test' }]} />);

    expect(document.activeElement).toBe(<div />);
    expect(
      component
        .find('.inovua-react-toolkit-menu')
        .matchesElement(document.activeElement)
    ).toBe(true);
  });
});
