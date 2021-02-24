/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Style can come from 3 paces, and they overwrite one another:
 * - global cellStyle
 * - column cellStyle
 * - item cellStyle
 */
import React from 'react';
import Menu from '../Menu';
import MenuItemCell from '../MenuItem/MenuItemCell';
import { mount } from 'enzyme';

describe('cellStyle', () => {
  const cellStyle = {
    color: 'global color',
    background: 'global background',
    height: 0,
    width: 1,
    maxHeight: 2,
    maxWidth: 3,
  };

  // column overwrites color and max height
  const columnCellStyle = {
    color: 'column color',
    minWidth: 4,
    maxHeight: 5,
  };

  // item overwrites maxWidth
  const itemCellStyle = {
    maxWidth: 6,
  };

  const wrapper = mount(
    <Menu
      cellStyle={cellStyle}
      columns={[{ name: 'label', style: columnCellStyle }]}
      items={[
        {
          label: 'test',
          style: itemCellStyle,
        },
      ]}
    />
  );

  const test = wrapper
    .find(MenuItemCell)
    .first()
    .prop('style');

  it('width should come from cellStyle', () => {
    expect(test.width).toBe(cellStyle.width);
  });

  it('color should come from columnCellStyle', () => {
    expect(test.color).toBe(columnCellStyle.color);
  });

  it('maxWidth should come from item.style', () => {
    expect(test.maxWidth).toBe(cellStyle.maxWidth);
  });
});
