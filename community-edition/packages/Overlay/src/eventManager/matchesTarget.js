/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import matchesSelector from '../../../../common/matchesSelector';
import containsNode from '../../../../common/containsNode';

/**
 * Checks if node matches target, it mathces if:
 * - it is the same element
 * - is a string and matches the selector
 * (target: String, node: HtmlElement) => Bool
 */
function matchesTarget(target, node) {
  if (node === document) {
    return null;
  }

  if (target === node) {
    return true;
  }

  if (typeof target === 'string' && matchesSelector(node, target)) {
    return true;
  }

  if (containsNode(target, node)) {
    return true;
  }

  return false;
}

export default matchesTarget;
