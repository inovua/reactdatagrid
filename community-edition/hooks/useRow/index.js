/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useRef, useCallback } from 'react';
import batchUpdate from '../../utils/batchUpdate';
import { handleSelection } from './handleSelection';
import handleRowNavigation from './handleRowNavigation';
import handleCellNavigation from './handleCellNavigation';
export default (props, computedProps, computedPropsRef) => {
    const computedOnKeyDown = (event) => {
        if (props.onKeyDown) {
            props.onKeyDown(event);
        }
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        if (event.nativeEvent && event.nativeEvent.__handled_in_details) {
            return;
        }
        const sameElement = event.target === computedProps.getScrollingElement();
        let handled = false;
        if (event.key === 'Escape' && !sameElement) {
            handled = true;
            computedProps.focus();
        }
        if (!sameElement) {
            return;
        }
        if (computedProps.computedHasRowNavigation) {
            handled = handleRowNavigation(event, computedProps);
        }
        else if (computedProps.computedCellNavigationEnabled) {
            handled = handleCellNavigation(event, computedProps);
        }
        const activeItem = computedProps.computedActiveItem;
        const activeIndex = computedProps.computedActiveIndex;
        const isGroup = computedProps.isGroup(activeItem);
        const rowExpandEnabled = computedProps.computedRowExpandEnabled;
        const rowExpandable = activeItem && computedProps.isRowExpandableAt
            ? computedProps.isRowExpandableAt(activeIndex)
            : false;
        const rowExpanded = rowExpandable && activeItem
            ? computedProps.isRowExpanded(activeItem)
            : false;
        const treeEnabled = computedProps.computedTreeEnabled;
        const nodeExpandable = treeEnabled && activeItem && computedProps.isNodeExpandableAt
            ? computedProps.isNodeExpandableAt(activeIndex)
            : false;
        const nodeExpanded = treeEnabled && activeItem && computedProps.isNodeExpanded
            ? computedProps.isNodeExpanded(activeItem)
            : false;
        const rowSelectionEnabled = computedProps.computedRowSelectionEnabled;
        const keyShortcutArg = {
            event,
            data: activeItem,
            index: activeIndex,
            activeItem,
            activeIndex,
            handle: computedPropsRef,
            isGroup,
            treeEnabled,
            rowSelectionEnabled,
            nodeExpandable,
            nodeExpanded,
            rowExpandEnabled,
            rowExpandable,
            rowExpanded,
        };
        const editKeyPressed = !!computedProps.isStartEditKeyPressed(keyShortcutArg);
        const expandKeyPressed = !!computedProps.isExpandKeyPressed(keyShortcutArg);
        const collapseKeyPressed = !expandKeyPressed
            ? computedProps.isCollapseKeyPressed(keyShortcutArg)
            : false;
        if (expandKeyPressed) {
            handled = true;
        }
        if (expandKeyPressed && activeItem) {
            if (rowExpandEnabled && rowExpandable && !rowExpanded) {
                computedProps.setRowExpandedAt(activeIndex, true);
            }
            else {
                if (isGroup) {
                    computedProps.expandGroup(activeItem);
                }
                else if (treeEnabled && nodeExpandable && !nodeExpanded) {
                    computedProps.setNodeExpandedAt(activeIndex, true);
                }
            }
        }
        if (collapseKeyPressed) {
            handled = true;
        }
        if (collapseKeyPressed && activeItem) {
            if (rowExpandEnabled && rowExpandable && rowExpanded) {
                computedProps.setRowExpandedAt(activeIndex, false);
            }
            else {
                if (isGroup) {
                    computedProps.collapseGroup(activeItem);
                }
                else if (treeEnabled && nodeExpandable && nodeExpanded) {
                    computedProps.setNodeExpandedAt(activeIndex, false);
                }
            }
        }
        if (editKeyPressed) {
            handled = true;
            if (computedProps.visibleColumns && computedProps.visibleColumns.length) {
                computedProps.tryStartEdit({
                    rowIndex: activeItem ? activeIndex : 0,
                    columnId: computedProps.visibleColumns[0].id,
                    dir: 1,
                });
            }
        }
        if (activeItem && event.key === 'Enter') {
            if (rowExpandEnabled && rowExpandable) {
                if (!rowSelectionEnabled) {
                    computedProps.toggleRowExpand(activeIndex);
                    handled = true;
                }
            }
            else {
                if (isGroup) {
                    computedProps.toggleGroup(activeItem);
                    handled = true;
                }
                else if (nodeExpandable &&
                    !rowSelectionEnabled &&
                    computedProps.computedTreeEnabled) {
                    computedProps.toggleNodeExpand(activeItem);
                    handled = true;
                }
            }
        }
        if (handled) {
            event.preventDefault();
            if (event.nativeEvent) {
                event.nativeEvent.__handled_in_details = true;
            }
        }
    };
    const onFullBlur = useCallback((event) => { }, []);
    const isGroup = useCallback((item) => {
        return !!item && !!item.__group;
    }, []);
    const computedOnFocus = useCallback((event) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        event.preventDefault();
        if (props.onFocus) {
            props.onFocus(event);
        }
        if (event.nativeEvent.preventParentFocus) {
            onFullBlur(event);
            return;
        }
        event.nativeEvent.preventParentFocus = true;
        if (computedProps.computedWillReceiveFocusRef.current) {
            // component will receive focus in the computedOnRowClick,
            // as a row onMouseDown event already occured (and caused the onFocus event)
            // so no need to continue setting the focused flag here
            // as it will be set in computedOnRowClick
            computedProps.computedWillReceiveFocusRef.current = false;
            return;
        }
        if (!computedProps.computedFocused) {
            computedProps.computedSetFocused(true);
        }
    }, []);
    const onGroupRowClick = useCallback((rowProps, { enableKeyboardNavigation, setActiveIndex, }, queue) => {
        if (rowProps.groupProps || (rowProps.data && rowProps.data.__group)) {
            // it's a group row, so stop doing anything else and only update
            // what we already have
            if (enableKeyboardNavigation) {
                queue(() => {
                    setActiveIndex(rowProps.rowIndex);
                });
            }
            queue.commit();
            return true;
        }
        return false;
    }, []);
    const handleRowSelectionOnClick = (event, rowProps, computedProps, queue) => {
        if (event.nativeEvent.skipSelect) {
            if (computedProps.enableKeyboardNavigation) {
                queue(() => {
                    computedProps.setActiveIndex(rowProps.rowIndex);
                });
            }
            queue.commit();
            return;
        }
        const { shiftKey, metaKey, ctrlKey } = event;
        const multiSelectKey = shiftKey || metaKey || ctrlKey;
        const { autoCheckboxColumn } = props;
        if (autoCheckboxColumn && multiSelectKey) {
            // TODO show checkbox column with animation
            return;
        }
        if (handleSelection(rowProps, computedProps, event, queue) !== false) {
            queue(() => {
                computedProps.setActiveIndex(rowProps.rowIndex);
            });
        }
    };
    const computedOnRowClick = useCallback((event, rowProps) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        const { preventRowSelectionOnClickWithMouseMove, initialProps, } = computedProps;
        if (initialProps.onRowClick) {
            initialProps.onRowClick({
                rowIndex: rowProps.rowIndex,
                remoteRowIndex: rowProps.remoteRowIndex,
                groupProps: rowProps.groupProps,
                empty: rowProps.empty,
                columns: rowProps.columns,
                dataSourceArray: rowProps.dataSourceArray,
                data: rowProps.data,
            }, event);
        }
        const queue = batchUpdate();
        const { current: lastMouseDownEventProps, } = computedProps.lastMouseDownEventPropsRef;
        let mouseDidNotMove = event.type !== 'click';
        if (lastMouseDownEventProps && event.type === 'click') {
            const { pageX, pageY, rowIndex } = lastMouseDownEventProps;
            mouseDidNotMove =
                pageX === Math.floor(event.pageX) &&
                    pageY === Math.floor(event.pageY) &&
                    rowIndex === rowProps.rowIndex;
        }
        if (!computedProps.computedFocused) {
            queue(() => {
                computedProps.computedSetFocused(true);
            });
        }
        if (computedProps.computedCellSelectionEnabled) {
            // only update what we already have
            // since cellmousedown will handle the rest
            queue.commit();
            return;
        }
        if (onGroupRowClick(rowProps, computedProps, queue)) {
            queue.commit();
            return;
        }
        if ((!props.checkboxOnlyRowSelect || event.type !== 'click') &&
            (preventRowSelectionOnClickWithMouseMove ? mouseDidNotMove : true)) {
            // perform row selection
            handleRowSelectionOnClick(event, rowProps, computedProps, queue);
        }
        else {
            if (computedProps.enableKeyboardNavigation &&
                computedProps.computedHasRowNavigation) {
                queue(() => {
                    computedProps.setActiveIndex(rowProps.rowIndex);
                });
            }
        }
        queue.commit();
    }, []);
    const onCellClickAction = useCallback((event, cellProps) => {
        if (cellProps.groupProps || cellProps.cellSelectable === false) {
            return;
        }
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        const hasCellSelection = computedProps.computedCellSelectionEnabled;
        const cellMultiSelect = computedProps.computedCellMultiSelectionEnabled;
        const queue = batchUpdate();
        if (hasCellSelection) {
            const ctrlKey = event.ctrlKey || event.metaKey;
            const append = cellMultiSelect && ctrlKey;
            const cellCoords = [
                cellProps.rowIndex,
                cellProps.columnIndex,
            ];
            const key = computedProps.getCellSelectionKey(cellProps);
            const shiftKey = event.shiftKey &&
                (computedProps.computedActiveCell || computedProps.lastSelectedCell);
            if (shiftKey && cellMultiSelect) {
                const cellSelection = computedProps.getCellSelectionBetween(computedProps.computedActiveCell ||
                    computedProps.lastSelectedCell ||
                    undefined, cellCoords);
                queue(() => {
                    computedProps.setLastCellInRange(Object.keys(cellSelection).pop() || '');
                    computedProps.setCellSelection(cellSelection);
                });
            }
            else {
                const cellSelectionMap = computedProps.computedCellSelection;
                const isSelected = !!cellSelectionMap[key];
                const newCellSelectionMap = append
                    ? Object.assign({}, cellSelectionMap)
                    : {};
                if (isSelected &&
                    (cellMultiSelect ||
                        computedProps.initialProps.toggleCellSelectOnClick ||
                        ctrlKey)) {
                    delete newCellSelectionMap[key];
                }
                else {
                    if (!shiftKey) {
                        queue(() => {
                            computedProps.setLastSelectedCell(cellCoords);
                        });
                    }
                    newCellSelectionMap[key] = true;
                }
                queue(() => {
                    computedProps.setCellSelection(newCellSelectionMap);
                });
            }
        }
        const shouldSetActiveCell = computedProps.computedCellNavigationEnabled &&
            (!event.shiftKey || !cellMultiSelect);
        queue(() => {
            if (shouldSetActiveCell) {
                computedProps.setActiveCell([
                    cellProps.rowIndex,
                    cellProps.columnIndex,
                ]);
            }
        });
        queue.commit();
    }, []);
    const setItemAtAsSelected = useCallback((index, event) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        const { computedRowSelectionEnabled, getItemAt, getItemId, } = computedProps;
        const item = getItemAt(index);
        const itemId = item ? getItemId(item) : undefined;
        if (itemId === undefined) {
            return;
        }
        if (computedRowSelectionEnabled) {
            handleSelection({
                rowIndex: index,
                data: item,
            }, computedProps, (event || { nativeEvent: null }));
        }
    }, []);
    const selectionIndexRef = useRef(null);
    const shiftKeyIndexRef = useRef(null);
    const lastMouseDownEventPropsRef = useRef({
        rowIndex: -1,
        pageX: -1,
        pageY: -1,
    });
    const computedOnCellMouseDown = useCallback((event, cellProps) => {
        lastMouseDownEventPropsRef.current = {
            rowIndex: cellProps.rowIndex,
            pageX: Math.floor(event.pageX),
            pageY: Math.floor(event.pageY),
        };
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        if (computedProps.columnUserSelect &&
            event.shiftKey &&
            computedProps.preventDefaultTextSelectionOnShiftMouseDown) {
            event.preventDefault();
        }
        computedProps.onCellClickAction(event, cellProps);
        if (computedProps.onCellSelectionDraggerMouseDown) {
            computedProps.onCellSelectionDraggerMouseDown(event, cellProps);
        }
    }, []);
    const { computedActiveIndex } = computedProps;
    return {
        selectionIndexRef,
        shiftKeyIndexRef,
        onCellClickAction,
        computedOnKeyDown,
        computedOnFocus,
        computedOnRowClick,
        computedOnCellMouseDown,
        isGroup,
        computedActiveItem: computedActiveIndex !== -1 && computedProps.data
            ? computedProps.data[computedActiveIndex]
            : null,
        lastMouseDownEventPropsRef,
        toggleActiveRowSelection: (event) => {
            const { current: computedProps } = computedPropsRef;
            if (!computedProps) {
                return;
            }
            const { computedActiveIndex } = computedProps;
            if (computedActiveIndex == -1) {
                return;
            }
            setItemAtAsSelected(computedActiveIndex, event);
        },
        rowProps: {
            ...computedProps.initialProps.rowProps,
            onMouseDown: (event) => {
                if (computedProps.initialProps.rowProps &&
                    computedProps.initialProps.rowProps.onMouseDown) {
                    computedProps.initialProps.rowProps.onMouseDown(event);
                }
                if (!computedProps.computedFocused &&
                    computedProps.enableKeyboardNavigation) {
                    // a row click will occur,
                    // so allow computedOnRowClick to set both the active index and the focused flags
                    computedProps.computedWillReceiveFocusRef.current = true;
                }
            },
        },
    };
};
