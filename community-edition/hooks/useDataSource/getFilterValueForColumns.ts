/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  TypeFilterValue,
  TypeComputedColumnsMap,
  TypeSingleFilterValue,
} from '../../types';

const getFilterValueForColumns = (
  filterValue: TypeFilterValue,
  columnsMap: TypeComputedColumnsMap
): TypeSingleFilterValue[] => {
  return (filterValue || []).map((filterValueObject: TypeSingleFilterValue) => {
    if (filterValueObject) {
      const column = columnsMap[filterValueObject.name];
      if (column) {
        if (column.type && !filterValueObject.type) {
          filterValueObject = {
            ...filterValueObject,
            type: column.filterType || column.type,
          };
        }

        if (typeof column.getFilterValue == 'function') {
          filterValueObject = {
            ...filterValueObject,
            getFilterValue: column.getFilterValue,
          };
        }

        if (typeof column.filterName === 'string') {
          filterValueObject = {
            ...filterValueObject,
            name: column.filterName,
          };
        }
      }
    }

    return filterValueObject;
  });
};

export default getFilterValueForColumns;
