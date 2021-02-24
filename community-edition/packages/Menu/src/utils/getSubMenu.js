/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Menu from '../Menu';

/**
 * Give an wrapper instance from enzyme.mount
 * it will return it's submenu
 */
export default wrapper => {
  const subMenu = wrapper.find(Menu).reduce((acc, menu) => {
    if (menu.props().subMenu) {
      acc = menu;
    }

    return acc;
  }, null);

  return subMenu;
};
