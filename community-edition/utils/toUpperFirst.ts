/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default (s: string): string => {
  return `${s.charAt(0).toUpperCase()}${s.substring(1)}`;
};
