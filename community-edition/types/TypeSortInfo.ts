/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type TypeSingleSortInfo = {
  dir: 1 | -1 | 0;
  name: string;
  id?: string;
  type?: string;
  fn?: Function;
};
export type TypeSortInfo = TypeSingleSortInfo | TypeSingleSortInfo[] | null;

export default TypeSortInfo;
