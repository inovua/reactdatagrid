/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { equalReturnKey } from '../../../packages/shallowequal';
type TypeDeps = { [key: string]: any };

export default (fn: () => void, gridId: number, deps: TypeDeps) => {
  let result = undefined;
  let prevGridId: number = -1;

  const useWeakMap = !!window.WeakMap;
  const cachePerGrid: WeakMap<{}, any> | { [key: number]: any } = useWeakMap
    ? new WeakMap()
    : {};
  const grids: { [key: number]: any } = {};

  const set = (key: number, value: any) => {
    if (cachePerGrid instanceof WeakMap) {
      if (!grids[key]) {
        grids[key] = {};
      }
      const _key = grids[key];
      cachePerGrid.set(_key, value);
    } else {
      cachePerGrid[key] = value;
    }
  };

  const get = (key: number) => {
    if (cachePerGrid instanceof WeakMap) {
      if (!grids[key]) {
        grids[key] = {};
      }
      const _key = grids[key];
      return cachePerGrid.get(_key);
    } else {
      return cachePerGrid[key];
    }
  };

  return () => {
    let gridInfo = get(gridId);
    let depsEqual = false;

    if (gridInfo) {
      const { result } = equalReturnKey(gridInfo.deps, deps);

      depsEqual = result;
    } else {
      gridInfo.value = fn();
    }

    let value = depsEqual ? gridInfo.value : fn();

    set(gridId, {
      deps,
      value,
    });

    return value;
  };
};
