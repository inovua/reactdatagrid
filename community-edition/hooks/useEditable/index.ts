/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { MutableRefObject, useRef, useCallback } from 'react';

import {
  TypeDataGridProps,
  TypeComputedProps,
  TypeComputedColumn,
  TypeEditInfo,
} from '../../types';

const useEditable = (
  props: TypeDataGridProps,
  computedProps: TypeComputedProps,
  computedPropsRef: MutableRefObject<TypeComputedProps | null>
): {} => {
  const editInfoRef = useRef<TypeEditInfo | null>(null);
  const isInEdit = useRef<Boolean>(false);

  const onEditStop = useCallback((editProps: TypeEditInfo) => {
    const { current: computedProps } = computedPropsRef;
    if (!computedProps) {
      return;
    }
    if (computedProps.initialProps.onEditStop) {
      computedProps.initialProps.onEditStop(editProps);
    }
    setTimeout(() => {
      // needed for cancelEdit method
      editInfoRef.current = null;
    }, 0);
  }, []);

  const onEditCancel = useCallback((editProps: TypeEditInfo) => {
    const { current: computedProps } = computedPropsRef;
    if (!computedProps) {
      return;
    }
    if (computedProps.initialProps.onEditCancel) {
      computedProps.initialProps.onEditCancel(editProps);
    }
    setTimeout(() => {
      computedProps.isInEdit.current = false;
    }, 50);
  }, []);

  const onEditComplete = useCallback((editProps: TypeEditInfo) => {
    const { current: computedProps } = computedPropsRef;
    if (!computedProps) {
      return;
    }

    if (computedProps.autoFocusOnEditComplete) {
      computedProps.focus();
    }
    if (computedProps.initialProps.onEditComplete) {
      computedProps.initialProps.onEditComplete(editProps);
    }
    computedProps.isInEdit.current = false;
  }, []);

  const onEditValueChange = useCallback((editProps: TypeEditInfo) => {
    const { current: computedProps } = computedPropsRef;
    if (!computedProps) {
      return;
    }
    if (computedProps.initialProps.onEditValueChange) {
      computedProps.initialProps.onEditValueChange(editProps);
    }
  }, []);

  const onEditStart = useCallback((editProps: any) => {
    const { current: computedProps } = computedPropsRef;
    if (!computedProps) {
      return;
    }
    const { columnId } = editProps;
    editInfoRef.current = {
      columnId,
      columnIndex: editProps.columnIndex,
      rowId: editProps.rowId,
      rowIndex: editProps.rowIndex,
    };

    if (computedProps.initialProps.onEditStart) {
      computedProps.initialProps.onEditStart(editProps);
    }

    requestAnimationFrame(() => {
      const { current: computedProps } = computedPropsRef;
      if (!computedProps) {
        return;
      }
      const col = computedProps.getColumnBy(columnId) as TypeComputedColumn;
      const columnsCount = computedProps.columns.length;
      if (!col) {
        return;
      }
      const columnIndex = computedProps.rtl
        ? columnsCount - col.computedVisibleIndex
        : col.computedVisibleIndex;

      computedProps.scrollToColumn(columnIndex, { duration: 50 });
    });
    computedProps.isInEdit.current = true;
  }, []);

  const tryStartEdit = useCallback(
    (
      {
        rowIndex,
        rowId,
        columnId,
        dir,
      }: {
        rowIndex?: number;
        rowId?: string;
        columnId: string;
        dir: number;
      } = { rowIndex: undefined, rowId: undefined, columnId: '', dir: 1 }
    ): Promise<any> => {
      const { current: computedProps } = computedPropsRef;
      if (!computedProps) {
        return Promise.reject(new Error(`Grid was probably unmounted`));
      }
      const col = computedProps.getColumnBy(columnId) as TypeComputedColumn;

      if (!col) {
        return Promise.reject(
          new Error(`No column found for columnId: ${columnId}`)
        );
      }

      if (rowIndex === undefined) {
        rowIndex = computedProps.getRowIndexById(rowId!);
      }

      return new Promise((resolve, reject) => {
        computedProps.scrollToIndex(rowIndex!, undefined, () => {
          setTimeout(() => {
            computedProps
              .getColumnLayout()
              .tryStartEdit({
                rowIndex,
                rowId,
                columnIndex: col.computedVisibleIndex,
                columnId,
                dir,
              })
              .then(resolve, reject);
          }, 50);
        });
      });
    },
    []
  );

  const startEdit = useCallback(
    (
      {
        rowIndex,
        rowId,
        columnId,
        value,
      }: {
        rowIndex?: number;
        rowId?: string;
        columnId: string;
        dir: number;
        value: any;
      } = {
        rowIndex: undefined,
        rowId: undefined,
        columnId: '',
        dir: 1,
        value: '',
      }
    ): Promise<any> => {
      const { current: computedProps } = computedPropsRef;
      if (!computedProps) {
        return Promise.reject(new Error(`Grid was probably unmounted`));
      }
      const col = computedProps.getColumnBy(columnId) as TypeComputedColumn;

      if (!col) {
        return Promise.reject(
          new Error(`No column found for columnId: ${columnId}`)
        );
      }

      if (rowIndex === undefined) {
        rowIndex = computedProps.getRowIndexById(rowId!);
      }

      return new Promise((resolve, reject) => {
        computedProps.scrollToIndex(rowIndex!, undefined, () => {
          setTimeout(() => {
            computedProps
              .getColumnLayout()
              .startEdit({
                rowIndex,
                rowId,
                columnIndex: col.computedVisibleIndex,
                columnId,
                value,
              })
              .then(resolve, reject);
          }, 50);
        });
      });
    },
    []
  );

  const completeEdit = useCallback(
    (
      {
        rowId,
        rowIndex,
        columnId,
        value,
      }: {
        rowId?: string;
        rowIndex?: number;
        dir: number;
        columnId: string;
        value: any;
      } = {
        rowIndex: undefined,
        rowId: undefined,
        columnId: '',
        dir: 1,
        value: '',
      }
    ) => {
      const { current: computedProps } = computedPropsRef;
      if (!computedProps) {
        return Promise.reject(new Error(`Grid was probably unmounted`));
      }
      let col = computedProps.getColumnBy(columnId) as TypeComputedColumn;

      const editInfo: TypeEditInfo | null = getCurrentEditInfo();

      if (!editInfo) {
        return;
      }
      if (!col && editInfo) {
        col = computedProps.getColumnBy(
          editInfo.columnId
        ) as TypeComputedColumn;
        rowIndex = editInfo.rowIndex;
      }

      if (!col) {
        return;
      }

      if (rowIndex === undefined) {
        rowIndex = computedProps.getRowIndexById(rowId!);
      }

      computedProps.scrollToIndex(rowIndex, undefined, () => {
        setTimeout(() => {
          computedProps.getColumnLayout().completeEdit({
            rowIndex,
            columnIndex: col.computedVisibleIndex,
            value,
          });
        }, 50);
      });
    },
    []
  );

  const cancelEdit = useCallback(
    (
      { rowIndex, columnId }: { rowIndex?: number; columnId?: string } = {
        rowIndex: undefined,
        columnId: undefined,
      }
    ) => {
      const editInfo: TypeEditInfo | null = editInfoRef.current;

      if (!editInfo) {
        return;
      }

      let col = columnId
        ? (computedProps.getColumnBy(columnId) as TypeComputedColumn)
        : null;

      if (!col && editInfo) {
        col = computedProps.getColumnBy(
          editInfo.columnId
        ) as TypeComputedColumn;
        rowIndex = editInfo.rowIndex;
      }

      if (!col) {
        return;
      }

      computedProps
        .getColumnLayout()
        .cancelEdit({ rowIndex, columnIndex: col.computedVisibleIndex });
    },
    []
  );

  const getCurrentEditInfo = useCallback((): TypeEditInfo | null => {
    return editInfoRef.current;
  }, []);

  return {
    getCurrentEditInfo,
    startEdit,
    onEditStart,
    onEditStop,
    onEditCancel,
    onEditComplete,
    onEditValueChange,
    completeEdit,
    cancelEdit,
    tryStartEdit,
    isInEdit,
  };
};

export default useEditable;
