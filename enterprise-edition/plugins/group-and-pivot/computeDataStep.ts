/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  TypeBatchUpdateQueue,
  TypeComputedProps,
  TypeGroupBy,
  TypeComputedColumnsMap,
} from '../../types';
import groupAndPivot, { flatten } from './groupAndPivot';

export default ({
  groupBy,
  config,
  computedProps,
  batchUpdateQueue,
  columnsMap,
}: {
  groupBy: TypeGroupBy;
  config: any;
  columnsMap: TypeComputedColumnsMap;
  computedProps: TypeComputedProps;
  batchUpdateQueue: TypeBatchUpdateQueue;
}) => {
  const pivot = computedProps.pivot;
  if (Array.isArray(groupBy) && groupBy.length) {
    const groupAndPivotData = groupAndPivot(config.data, {
      groupBy,
      pivot,
      columnsMap,
      stringify: computedProps.groupToString,
      groupSummaryReducer: computedProps.groupSummaryReducer,
      groupColumnSummaryReducers: computedProps.groupColumnSummaryReducers,
      pivotColumnSummaryReducers: computedProps.pivotColumnSummaryReducers,
    });
    const groupArray: object[] = [];
    const groupKeys: { [key: string]: boolean } = {};

    let lastTopGroupCollapsed = false;

    const flattenedData = flatten(groupAndPivotData, {
      pivot: pivot || null,
      showGroupSummaryRow: computedProps.groupColumn
        ? null
        : computedProps.showGroupSummaryRow || null,
      groupSummaryReducer: computedProps.groupSummaryReducer || null,
      groupColumnSummaryReducers:
        computedProps.groupColumnSummaryReducers || null,
      pivotColumnSummaryReducers:
        computedProps.pivotColumnSummaryReducers || null,
      isCollapsed: (group: any) => {
        groupArray.push(group);
        groupKeys[group.keyPath.join(computedProps.groupPathSeparator)] = true;
        const collapsed = computedProps.isGroupCollapsed!(group);
        if (group.depth === 1) {
          lastTopGroupCollapsed = collapsed;
        }
        return collapsed;
      },
    });

    config.computedShowEmptyRows = lastTopGroupCollapsed ? false : undefined;

    config.data = flattenedData.data;

    groupArray.forEach(group => {
      const keyPath = group.keyPath;

      let root = flattenedData.bucket;

      for (let i = 0, len = keyPath.length; i < len; i++) {
        let key = keyPath[i];
        if (!root || !root.data) {
          break;
        }
        root = root.data[key];
      }

      group.array = root ? root.array : [];
    });

    batchUpdateQueue(() => {
      computedProps.setComputedGroupRelatedInfo({
        computedPivotUniqueValuesPerColumn:
          groupAndPivotData.pivotUniqueValuesPerColumn,
        computedGroupArray: groupArray,
        computedGroupKeys: groupKeys,
        computedGroupCounts: flattenedData.groupCounts || [],
        computedIndexesInGroups: flattenedData.indexesInGroups,
      });
    });
  }

  return config;
};
