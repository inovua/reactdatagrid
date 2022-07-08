/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function debounce(
  this: any,
  func: Function,
  wait: number,
  immediate:
    | boolean
    | {
        leading: boolean;
        trailing: boolean;
      } = false
) {
  let timeout: any;
  let args: any[] | null;
  let context: any[] | null;
  let timestamp: number;
  let result: any;

  const later = () => {
    const last = Date.now() - timestamp;
    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) {
          context = null;
          args = null;
        }
      }
    }
  };

  return (...internalArgs: any[]) => {
    const callNow = immediate && !timeout;
    context = this;
    args = internalArgs;
    timestamp = Date.now();

    if (!timeout) {
      timeout = setTimeout(later, wait);
    }
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

export default debounce;
