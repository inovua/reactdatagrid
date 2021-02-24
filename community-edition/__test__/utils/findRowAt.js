/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ReactTestUtils from 'react-addons-test-utils';

import Row from '../../Layout/ColumnLayout/Content/Row';

export default (grid, index) => {
  const rows = ReactTestUtils.findAllInRenderedTree(grid, cmp => {
    return cmp.constructor === Row && cmp.props.rowIndex == index;
  });

  return rows[0];
};
