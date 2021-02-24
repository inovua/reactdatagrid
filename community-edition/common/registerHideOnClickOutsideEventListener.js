/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Handles click on document, it checks if the click
 * comes from outside the target.
 *
 * Checks if the event.target is not a child and is not the
 * active target
 *@param {function} getRootNode => DOMNode
 * @param  {function} onHide
 * @return {function} unregister
 */
function registerHideOnClickOutsideEventListener({ getRootNode, onHide }) {
  const eventHandler = event => {
    const node = event.target;
    const rootNode = getRootNode();
    if (!rootNode) {
      return;
    }

    // target node should still be in the tree
    if (!global.document.body.contains(node)) {
      return;
    }

    if (rootNode !== node && !rootNode.contains(node)) {
      onHide(event, { target: null });
    }
  };

  // register
  global.document.addEventListener('click', eventHandler);

  const unregister = () => {
    global.document.addEventListener('click', eventHandler);
  };

  return unregister;
}

export default registerHideOnClickOutsideEventListener;
