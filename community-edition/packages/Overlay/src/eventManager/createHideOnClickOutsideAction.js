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
 * active target or the overlay
 *
 * @param  {String} target
 * @param  {function} onHide
 * @return {Void}
 */
function createHideOnClickOutsideAction({
  getOverlayNode,
  getActiveTargetNode,
  onHide,
}) {
  return event => {
    const node = event.target;
    const activeTargetNode = getActiveTargetNode();
    const overlayNode = getOverlayNode();

    if (!activeTargetNode || !overlayNode) {
      return null;
    }

    if (
      // overlay
      overlayNode !== node &&
      !overlayNode.contains(node) &&
      // active target
      activeTargetNode !== node &&
      !activeTargetNode.contains(node)
    ) {
      onHide(event, { target: null });
    }
  };
}

export default createHideOnClickOutsideAction;
