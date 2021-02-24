/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ReactTestUtils from 'react-addons-test-utils';

import findCells from './findCells';

import Content from '../../Layout/ColumnLayout/Content';

export default grid => {
  const body = ReactTestUtils.findAllInRenderedTree(grid, cmp => {
    return cmp.constructor === Content;
  });

  return findCells(body[0]);
};
