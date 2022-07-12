/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TypeFilterType, TypeFilterTypes, TypeFnParam } from './types';

const emptyObject = {};

export const stringTypes: TypeFilterType = {
  type: 'string',
  emptyValue: '',
  operators: [
    {
      name: 'contains',
      fn: ({ value, filterValue }: TypeFnParam): boolean => {
        value = value || '';
        return !filterValue
          ? true
          : value.toLowerCase().indexOf(filterValue.toLowerCase()) != -1;
      },
    },
    {
      name: 'notContains',
      fn: ({ value, filterValue }: TypeFnParam): boolean =>
        !filterValue
          ? true
          : (value || '').toLowerCase().indexOf(filterValue.toLowerCase()) ===
            -1,
    },
    {
      name: 'eq',
      fn: ({ value, filterValue }: TypeFnParam): boolean => {
        return !filterValue
          ? true
          : (value || '').toLowerCase() === filterValue.toLowerCase();
      },
    },

    {
      name: 'neq',
      fn: ({ value, filterValue }: TypeFnParam): boolean => {
        return !filterValue
          ? true
          : (value || '').toLowerCase() !== filterValue.toLowerCase();
      },
    },
    {
      name: 'empty',
      fn: ({ value }: TypeFnParam): boolean => {
        return value === '';
      },
      filterOnEmptyValue: true,
      valueOnOperatorSelect: '',
      disableFilterEditor: true,
    },

    {
      name: 'notEmpty',
      fn: ({ value }: TypeFnParam): boolean => {
        return value !== '';
      },
      filterOnEmptyValue: true,
      valueOnOperatorSelect: '',
      disableFilterEditor: true,
    },
    {
      name: 'startsWith',
      fn: ({ value, filterValue }: TypeFnParam): boolean =>
        !filterValue
          ? true
          : (value || '').toLowerCase().startsWith(filterValue.toLowerCase()),
    },
    {
      name: 'endsWith',
      fn: ({ value, filterValue }: TypeFnParam): boolean =>
        !filterValue
          ? true
          : (value || '').toLowerCase().endsWith(filterValue.toLowerCase()),
    },
  ],
};

export const boolTypes: TypeFilterType = {
  type: 'bool',
  emptyValue: null,
  operators: [
    {
      name: 'eq',
      fn: ({ value, filterValue }: TypeFnParam): boolean => {
        return filterValue != null ? filterValue === value : true;
      },
    },
    {
      name: 'neq',
      fn: ({ value, filterValue }: TypeFnParam): boolean => {
        return filterValue != null ? filterValue !== value : true;
      },
    },
  ],
};

export const selectTypes: TypeFilterType = {
  type: 'select',
  emptyValue: null,
  operators: [
    {
      name: 'inlist',
      fn: ({ value, filterValue }: TypeFnParam): boolean => {
        return !filterValue || !filterValue.length
          ? true
          : filterValue.indexOf(value) !== -1;
      },
    },
    {
      name: 'notinlist',
      fn: ({ value, filterValue }: TypeFnParam): boolean => {
        return !filterValue || !filterValue.length
          ? true
          : filterValue.indexOf(value) === -1;
      },
    },
    {
      name: 'eq',
      fn: ({
        value,
        filterValue,

        emptyValue,
      }: TypeFnParam): boolean => {
        return filterValue !== emptyValue ? filterValue === value : true;
      },
    },
    {
      name: 'neq',
      fn: ({ value, filterValue, emptyValue }: TypeFnParam): boolean => {
        return filterValue !== emptyValue ? filterValue !== value : true;
      },
    },
  ],
};

export const booleanTypes: TypeFilterType = {
  type: 'boolean',
  emptyValue: null,
  operators: boolTypes.operators,
};

export const numberTypes: TypeFilterType = {
  type: 'number',
  emptyValue: null,
  operators: [
    {
      name: 'gt',
      fn: ({ value, filterValue }: TypeFnParam): boolean =>
        filterValue != null ? value > filterValue : true,
    },
    {
      name: 'gte',
      fn: ({ value, filterValue }: TypeFnParam): boolean =>
        filterValue != null ? value >= filterValue : true,
    },
    {
      name: 'lt',
      fn: ({ value, filterValue }: TypeFnParam): boolean =>
        filterValue != null ? value < filterValue : true,
    },
    {
      name: 'lte',
      fn: ({ value, filterValue }: TypeFnParam): boolean =>
        filterValue != null ? value <= filterValue : true,
    },
    {
      name: 'eq',
      fn: ({ value, filterValue }: TypeFnParam): boolean =>
        filterValue != null ? value === filterValue : true,
    },
    {
      name: 'neq',
      fn: ({ value, filterValue }: TypeFnParam): boolean =>
        filterValue != null ? value !== filterValue : true,
    },
    {
      name: 'inrange',
      fn: ({ value, filterValue }: TypeFnParam) => {
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
      fn: ({ value, filterValue }: TypeFnParam) => {
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
      fn: ({
        value,
        filterValue,

        column: { dateFormat },
      }: TypeFnParam): boolean =>
        filterValue
          ? window
              .moment(window.moment(value).format(dateFormat), dateFormat)
              .isAfter(window.moment(filterValue, dateFormat))
          : true,
    },
    {
      name: 'afterOrOn',
      fn: ({
        value,
        filterValue,

        column: { dateFormat },
      }: TypeFnParam): boolean =>
        filterValue != null
          ? window
              .moment(window.moment(value).format(dateFormat), dateFormat)
              .isSameOrAfter(window.moment(filterValue, dateFormat))
          : true,
    },
    {
      name: 'before',
      fn: ({
        value,
        filterValue,

        column: { dateFormat },
      }: TypeFnParam): boolean =>
        filterValue != null
          ? window
              .moment(window.moment(value).format(dateFormat), dateFormat)
              .isBefore(window.moment(filterValue, dateFormat))
          : true,
    },
    {
      name: 'beforeOrOn',
      fn: ({
        value,
        filterValue,

        column: { dateFormat },
      }: TypeFnParam): boolean =>
        filterValue != null
          ? window
              .moment(window.moment(value).format(dateFormat), dateFormat)
              .isSameOrBefore(window.moment(filterValue, dateFormat))
          : true,
    },
    {
      name: 'eq',
      fn: ({
        value,
        filterValue,

        column: { dateFormat },
      }: TypeFnParam): boolean =>
        filterValue
          ? window
              .moment(window.moment(value).format(dateFormat), dateFormat)
              .isSame(window.moment(filterValue, dateFormat))
          : true,
    },
    {
      name: 'neq',
      fn: ({
        value,
        filterValue,

        column: { dateFormat },
      }: TypeFnParam): boolean =>
        filterValue
          ? !window
              .moment(window.moment(value).format(dateFormat), dateFormat)
              .isSame(window.moment(filterValue, dateFormat))
          : true,
    },
    {
      name: 'inrange',
      fn: ({
        value,
        filterValue,

        column: { dateFormat },
      }: TypeFnParam): boolean => {
        const { start, end } = filterValue || emptyObject;
        if (start && end) {
          return (
            window
              .moment(window.moment(value).format(dateFormat), dateFormat)
              .isSameOrAfter(window.moment(start, dateFormat)) &&
            window
              .moment(window.moment(value).format(dateFormat), dateFormat)
              .isSameOrBefore(window.moment(end, dateFormat))
          );
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
      fn: ({
        value,
        filterValue,

        column: { dateFormat },
      }: TypeFnParam): boolean => {
        const { start, end } = filterValue || emptyObject;
        if (start && end) {
          return (
            window
              .moment(window.moment(value).format(dateFormat), dateFormat)
              .isBefore(window.moment(start, dateFormat)) ||
            window
              .moment(window.moment(value).format(dateFormat), dateFormat)
              .isAfter(window.moment(end, dateFormat))
          );
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

const defaultFilterTypes: TypeFilterTypes = {
  select: selectTypes,
  string: stringTypes,
  number: numberTypes,
  bool: boolTypes,
  boolean: booleanTypes,
  date: dateTypes,
};

export {
  selectTypes as select,
  stringTypes as string,
  numberTypes as number,
  boolTypes as bool,
  boolTypes as boolean,
  dateTypes as date,
};

export default defaultFilterTypes;
