/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const DEFAULTS: { duration: number; orientation: 'vertical' | 'horizontal' } = {
  duration: 100,
  orientation: 'vertical',
};

export default (
  node: HTMLElement,
  newValue: number,
  config?: { orientation: 'horizontal' | 'vertical'; duration?: number } | null, // or callback
  callback?: (...args: any[]) => void
) => {
  if (typeof config === 'function') {
    callback = config;
    config = null;
  }
  if (!config) {
    config = DEFAULTS;
  }
  const { orientation } = config;
  let { duration } = config;

  const horiz = orientation == 'horizontal';
  const scrollPosName = horiz ? 'scrollLeft' : 'scrollTop';

  const currentValue = node[scrollPosName];

  const diff = newValue - currentValue;

  const now = Date.now();
  duration = duration != null ? duration : 100;
  const millisecondStep = diff / duration;

  if (!duration) {
    node[scrollPosName] = newValue;
    if (typeof callback === 'function') {
      callback(newValue);
    }
    return;
  }

  const scroll = () => {
    const elapsed = Date.now() - now;
    node[scrollPosName] = currentValue + elapsed * millisecondStep;

    if (elapsed < duration) {
      global.requestAnimationFrame(scroll);
    } else {
      node[scrollPosName] = newValue;
      if (typeof callback === 'function') {
        callback(newValue);
      }
    }
  };

  global.requestAnimationFrame(scroll);
};
