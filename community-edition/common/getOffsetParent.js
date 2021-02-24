/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * If fixed the offset parent is null, so
 * must find first parent with position set.
 */
function getOffsetParent(node) {
  const parent = node && node.parentNode;

  // fist check if first parent has position,
  // if not get offsetparent
  const computedStyle = global.getComputedStyle(parent);
  if (computedStyle.position !== 'static') {
    return parent;
  }

  return parent && parent.offsetParent;
}

export default getOffsetParent;
