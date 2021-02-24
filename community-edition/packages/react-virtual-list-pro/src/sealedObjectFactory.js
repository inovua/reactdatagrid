/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const DEFAULTS = {};
export default (shape = DEFAULTS) => {
  const sealed = Object.seal ? Object.seal(shape) : {};

  return sealed;
};
