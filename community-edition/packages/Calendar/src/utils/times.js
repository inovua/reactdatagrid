/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const times = count =>
  (count >= 0 ? [...new Array(count)] : []).map((v, i) => i);
export default times;
