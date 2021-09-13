/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useState, useLayoutEffect, useRef, useCallback, } from 'react';
import clamp from '../../utils/clamp';
import getIndexBy from '../../utils/getIndexBy';
import deepEqual from 'fast-deep-equal';
import useLoadDataEffect from '../useLoadDataEffect';
import useProperty from '../useProperty';
import useNamedState from '../useNamedState';
import computeData from './computeData';
import batchUpdate from '../../utils/batchUpdate';
import usePrevious from '../usePrevious';
import isControlledProperty from '../../utils/isControlledProperty';
const raf = global.requestAnimationFrame;
const isRemoteData = (props) => {
    if (props.dataSource == null) {
        return false;
    }
    return (typeof props.dataSource.then === 'function' ||
        typeof props.dataSource === 'function');
};
const isRemoteSort = (props) => {
    const { remoteSort } = props;
    return (remoteSort === true || (remoteSort === undefined && isRemoteData(props)));
};
const isRemoteFilter = (props) => {
    const { remoteFilter } = props;
    return (remoteFilter === true || (remoteFilter === undefined && isRemoteData(props)));
};
const isPagination = (props) => {
    return !!props.pagination;
};
const isLocalPagination = (props) => {
    return isPagination(props) && !isRemotePagination(props);
};
export const isLivePagination = (props) => !!props.livePagination && isRemotePagination(props);
const isRemotePagination = (props) => {
    const { remotePagination, pagination, livePagination } = props;
    if (pagination === false || pagination === 'local') {
        return false;
    }
    if (pagination === 'remote' || isRemoteData(props)) {
        return true;
    }
    if (remotePagination !== undefined) {
        return remotePagination;
    }
    return !!livePagination;
};
const loadDataSource = (dataSource, { skip, limit, currentData, sortInfo, filterValue, groupBy, }) => {
    if (typeof dataSource === 'function') {
        dataSource = loadDataSource(dataSource({
            skip,
            limit,
            sortInfo,
            currentData,
            filterValue,
            groupBy,
        }), { skip, limit, sortInfo, groupBy, filterValue, currentData });
    }
    if (dataSource instanceof Promise) {
        return dataSource.then((result) => {
            if (Array.isArray(result)) {
                return {
                    data: result,
                    count: result.length,
                };
            }
            return {
                data: result.data,
                count: result.count,
            };
        });
    }
    return Promise.resolve({ data: dataSource, count: dataSource.length });
};
// original :___ filter___>> FILTERED :____ sort ___>> SORTED :_____paginate ____>> PAGINATED :_____group_____>> GROUPED
const useData = ({ dataSource, skip, limit, localPagination, }, context) => {
    let data;
    let silentSetData;
    [data, silentSetData] = useNamedState([], context, 'data');
    const [dataMap, setDataMap] = useState(null);
    const [dataIndexMap, setDataIndexMap] = useState(null);
    let originalData;
    let setOriginalData;
    [originalData, setOriginalData] = useNamedState(Array.isArray(dataSource) ? dataSource : [], context, 'originalData');
    let [count, setCount] = useNamedState(data.length, context, 'count');
    let [dataCountAfterFilter, setDataCountAfterFilter] = useNamedState(0, context, 'dataCountAfterFilter');
    return {
        setDataMap,
        dataMap,
        dataIndexMap,
        setDataIndexMap,
        originalData,
        setOriginalData,
        data,
        count,
        dataCountAfterFilter,
        silentSetData,
        setDataCountAfterFilter,
        setCount,
    };
};
const getDataCountForPagination = (props) => {
    const paginationCount = props.remotePagination
        ? props.count
        : props.dataCountAfterFilter != null
            ? props.dataCountAfterFilter
            : props.originalData.length;
    return paginationCount;
};
const getCurrentPage = (props) => Math.floor(props.skip / props.limit) + 1;
const getPageCount = ({ count, limit, }) => Math.ceil(count / limit);
const getSkipForPage = ({ page, limit, }) => Math.max(0, limit * (page - 1));
// it's 1 based
const hasNextPage = ({ skip, limit, count, }) => getCurrentPage({ skip, limit }) < getPageCount({ count, limit });
const hasPrevPage = ({ skip, limit, count, }) => {
    const currentPage = getCurrentPage({ skip, limit });
    return currentPage > 1 && currentPage - 1 < getPageCount({ count, limit });
};
const usePagination = ({ append, reload, setAppend, skip, limit, count, setSkip: silentSetSkip, setLimit: silentSetLimit, remotePagination, localPagination, pagination, lastSkipRef, lastLimitRef, dataCountAfterFilter, livePagination, originalData, data, }, computedPropsRef) => {
    const paginationCount = getDataCountForPagination({
        originalData,
        remotePagination,
        count,
        dataCountAfterFilter,
    });
    const setLimitOrSkip = (computedProps, config, queue) => {
        return computeData({
            skip,
            limit,
            ...config,
            localPagination,
        }, computedProps, queue);
    };
    const setSkip = (skip, config) => {
        const computedProps = computedPropsRef.current;
        const queue = batchUpdate();
        const { computedRemoteData } = computedProps;
        queue.commit(() => {
            if (config && config.append !== undefined) {
                setAppend(config.append);
            }
            if (computedRemoteData) {
                // remote data
                computedProps.setLoadDataTrigger((loadDataTrigger) => [
                    ...loadDataTrigger,
                    'skip',
                ]);
            }
            silentSetSkip(skip);
        });
    };
    const setLimit = (limit) => {
        const computedProps = computedPropsRef.current;
        const queue = batchUpdate();
        const { computedRemoteData } = computedProps;
        queue.commit(() => {
            if (computedRemoteData) {
                // remote data
                computedProps.setLoadDataTrigger((loadDataTrigger) => [
                    ...loadDataTrigger,
                    'limit',
                ]);
            }
            silentSetLimit(limit);
        });
    };
    const incrementSkip = (amount, config) => {
        setSkip(skip + amount, config);
    };
    const gotoNextPage = (config) => {
        if (hasNextPage({ skip, limit: lastLimitRef.current, count: paginationCount })) {
            incrementSkip(lastLimitRef.current, config);
        }
    };
    const gotoPrevPage = () => {
        if (hasPrevPage({ skip, limit, count: paginationCount })) {
            incrementSkip(-limit);
        }
    };
    const gotoPage = (page, config) => {
        page = clamp(page, 1, getPageCount({ count: paginationCount, limit }));
        const force = config ? config.force : false;
        if (page === getCurrentPage({ skip, limit }) && !force) {
            return;
        }
        setSkip(getSkipForPage({ page, limit }));
    };
    const hasNext = () => hasNextPage({ skip, limit, count: paginationCount });
    const hasPrev = () => hasPrevPage({ skip, limit, count: paginationCount });
    const gotoFirstPage = () => gotoPage(1);
    const gotoLastPage = () => gotoPage(getPageCount({ count: paginationCount, limit }));
    let paginationProps;
    if ((localPagination || remotePagination) && !livePagination) {
        paginationProps = {
            onSkipChange: setSkip,
            onLimitChange: setLimit,
            reload,
            onRefresh: reload,
            totalCount: paginationCount,
            count,
            skip,
            limit,
            remotePagination,
            localPagination,
            livePagination,
            pagination,
            gotoNextPage,
            gotoFirstPage,
            gotoLastPage,
            gotoPrevPage,
            hasNextPage: hasNext,
            hasPrevPage: hasPrev,
        };
    }
    return {
        count,
        paginationCount,
        reload,
        setSkip,
        setLimit,
        gotoNextPage,
        gotoPrevPage,
        hasNextPage: hasNext,
        hasPrevPage: hasPrev,
        gotoFirstPage,
        gotoLastPage,
        paginationProps,
    };
};
const useDataSourceCache = (props, computedProps, computedPropsRef) => {
    const prevDataSource = usePrevious(props.dataSource, props.dataSource);
    let [dataSourceCache, setDataSourceCache] = useProperty(props, 'dataSourceCache', undefined, {
        onChange: (dataSourceCache, info) => {
            const { current: computedProps } = computedPropsRef;
            if (!computedProps) {
                return;
            }
            if (computedProps.initialProps.onDataSourceCacheChange) {
                computedProps.initialProps.onDataSourceCacheChange(dataSourceCache, info);
            }
        },
    });
    // both this is needed
    if (props.clearDataSourceCacheOnChange &&
        prevDataSource !== props.dataSource) {
        dataSourceCache = undefined;
    }
    // and this
    useLayoutEffect(() => {
        if (props.clearDataSourceCacheOnChange) {
            setDataSourceCache(undefined);
        }
    }, [props.dataSource]);
    // the first if is needed because we need the value to be cleared
    // right away, since we use it in other computations following syncronously after
    // the useDataSourceCache call
    // the hook is needed because we want it to be applied for subsequent calls as well
    return [dataSourceCache, setDataSourceCache];
};
export default (props, computedProps, computedPropsRef) => {
    const computedRemoteData = isRemoteData(props);
    const computedRemoteFilter = isRemoteFilter(props);
    const computedRemoteSort = isRemoteSort(props);
    const computedLivePagination = isLivePagination(props);
    const computedRemotePagination = isRemotePagination(props);
    const computedLocalPagination = isLocalPagination(props);
    const computedPagination = computedRemotePagination || computedLocalPagination;
    const [ungroupedData, setUngroupedData] = useState([]);
    const [loadDataTrigger, setLoadDataTrigger] = useState([]);
    const [append, setAppend] = useState(false);
    const [computedSkip, setSkip] = useProperty(props, 'skip', 0);
    const [computedLimit, setLimit] = useProperty(props, 'limit', 50);
    const [computedDataSourceCache, setDataSourceCache] = useDataSourceCache(props, computedProps, computedPropsRef);
    const [summary, setSummary] = useState(props.summaryReducer ? props.summaryReducer.initialValue : null);
    const setItemAt = (index, item, config) => {
        const replace = config && config.replace;
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        let newItem = computedProps.getItemAt(index);
        const oldId = computedProps.getItemId(newItem);
        if (!newItem) {
            return;
        }
        if (replace) {
            newItem = item;
        }
        else {
            if (config && config.property) {
                newItem = { ...newItem, [config.property]: config.value };
            }
            else {
                newItem = { ...newItem, ...item };
            }
        }
        const newId = computedProps.getItemId(newItem);
        if (newId !== oldId) {
            if (computedProps.showWarnings) {
                console.error(`Cannot replace the item with another one that has a different value for the idProperty!`);
            }
            return;
        }
        setDataSourceCache({
            ...computedProps.computedDataSourceCache,
            [newId]: newItem,
        });
    };
    const setItemsAt = (items, config) => {
        const replace = config && config.replace;
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        const newItems = [];
        for (let i = 0; i < items.length; i++) {
            const oldId = computedProps.getItemId(items[i]);
            let newItem = computedProps.getItemAt(oldId);
            if (!newItem) {
                continue;
            }
            if (replace) {
                newItem = items[i];
            }
            else {
                newItem = { ...newItem, ...items[i] };
            }
            const newId = computedProps.getItemId(newItem);
            if (newId !== oldId) {
                continue;
            }
            newItems.push(newItem);
        }
        if (!newItems || newItems.length === 0) {
            return;
        }
        setDataSourceCache({
            ...computedProps.computedDataSourceCache,
            ...newItems,
        });
    };
    const setItemPropertyAt = (index, property, value) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        if (property === computedProps.idProperty) {
            if (computedProps.showWarnings) {
                console.error(`Cannot update the value of the "idProperty" property!`);
            }
        }
        let item = computedProps.getItemAt(index);
        if (item) {
            item = { ...item };
            item[property] = value;
            setItemAt(index, item, { property, value });
        }
    };
    const setItemPropertyForId = (id, property, value) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        const index = computedProps.getRowIndexById(id);
        setItemPropertyAt(index, property, value);
    };
    const { data, dataMap, dataIndexMap, setDataIndexMap, setDataMap, count, silentSetData, setCount, originalData, setOriginalData, dataCountAfterFilter, setDataCountAfterFilter, } = useData({
        dataSource: props.dataSource,
        skip: computedSkip,
        limit: computedLimit,
        localPagination: computedLocalPagination,
    }, props.context);
    const [reloadTimestamp, setReloadTimestamp] = useState(Date.now);
    const reload = () => {
        setReloadTimestamp(Date.now());
    };
    const lastSkipRef = useRef(computedSkip);
    const lastFilterValueRef = useRef(computedProps.computedFilterValue);
    const lastLimitRef = useRef(computedLimit);
    const lastGroupBy = usePrevious(computedProps.computedGroupBy, computedProps.computedGroupBy);
    const lastDataSource = usePrevious(props.dataSource, props.dataSource);
    let dataPromiseRef = useRef(null);
    dataPromiseRef.current = useLoadDataEffect({
        getDataSource: ({ shouldReload }) => {
            const computedProps = computedPropsRef.current;
            return shouldReload
                ? computedProps.dataSource
                : computedProps.originalData;
        },
    }, (dataToLoad, { shouldReload, intercept }) => {
        const { computedSortInfo, computedRemoteData, computedFilterValue, computedGroupBy, originalData: prevOriginalData, skipLoadOnMount, wasMountedRef, initialState, } = computedPropsRef.current;
        if (!prevOriginalData.length && computedRemoteData) {
            // initial loading
            computedPropsRef.current.setLoading(true);
        }
        let initialCount;
        if (skipLoadOnMount &&
            !wasMountedRef.current &&
            initialState &&
            initialState.data) {
            dataToLoad = initialState.data;
            initialCount = initialState.count;
        }
        if (computedRemoteData && !Array.isArray(dataToLoad)) {
            computedPropsRef.current.setLoading(true);
        }
        const skipControlled = isControlledProperty(computedProps.initialProps, 'skip');
        let shouldResetSkip = shouldReload &&
            typeof props.dataSource === 'function' &&
            props.dataSource !== lastDataSource &&
            !skipControlled &&
            computedPropsRef.current.computedSkip !== 0;
        if (!shouldResetSkip) {
            if (shouldReload &&
                typeof props.dataSource === 'function' &&
                computedPropsRef.current.computedSkip !== 0 &&
                computedPropsRef.current.computedFilterable &&
                (!deepEqual(computedPropsRef.current.computedFilterValue, lastFilterValueRef.current) ||
                    computedPropsRef.current.computedGroupBy !== lastGroupBy)) {
                shouldResetSkip = true;
            }
        }
        if (shouldResetSkip) {
            setSkip(0);
            // prevent reload data now - let the cmp rerender and changing skip will trigger reload
            return Promise.resolve(true);
        }
        return intercept(loadDataSource(dataToLoad, {
            sortInfo: computedSortInfo,
            currentData: computedPropsRef.current.data,
            skip: computedSkip,
            limit: computedLimit,
            filterValue: computedFilterValue,
            groupBy: computedGroupBy,
        }), dataToLoad).then(({ data: originalData, count }) => {
            if (initialCount) {
                count = initialCount;
            }
            const computedProps = computedPropsRef.current;
            const queue = batchUpdate();
            let data = originalData;
            let shouldAppend = computedLivePagination && !shouldReload
                ? computedSkip > lastSkipRef.current
                : append;
            if (shouldAppend) {
                originalData = prevOriginalData.concat(originalData);
                data = originalData;
            }
            const computeDataResult = computeData({
                remoteData: false,
                originalData,
            }, computedProps, queue);
            data = computeDataResult.data || originalData;
            let dataCountAfterFilter = computeDataResult.dataCountAfterFilter;
            let prevComputedSkip = lastSkipRef.current;
            lastSkipRef.current = computedSkip;
            lastFilterValueRef.current = computedFilterValue;
            lastLimitRef.current = computedLimit;
            const shouldIndexData = computedProps.computedRowSelectionEnabled ||
                computedProps.computedRowExpandEnabled ||
                computedProps.treeColumn ||
                computedProps.treeEnabled ||
                computedProps.rowIndexColumn ||
                computedProps.computedRowHeights ||
                (computedProps.computedGroupBy && props.stickyGroupRows);
            let dataIndexMap = shouldIndexData && Array.isArray(data) ? {} : null;
            const stickyGroupsIndexes = props.stickyGroupRows === true || props.stickyTreeNodes === true
                ? {}
                : null;
            const dataMap = shouldIndexData && Array.isArray(data)
                ? data.reduce((acc, item, index) => {
                    const id = computedProps.getItemId(item);
                    if (stickyGroupsIndexes) {
                        if (item.__group) {
                            stickyGroupsIndexes[index] = item.depth;
                        }
                        if (item.__nodeProps && !item.__nodeProps.leafNode) {
                            stickyGroupsIndexes[index] = item.__nodeProps.depth + 1;
                        }
                    }
                    acc[id] = item;
                    dataIndexMap[id] = index;
                    return acc;
                }, {})
                : null;
            return queue.commit(() => {
                const computedProps = computedPropsRef.current;
                setOriginalData(originalData);
                if (computedProps.scrollTopOnSort &&
                    computedProps.loadDataTrigger.find(s => s == 'sortInfo')) {
                    raf(() => {
                        computedProps.setScrollTop(0);
                    });
                }
                if (computedSkip === 0 && prevComputedSkip > 0) {
                    raf(() => {
                        computedProps.setScrollTop(0);
                    });
                }
                if (computedProps.scrollTopOnFilter &&
                    computedProps.loadDataTrigger.find(s => s == 'filterValue')) {
                    raf(() => {
                        computedProps.setScrollTop(0);
                    });
                }
                setLoadDataTrigger([]);
                if (append) {
                    setAppend(false);
                }
                computedProps.setDataMap(dataMap);
                computedProps.setDataIndexMap(dataIndexMap);
                if (stickyGroupsIndexes && computedProps.setStickyGroupsIndexes) {
                    computedProps.setStickyGroupsIndexes(stickyGroupsIndexes);
                }
                setDataCountAfterFilter(dataCountAfterFilter);
                if (dataCountAfterFilter != null &&
                    computedSkip >= dataCountAfterFilter &&
                    !computedRemoteData) {
                    setSkip(0);
                }
                silentSetData(data || []);
                computedProps.setLoading(false);
                if (shouldReload) {
                    setCount(count);
                }
            });
        }, _err => {
            // pending promise discarded
            // newer requests came in before this finished, so ignoring the promise
        });
    }, {
        reloadDeps: [
            props.dataSource,
            // when we have remote data, we have to load data (call the dataSource fn) whenever a controlled or uncontrolled skip/limit changes
            // but for local data, the data is updated internally in the grid
            computedRemoteData ? computedSkip : null,
            computedRemoteData && !computedLivePagination ? computedLimit : null,
            reloadTimestamp,
            props.pagination,
            props.remotePagination,
            props.pivot,
            props.livePagination,
            computedRemoteData || props.groupBy
                ? computedProps.computedGroupBy
                : null,
            computedRemoteData
                ? JSON.stringify(computedProps.computedSortInfo)
                : null,
            computedRemoteData
                ? JSON.stringify(computedProps.computedFilterValue)
                : null,
            computedRemoteFilter
                ? JSON.stringify(computedProps.computedFilterValue)
                : null,
        ],
        noReloadDeps: [
            originalData,
            computedProps.computedGroupBy,
            computedProps.groupColumn,
            computedProps.renderRowDetails,
            computedProps.treeColumn,
            computedProps.showGroupSummaryRow,
            !computedRemoteData ? computedSkip : null,
            !computedRemoteData ? computedLimit : null,
            !computedRemoteData
                ? JSON.stringify(computedProps.computedSortInfo)
                : null,
            !computedRemoteFilter
                ? JSON.stringify(computedProps.computedFilterValue)
                : null,
            JSON.stringify(computedProps.computedCollapsedGroups || ''),
            JSON.stringify(computedProps.computedExpandedGroups || ''),
            computedProps.computedExpandedNodes
                ? JSON.stringify(computedProps.computedExpandedNodes)
                : null,
            computedProps.computedNodeCache
                ? JSON.stringify(computedProps.computedNodeCache)
                : null,
            computedProps.computedLoadingNodes
                ? JSON.stringify(computedProps.computedLoadingNodes)
                : null,
            computedDataSourceCache,
            computedProps.stickyGroupRows,
        ],
    });
    const paginationProps = usePagination({
        append,
        reload,
        setAppend,
        lastSkipRef,
        lastLimitRef,
        skip: computedSkip,
        limit: computedLimit,
        count,
        setSkip,
        setLimit,
        pagination: computedPagination,
        livePagination: computedLivePagination,
        localPagination: computedLocalPagination,
        remotePagination: computedRemotePagination,
        dataCountAfterFilter,
        originalData,
        data,
    }, computedPropsRef);
    const getRowIndexById = useCallback((rowId, data) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return -1;
        }
        const { dataIndexMap } = computedProps;
        if (dataIndexMap) {
            return dataIndexMap[rowId];
        }
        data = data || computedProps.data;
        return getIndexBy(data, computedProps.idProperty, rowId);
    }, []);
    const getItemIndexById = useCallback((id, data) => {
        return getRowIndexById(id, data);
    }, []);
    const getData = useCallback(() => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return [];
        }
        return computedProps.data;
    }, []);
    return {
        getData,
        getRowIndexById,
        getItemIndexById,
        data,
        dataMap,
        setDataMap,
        dataIndexMap,
        setDataIndexMap,
        loadDataTrigger,
        setLoadDataTrigger,
        originalData,
        setOriginalData,
        ungroupedData,
        setUngroupedData,
        computedSkip,
        computedPagination,
        computedLimit,
        computedSummary: summary,
        setSummary,
        dataPromiseRef,
        setSkip,
        setLimit,
        silentSetData,
        computedLivePagination,
        computedLocalPagination,
        computedRemotePagination,
        computedRemoteData,
        computedRemoteFilter,
        computedRemoteSort,
        computedDataSourceCache,
        setDataSourceCache,
        setItemPropertyAt,
        setItemPropertyForId,
        setItemAt,
        setItemsAt,
        ...paginationProps,
    };
};
