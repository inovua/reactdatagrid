/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const focusableSelector =
  'input, select, textarea, button, object, a[href], [tabindex]';

export default node => {
  if (!node) {
    return null;
  }

  // filter out nonvisible items
  let nodes = [...node.querySelectorAll(focusableSelector)];
  // http://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
  nodes = nodes.filter(el => !!el.offsetParent);

  return nodes;
};
