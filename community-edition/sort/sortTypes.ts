/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type SortDirection = 1 | -1 | 0;

export interface ISortInfo {
  name: string;
  dir: SortDirection;
  type?: string;
}
export type WithSortInfo = {
  sortInfo: ISortInfo | [ISortInfo];
};
export type WithOptionalSortInfo = {
  sortInfo?: ISortInfo | [ISortInfo];
};
