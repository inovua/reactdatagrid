/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import DEFAULT_FILTER_TYPES from './filterTypes';
export const buildTypeOperators = (filterTypes) => {
    return Object.keys(filterTypes).reduce((acc, filterTypeName) => {
        const filterType = filterTypes[filterTypeName];
        if (!filterType || !filterType.operators) {
            return acc;
        }
        const operators = filterType.operators.reduce((operatorAccumulator, operator) => {
            operatorAccumulator[operator.name] = operator;
            return operatorAccumulator;
        }, {});
        acc[filterTypeName] = operators;
        return acc;
    }, {});
};
export const buildFilterParam = (item, fv, filterTypes = DEFAULT_FILTER_TYPES, columnsMap) => {
    const filterParam = {};
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
export const hasTypeOperators = (fn, currentTypeOperators, type) => {
    if (!fn && !currentTypeOperators) {
        console.error(`No filter of type "${type}" found!`);
        return true;
    }
    return false;
};
export const hasTypeOperator = (fn, currentTypeOperators, type, operator) => {
    if (!fn && !currentTypeOperators[operator]) {
        console.error(`No operator "${operator}" found for filter type "${type}"!`);
        return true;
    }
    return false;
};
export const checkForEmptyValue = (filterValue, emptyValue, filterOnEmptyValue) => {
    if (filterValue === emptyValue && !filterOnEmptyValue) {
        return true;
    }
    return false;
};
export const validateFilters = (fv, filterTypes = DEFAULT_FILTER_TYPES, currentTypeOperators) => {
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
const doFilter = (item, filterValueArray, filterTypes = DEFAULT_FILTER_TYPES, columnsMap) => {
    const typeOperators = buildTypeOperators(filterTypes);
    for (let i = 0, len = filterValueArray.length; i < len; i++) {
        const fv = filterValueArray[i];
        const { type, operator, fn } = fv;
        const currentTypeOperators = typeOperators[type];
        if (validateFilters(fv, filterTypes, currentTypeOperators)) {
            continue;
        }
        const filterParam = buildFilterParam(item, fv, filterTypes, columnsMap);
        const filterFn = fn || currentTypeOperators[operator].fn;
        if (filterFn(filterParam) !== true) {
            return false;
        }
    }
    return true;
};
const filter = (data, filterValueArray, filterTypes, columnsMap) => {
    filterTypes = filterTypes || DEFAULT_FILTER_TYPES;
    const filterFn = (item) => {
        const result = doFilter(item, filterValueArray, filterTypes, columnsMap);
        return result;
    };
    if (data === undefined) {
        return filterFn;
    }
    return data.filter(filterFn);
};
export default filter;
