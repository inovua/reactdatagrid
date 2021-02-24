/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useProperty from '@inovua/reactdatagrid-community/hooks/useProperty';
import {
  TypeDataGridProps,
  TypeComputedProps,
  TypeGetColumnByParam,
  TypeCellProps,
  TypeBatchUpdateQueue,
} from '../../types';
import { MutableRefObject, useLayoutEffect, useCallback } from 'react';
import clamp from '@inovua/reactdatagrid-community/utils/clamp';
import usePrevious from '@inovua/reactdatagrid-community/hooks/usePrevious';
import batchUpdate from '@inovua/reactdatagrid-community/utils/batchUpdate';

const useActiveCell = (
  props: TypeDataGridProps,
  computedPropsRef: MutableRefObject<TypeComputedProps | null>
): {
  computedActiveCell: [number, number] | null | undefined;
  getCellSelectionIdKey: (
    rowIndex: number,
    columnIndex: number
  ) => string | number;
  getCellSelectionKey?: (
    cellProps: number | TypeCellProps | string,
    col: TypeGetColumnByParam
  ) => string | number;
  getCellSelectionBetween: (
    start?: [number, number],
    end?: [number, number]
  ) => { [key: string]: boolean };
  incrementActiveCell: (direction: [number, number]) => void;
  setActiveCell: (
    activeCell: [number, number] | null,
    queue?: TypeBatchUpdateQueue
  ) => void;
} => {
  let [computedActiveCell, doSetActiveCell] = useProperty<
    [number, number] | null | undefined
  >(props, 'activeCell');

  if (!props.enableKeyboardNavigation) {
    computedActiveCell = undefined;
  }

  const setActiveCell = useCallback(
    (
      activeCell: [number, number] | null,
      queue?: TypeBatchUpdateQueue
    ): void => {
      const computedProps = computedPropsRef.current;
      if (!computedProps || !computedProps.computedCellNavigationEnabled) {
        return;
      }
      const { computedActiveCell, data, visibleColumns } = computedProps;

      const shouldCommit = !queue;
      queue = queue || batchUpdate();

      if (activeCell) {
        let [activeCellRowIndex, activeCellColumnIndex] = activeCell;
        activeCellRowIndex = clamp(activeCellRowIndex, 0, data.length - 1);
        activeCellColumnIndex = clamp(
          activeCellColumnIndex,
          0,
          visibleColumns.length - 1
        );

        const col = computedProps.getColumnBy(activeCellColumnIndex);

        if (col && col.cellSelectable === false) {
          return;
        }

        if (
          !data ||
          data.__group ||
          activeCellRowIndex == null ||
          activeCellColumnIndex == null
        ) {
          queue(() => {
            doSetActiveCell(null);
            computedProps.setLastCellInRange('');
          });
          if (shouldCommit) {
            queue.commit();
          }
          return;
        }

        activeCell = [activeCellRowIndex, activeCellColumnIndex];

        if (
          activeCell === computedActiveCell ||
          (computedActiveCell &&
            activeCell &&
            computedActiveCell[0] === activeCell[0] &&
            computedActiveCell[1] === activeCell[1])
        ) {
          return;
        }
      }

      queue(() => {
        doSetActiveCell(activeCell);
        computedProps.setLastCellInRange('');
      });
      if (shouldCommit) {
        queue.commit();
      }
    },
    []
  );

  const oldActiveCell = usePrevious<[number, number] | null | undefined>(
    computedActiveCell,
    null
  );

  useLayoutEffect(() => {
    const { current: computedProps } = computedPropsRef;
    if (!computedProps) {
      return;
    }
    if (oldActiveCell !== computedActiveCell && computedActiveCell) {
      const [rowIndex, columnIndex] = computedActiveCell;
      if (rowIndex == null || columnIndex == null) {
        return;
      }
      const top = !oldActiveCell || rowIndex < oldActiveCell[0];
      const right = !oldActiveCell || columnIndex > oldActiveCell[1];

      const scrollToColumnIndex = clamp(
        columnIndex + (right ? 0 : -0),
        0,
        computedProps.visibleColumns.length - 1
      );
      computedProps.scrollToCell(
        { rowIndex, columnIndex: scrollToColumnIndex },
        { top, right }
      );
    }
  }, [computedActiveCell, oldActiveCell]);

  const getCellSelectionBetween = useCallback(
    (
      start?: [number, number] | null | undefined,
      end?: [number, number] | null | undefined
    ): { [key: string]: boolean } => {
      const { current: computedProps } = computedPropsRef;
      if (!start || !end || !computedProps) {
        return {};
      }
      const startRow = Math.min(start[0], end[0]);
      const startCol = Math.min(start[1], end[1]);

      const endRow = Math.max(start[0], end[0]);
      const endCol = Math.max(start[1], end[1]);

      const range: { [key: string]: boolean } = {};

      const groupBy = computedProps.computedGroupBy;
      const dataSource = groupBy ? computedProps.data : [];

      let current;
      for (let row = startRow; row <= endRow; row++) {
        if (groupBy) {
          current = dataSource[row];
          if (!current) {
            break;
          }
          if (current.__group) {
            continue;
          }
        }
        for (let col = startCol; col <= endCol; col++) {
          range[getCellSelectionKey(row, col)] = true;
        }
      }

      return range;
    },
    []
  );

  const getCellSelectionKey = useCallback(
    (
      cellProps: number | TypeCellProps | string,
      col?: TypeGetColumnByParam
    ): string | number => {
      const { current: computedProps } = computedPropsRef;
      if (!computedProps) {
        return -1;
      }
      let rowKey: number;
      let colKey: number;
      if (typeof cellProps === 'string') {
        return cellProps;
      }
      if (typeof cellProps === 'number' && typeof col === 'number') {
        rowKey = cellProps;
        colKey = col;
      } else {
        if (cellProps) {
          rowKey = (cellProps as TypeCellProps).rowIndex;
          colKey = (cellProps as TypeCellProps).columnIndex;
        }
      }

      if (!computedProps.cellSelectionByIndex) {
        return computedProps.getCellSelectionIdKey!(rowKey, colKey);
      }

      return `${[rowKey, colKey]}`;
    },
    [computedPropsRef, props.columns]
  );

  const getCellSelectionIdKey = useCallback(
    (rowIndex: number, columnIndex: number): string | number => {
      const { current: computedProps } = computedPropsRef;
      if (!computedProps) {
        return -1;
      }
      const col = computedProps.getColumnBy(columnIndex);
      if (!col) {
        return -1;
      }

      const colId = col.id || col.name;

      const item = computedProps.getItemAt(rowIndex);

      if (!item) {
        return '';
      }
      const rowId = computedProps.getItemId(item);

      return `${[rowId, colId]}`;
    },
    []
  );

  const incrementActiveCell = useCallback((direction: [number, number]) => {
    const { current: computedProps } = computedPropsRef;
    if (!computedProps) {
      return;
    }
    let { computedActiveCell } = computedProps;
    if (!computedActiveCell) {
      computedActiveCell = [0, 0];
    }
    const [row, col] = direction;
    const {
      data,
      visibleColumns,
      computedGroupBy,
      groupColumn,
    } = computedProps;

    const maxRow = data.length - 1;
    const columns = visibleColumns;
    const maxCol = columns.length - 1;
    const groupBy = computedGroupBy;
    const minCol = groupBy && !groupColumn ? groupBy.length : 0;

    let rowIndex = computedActiveCell[0];
    let colIndex = computedActiveCell[1];

    if (row) {
      const rowSign = row < 0 ? -1 : 1;
      let rowAdd = row;

      while (data[rowIndex + rowAdd] && data[rowIndex + rowAdd].__group) {
        rowIndex += rowAdd;
        rowAdd = rowSign;
      }

      rowIndex += rowAdd;
    }

    if (col) {
      const colSign = col < 0 ? -1 : 1;
      let colAdd = col;

      while (
        columns[colIndex + colAdd] &&
        columns[colIndex + colAdd].cellSelectable === false
      ) {
        colIndex += colSign;
        colAdd = colSign;
      }

      colIndex += colAdd;
    }

    rowIndex = clamp(rowIndex, 0, maxRow);
    colIndex = clamp(colIndex, minCol, maxCol);

    computedProps.setActiveCell!([rowIndex, colIndex]);
  }, []);

  return {
    getCellSelectionBetween,
    getCellSelectionIdKey,
    computedActiveCell,
    setActiveCell,
    getCellSelectionKey,
    incrementActiveCell,
  };
};

export default useActiveCell;
