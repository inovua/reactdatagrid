/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Menu from './Menu';

import MenuItem from './MenuItem';
import MenuItemCell from './MenuItem/MenuItemCell';
import MenuSeparator from './MenuSeparator';

export default Menu;

Menu.Item = MenuItem;
Menu.Item.Cell = MenuItemCell;
MenuItem.Cell = MenuItemCell;

export {
  MenuItem as Item,
  MenuItemCell as Cell,
  MenuItemCell as ItemCell,
  MenuSeparator as Separator,
};
