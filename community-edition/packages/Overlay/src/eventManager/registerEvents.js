/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Registers events listeners on document
 * @param  {String[]} events Dom event names
 * @param  {function} action event handler
 * @return {Void}
 */
function registerListeners({ events, action }) {
  events.forEach(eventName => {
    // as it doesn't bubble we have to catch in capture
    if (
      eventName === 'mouseenter' ||
      eventName === 'mouseleave' ||
      eventName === 'scroll'
    ) {
      document.addEventListener(eventName, action, { capture: true });
    } else {
      document.addEventListener(eventName, action);
    }
  });
}

/**
 * Removes event listeners on document
 * @param  {String[]} events Dom event names
 * @param  {function} action event handler
 * @return {Void}
 */
function unregisterListeners({ events, action }) {
  events.forEach(eventName => {
    if (
      eventName === 'mouseenter' ||
      eventName === 'mouseleave' ||
      eventName === 'scroll'
    ) {
      document.removeEventListener(eventName, action, { capture: true });
    } else {
      document.removeEventListener(eventName, action);
    }
  });
}

export { registerListeners, unregisterListeners };
