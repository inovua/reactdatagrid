/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type TypeRowSelection =
  | string
  | number
  | boolean
  | { [key: string]: boolean | any }
  | null;

export type TypeCellSelection = { [key: string]: boolean } | null;

export type TypeRowUnselected = { [key: string]: boolean } | null;

export default TypeRowSelection;
