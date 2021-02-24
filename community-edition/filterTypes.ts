/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TypeFilterType } from './types';

const emptyObject = {};

export const stringTypes: TypeFilterType = {
  type: 'string',
  emptyValue: '',
  operators: [
    {
      name: 'contains',
      fn: ({
        value,
        filterValue,
        data,
      }: {
        value: string;
        filterValue: string;
        data: any;
      }): boolean => {
        value = value || '';
        return !filterValue
          ? true
          : value.toLowerCase().indexOf(filterValue.toLowerCase()) != -1;
      },
    },
    {
      name: 'notContains',
      fn: ({
        value,
        filterValue,
        data,
      }: {
        value: string;
        filterValue: string;
        data: any;
      }): boolean =>
        !filterValue
          ? true
          : (value || '').toLowerCase().indexOf(filterValue.toLowerCase()) ===
            -1,
    },
    {
      name: 'eq',
      fn: ({
        value,
        filterValue,
        data,
      }: {
        value: string;
        filterValue: string;
        data: any;
      }): boolean => {
        return !filterValue
          ? true
          : (value || '').toLowerCase() === filterValue.toLowerCase();
      },
    },

    {
      name: 'neq',
      fn: ({
        value,
        filterValue,
        data,
      }: {
        value: string;
        filterValue: string;
        data: any;
      }): boolean => {
        return !filterValue
          ? true
          : (value || '').toLowerCase() !== filterValue.toLowerCase();
      },
    },
    {
      name: 'empty',
      fn: ({ value, data }: { value: string; data: any }): boolean => {
        return value === '';
      },
      filterOnEmptyValue: true,
      valueOnOperatorSelect: '',
      disableFilterEditor: true,
    },

    {
      name: 'notEmpty',
      fn: ({ value, data }: { value: string; data: any }): boolean => {
        return value !== '';
      },
      filterOnEmptyValue: true,
      valueOnOperatorSelect: '',
      disableFilterEditor: true,
    },
    {
      name: 'startsWith',
      fn: ({
        value,
        filterValue,
        data,
      }: {
        value: string;
        filterValue: string;
        data: any;
      }): boolean =>
        !filterValue
          ? true
          : (value || '').toLowerCase().startsWith(filterValue.toLowerCase()),
    },
    {
      name: 'endsWith',
      fn: ({
        value,
        filterValue,
        data,
      }: {
        value: string;
        filterValue: string;
        data: any;
      }): boolean =>
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
      fn: ({
        value,
        filterValue,
        data,
      }: {
        value: boolean;
        filterValue?: boolean | null;
        data: any;
      }): boolean => {
        return filterValue != null ? filterValue === value : true;
      },
    },
    {
      name: 'neq',
      fn: ({
        value,
        filterValue,
        data,
      }: {
        value: boolean;
        filterValue?: boolean | null;
        data: any;
      }): boolean => {
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
      fn: ({
        value,
        filterValue,
        data,
      }: {
        value: string;
        filterValue: any[];
        data: any;
      }): boolean => {
        return !filterValue || !filterValue.length
          ? true
          : filterValue.indexOf(value) !== -1;
      },
    },
    {
      name: 'notinlist',
      fn: ({
        value,
        filterValue,
        data,
      }: {
        value: string;
        filterValue: any[];
        data: any;
      }): boolean => {
        return !filterValue || !filterValue.length
          ? true
          : filterValue.indexOf(value) === -1;
      },
    },
    {
      name: 'eq',
      fn: <T>({
        value,
        filterValue,
        data,
        emptyValue,
      }: {
        value?: T | null;
        filterValue: T | null;
        emptyValue: T | null;
        data: any;
      }): boolean => {
        return filterValue !== emptyValue ? filterValue === value : true;
      },
    },
    {
      name: 'neq',
      fn: <T>({
        value,
        filterValue,
        emptyValue,
        data,
      }: {
        value?: T | null;
        filterValue: T | null;
        emptyValue: T | null;
        data: any;
      }): boolean => {
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
      fn: ({
        value,
        filterValue,
        data,
      }: {
        value: number;
        filterValue?: number;
        data: any;
      }): boolean => (filterValue != null ? value > filterValue : true),
    },
    {
      name: 'gte',
      fn: ({
        value,
        filterValue,
        data,
      }: {
        value: number;
        filterValue?: number;
        data: any;
      }): boolean => (filterValue != null ? value >= filterValue : true),
    },
    {
      name: 'lt',
      fn: ({
        value,
        filterValue,
        data,
      }: {
        value: number;
        filterValue?: number;
        data: any;
      }): boolean => (filterValue != null ? value < filterValue : true),
    },
    {
      name: 'lte',
      fn: ({
        value,
        filterValue,
        data,
      }: {
        value: number;
        filterValue?: number;
        data: any;
      }): boolean => (filterValue != null ? value <= filterValue : true),
    },
    {
      name: 'eq',
      fn: ({
        value,
        filterValue,
        data,
      }: {
        value: number;
        filterValue?: number;
        data: any;
      }): boolean => (filterValue != null ? value === filterValue : true),
    },
    {
      name: 'neq',
      fn: ({
        value,
        filterValue,
        data,
      }: {
        value: number;
        filterValue?: number;
        data: any;
      }): boolean => (filterValue != null ? value !== filterValue : true),
    },
    {
      name: 'inrange',
      fn: ({
        value,
        filterValue,
        data,
      }: {
        value: number;
        filterValue: { start: number; end: number };
        data: any;
      }) => {
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
      fn: ({
        value,
        filterValue,
        data,
      }: {
        value: number;
        filterValue: { start: number; end: number };
        data: any;
      }) => {
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
      fn: ({ value, filterValue, data, column: { dateFormat } }) =>
        filterValue
          ? window
              .moment(value, dateFormat)
              .isAfter(window.moment(filterValue, dateFormat))
          : true,
    },
    {
      name: 'afterOrOn',
      fn: ({ value, filterValue, data, column: { dateFormat } }) =>
        filterValue != null
          ? window
              .moment(value, dateFormat)
              .isSameOrAfter(window.moment(filterValue, dateFormat))
          : true,
    },
    {
      name: 'before',
      fn: ({ value, filterValue, data, column: { dateFormat } }) =>
        filterValue != null
          ? window
              .moment(value, dateFormat)
              .isBefore(window.moment(filterValue, dateFormat))
          : true,
    },
    {
      name: 'beforeOrOn',
      fn: ({ value, filterValue, data, column: { dateFormat } }) =>
        filterValue != null
          ? window
              .moment(value, dateFormat)
              .isSameOrBefore(window.moment(filterValue, dateFormat))
          : true,
    },
    {
      name: 'eq',
      fn: ({ value, filterValue, data, column: { dateFormat } }) =>
        filterValue
          ? window
              .moment(value, dateFormat)
              .isSame(window.moment(filterValue, dateFormat))
          : true,
    },
    {
      name: 'neq',
      fn: ({ value, filterValue, data, column: { dateFormat } }) =>
        filterValue
          ? !window
              .moment(value, dateFormat)
              .isSame(window.moment(filterValue, dateFormat))
          : true,
    },
    {
      name: 'inrange',
      fn: ({ value, filterValue, data, column: { dateFormat } }) => {
        const { start, end } = filterValue || emptyObject;
        if (start && end) {
          return (
            window
              .moment(value, dateFormat)
              .isSameOrAfter(window.moment(start, dateFormat)) &&
            window
              .moment(value, dateFormat)
              .isSameOrBefore(window.moment(end, dateFormat))
          );
        }
        if (start) {
          return window
            .moment(value, dateFormat)
            .isSameOrAfter(window.moment(start, dateFormat));
        }
        if (end) {
          return window
            .moment(value, dateFormat)
            .isSameOrBefore(window.moment(end, dateFormat));
        }
        return true;
      },
    },
    {
      name: 'notinrange',
      fn: ({ value, filterValue, data, column: { dateFormat } }) => {
        const { start, end } = filterValue || emptyObject;
        if (start && end) {
          return (
            window
              .moment(value, dateFormat)
              .isBefore(window.moment(start, dateFormat)) ||
            window
              .moment(value, dateFormat)
              .isAfter(window.moment(end, dateFormat))
          );
        }
        if (start) {
          return window
            .moment(value, dateFormat)
            .isBefore(window.moment(start, dateFormat));
        }
        if (end) {
          return window
            .moment(value, dateFormat)
            .isAfter(window.moment(end, dateFormat));
        }
        return true;
      },
    },
  ],
};

export default {
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
