/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Find common events, and remove them fron the original
 * kist
 * @param  {String[]} showEvent
 * @param  {String[]} hideEvent
 * @return {{ normalizedShowEvents normalizedHideEvents toggleEvents }} [description]
 */
function separateEvents({ showEvent, hideEvent }) {
  if (!Array.isArray(showEvent) || !Array.isArray(hideEvent)) {
    return {};
  }

  let normalizedShowEvents = [...showEvent];
  let normalizedHideEvents = [...hideEvent];
  const toggleEvents = [];

  // it is enough to iterate through one of the event
  // lists
  normalizedShowEvents.forEach((eventName, index) => {
    const searchIndex = normalizedHideEvents.indexOf(eventName);
    if (searchIndex !== -1) {
      toggleEvents.push(eventName);
      delete normalizedShowEvents[index];
      delete normalizedHideEvents[searchIndex];
    }
  });

  normalizedShowEvents = normalizedShowEvents.filter(eventName => eventName);
  normalizedHideEvents = normalizedHideEvents.filter(eventName => eventName);

  return {
    normalizedShowEvents,
    normalizedHideEvents,
    toggleEvents,
  };
}

export default separateEvents;
