/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const random = (): string => {
  return Date.now
    ? `${Date.now()}${Math.random()}`
    : `${new Date().getTime()}` + Math.random();
};

type TypeObjectWithId = {
  id: string;
};
export default (col: any): TypeObjectWithId => {
  col.id = col.id == null ? col.name || random() : col.id;

  return col;
};
