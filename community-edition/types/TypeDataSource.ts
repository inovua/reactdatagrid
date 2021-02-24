/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type TypeDataSource =
  | ((props: any) => any[])
  | ((props: any) => Promise<any[]>)
  | ((props: any) => Promise<{ data: any[]; count: number }>)
  | any[]
  | Promise<any[]>
  | Promise<{ data: any[]; count: number }>;

export default TypeDataSource;
