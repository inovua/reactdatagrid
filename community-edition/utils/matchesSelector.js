/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default (element, selector) => {
  const proto = Element.prototype;
  const vendor =
    proto.matches ||
    proto.matchesSelector ||
    proto.webkitMatchesSelector ||
    proto.mozMatchesSelector ||
    proto.msMatchesSelector ||
    proto.oMatchesSelector;

  function match(el, sel) {
    if (vendor) {
      return vendor.call(el, sel);
    }
    const nodes = el.parentNode.querySelectorAll(sel);

    for (let i = 0, len = nodes.length; i < len; i++) {
      if (nodes[i] == el) {
        return true;
      }
    }
    return false;
  }

  return match(element, selector);
};
