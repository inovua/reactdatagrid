/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import DEFAULT_FILTER_TYPES from './filterTypes';
export const buildTypeOperators = filterTypes => {
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
export default (data, filterValueArray, filterTypes = DEFAULT_FILTER_TYPES, columnsMap) => {
    const typeOperators = buildTypeOperators(filterTypes);
    const filterFn = (item, index, data) => {
        const filterParam = {};
        for (let i = 0, len = filterValueArray.length; i < len; i++) {
            const fv = filterValueArray[i];
            const { name, getFilterValue, value: filterValue, type, operator, active, fn, } = fv;
            if (active === false) {
                continue;
            }
            if (!filterTypes[type]) {
                continue;
            }
            filterParam.emptyValue = fv.hasOwnProperty('emptyValue')
                ? fv.emptyValue
                : filterTypes[type].emptyValue;
            filterParam.filterValue = filterValue;
            if (columnsMap) {
                filterParam.column = columnsMap[name];
            }
            const currentTypeOperators = typeOperators[type];
            if (!fn && !currentTypeOperators) {
                console.error(`No filter of type "${type}" found!`);
                continue;
            }
            if (!fn && !currentTypeOperators[operator]) {
                console.error(`No operator "${operator}" found for filter type "${type}"!`);
                continue;
            }
            if (filterParam.filterValue === filterParam.emptyValue &&
                !currentTypeOperators[operator].filterOnEmptyValue) {
                continue;
            }
            const filterFn = fn || currentTypeOperators[operator].fn;
            filterParam.data = item;
            filterParam.value =
                typeof getFilterValue == 'function'
                    ? getFilterValue({ data: item, value: item[name] })
                    : item[name];
            if (filterFn(filterParam) !== true) {
                return false;
            }
        }
        return true;
    };
    if (data === undefined) {
        return filterFn;
    }
    return data.filter(filterFn);
};
