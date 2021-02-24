/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import matchesSelector from './matchesSelector';

function selectParent(selector, node) {
  node = node.parentElement;
  while (node) {
    if (matchesSelector(node, selector)) {
      return node;
    }
    node = node.parentElement;
  }

  return false;
}

export default selectParent;
