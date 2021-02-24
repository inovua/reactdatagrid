/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

let IS_SAFARI: boolean;
export default (): boolean => {
  if (IS_SAFARI !== undefined) {
    return IS_SAFARI;
  }

  const ua = ((global as unknown) as Window).navigator
    ? ((global as unknown) as Window).navigator.userAgent
    : '';

  return (IS_SAFARI =
    ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1);
};
