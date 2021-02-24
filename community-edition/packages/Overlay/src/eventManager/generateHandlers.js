/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import matchesTarget from './matchesTarget';
import assign from '../../../../common/assign';

/**
 * Creates a handler for onShow event
 * it decies wether to call onShow(action),
 * and if it has to cancel an ongoing onHide.
 * @param  {function} action
 * @param  {String} target       [description]
 * @param  {Number} delay        [description]
 * @param  {Object: { showId, hideId, targetThatTriggeredEvent  }} timeoutState
 * @return {Function}
 */
function createShowHandler({ action, target, getDelay, timeoutState }) {
  return (event, config = {}) => {
    const delay = getDelay && getDelay();
    /**
     * target can be overwritten by config
     * it is used when it is triggered by
     * the overlay mouseneter
     */
    if (config.target) {
      event = assign({}, event, {
        target: config.target,
      });
    }

    const node = event.target;

    if (!matchesTarget(target, node)) {
      return null;
    }

    const activeTargetNode = timeoutState.targetThatTriggeredEvent;
    timeoutState.targetThatTriggeredEvent = node;

    // case 7. onShow cancels onHide if from any target
    if (timeoutState.hideId) {
      clearTimeout(timeoutState.hideId);
      timeoutState.hideId = null;
    }

    if (delay) {
      // case 1, if it comes from same target do nothing
      if (timeoutState.showId && activeTargetNode === node) {
        return null;
      }

      /**
       * case 2. if comes from different target
       * remove the previous onShow and
       * schedule the new target's onShow
       */
      if (timeoutState.showId) {
        clearTimeout(timeoutState.showId);
      }

      timeoutState.showId = setTimeout(() => {
        timeoutState.showId = null;
        action(event);
      }, delay);
    } else {
      action(event);
    }
  };
}

/**
 * Creates a handler for onHide event
 * it decies wether to call onHide(action),
 * and if it has to cancel an ongoing onShow.
 * @param  {function} action
 * @param  {String} target       [description]
 * @param  {Number} delay        [description]
 * @param  {Object: { showId, hideId, targetThatTriggeredEvent  }} timeoutState
 * @return {Function}
 */
function createHideHandler({ action, target, getDelay, timeoutState }) {
  return (event, config = {}) => {
    const delay = getDelay && getDelay();
    /**
     * target can be overwritten by config
     * it is used when it is triggered by
     * the overlay mouseneter
     */
    if (config.target) {
      event = assign({}, event, {
        target: config.target,
      });
    }

    const node = event.target;

    /**
     * config is used to overwrite initial setup
     */
    if (config.target !== null) {
      if (!matchesTarget(target, node)) {
        return null;
      }
    }

    const activeTargetNode = timeoutState.targetThatTriggeredEvent;
    timeoutState.targetThatTriggeredEvent = node;

    // case 3. onHide cancels onShow if from same target
    if (activeTargetNode === node && timeoutState.showId) {
      clearTimeout(timeoutState.showId);
      timeoutState.showId = null;
    }

    // case 4 .. do nothing

    if (delay) {
      // case 5. from same target, do nothing
      if (timeoutState.hideId && activeTargetNode === node) {
        return null;
      }

      timeoutState.hideId = setTimeout(() => {
        timeoutState.hideId = null;
        action(event);
      }, delay);
    } else {
      action(event);
    }
  };
}

/**
 * Event handler that when called toggles calling
 * onShow and onHide
 * @param  {Function} onHide
 * @param  {Function} onShow
 * @param {String} target, css selector
 * @return {Function} handler
 */
function createToggleHandler({
  onHide,
  onShow,
  target,
  getActiveTargetNode,
  getVisible,
}) {
  return event => {
    const activeTargetNode = getActiveTargetNode();
    const node = event.target;

    if (!matchesTarget(target, node)) {
      return null;
    }

    // if from same element toggle, else hide
    if (getVisible() && node === activeTargetNode) {
      onHide(event);
    } else {
      onShow(event);
    }
  };
}

export { createShowHandler, createHideHandler, createToggleHandler };
