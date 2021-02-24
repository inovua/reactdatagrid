/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Normalizes event names to an array
 * @param  {String|String[]} event
 * @return {Array}
 */
function normalizeEvent(events) {
  return Array.isArray(events) ? events : [events];
}

export default normalizeEvent;
