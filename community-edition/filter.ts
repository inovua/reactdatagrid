/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import DEFAULT_FILTER_TYPES from './filterTypes';
import {
  TypeSingleFilterValue,
  TypeColumn,
  TypeFilterParam,
  TypeFilterTypes,
  TypeFilter,
} from './types';

export const buildTypeOperators = (filterTypes: any) => {
  return Object.keys(filterTypes).reduce((acc: any, filterTypeName: any) => {
    const filterType = filterTypes[filterTypeName];
    if (!filterType || !filterType.operators) {
      return acc;
    }
    const operators = filterType.operators.reduce(
      (operatorAccumulator: any, operator: any) => {
        operatorAccumulator[operator.name] = operator;

        return operatorAccumulator;
      },
      {}
    );

    acc[filterTypeName] = operators;

    return acc;
  }, {});
};

export const buildFilterParam = (
  item: any,
  fv: TypeSingleFilterValue,
  filterTypes: any = DEFAULT_FILTER_TYPES,
  columnsMap: { [key: string]: TypeColumn } | undefined
): TypeFilterParam => {
  const filterParam: TypeFilterParam = {};

  const { name, getFilterValue, value: filterValue, type } = fv;

  filterParam.emptyValue = fv.hasOwnProperty('emptyValue')
    ? fv.emptyValue
    : filterTypes[type].emptyValue;
  filterParam.filterValue = filterValue;
  if (columnsMap) {
    filterParam.column = columnsMap[name];
  }

  filterParam.data = item;
  filterParam.value =
    typeof getFilterValue === 'function'
      ? getFilterValue({ data: item, value: item[name] })
      : item[name];

  return filterParam;
};

export const hasTypeOperators = (
  fn: ((arg: any) => any) | undefined,
  currentTypeOperators: any,
  type: string
): boolean => {
  if (!fn && !currentTypeOperators) {
    console.error(`No filter of type "${type}" found!`);
    return true;
  }
  return false;
};

export const hasTypeOperator = (
  fn: ((arg: any) => any) | undefined,
  currentTypeOperators: any,
  type: string,
  operator: string
): boolean => {
  if (!fn && !currentTypeOperators[operator]) {
    console.error(`No operator "${operator}" found for filter type "${type}"!`);
    return true;
  }
  return false;
};

export const checkForEmptyValue = (
  filterValue: string | number | undefined,
  emptyValue: string | number | undefined,
  filterOnEmptyValue: string | number
): boolean => {
  if (filterValue === emptyValue && !filterOnEmptyValue) {
    return true;
  }
  return false;
};

export const validateFilters = (
  fv: TypeSingleFilterValue,
  filterTypes: any = DEFAULT_FILTER_TYPES,
  currentTypeOperators: any
): boolean => {
  const { active, fn, type, operator } = fv;
  const emptyValue = fv.hasOwnProperty('emptyValue')
    ? fv.emptyValue
    : filterTypes[type].emptyValue;
  const filterOnEmptyValue = currentTypeOperators[operator].filterOnEmptyValue;

  if (active === false) {
    return true;
  }
  if (!filterTypes[type]) {
    return true;
  }
  if (hasTypeOperators(fn, currentTypeOperators, type)) {
    return true;
  }
  if (hasTypeOperator(fn, currentTypeOperators, type, operator)) {
    return true;
  }
  if (checkForEmptyValue(fv.value, emptyValue, filterOnEmptyValue)) {
    return true;
  }

  return false;
};

const doFilter = (
  item: any,
  filterValueArray: TypeSingleFilterValue[],
  filterTypes: any = DEFAULT_FILTER_TYPES,
  columnsMap?: { [key: string]: TypeColumn }
): boolean => {
  const typeOperators: any = buildTypeOperators(filterTypes);

  for (let i = 0, len = filterValueArray.length; i < len; i++) {
    const fv: TypeSingleFilterValue = filterValueArray[i];
    const { type, operator, fn } = fv;
    const currentTypeOperators = typeOperators[type];

    if (validateFilters(fv, filterTypes, currentTypeOperators)) {
      continue;
    }

    const filterParam: TypeFilterParam = buildFilterParam(
      item,
      fv,
      filterTypes,
      columnsMap
    );

    const filterFn = fn || currentTypeOperators[operator].fn;
    if (filterFn(filterParam) !== true) {
      return false;
    }
  }

  return true;
};

const filter: TypeFilter = (
  data: any[],
  filterValueArray: TypeSingleFilterValue[],
  filterTypes?: TypeFilterTypes,
  columnsMap?: { [key: string]: TypeColumn }
) => {
  filterTypes = filterTypes || DEFAULT_FILTER_TYPES;

  const filterFn = (item: any): boolean => {
    const result: boolean = doFilter(
      item,
      filterValueArray,
      filterTypes,
      columnsMap
    );

    return result;
  };

  if (data === undefined) {
    return filterFn;
  }

  return data.filter(filterFn);
};

export default filter;
