/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import separateEvents from './separateEvents';
import { registerListeners, unregisterListeners } from './registerEvents';
import {
  createShowHandler,
  createHideHandler,
  createToggleHandler,
} from './generateHandlers';
import createHideOnClickOutsideAction from './createHideOnClickOutsideAction';

/**
 * Decides when to trigger onShow or onHide.
 *
 *  Delays, the interaction between onShow and onHide with delay
 *  All cases are tested in delay-test.js.
 *
 *  Cases:
 *  [x] 1 - onShow scheduled + domShow event from same target
 *  a second event is not scheduled
 *
 *  [x] 2 - onShow scheduled + domShow event from different target
 *  previous scheduled is calceled, the new one is scheduled
 *
 *  [x] 3 - onShow scheduled + domHide event from same target
 *  cancel onShow event
 *
 *  [x] 4 - onShow scheduled + domHide event from other target
 *  nothing to do
 *
 *  [x] 5 - onHide scheduled + domHide event from same target
 *  don't schedule a new on hide
 *
 *  [x] 6 - onHide scheduled + domHide from different target
 *  nothing to do
 *
 *  [x] 7 - onHide scheduled + domShow from same target
 *  cancel scheduled
 *
 *  [x] 8 - onHide scheduled + domShow from different target
 *  cancel scheduled, as it should just jump from one another
 *
 *  TODO:
 *  When the overlay has hideEvents: mouseout,
 *  we asume that
 *  showEvent: 'mouseenter'
 *  hideEvent: 'mouseleave'
 *  is applied on the overlay
 *
 *  target can be node
 *
 *
 * @param {Object} : {
 *  showEvent: String[] - events to trigger show
 *  hideEvent: String[] - events to trigger hide
 *  target: String|String[]|DOMNode - on what elements to listen to events and
 *  on which elements it should overlay/show
 *  hideOnScroll: Boolean - whether to hide on window scroll
 *  hideOnClickOutside: Bool - whether to hide when a click was registered outiside
 *  the overlay or the target element
 *
 *  getVisible: () => visible - returns the current visible state of the overlay
 *
 *  showDelay/hideDelay: Number - in ms, time from when the event has been triggered until
 *  the onShow/onHide will be called
 *
 *  getOverlayNode: () => DOMNode
 *  getActiveTargetNode: () => DOMNode - this is the node that whas the source of the
 *  event from the previous onShow/onHide
 * }
 * @return { unregister: Function }
 */
function eventManager(config) {
  const {
    showEvent = [],
    hideEvent = [],
    target,

    // falgs
    hideOnScroll,
    hideOnClickOutside,
    hideOnEscape,

    // actions
    onShow,
    onHide,

    // delays
    getShowDelay,
    getHideDelay,

    // states
    getVisible,

    // nodes
    getOverlayNode = () => {},
    getActiveTargetNode,
  } = config;

  // is mutated
  const timeoutState = {
    showId: null,
    hideId: null,
    targetThatTriggeredEvent: null,
  };

  // common events must toggle
  // they must be separated and removed from hideEvent and showEvent
  const {
    normalizedShowEvents,
    normalizedHideEvents,
    toggleEvents,
  } = separateEvents({
    showEvent,
    hideEvent,
  });

  const showAction = createShowHandler({
    timeoutState,
    target,
    getActiveTargetNode,
    action: onShow,
    getDelay: getShowDelay,
  });
  if (normalizedShowEvents && onShow) {
    // register show
    registerListeners({
      events: normalizedShowEvents,
      action: showAction,
    });
  }

  // register hide
  const hideAction = createHideHandler({
    timeoutState,
    target,
    getActiveTargetNode,
    action: onHide,
    getDelay: getHideDelay,
  });

  if (normalizedHideEvents && onHide) {
    registerListeners({
      events: normalizedHideEvents,
      action: hideAction,
    });
  }

  let toggleAction;
  if (toggleEvents.length) {
    toggleAction = createToggleHandler({
      target,
      getActiveTargetNode,
      getVisible,
      onHide: hideAction,
      onShow: showAction,
    });

    registerListeners({
      events: toggleEvents,
      action: toggleAction,
    });
  }

  let hideOnClickOutsideAction;
  if (hideOnClickOutside) {
    hideOnClickOutsideAction = createHideOnClickOutsideAction({
      getOverlayNode,
      getActiveTargetNode,
      onHide: hideAction,
    });
    registerListeners({
      events: ['click'],
      action: hideOnClickOutsideAction,
    });
  }

  let hideOnScrollAction;
  if (hideOnScroll) {
    hideOnScrollAction = event => {
      if (getVisible()) {
        hideAction(event, { target: null });
      }
    };
    registerListeners({
      events: ['scroll'],
      action: hideOnScrollAction,
    });
  }

  let hideOnEscapeAction;
  if (hideOnEscape) {
    hideOnEscapeAction = event => {
      if (getVisible() && event.key === 'Escape') {
        hideAction(event, { target: null });
      }
    };
    registerListeners({
      events: ['keydown'],
      action: hideOnEscapeAction,
    });
  }

  /**
   * If there is a mouseleave registered for hideEvent
   * will also listen for mouseleave and mouseenter
   * on tooltip
   */
  let handleOverlayShowAction;
  let handleOverlayHideAction;
  if (normalizedHideEvents.indexOf('mouseleave') !== -1) {
    handleOverlayShowAction = event => {
      if (event.target === getOverlayNode()) {
        const activeTargetNode = getActiveTargetNode();
        showAction(event, { target: activeTargetNode });
      }
    };

    registerListeners({
      events: ['mouseenter'],
      action: handleOverlayShowAction,
    });

    handleOverlayHideAction = event => {
      if (event.target === getOverlayNode()) {
        const activeTargetNode = getActiveTargetNode();
        hideAction(event, { target: activeTargetNode });
      }
    };
    registerListeners({
      events: ['mouseleave'],
      action: handleOverlayHideAction,
    });
  }

  // unregister all event listeners
  return {
    unregister: () => {
      if (normalizedShowEvents && showAction) {
        unregisterListeners({
          events: normalizedShowEvents,
          action: showAction,
        });
      }

      // unregister hide
      if (normalizedHideEvents && hideAction) {
        unregisterListeners({
          events: normalizedHideEvents,
          action: hideAction,
        });
      }

      // unregister hide
      if (toggleEvents && toggleAction) {
        unregisterListeners({
          events: toggleEvents,
          action: toggleAction,
        });
      }

      // unregister clickoutside
      if (hideOnClickOutsideAction) {
        unregisterListeners({
          events: ['click'],
          action: hideOnClickOutsideAction,
        });
      }

      // unregister hideOnScrollAction
      if (hideOnScrollAction) {
        unregisterListeners({
          events: ['scroll'],
          action: hideOnScrollAction,
        });
      }

      // unregister onSow and onHide listeners on popover
      if (handleOverlayShowAction) {
        unregisterListeners({
          events: ['mouseenter'],
          action: handleOverlayShowAction,
        });
      }
      if (handleOverlayHideAction) {
        unregisterListeners({
          events: ['mouseleave'],
          action: handleOverlayHideAction,
        });
      }
      if (hideOnEscapeAction) {
        unregisterListeners({
          events: ['keydown'],
          action: hideOnEscapeAction,
        });
      }
    },
  };
}

export default eventManager;
