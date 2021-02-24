/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useCallback } from 'react';
import isControlledProperty from '../../utils/isControlledProperty';
import useProperty from '../../hooks/useProperty';
import batchUpdate from '../../utils/batchUpdate';
const getNextSortInfoForColumn = (currentDir, column, { allowUnsort, multiSort, forceDir, sortFunctions, }) => {
    const newSortInfo = {
        dir: 1,
        id: column.id,
        name: column.sortName || column.name || '',
        type: column.type,
    };
    // column cannot be sorted if it has no name and no sort function
    const sortName = newSortInfo.name;
    if (!sortName && !column.sort) {
        return null;
    }
    let sortFn = column.sort;
    if (!sortFn && sortFunctions && sortFunctions[column.type]) {
        sortFn = sortFunctions[column.type];
    }
    if (sortFn) {
        newSortInfo.fn = (one, two) => sortFn(one, two, column);
    }
    if (forceDir !== undefined) {
        newSortInfo.dir = forceDir;
        return newSortInfo;
    }
    if (!currentDir) {
        newSortInfo.dir = 1;
    }
    else if (currentDir === 1) {
        newSortInfo.dir = -1;
    }
    else if (currentDir === -1) {
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
const getNextSingleSortInfo = (column, currentSortInfo, { allowUnsort = false, multiSort, forceDir, sortFunctions, }) => {
    if (Array.isArray(currentSortInfo)) {
        return null;
    }
    return getNextSortInfoForColumn(currentSortInfo &&
        (currentSortInfo.name === column.id ||
            currentSortInfo.id === column.id ||
            currentSortInfo.name === column.sortName)
        ? currentSortInfo.dir
        : 0, column, { allowUnsort, multiSort, forceDir, sortFunctions });
};
const getNextMultipleSortInfo = (column, currentSortInfo, { allowUnsort = false, forceDir, sortFunctions, }) => {
    let result;
    if (!Array.isArray(currentSortInfo)) {
        const info = getNextSingleSortInfo(column, currentSortInfo, {
            allowUnsort,
            multiSort: true,
            forceDir,
            sortFunctions,
        });
        result = [info].filter(x => x);
    }
    else {
        const sortInfoIndex = currentSortInfo.findIndex(value => value.id
            ? value.id === column.id
            : value.name === column.name || value.name === column.sortName);
        const currentSortInfoForColumn = currentSortInfo[sortInfoIndex];
        const nextSortInfoForColumn = getNextSingleSortInfo(column, currentSortInfo[sortInfoIndex], { allowUnsort, multiSort: true, forceDir, sortFunctions });
        if (nextSortInfoForColumn && forceDir !== undefined) {
            nextSortInfoForColumn.dir = forceDir;
        }
        result = (currentSortInfoForColumn
            ? [
                ...currentSortInfo.slice(0, sortInfoIndex),
                nextSortInfoForColumn,
                ...currentSortInfo.slice(sortInfoIndex + 1),
            ]
            : [...currentSortInfo, nextSortInfoForColumn]).filter(x => x);
    }
    return result;
};
const useSortInfo = (props, _, computedPropsRef) => {
    const controlled = isControlledProperty(props, 'sortInfo');
    let [sortInfo, silentSetSortInfo] = useProperty(props, 'sortInfo');
    if (controlled) {
        // TODO
    }
    const setSortInfo = useCallback((sortInfo) => {
        const computedProps = computedPropsRef.current;
        if (!computedProps) {
            return;
        }
        const queue = batchUpdate();
        const { computedRemoteData } = computedProps;
        queue.commit(() => {
            if (computedProps.computedPagination &&
                computedProps.setSkip &&
                computedProps.computedSkip) {
                computedProps.setSkip(0);
            }
            silentSetSortInfo(sortInfo);
            if (computedRemoteData) {
                // remote data
                computedProps.setLoadDataTrigger((loadDataTrigger) => [
                    ...loadDataTrigger,
                    'sortInfo',
                ]);
            }
        });
    }, []);
    const toggleColumnSort = useCallback((colId) => {
        const computedProps = computedPropsRef.current;
        if (!computedProps) {
            return;
        }
        const allowUnsort = computedProps.allowUnsort;
        const computedColumn = computedProps.getColumnBy(colId);
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
    }, []);
    const setColumnSortInfo = useCallback((column, dir) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        const allowUnsort = computedProps.allowUnsort;
        const computedColumn = computedProps.getColumnBy(column);
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
    }, []);
    const unsortColumn = (column) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        const computedColumn = computedProps.getColumnBy(column);
        if (!computedColumn) {
            return;
        }
        const columnSortInfo = computedColumn.computedSortInfo;
        if (!columnSortInfo) {
            return;
        }
        const sortInfo = computedProps.computedSortInfo;
        let newSortInfo = null;
        if (Array.isArray(sortInfo)) {
            newSortInfo = sortInfo.filter((sortInfo) => {
                if (sortInfo &&
                    (sortInfo.id === columnSortInfo.id ||
                        sortInfo.name === columnSortInfo.name)) {
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
