/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import deepGet from '../../deep-get';

import curry from './curry';
import TYPES from './types';

function isFn(fn?: Function) {
  return typeof fn === 'function';
}

export type TypeSingleSortInfo = {
  dir: 1 | -1 | 0 | 'asc' | 'desc';
  name: string;
  type?: string;
  fn?: Function;
};
export type TypeSortInfo = TypeSingleSortInfo | TypeSingleSortInfo[] | null;

var sorty: ((sortInfo: TypeSortInfo, data: any[]) => void) & {
  types?: any;
  _getSortFunctions?: (sortInfo: TypeSingleSortInfo[]) => void;
  getFunction?: (sortinfo: TypeSingleSortInfo[]) => void;
} = curry(function(sortInfo: any, array: any): any[] {
  return array.sort(getMultiSortFunction(sortInfo));
});

sorty.types = TYPES;

var getSingleSortFunction = function(info: TypeSingleSortInfo) {
  if (!info) {
    return;
  }

  var field = info.name;
  var dir =
    info.dir === 'desc' || info.dir < 0
      ? -1
      : info.dir === 'asc' || info.dir > 0
      ? 1
      : 0;

  if (!dir) {
    return;
  }

  if (!info.fn && info.type) {
    info.fn = sorty.types[info.type];
  }

  if (!info.fn) {
    info.fn = sorty.types.string || TYPES.string;
  }

  var fn = info.fn;

  return function(first: any, second: any) {
    var a = field ? deepGet(first, field) : first;
    var b = field ? deepGet(second, field) : second;

    return dir * fn!(a, b, first, second, info);
  };
};

var getSortFunctions = function(sortInfo: TypeSingleSortInfo[]) {
  if (!Array.isArray(sortInfo)) {
    sortInfo = [sortInfo];
  }

  return sortInfo.map(getSingleSortFunction).filter(isFn);
};

var getMultiSortFunction = function(sortInfo: TypeSingleSortInfo[]) {
  var fns = getSortFunctions(sortInfo);

  return function(first: any, second: any) {
    var result = 0;
    var i = 0;
    var len = fns.length;
    var fn;

    for (; i < len; i++) {
      fn = fns[i];
      if (!fn) {
        continue;
      }

      result = fn(first, second);

      if (result != 0) {
        return result;
      }
    }

    return result;
  };
};

sorty._getSortFunctions = getSortFunctions;
sorty.getFunction = getMultiSortFunction;

export default sorty;
