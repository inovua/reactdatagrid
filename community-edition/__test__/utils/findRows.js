/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ReactTestUtils from 'react-addons-test-utils';

import Row from '../../Layout/ColumnLayout/Content/Row';

export default (tree, index) =>
  ReactTestUtils.findAllInRenderedTree(tree, cmp => {
    return cmp.constructor === Row;
  });
