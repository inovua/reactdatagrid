/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import isControlledProperty from './isControlledProperty';

const getProperty = <T1 extends any, T2 extends any, K extends string>(
  props: T1,
  state: T2,
  propName: K
): T1[K] | T2[K] => {
  if (isControlledProperty(props, propName)) {
    return props[propName];
  }

  return state[propName];
};

export default getProperty;
