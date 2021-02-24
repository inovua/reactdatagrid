/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ReactTestUtils from 'react-addons-test-utils';

import Cell from '../../Layout/ColumnLayout/Cell';

export default node =>
  ReactTestUtils.findAllInRenderedTree(node, cmp => {
    return cmp.constructor === Cell;
  });
