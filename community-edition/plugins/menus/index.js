/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import useMenus, { renderColumnContextMenu, renderRowContextMenu, } from './useMenus';
export default {
    name: 'menus',
    hook: useMenus,
    renderColumnContextMenu,
    renderRowContextMenu,
    defaultProps: () => {
        return {
            showColumnMenuTool: true,
        };
    },
};
