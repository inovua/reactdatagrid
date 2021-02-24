/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useRef, useCallback } from 'react';
const useEditable = (props, computedProps, computedPropsRef) => {
    const editInfoRef = useRef(null);
    const onEditStop = useCallback((editProps) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        if (computedProps.initialProps.onEditStop) {
            computedProps.initialProps.onEditStop(editProps);
        }
        editInfoRef.current = null;
    }, []);
    const onEditCancel = useCallback((editProps) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        if (computedProps.initialProps.onEditCancel) {
            computedProps.initialProps.onEditCancel(editProps);
        }
    }, []);
    const onEditComplete = useCallback((editProps) => {
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
    const onEditValueChange = useCallback((editProps) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        if (computedProps.initialProps.onEditValueChange) {
            computedProps.initialProps.onEditValueChange(editProps);
        }
    }, []);
    const onEditStart = useCallback((editProps) => {
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
            const col = computedProps.getColumnBy(columnId);
            if (!col) {
                return;
            }
            computedProps.scrollToColumn(col.computedVisibleIndex, {});
        });
    }, []);
    const tryStartEdit = useCallback(({ rowIndex, rowId, columnId, dir, } = { rowIndex: undefined, rowId: undefined, columnId: '', dir: 1 }) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return Promise.reject(new Error(`Grid was probably unmounted`));
        }
        const col = computedProps.getColumnBy(columnId);
        if (!col) {
            return Promise.reject(new Error(`No column found for columnId: ${columnId}`));
        }
        if (rowIndex === undefined) {
            rowIndex = computedProps.getRowIndexById(rowId);
        }
        return new Promise((resolve, reject) => {
            computedProps.scrollToIndex(rowIndex, undefined, () => {
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
    }, []);
    const startEdit = useCallback(({ rowIndex, rowId, columnId, dir, value, } = {
        rowIndex: undefined,
        rowId: undefined,
        columnId: '',
        dir: 1,
        value: '',
    }) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return Promise.reject(new Error(`Grid was probably unmounted`));
        }
        const col = computedProps.getColumnBy(columnId);
        if (!col) {
            return Promise.reject(new Error(`No column found for columnId: ${columnId}`));
        }
        if (rowIndex === undefined) {
            rowIndex = computedProps.getRowIndexById(rowId);
        }
        return new Promise((resolve, reject) => {
            computedProps.scrollToIndex(rowIndex, undefined, () => {
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
    }, []);
    const completeEdit = useCallback(({ rowId, rowIndex, columnId, value, } = {
        rowIndex: undefined,
        rowId: undefined,
        columnId: '',
        dir: 1,
        value: '',
    }) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return Promise.reject(new Error(`Grid was probably unmounted`));
        }
        let col = computedProps.getColumnBy(columnId);
        const editInfo = getCurrentEditInfo();
        if (!editInfo) {
            return;
        }
        if (!col && editInfo) {
            col = computedProps.getColumnBy(editInfo.columnId);
            rowIndex = editInfo.rowIndex;
        }
        if (!col) {
            return;
        }
        if (rowIndex === undefined) {
            rowIndex = computedProps.getRowIndexById(rowId);
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
    }, []);
    const getCurrentEditInfo = useCallback(() => {
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
