/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const times = (count: number): number[] =>
  (count >= 0 ? [...new Array(count)] : []).map((_v: number, i: number) => i);
export default times;
