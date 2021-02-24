/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { findDOMNode } from 'react-dom';

import findHeaderCells from './findHeaderCells';

export default grid => {
  const headerCells = findHeaderCells(grid).map(findDOMNode);

  const hasSortIcon = headerCell => {
    const cls = 'InovuaReactDataGrid__sort-icon';
    const asc = !!headerCell.querySelector(
      `.InovuaReactDataGrid__column-header__content .${cls}--asc:not(.${cls}--hidden)`
    );
    const desc = !!headerCell.querySelector(
      `.InovuaReactDataGrid__column-header__content .${cls}--desc:not(.${cls}--hidden)`
    );

    return asc ? 1 : desc ? -1 : 0;
  };

  return headerCells.map(hasSortIcon);
};
