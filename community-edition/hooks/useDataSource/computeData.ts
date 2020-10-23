/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  TypeSortInfo,
  TypeFilterValue,
  TypeFilterTypes,
  TypeComputedProps,
  TypeComputedColumnsMap,
  TypeGroupBy,
  TypeBatchUpdateQueue,
  TypeDataSourceCache,
} from '../../types';

import filter from '../../filter';
import groupAndPivot, { flatten } from '../../utils/groupAndPivot';
import paginate from '../../utils/paginate';
import getFilterValueForColumns from './getFilterValueForColumns';
import getSortInfoForColumns from './getSortInfoForColumns';
import { expandByIdsWithInfo } from '../../utils/tree';

const emptyObject = {};

const filterData = (
  data: any[],
  {
    filterValue,
    remoteFilter,
    filterTypes,
    columnsMap,
  }: {
    filterValue: TypeFilterValue;
    filterTypes?: TypeFilterTypes;
    remoteFilter: boolean;
    columnsMap: TypeComputedColumnsMap;
  }
): any[] => {
  if (!Array.isArray(filterValue) || !filterValue.length) {
    return data;
  }
  if (remoteFilter) {
    return data;
  }

  const filterValueForColumns = getFilterValueForColumns(
    filterValue,
    columnsMap
  );

  if (!filterValueForColumns.length) {
    return data;
  }

  return filter(data, filterValueForColumns, filterTypes, columnsMap);
};

const flow = (
  { originalData, ...rest }: { originalData: any[] },
  ...transforms: Function[]
) => {
  const input: {
    data: any[];
    originalData: any[];
    previousData: Array<any[]>;
  } = { ...rest, data: originalData, originalData, previousData: [] };

  return transforms.reduce((acc, transform) => {
    acc = transform(acc);
    acc.previousData.push(acc.data);

    return acc;
  }, input);
};

const computeData = (
  config: {
    skip?: number;
    limit?: number;
    localPagination?: boolean;
    originalData?: any[];
    groupBy?: TypeGroupBy;
    sortInfo?: TypeSortInfo;
    filterValue?: TypeFilterValue;
    dataSourceCache?: TypeDataSourceCache;
    remoteFilter?: boolean;
    loading?: boolean;
    remoteData?: boolean;
  },
  computedProps: TypeComputedProps,
  batchUpdateQueue: TypeBatchUpdateQueue
): { data: any[] | undefined; dataCountAfterFilter: number | undefined } => {
  const { columnsMap } = computedProps;
  let originalData = config.originalData || computedProps.originalData;
  let dataCountAfterFilter: number | undefined = undefined;
  const loading =
    config.loading === undefined
      ? computedProps.computedLoading
      : config.loading;
  let filterValue =
    config.filterValue === undefined
      ? computedProps.computedFilterValue
      : config.filterValue;
  const remoteFilter =
    config.remoteFilter === undefined
      ? computedProps.computedRemoteFilter
      : config.remoteFilter;
  const dataSourceCache =
    config.dataSourceCache === undefined
      ? computedProps.computedDataSourceCache
      : config.dataSourceCache;
  const filterTypes = computedProps.filterTypes;
  const localPagination =
    config.localPagination === undefined
      ? computedProps.computedLocalPagination
      : config.localPagination;
  const remoteData =
    config.remoteData === undefined
      ? computedProps.computedRemoteData
      : config.remoteData;
  let sortInfo =
    config.sortInfo === undefined
      ? computedProps.computedSortInfo
      : config.sortInfo;
  let skip =
    config.skip === undefined ? computedProps.computedSkip : config.skip;
  let limit =
    config.limit === undefined ? computedProps.computedLimit : config.limit;
  let groupBy =
    config.groupBy === undefined
      ? computedProps.computedGroupBy
      : config.groupBy;

  const treeEnabled: boolean = computedProps.computedTreeEnabled;
  const pivot = computedProps.pivot;

  const computedSummary: boolean = !!computedProps.summaryReducer;

  if (remoteData) {
    return { data: undefined, dataCountAfterFilter };
  }

  const result = flow(
    { originalData },

    // dataSourceCache
    (config: { data: any[] }) => {
      if (dataSourceCache && Object.keys(dataSourceCache).length) {
        config.data = config.data.map(item => {
          const id = computedProps.getItemId(item);
          if (dataSourceCache[id]) {
            item = { ...item, ...dataSourceCache[id] };
          }

          return item;
        });
      }
      return config;
    },

    // FILTER
    (config: { data: any[]; dataCountAfterFilter: number | undefined }) => {
      // only filter locally for uncontrolled prop
      if (filterValue && !computedProps.filterValue) {
        filterValue = getFilterValueForColumns(filterValue, columnsMap);

        config.data = filterData(config.data, {
          filterValue,
          filterTypes,
          remoteFilter,
          columnsMap,
        });
        dataCountAfterFilter = config.data.length;
      }
      return config;
    },

    // SORT
    (config: { data: any[] }) => {
      // only sort locally for uncontrolled prop
      if (!computedProps.sortInfo) {
        sortInfo = getSortInfoForColumns(sortInfo, columnsMap);
        if (sortInfo && computedProps.sorty) {
          config.data = [...config.data];
          computedProps.sorty(sortInfo, config.data);
        }
      }

      return config;
    },

    // TREE
    (config: { data: any[] }) => {
      if (treeEnabled && computedProps.computeTreeData) {
        const expandedNodes = computedProps.computedExpandedNodes;

        config.data = computedProps.computeTreeData(config.data, {
          expandedNodes,
          isNodeLeaf: computedProps.isNodeLeaf,
          isNodeAsync: computedProps.isNodeAsync,
          pathSeparator: computedProps.nodePathSeparator,
          loadingNodes: computedProps.computedLoadingNodes,
          nodesName: computedProps.nodesProperty,
          nodeCache: computedProps.computedNodeCache,
          dataSourceCache: computedProps.computedDataSourceCache,
          generateIdFromPath: computedProps.generateIdFromPath,
          collapsingNodes: computedProps.collapsingNodesRef.current,
        });
      }

      return config;
    },

    // summary
    (config: { data: any[] }) => {
      if (computedSummary) {
        let summary = computedProps.summaryReducer!.initialValue;
        const reducerFn =
          computedProps.summaryReducer!.reducer ||
          computedProps.summaryReducer!.reduce;

        if (summary && typeof summary === 'object') {
          summary = { ...summary };
        }

        const data = config.data;
        let item;
        for (let i = 0, len = data.length; i < len; i++) {
          item = data[i];
          summary = reducerFn(summary, item, computedProps);
        }

        if (computedProps.summaryReducer!.complete) {
          summary = computedProps.summaryReducer!.complete(
            summary,
            data || [],
            computedProps
          );
        }

        batchUpdateQueue(() => {
          computedProps.setSummary(summary);
        });
      }
      return config;
    },

    // PAGINATE
    (config: { data: any[] }) => {
      if (localPagination && limit) {
        skip = skip || 0;

        config.data = paginate(config.data, { skip, limit });
      }
      return config;
    },

    // group
    (config: {
      data: any;
      computedIndexesInGroups?: any;
      computedGroupArray?: any;
      computedShowEmptyRows?: boolean;
    }) => {
      batchUpdateQueue(() => {
        computedProps.setUngroupedData(config.data);
      });

      if (
        Array.isArray(groupBy) &&
        groupBy.length &&
        computedProps.computeDataStep
      ) {
        config = computedProps.computeDataStep({
          groupBy,
          batchUpdateQueue,
          columnsMap,
          computedProps,
          config,
        });
      }

      return config;
    }
  );

  return {
    data: result.data,
    dataCountAfterFilter: dataCountAfterFilter || 0,
  };
};

export default computeData;
