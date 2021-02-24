/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ReactTestUtils from 'react-addons-test-utils';

import { findDOMNode } from 'react-dom';

import HeaderLayout from '../../Layout/ColumnLayout/HeaderLayout';
import findCells from './findCells';

export default grid => {
  const headerLayout = ReactTestUtils.findAllInRenderedTree(grid, cmp => {
    return cmp.constructor === HeaderLayout;
  })[0];

  const cells = findCells(headerLayout);

  const domCells = cells.map(findDOMNode);

  return domCells.map(cellNode => cellNode);
};
