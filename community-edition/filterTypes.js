/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const emptyObject = {};
export const stringTypes = {
    type: 'string',
    emptyValue: '',
    operators: [
        {
            name: 'contains',
            fn: ({ value, filterValue }) => {
                value = value || '';
                return !filterValue
                    ? true
                    : value.toLowerCase().indexOf(filterValue.toLowerCase()) != -1;
            },
        },
        {
            name: 'notContains',
            fn: ({ value, filterValue }) => !filterValue
                ? true
                : (value || '').toLowerCase().indexOf(filterValue.toLowerCase()) ===
                    -1,
        },
        {
            name: 'eq',
            fn: ({ value, filterValue }) => {
                return !filterValue
                    ? true
                    : (value || '').toLowerCase() === filterValue.toLowerCase();
            },
        },
        {
            name: 'neq',
            fn: ({ value, filterValue }) => {
                return !filterValue
                    ? true
                    : (value || '').toLowerCase() !== filterValue.toLowerCase();
            },
        },
        {
            name: 'empty',
            fn: ({ value }) => {
                return value === '';
            },
            filterOnEmptyValue: true,
            valueOnOperatorSelect: '',
            disableFilterEditor: true,
        },
        {
            name: 'notEmpty',
            fn: ({ value }) => {
                return value !== '';
            },
            filterOnEmptyValue: true,
            valueOnOperatorSelect: '',
            disableFilterEditor: true,
        },
        {
            name: 'startsWith',
            fn: ({ value, filterValue }) => !filterValue
                ? true
                : (value || '').toLowerCase().startsWith(filterValue.toLowerCase()),
        },
        {
            name: 'endsWith',
            fn: ({ value, filterValue }) => !filterValue
                ? true
                : (value || '').toLowerCase().endsWith(filterValue.toLowerCase()),
        },
    ],
};
export const boolTypes = {
    type: 'bool',
    emptyValue: null,
    operators: [
        {
            name: 'eq',
            fn: ({ value, filterValue }) => {
                return filterValue != null ? filterValue === value : true;
            },
        },
        {
            name: 'neq',
            fn: ({ value, filterValue }) => {
                return filterValue != null ? filterValue !== value : true;
            },
        },
    ],
};
export const selectTypes = {
    type: 'select',
    emptyValue: null,
    operators: [
        {
            name: 'inlist',
            fn: ({ value, filterValue }) => {
                return !filterValue || !filterValue.length
                    ? true
                    : filterValue.indexOf(value) !== -1;
            },
        },
        {
            name: 'notinlist',
            fn: ({ value, filterValue }) => {
                return !filterValue || !filterValue.length
                    ? true
                    : filterValue.indexOf(value) === -1;
            },
        },
        {
            name: 'eq',
            fn: ({ value, filterValue, emptyValue, }) => {
                return filterValue !== emptyValue ? filterValue === value : true;
            },
        },
        {
            name: 'neq',
            fn: ({ value, filterValue, emptyValue }) => {
                return filterValue !== emptyValue ? filterValue !== value : true;
            },
        },
    ],
};
export const booleanTypes = {
    type: 'boolean',
    emptyValue: null,
    operators: boolTypes.operators,
};
export const numberTypes = {
    type: 'number',
    emptyValue: null,
    operators: [
        {
            name: 'gt',
            fn: ({ value, filterValue }) => filterValue != null ? value > filterValue : true,
        },
        {
            name: 'gte',
            fn: ({ value, filterValue }) => filterValue != null ? value >= filterValue : true,
        },
        {
            name: 'lt',
            fn: ({ value, filterValue }) => filterValue != null ? value < filterValue : true,
        },
        {
            name: 'lte',
            fn: ({ value, filterValue }) => filterValue != null ? value <= filterValue : true,
        },
        {
            name: 'eq',
            fn: ({ value, filterValue }) => filterValue != null ? value === filterValue : true,
        },
        {
            name: 'neq',
            fn: ({ value, filterValue }) => filterValue != null ? value !== filterValue : true,
        },
        {
            name: 'inrange',
            fn: ({ value, filterValue }) => {
                const { start, end } = filterValue || emptyObject;
                if (start != null && end != null) {
                    return value >= start && value <= end;
                }
                if (start != null) {
                    return value >= start;
                }
                if (end != null) {
                    return value <= end;
                }
                return true;
            },
        },
        {
            name: 'notinrange',
            fn: ({ value, filterValue }) => {
                const { start, end } = filterValue || emptyObject;
                if (start != null && end != null) {
                    return value < start || value > end;
                }
                if (start != null) {
                    return value < start;
                }
                if (end != null) {
                    return value > end;
                }
                return true;
            },
        },
    ],
};
export const dateTypes = {
    type: 'date',
    emptyValue: '',
    operators: [
        {
            name: 'after',
            fn: ({ value, filterValue, column: { dateFormat }, }) => filterValue
                ? window
                    .moment(window.moment(value).format(dateFormat), dateFormat)
                    .isAfter(window.moment(filterValue, dateFormat))
                : true,
        },
        {
            name: 'afterOrOn',
            fn: ({ value, filterValue, column: { dateFormat }, }) => filterValue != null
                ? window
                    .moment(window.moment(value).format(dateFormat), dateFormat)
                    .isSameOrAfter(window.moment(filterValue, dateFormat))
                : true,
        },
        {
            name: 'before',
            fn: ({ value, filterValue, column: { dateFormat }, }) => filterValue != null
                ? window
                    .moment(window.moment(value).format(dateFormat), dateFormat)
                    .isBefore(window.moment(filterValue, dateFormat))
                : true,
        },
        {
            name: 'beforeOrOn',
            fn: ({ value, filterValue, column: { dateFormat }, }) => filterValue != null
                ? window
                    .moment(window.moment(value).format(dateFormat), dateFormat)
                    .isSameOrBefore(window.moment(filterValue, dateFormat))
                : true,
        },
        {
            name: 'eq',
            fn: ({ value, filterValue, column: { dateFormat }, }) => filterValue
                ? window
                    .moment(window.moment(value).format(dateFormat), dateFormat)
                    .isSame(window.moment(filterValue, dateFormat))
                : true,
        },
        {
            name: 'neq',
            fn: ({ value, filterValue, column: { dateFormat }, }) => filterValue
                ? !window
                    .moment(window.moment(value).format(dateFormat), dateFormat)
                    .isSame(window.moment(filterValue, dateFormat))
                : true,
        },
        {
            name: 'inrange',
            fn: ({ value, filterValue, column: { dateFormat }, }) => {
                const { start, end } = filterValue || emptyObject;
                if (start && end) {
                    return (window
                        .moment(window.moment(value).format(dateFormat), dateFormat)
                        .isSameOrAfter(window.moment(start, dateFormat)) &&
                        window
                            .moment(window.moment(value).format(dateFormat), dateFormat)
                            .isSameOrBefore(window.moment(end, dateFormat)));
                }
                if (start) {
                    return window
                        .moment(window.moment(value).format(dateFormat), dateFormat)
                        .isSameOrAfter(window.moment(start, dateFormat));
                }
                if (end) {
                    return window
                        .moment(window.moment(value).format(dateFormat), dateFormat)
                        .isSameOrBefore(window.moment(end, dateFormat));
                }
                return true;
            },
        },
        {
            name: 'notinrange',
            fn: ({ value, filterValue, column: { dateFormat }, }) => {
                const { start, end } = filterValue || emptyObject;
                if (start && end) {
                    return (window
                        .moment(window.moment(value).format(dateFormat), dateFormat)
                        .isBefore(window.moment(start, dateFormat)) ||
                        window
                            .moment(window.moment(value).format(dateFormat), dateFormat)
                            .isAfter(window.moment(end, dateFormat)));
                }
                if (start) {
                    return window
                        .moment(window.moment(value).format(dateFormat), dateFormat)
                        .isBefore(window.moment(start, dateFormat));
                }
                if (end) {
                    return window
                        .moment(window.moment(value).format(dateFormat), dateFormat)
                        .isAfter(window.moment(end, dateFormat));
                }
                return true;
            },
        },
    ],
};
const defaultFilterTypes = {
    select: selectTypes,
    string: stringTypes,
    number: numberTypes,
    bool: boolTypes,
    boolean: booleanTypes,
    date: dateTypes,
};
export { selectTypes as select, stringTypes as string, numberTypes as number, boolTypes as bool, boolTypes as boolean, dateTypes as date, };
export default defaultFilterTypes;
