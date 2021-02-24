/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function containsNode(parent, child) {
  if (
    !parent ||
    !child ||
    !(parent instanceof Element) ||
    !(child instanceof Element)
  ) {
    return false;
  }

  // target node should still be in the tree
  if (!global.document.body.contains(child)) {
    return false;
  }

  let result = true;
  if (parent !== child && !parent.contains(child)) {
    result = false;
  }

  return result;
}

export default containsNode;
