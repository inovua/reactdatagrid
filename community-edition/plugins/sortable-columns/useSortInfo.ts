/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { MutableRefObject, useCallback } from 'react';
import {
  TypeSortInfo,
  TypeComputedProps,
  TypeComputedColumn,
  TypeSingleSortInfo,
} from '../../types';
import isControlledProperty from '../../utils/isControlledProperty';
import useProperty from '../../hooks/useProperty';
import batchUpdate from '../../utils/batchUpdate';

const getNextSortInfoForColumn = (
  currentDir: 1 | 0 | -1,
  column: TypeComputedColumn,
  {
    allowUnsort,
    multiSort,
    forceDir,
    sortFunctions,
  }: {
    allowUnsort: boolean;
    multiSort: boolean;
    forceDir?: 0 | 1 | -1;
    sortFunctions: {
      [key: string]: (...args: any[]) => number | boolean;
    } | null;
  }
): TypeSingleSortInfo | null => {
  const newSortInfo: TypeSingleSortInfo = {
    dir: 1,
    id: column.id,
    name: column.sortName || column.name || '',
    type: column.type,
  };

  // column cannot be sorted if it has no name and no sort function
  const sortName: string = newSortInfo.name;
  if (!sortName && !column.sort) {
    return null;
  }

  let sortFn = column.sort;
  if (!sortFn && sortFunctions && sortFunctions[column.type!]) {
    sortFn = sortFunctions[column.type!];
  }

  if (sortFn) {
    newSortInfo.fn = (one, two) => sortFn!(one, two, column);
  }

  if (forceDir !== undefined) {
    newSortInfo.dir = forceDir;

    return newSortInfo;
  }

  if (!currentDir) {
    newSortInfo.dir = 1;
  } else if (currentDir === 1) {
    newSortInfo.dir = -1;
  } else if (currentDir === -1) {
    // newSortInfo shoud be null in this case
    // this means there is no sort
    // so there is no need to sort with nothing
    if (allowUnsort || multiSort) {
      return null;
    }
    newSortInfo.dir = 1;
  }

  return newSortInfo;
};

const getNextSingleSortInfo = (
  column: TypeComputedColumn,
  currentSortInfo: TypeSortInfo,
  {
    allowUnsort = false,
    multiSort,
    forceDir,
    sortFunctions,
  }: {
    allowUnsort: boolean;
    multiSort: boolean;
    forceDir?: 0 | 1 | -1;
    sortFunctions: {
      [key: string]: (...args: any[]) => number | boolean;
    } | null;
  }
): TypeSingleSortInfo | null => {
  if (Array.isArray(currentSortInfo)) {
    return null;
  }

  return getNextSortInfoForColumn(
    currentSortInfo &&
      (currentSortInfo.name === column.id ||
        currentSortInfo.id === column.id ||
        currentSortInfo.name === column.sortName)
      ? currentSortInfo.dir
      : 0,
    column,
    { allowUnsort, multiSort, forceDir, sortFunctions }
  );
};

const getNextMultipleSortInfo = (
  column: TypeComputedColumn,
  currentSortInfo: TypeSortInfo,
  {
    allowUnsort = false,
    forceDir,
    sortFunctions,
  }: {
    allowUnsort: boolean;
    forceDir?: 0 | 1 | -1;
    sortFunctions: {
      [key: string]: (...args: any[]) => number | boolean;
    } | null;
  }
): TypeSortInfo => {
  let result: any;
  if (!Array.isArray(currentSortInfo)) {
    const info = getNextSingleSortInfo(column, currentSortInfo, {
      allowUnsort,
      multiSort: true,
      forceDir,
      sortFunctions,
    });

    result = [info].filter(x => x);
  } else {
    const sortInfoIndex: number = currentSortInfo.findIndex(value =>
      value.id
        ? value.id === column.id
        : value.name === column.name || value.name === column.sortName
    );
    const currentSortInfoForColumn = currentSortInfo[sortInfoIndex];
    const nextSortInfoForColumn = getNextSingleSortInfo(
      column,
      currentSortInfo[sortInfoIndex],
      { allowUnsort, multiSort: true, forceDir, sortFunctions }
    );

    if (nextSortInfoForColumn && forceDir !== undefined) {
      nextSortInfoForColumn.dir = forceDir;
    }

    result = (currentSortInfoForColumn
      ? [
          ...currentSortInfo.slice(0, sortInfoIndex),
          nextSortInfoForColumn,
          ...currentSortInfo.slice(sortInfoIndex + 1),
        ]
      : [...currentSortInfo, nextSortInfoForColumn]
    ).filter(x => x);
  }

  return result;
};

const useSortInfo = (
  props: {
    sortInfo?: TypeSortInfo;
    defaultSortInfo?: TypeSortInfo;
    allowUnsort: boolean;
  },
  _: any,
  computedPropsRef: MutableRefObject<TypeComputedProps | null>
): {
  computedIsMultiSort: boolean;
  computedSortInfo: TypeSortInfo;
  setSortInfo: (sortInfo: TypeSortInfo) => void;
  toggleColumnSort: (colId: any) => void;
  setColumnSortInfo: (
    column:
      | string
      | number
      | { id: string | number; name?: string | number }
      | { name: string | number; id?: string | number },
    dir: 1 | 0 | -1
  ) => void;
  unsortColumn: (
    column:
      | string
      | number
      | { id: string | number; name?: string | number }
      | { name: string | number; id?: string | number }
  ) => void;
} => {
  const controlled = isControlledProperty(props, 'sortInfo');

  let [sortInfo, silentSetSortInfo]: [
    TypeSortInfo,
    (sortInfo: TypeSortInfo) => void
  ] = useProperty<TypeSortInfo>(props, 'sortInfo');

  if (controlled) {
    // TODO
  }

  const setSortInfo = useCallback((sortInfo: TypeSortInfo) => {
    const computedProps = computedPropsRef.current;
    if (!computedProps) {
      return;
    }

    const queue = batchUpdate();
    const { computedRemoteData } = computedProps;

    queue.commit(() => {
      if (
        computedProps.computedPagination &&
        computedProps.setSkip &&
        computedProps.computedSkip
      ) {
        computedProps.setSkip(0);
      }
      silentSetSortInfo(sortInfo);

      if (computedRemoteData) {
        // remote data
        computedProps.setLoadDataTrigger((loadDataTrigger: string[]) => [
          ...loadDataTrigger,
          'sortInfo',
        ]);
      }
    });
  }, []);

  const toggleColumnSort = useCallback(
    (
      colId:
        | string
        | number
        | { id: string | number; name?: string | number }
        | { name: string | number; id?: string | number }
    ): void => {
      const computedProps = computedPropsRef.current;
      if (!computedProps) {
        return;
      }
      const allowUnsort = computedProps.allowUnsort;
      const computedColumn: TypeComputedColumn = computedProps.getColumnBy(
        colId
      ) as TypeComputedColumn;

      if (!computedColumn) {
        return;
      }

      const sortInfo = computedProps.computedSortInfo;
      const computedIsMultiSort = computedProps.computedIsMultiSort;
      const nextSortInfo = computedIsMultiSort
        ? getNextMultipleSortInfo(computedColumn, sortInfo, {
            allowUnsort,
            sortFunctions: computedProps.sortFunctions,
          })
        : getNextSingleSortInfo(computedColumn, sortInfo, {
            allowUnsort,
            multiSort: false,
            sortFunctions: computedProps.sortFunctions,
          });
      setSortInfo(nextSortInfo);
    },
    []
  );

  const setColumnSortInfo = useCallback(
    (
      column:
        | string
        | number
        | { id: string | number; name?: string | number }
        | { name: string | number; id?: string | number },
      dir: 1 | 0 | -1
    ) => {
      const { current: computedProps } = computedPropsRef;

      if (!computedProps) {
        return;
      }

      const allowUnsort = computedProps.allowUnsort;
      const computedColumn: TypeComputedColumn = computedProps.getColumnBy(
        column
      ) as TypeComputedColumn;

      if (!computedColumn) {
        return;
      }
      const computedIsMultiSort = computedProps.computedIsMultiSort;

      const nextSortInfo = computedIsMultiSort
        ? getNextMultipleSortInfo(computedColumn, sortInfo, {
            allowUnsort,
            forceDir: dir,
            sortFunctions: computedProps.sortFunctions,
          })
        : getNextSingleSortInfo(computedColumn, sortInfo, {
            allowUnsort,
            multiSort: false,
            forceDir: dir,
            sortFunctions: computedProps.sortFunctions,
          });
      setSortInfo(nextSortInfo);
    },
    []
  );

  const unsortColumn = (
    column:
      | string
      | number
      | { id: string | number; name?: string | number }
      | { name: string | number; id?: string | number }
  ) => {
    const { current: computedProps } = computedPropsRef;

    if (!computedProps) {
      return;
    }
    const computedColumn: TypeComputedColumn = computedProps.getColumnBy(
      column
    ) as TypeComputedColumn;

    if (!computedColumn) {
      return;
    }

    const columnSortInfo: TypeSingleSortInfo = computedColumn.computedSortInfo as TypeSingleSortInfo;

    if (!columnSortInfo) {
      return;
    }

    const sortInfo = computedProps.computedSortInfo;

    let newSortInfo = null;
    if (Array.isArray(sortInfo)) {
      newSortInfo = sortInfo.filter((sortInfo: TypeSingleSortInfo) => {
        if (
          sortInfo &&
          (sortInfo.id === columnSortInfo.id ||
            sortInfo.name === columnSortInfo.name)
        ) {
          return false;
        }

        return true;
      });
    }

    setSortInfo(newSortInfo);
  };

  return {
    computedSortInfo: sortInfo,
    unsortColumn,
    setSortInfo,
    computedIsMultiSort: Array.isArray(sortInfo),
    toggleColumnSort,
    setColumnSortInfo,
  };
};

export default useSortInfo;
