/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import normalizeColumns, { TypeParam } from '.';

import { equalReturnKey } from '../packages/shallowequal';

import { TypeColumn } from './types';
import { TypeGroupBy, TypeExpandedRows } from '../types';
import useBuildColumns from './useBuildColumns';
import { IColumn, TypeColumns } from '../types/TypeColumn';

import useMemoWithObject from '../hooks/useMemoWithObject';
import {
  TypeRowReorder,
  TypeBuildColumnsProps,
} from '../types/TypeDataGridProps';

const includeAll = () => true;

type TypeParamObject = TypeParam & {
  groupBy: TypeGroupBy;
  groupNestingSize: number;
  groupForGroupColumns: string;
  inTransition: boolean;
  hideGroupByColumns: boolean;
  enableRowExpand?: boolean;
  expandedRows?: TypeExpandedRows;
  showPivotSummaryColumns?: boolean;

  maybeAddColumns?: (
    columns: TypeColumns,
    props: TypeBuildColumnsProps
  ) => TypeColumns;

  defaultExpandedRows?: TypeExpandedRows;
  renderRowDetails?: (...args: any[]) => any;
  renderDetailsGrid?: (...args: any[]) => any;
  pivotGrandSummaryColumn?: boolean | IColumn;
  rowExpandColumn?: IColumn | boolean;
  rowIndexColumn?: IColumn | boolean;
  onRowReorder?: TypeRowReorder;
  rowReorderColumn?: IColumn;
};

type TypeUseGroupByColumns = {
  groupBy: string[];
  groupColumn: string | boolean;
  columns: TypeColumn[];
  filter: (col: TypeColumn) => boolean;
  inTransition: boolean;
  groupNestingSize: number;
  checkboxColumn: boolean | TypeColumn;
};

const useGroupByColumns = (
  args: TypeUseGroupByColumns
): {
  columns: TypeColumn[];
  generatedColumnsLength: number;
} => {
  let generatedColumnsLength = 0;

  let { columns } = args;
  const {
    groupBy,
    groupColumn,
    filter,
    groupForGroupColumns,
    checkboxColumn,
    lockedColumnsState,
    groupNestingSize,
    inTransition,
  } = args;
  if (groupBy && groupBy.length && !groupColumn) {
    let lockedStartCount = 0;
    let groupColumnCount = 0;

    columns.filter(filter || includeAll).forEach((col: TypeColumn) => {
      if (col.groupSpacerColumn) {
        groupColumnCount++;
      }
      let locked = col.locked === undefined ? col.defaultLocked : col.locked;

      const colInLocked =
        lockedColumnsState[col.id as string] ||
        lockedColumnsState[col.name as string];
      if (colInLocked !== undefined) {
        locked = colInLocked;
      }
      if (locked === 'start' || locked === true) {
        lockedStartCount++;
      }
    });

    if (lockedStartCount && checkboxColumn) {
      lockedStartCount++;
    }

    const generatedColumns = [...Array(groupBy.length - groupColumnCount)].map(
      (
        _,
        i
      ): TypeColumn & {
        inTransition: boolean;
        visibilityTransitionDuration: boolean;
        showInContextMenu: boolean;
        cellSelectable: false;
        draggable: false;
      } => {
        return {
          name: `__col_generated-groupBy-${groupColumnCount + i}`,
          header: null,
          inTransition,
          visibilityTransitionDuration: !!inTransition,
          groupSpacerColumn: true,
          group: groupForGroupColumns,
          locked: !!lockedStartCount,
          defaultWidth: groupNestingSize,
          width: groupNestingSize,
          minWidth: groupNestingSize,
          maxWidth: groupNestingSize,
          showInContextMenu: false,
          cellSelectable: false,
          draggable: false,
          resizable: false,
          sortable: false,
        };
      }
    );

    generatedColumnsLength = generatedColumns.length;

    columns = generatedColumnsLength
      ? [...generatedColumns, ...columns]
      : columns;
  }

  return { columns, generatedColumnsLength };
};

const useColumnInfo = (params: TypeParamObject) => {
  return useMemoWithObject(
    () => {
      let {
        columns,
        columnMinWidth,
        columnMaxWidth,
        columnDefaultWidth,
        columnWidth,
        groupNestingSize,
        columnOrder,
        onRowReorder,
        columnVisibilityMap,
        columnSizes,
        columnFlexes,
        lockedColumnsState = {},
        groupBy,
        maybeAddColumns,
        editable,
        computedPivotUniqueValuesPerColumn,
        checkboxColumn,
        rowIndexColumn,
        groupColumn,
        pivot,
        groupForGroupColumns,
        inTransition,
        rtl,
        hideGroupByColumns,
        availableWidth,
        sortInfo,
        filterValueMap,
        sortable,
        filterable,
        resizable,
        pivotGrandSummaryColumn,
        lockable,
        groups,
        enableRowExpand,
        showPivotSummaryColumns,
        expandedRows,
        defaultExpandedRows,
        renderRowDetails,
        renderDetailsGrid,
        rowExpandColumn,
        rowReorderColumn,
      } = params;
      if (pivot) {
        groupColumn = groupColumn || true;
      }
      columns = useBuildColumns(columns, {
        groups,
        checkboxColumn,
        groupBy,
        groupColumn,
        rowIndexColumn,
        enableRowExpand,
        expandedRows,
        maybeAddColumns,
        defaultExpandedRows,
        renderRowDetails,
        renderDetailsGrid,
        rowExpandColumn,
        onRowReorder,
        rowReorderColumn,
      });

      const filter =
        !hideGroupByColumns || !groupBy || !groupBy.length
          ? null
          : (col: TypeColumn) =>
              groupBy.indexOf((col.id || col.name) as string) == -1;

      let generatedColumnsLength: number;

      const res = useGroupByColumns({
        groupBy,
        groupColumn,
        columns,
        filter,
        groupForGroupColumns,
        checkboxColumn,
        lockedColumnsState,
        groupNestingSize,
        inTransition,
      });

      columns = res.columns;
      generatedColumnsLength = res.generatedColumnsLength;

      return normalizeColumns({
        pivotGrandSummaryColumn,
        generatedColumnsLength,
        columns,
        columnMinWidth,
        columnMaxWidth,
        columnDefaultWidth,
        columnWidth,
        columnSizes,
        columnFlexes,
        columnOrder,
        showPivotSummaryColumns,
        computedPivotUniqueValuesPerColumn,
        rtl,
        filterValueMap,
        pivot,
        checkboxColumn,
        rowIndexColumn,
        columnVisibilityMap,
        lockedColumnsState,
        sortable,
        filterable,
        resizable,
        lockable,
        filter,
        sortInfo,
        editable,
        availableWidth,
      });
    },
    params,
    (a, b) => {
      const { result, key } = equalReturnKey(a, b);

      return result;
    }
  );
};

export default useColumnInfo;
