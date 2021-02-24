/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import Combo from '../ComboBox';
import List from '../List';

describe('listClassName', () => {
  it('passes listClassName to List as className', () => {
    const wrapper = shallow(
      <Combo dataSource={[]} expanded listClassName={'test'} />
    );
    expect(
      wrapper
        .find(List)
        .at(0)
        .props().className
    ).toEqual('test');
  });
});
