/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export function assign(target, ...to) {
  if (target === null || target === undefined) {
    throw new TypeError(
      'Object.assign cannot be called with null or undefined'
    );
  }

  to.forEach(toItem => {
    toItem = Object(toItem);
    Object.keys(toItem).forEach(key => {
      target[key] = toItem[key];
    });
  });

  return target;
}

export default typeof Object.assign === 'function' ? Object.assign : assign;
