/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default function pickProps(props, targetProps) {
  const pickedProps = {};
  Object.keys(targetProps).forEach(key => {
    if (props[key] !== undefined) {
      pickedProps[key] = props[key];
    }
  });

  return pickedProps;
}
