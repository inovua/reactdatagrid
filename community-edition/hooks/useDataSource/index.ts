/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  useState,
  Dispatch,
  SetStateAction,
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from 'react';

import clamp from '../../utils/clamp';
import getIndexBy from '../../utils/getIndexBy';

import deepEqual from 'fast-deep-equal';

import useLoadDataEffect from '../useLoadDataEffect';

import {
  TypeDataGridProps,
  TypeDataSource,
  TypeSortInfo,
  TypePaginationProps,
  TypeComputedProps,
  TypeBatchUpdateQueue,
  TypeGroupBy,
  TypeFilterValue,
  TypeDataSourceCache,
} from '../../types';
import useProperty from '../useProperty';
import useNamedState from '../useNamedState';
import computeData from './computeData';
import batchUpdate from '../../utils/batchUpdate';
import usePrevious from '../usePrevious';
import isControlledProperty from '../../utils/isControlledProperty';

const raf = global.requestAnimationFrame;

const isRemoteData = (props: { dataSource?: TypeDataSource }): boolean => {
  if (props.dataSource == null) {
    return false;
  }
  return (
    typeof (props.dataSource as any).then === 'function' ||
    typeof props.dataSource === 'function'
  );
};

const isRemoteSort = (props: {
  remoteSort?: boolean;
  dataSource?: TypeDataSource;
}): boolean => {
  const { remoteSort } = props;

  return (
    remoteSort === true || (remoteSort === undefined && isRemoteData(props))
  );
};

const isRemoteFilter = (props: {
  remoteFilter?: boolean;
  dataSource?: TypeDataSource;
}) => {
  const { remoteFilter } = props;

  return (
    remoteFilter === true || (remoteFilter === undefined && isRemoteData(props))
  );
};

const isPagination = (props: {
  pagination?: true | false | 'remote' | 'local';
}): boolean => {
  return !!props.pagination;
};

const isLocalPagination = (props: {
  remotePagination?: boolean;
  pagination?: true | false | 'remote' | 'local';
  livePagination?: boolean;
  dataSource?: TypeDataSource;
}): boolean => {
  return isPagination(props) && !isRemotePagination(props);
};

export const isLivePagination = (props: {
  remotePagination?: boolean;
  pagination?: true | false | 'remote' | 'local';
  livePagination?: boolean;
  dataSource?: TypeDataSource;
}): boolean => !!props.livePagination && isRemotePagination(props);

const isRemotePagination = (props: {
  remotePagination?: boolean;
  pagination?: true | false | 'remote' | 'local';
  livePagination?: boolean;
  dataSource?: TypeDataSource;
}): boolean => {
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

const loadDataSource = (
  dataSource: TypeDataSource,
  {
    skip,
    limit,
    currentData,
    sortInfo,
    filterValue,
    groupBy,
  }: {
    skip?: number;
    limit?: number;
    currentData: any[];
    filterValue?: TypeFilterValue;
    sortInfo: TypeSortInfo;
    groupBy?: TypeGroupBy;
  }
): Promise<{ data: any[]; count: number }> => {
  if (typeof dataSource === 'function') {
    dataSource = loadDataSource(
      dataSource({
        skip,
        limit,
        sortInfo,
        currentData,
        filterValue,
        groupBy,
      }),
      { skip, limit, sortInfo, groupBy, filterValue, currentData }
    );
  }

  if (dataSource instanceof Promise) {
    return (dataSource as Promise<any[] | { data: any[]; count: number }>).then(
      (result: any[] | { data: any[]; count: number }) => {
        if (Array.isArray(result)) {
          return {
            data: result,
            count: result.length,
          };
        }
        return {
          data: result.data as [],
          count: result.count as number,
        };
      }
    );
  }

  return Promise.resolve({ data: dataSource, count: dataSource.length });
};

// original :___ filter___>> FILTERED :____ sort ___>> SORTED :_____paginate ____>> PAGINATED :_____group_____>> GROUPED

const useData = (
  {
    dataSource,
    skip,
    limit,
    localPagination,
  }: {
    dataSource: TypeDataSource;
    skip?: number;
    limit?: number;
    localPagination?: boolean;
  },
  context: any
): {
  data: any[];
  originalData: any[];
  count: number;
  dataCountAfterFilter: number | undefined;
  setOriginalData: (data: any[]) => void;
  silentSetData: (data: any[]) => void;
  setCount: (count: number) => void;
  setDataCountAfterFilter: (count: number | undefined) => void;
  dataMap: null | { [key: string]: any };
  dataIndexMap: null | { [key: string]: number };
  setDataMap: (dataMap: null | { [key: string]: any }) => void;
  setDataIndexMap: (dataIndexMap: null | { [key: string]: number }) => void;
} => {
  let data: any[];
  let silentSetData: (data: any) => any;

  [data, silentSetData] = useNamedState<any[]>([], context, 'data');

  const [dataMap, setDataMap] = useState<{ [key: string]: any } | null>(null);
  const [dataIndexMap, setDataIndexMap] = useState<{
    [key: string]: number;
  } | null>(null);

  let originalData: any[];
  let setOriginalData: (data: any) => any;

  [originalData, setOriginalData] = useNamedState<any[]>(
    Array.isArray(dataSource) ? dataSource : [],
    context,
    'originalData'
  );

  let [count, setCount] = useNamedState<number>(data.length, context, 'count');
  let [dataCountAfterFilter, setDataCountAfterFilter] = useNamedState<
    number | undefined
  >(0, context, 'dataCountAfterFilter');

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

const getDataCountForPagination = (props: {
  originalData: any[];
  remotePagination: boolean;
  count: number;
  dataCountAfterFilter: number | undefined;
}): number => {
  const paginationCount = props.remotePagination
    ? props.count
    : props.dataCountAfterFilter != null
    ? props.dataCountAfterFilter
    : props.originalData.length;

  return paginationCount;
};

const getCurrentPage = (props: { skip: number; limit: number }): number =>
  Math.floor(props.skip / props.limit) + 1;

const getPageCount = ({
  count,
  limit,
}: {
  count: number;
  limit: number;
}): number => Math.ceil(count / limit);

const getSkipForPage = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): number => Math.max(0, limit * (page - 1));

// it's 1 based
const hasNextPage = ({
  skip,
  limit,
  count,
}: {
  skip: number;
  limit: number;
  count: number;
}): boolean => getCurrentPage({ skip, limit }) < getPageCount({ count, limit });

const hasPrevPage = ({
  skip,
  limit,
  count,
}: {
  skip: number;
  limit: number;
  count: number;
}): boolean => {
  const currentPage = getCurrentPage({ skip, limit });

  return currentPage > 1 && currentPage - 1 < getPageCount({ count, limit });
};

const usePagination = (
  {
    append,
    reload,
    setAppend,
    skip,
    limit,
    count,
    setSkip: silentSetSkip,
    setLimit: silentSetLimit,
    remotePagination,
    localPagination,
    pagination,
    lastSkipRef,
    lastLimitRef,
    dataCountAfterFilter,
    livePagination,
    originalData,
    data,
  }: {
    append: boolean;
    setAppend: (append: boolean) => void;
    reload: () => void;
    onRefresh?: () => void;
    lastSkipRef: MutableRefObject<number>;
    lastLimitRef: MutableRefObject<number>;
    skip: number;
    limit: number;
    count: number;
    dataCountAfterFilter: number | undefined;
    setSkip: (skip: number) => void;
    setLimit: (limit: number) => void;

    remotePagination: boolean;
    localPagination: boolean;
    pagination: boolean;
    livePagination: boolean;
    originalData: any[];
    dataSource?: TypeDataSource;
    paginationProps?: TypePaginationProps;
    data?: any[];
  },
  computedPropsRef: MutableRefObject<TypeComputedProps>
): {
  setSkip: (skip: number) => void;
  setLimit: (limit: number) => void;
  reload: () => void;
  gotoNextPage: (config?: { append: boolean }) => void;
  gotoFirstPage: () => void;
  gotoLastPage: () => void;
  gotoPrevPage: () => void;
  hasNextPage: () => boolean;
  hasPrevPage: () => boolean;
  count: number;
  paginationCount: number;
  paginationProps?: TypePaginationProps;
} => {
  const paginationCount = getDataCountForPagination({
    originalData,
    remotePagination,
    count,
    dataCountAfterFilter,
  });

  const setLimitOrSkip = (
    computedProps: TypeComputedProps,
    config: { skip?: number; limit?: number },
    queue: TypeBatchUpdateQueue
  ) => {
    return computeData(
      {
        skip,
        limit,
        ...config,
        localPagination,
      },
      computedProps,
      queue
    );
  };

  const setSkip = (skip: number, config?: { append: boolean }) => {
    const computedProps = computedPropsRef.current;
    const queue = batchUpdate();
    const { computedRemoteData } = computedProps;

    queue.commit(() => {
      if (config && config.append !== undefined) {
        setAppend(config.append);
      }

      if (computedRemoteData) {
        // remote data
        computedProps.setLoadDataTrigger((loadDataTrigger: string[]) => [
          ...loadDataTrigger,
          'skip',
        ]);
      }

      silentSetSkip(skip);
    });
  };

  const setLimit = (limit: number) => {
    const computedProps = computedPropsRef.current;
    const queue = batchUpdate();
    const { computedRemoteData } = computedProps;

    queue.commit(() => {
      if (computedRemoteData) {
        // remote data
        computedProps.setLoadDataTrigger((loadDataTrigger: string[]) => [
          ...loadDataTrigger,
          'limit',
        ]);
      }
      silentSetLimit(limit);
    });
  };

  const incrementSkip = (amount: number, config?: { append: boolean }) => {
    setSkip(skip + amount, config);
  };

  const gotoNextPage = (config?: { append: boolean }) => {
    if (
      hasNextPage({ skip, limit: lastLimitRef.current, count: paginationCount })
    ) {
      incrementSkip(lastLimitRef.current, config);
    }
  };

  const gotoPrevPage = () => {
    if (hasPrevPage({ skip, limit, count: paginationCount })) {
      incrementSkip(-limit);
    }
  };

  const gotoPage = (page: number, config?: { force: boolean }) => {
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
  const gotoLastPage = () =>
    gotoPage(getPageCount({ count: paginationCount, limit }));

  let paginationProps: TypePaginationProps | undefined;

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

const useDataSourceCache = (
  props: TypeDataGridProps,
  computedProps: TypeComputedProps,
  computedPropsRef: MutableRefObject<TypeComputedProps>
): [TypeDataSourceCache, (dataSourceCache: TypeDataSourceCache) => void] => {
  const prevDataSource = usePrevious<TypeDataSource>(
    props.dataSource,
    props.dataSource
  );
  let [dataSourceCache, setDataSourceCache] = useProperty<TypeDataSourceCache>(
    props,
    'dataSourceCache',
    undefined,
    {
      onChange: (
        dataSourceCache: TypeDataSourceCache,
        info?: { itemId: string | number; item: object }
      ) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
          return;
        }
        if (computedProps.initialProps.onDataSourceCacheChange) {
          computedProps.initialProps.onDataSourceCacheChange(
            dataSourceCache,
            info
          );
        }
      },
    }
  );

  // both this is needed
  if (
    props.clearDataSourceCacheOnChange &&
    prevDataSource !== props.dataSource
  ) {
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

export default (
  props: TypeDataGridProps,
  computedProps: TypeComputedProps,
  computedPropsRef: MutableRefObject<TypeComputedProps>
): {
  computedLivePagination: boolean;
  computedLocalPagination: boolean;
  computedPagination: boolean;
  computedRemotePagination: boolean;
  computedDataSourceCache?: TypeDataSourceCache;
  setDataSourceCache: Dispatch<SetStateAction<TypeDataSourceCache | undefined>>;
  getData: () => any[];
  getRowIndexById: (rowId: string | number, data?: any[]) => number;
  getItemIndexById: (rowId: string | number, data?: any[]) => number;
  setItemPropertyAt: (index: number, property: string, value: any) => void;
  setItemPropertyForId: (
    id: string | number,
    property: string,
    value: any
  ) => void;
  setItemAt: (
    index: number,
    item: any,
    config?: { replace?: boolean; property?: string; value?: any }
  ) => void;
  data: any[];
  ungroupedData: any[];
  setUngroupedData: Dispatch<SetStateAction<any[]>>;
  originalData: any[];
  computedSkip: number;
  computedLimit: number;
  setSkip: (s: number) => any;
  setLimit: (limit: number) => any;
  silentSetData: (data: any[]) => any;
  setOriginalData: (data: any[]) => any;
  loadNextPage?: () => void;
  computedSummary: any;
  setSummary: Dispatch<SetStateAction<any>>;
  computedRemoteData: boolean;
  computedRemoteFilter: boolean;
  computedRemoteSort: boolean;
  loadDataTrigger: string[];
  setLoadDataTrigger: Dispatch<SetStateAction<string[]>>;
  dataMap: null | { [key: string]: any };
  dataIndexMap: null | { [key: string]: number };
  setDataMap: (dataMap: null | { [key: string]: any }) => void;
  setDataIndexMap: (dataMap: null | { [key: string]: number }) => void;
} => {
  const computedRemoteData = isRemoteData(props);
  const computedRemoteFilter = isRemoteFilter(props);
  const computedRemoteSort = isRemoteSort(props);
  const computedLivePagination = isLivePagination(props);
  const computedRemotePagination = isRemotePagination(props);
  const computedLocalPagination = isLocalPagination(props);
  const computedPagination =
    computedRemotePagination || computedLocalPagination;

  const [ungroupedData, setUngroupedData] = useState<any[]>([]);
  const [loadDataTrigger, setLoadDataTrigger] = useState<string[]>([]);
  const [append, setAppend] = useState<boolean>(false);
  const [computedSkip, setSkip] = useProperty<number>(props, 'skip', 0);
  const [computedLimit, setLimit] = useProperty<number>(props, 'limit', 50);

  const [computedDataSourceCache, setDataSourceCache] = useDataSourceCache(
    props,
    computedProps,
    computedPropsRef
  );

  const [summary, setSummary] = useState<any>(
    props.summaryReducer ? props.summaryReducer.initialValue : null
  );

  const setItemAt = (
    index: number,
    item: any,
    config?: { replace?: boolean; property?: string; value?: any }
  ) => {
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
    } else {
      if (config && config.property) {
        newItem = { ...newItem, [config.property]: config.value };
      } else {
        newItem = { ...newItem, ...item };
      }
    }

    const newId = computedProps.getItemId(newItem);
    if (newId !== oldId) {
      if (computedProps.showWarnings) {
        console.error(
          `Cannot replace the item with another one that has a different value for the idProperty!`
        );
      }
      return;
    }
    setDataSourceCache({
      ...computedProps.computedDataSourceCache,
      [newId]: newItem,
    });
  };

  const setItemsAt = (items: any, config?: { replace?: boolean }) => {
    const replace = config && config.replace;
    const { current: computedProps } = computedPropsRef;
    if (!computedProps) {
      return;
    }

    const newItems: any[] = [];
    for (let i = 0; i < items.length; i++) {
      const oldId = computedProps.getItemId(items[i]);
      let newItem = computedProps.getItemAt(oldId);
      if (!newItem) {
        continue;
      }
      if (replace) {
        newItem = items[i];
      } else {
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

  const setItemPropertyAt = (index: number, property: string, value: any) => {
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

  const setItemPropertyForId = (
    id: string | number,
    property: string,
    value: any
  ) => {
    const { current: computedProps } = computedPropsRef;
    if (!computedProps) {
      return;
    }
    const index = computedProps.getRowIndexById(id);

    setItemPropertyAt(index, property, value);
  };

  const {
    data,
    dataMap,
    dataIndexMap,
    setDataIndexMap,
    setDataMap,
    count,
    silentSetData,
    setCount,
    originalData,
    setOriginalData,
    dataCountAfterFilter,
    setDataCountAfterFilter,
  } = useData(
    {
      dataSource: props.dataSource,
      skip: computedSkip,
      limit: computedLimit,
      localPagination: computedLocalPagination,
    },
    props.context
  );

  const [reloadTimestamp, setReloadTimestamp] = useState<number>(Date.now);

  const reload = (): void => {
    setReloadTimestamp(Date.now());
  };

  const lastSkipRef = useRef<number>(computedSkip);
  const lastFilterValueRef = useRef<TypeFilterValue>(
    computedProps.computedFilterValue
  );
  const lastLimitRef = useRef<number>(computedLimit);
  const lastGroupBy = usePrevious<TypeGroupBy>(
    computedProps.computedGroupBy,
    computedProps.computedGroupBy
  );
  const lastDataSource = usePrevious<TypeDataSource>(
    props.dataSource,
    props.dataSource
  );

  let dataPromiseRef = useRef<Promise<any> | null>(null);
  dataPromiseRef.current = useLoadDataEffect(
    {
      getDataSource: ({ shouldReload }) => {
        const computedProps = computedPropsRef.current;

        return shouldReload
          ? computedProps.dataSource
          : computedProps.originalData;
      },
    },
    (dataToLoad, { shouldReload, intercept }) => {
      const {
        computedSortInfo,
        computedRemoteData,
        computedFilterValue,
        computedGroupBy,
        originalData: prevOriginalData,
        skipLoadOnMount,
        wasMountedRef,
        initialState,
      } = computedPropsRef.current;

      if (!prevOriginalData.length && computedRemoteData) {
        // initial loading
        computedPropsRef.current.setLoading(true);
      }

      let initialCount: number;

      if (
        skipLoadOnMount &&
        !wasMountedRef.current &&
        initialState &&
        initialState.data
      ) {
        dataToLoad = initialState.data;
        initialCount = initialState.count;
      }

      if (computedRemoteData && !Array.isArray(dataToLoad)) {
        computedPropsRef.current.setLoading(true);
      }

      const skipControlled = isControlledProperty(
        computedProps.initialProps,
        'skip'
      );
      let shouldResetSkip =
        shouldReload &&
        typeof props.dataSource === 'function' &&
        props.dataSource !== lastDataSource &&
        !skipControlled &&
        computedPropsRef.current.computedSkip !== 0;

      if (!shouldResetSkip) {
        if (
          shouldReload &&
          typeof props.dataSource === 'function' &&
          computedPropsRef.current.computedSkip !== 0 &&
          computedPropsRef.current.computedFilterable &&
          (!deepEqual(
            computedPropsRef.current.computedFilterValue,
            lastFilterValueRef.current
          ) ||
            computedPropsRef.current.computedGroupBy !== lastGroupBy)
        ) {
          shouldResetSkip = true;
        }
      }

      if (shouldResetSkip) {
        setSkip(0);
        // prevent reload data now - let the cmp rerender and changing skip will trigger reload
        return Promise.resolve(true);
      }
      return intercept(
        loadDataSource(dataToLoad, {
          sortInfo: computedSortInfo,
          currentData: computedPropsRef.current.data,
          skip: computedSkip,
          limit: computedLimit,
          filterValue: computedFilterValue,
          groupBy: computedGroupBy,
        }),
        dataToLoad
      ).then(
        ({ data: originalData, count }: { data: any[]; count: number }) => {
          if (initialCount) {
            count = initialCount;
          }
          const computedProps = computedPropsRef.current;
          const queue = batchUpdate();
          let data = originalData;

          let shouldAppend =
            computedLivePagination && !shouldReload
              ? computedSkip > lastSkipRef.current
              : append;

          if (shouldAppend) {
            originalData = prevOriginalData.concat(originalData);
            data = originalData;
          }

          const computeDataResult = computeData(
            {
              remoteData: false,
              originalData,
            },
            computedProps,
            queue
          );
          data = computeDataResult.data || originalData;
          let dataCountAfterFilter = computeDataResult.dataCountAfterFilter;

          let prevComputedSkip = lastSkipRef.current;
          lastSkipRef.current = computedSkip;
          lastFilterValueRef.current = computedFilterValue;
          lastLimitRef.current = computedLimit;

          const shouldIndexData =
            computedProps.computedRowSelectionEnabled ||
            computedProps.computedRowExpandEnabled ||
            computedProps.treeColumn ||
            computedProps.treeEnabled ||
            computedProps.rowIndexColumn ||
            computedProps.computedRowHeights ||
            (computedProps.computedGroupBy && props.stickyGroupRows);

          let dataIndexMap: { [key: string]: number } | null =
            shouldIndexData && Array.isArray(data) ? {} : null;

          const stickyGroupsIndexes: { [key: number]: number } | null =
            props.stickyGroupRows === true || props.stickyTreeNodes === true
              ? {}
              : null;

          const dataMap =
            shouldIndexData && Array.isArray(data)
              ? data.reduce((acc, item, index: number) => {
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
                  dataIndexMap![id] = index;

                  return acc;
                }, {} as { [key: string]: any })
              : null;

          return queue.commit(() => {
            const computedProps = computedPropsRef.current;
            setOriginalData(originalData);

            if (
              computedProps.scrollTopOnSort &&
              computedProps.loadDataTrigger.find(s => s == 'sortInfo')
            ) {
              raf(() => {
                computedProps.setScrollTop(0);
              });
            }

            if (computedSkip === 0 && prevComputedSkip > 0) {
              raf(() => {
                computedProps.setScrollTop(0);
              });
            }

            if (
              computedProps.scrollTopOnFilter &&
              computedProps.loadDataTrigger.find(s => s == 'filterValue')
            ) {
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
            if (
              dataCountAfterFilter != null &&
              computedSkip >= dataCountAfterFilter &&
              !computedRemoteData
            ) {
              setSkip(0);
            }
            silentSetData(data || []);
            computedProps.setLoading(false);

            if (shouldReload) {
              setCount(count);
            }
          });
        },
        _err => {
          // pending promise discarded
          // newer requests came in before this finished, so ignoring the promise
        }
      );
    },
    {
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
    }
  );

  const paginationProps = usePagination(
    {
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
    },
    computedPropsRef
  );

  const getRowIndexById = useCallback(
    (rowId: string | number, data?: any[]): number => {
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
    },
    []
  );

  const getItemIndexById = useCallback(
    (id: string | number, data?: any): number => {
      return getRowIndexById(id, data);
    },
    []
  );

  const getData = useCallback((): any[] => {
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
