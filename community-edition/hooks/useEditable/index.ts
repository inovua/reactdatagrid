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

  const onEditStop = useCallback((editProps: TypeEditInfo) => {
    const { current: computedProps } = computedPropsRef;
    if (!computedProps) {
      return;
    }
    if (computedProps.initialProps.onEditStop) {
      computedProps.initialProps.onEditStop(editProps);
    }
    editInfoRef.current = null;
  }, []);

  const onEditCancel = useCallback((editProps: TypeEditInfo) => {
    const { current: computedProps } = computedPropsRef;
    if (!computedProps) {
      return;
    }
    if (computedProps.initialProps.onEditCancel) {
      computedProps.initialProps.onEditCancel(editProps);
    }
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
      if (!col) {
        return;
      }

      computedProps.scrollToColumn(col.computedVisibleIndex, {});
    });
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
        dir,
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
    tryStartEdit,
  };
};

export default useEditable;
