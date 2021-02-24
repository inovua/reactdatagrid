/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useState, useCallback, } from 'react';
import useProperty from '../useProperty';
import isSelectionEnabled from './isSelectionEnabled';
import isMultiSelect from './isMultiSelect';
import isSelectionControlled from './isSelectionControlled';
import { notifySelection, handleSelection } from '../useRow/handleSelection';
import batchUpdate from '../../utils/batchUpdate';
const EMPTY_OBJECT = {};
const getUnselectedFromProps = (computedProps) => {
    if (!computedProps) {
        return null;
    }
    if (computedProps.computedUnselected === undefined) {
        return null;
    }
    return computedProps.computedUnselected;
};
const getUnselectedCountFromProps = (computedProps, unselected) => {
    if (!computedProps) {
        return 0;
    }
    if (!computedProps.computedRowSelectionEnabled) {
        return 0;
    }
    if (!computedProps.computedRowMultiSelectionEnabled) {
        return 0;
    }
    unselected =
        unselected === undefined
            ? getUnselectedFromProps(computedProps)
            : unselected;
    return unselected ? Object.keys(unselected).length : 0;
};
const getSelectedCountFromProps = (computedProps, selected, unselected) => {
    if (!computedProps) {
        return 0;
    }
    if (!computedProps.computedRowSelectionEnabled) {
        return 0;
    }
    const multiSelect = computedProps.computedRowMultiSelectionEnabled;
    selected = selected === undefined ? computedProps.computedSelected : selected;
    if (multiSelect && selected === true) {
        const unselectedCount = getUnselectedCountFromProps(computedProps, unselected);
        return computedProps.paginationCount - unselectedCount;
    }
    return multiSelect
        ? selected
            ? Object.keys(selected).length
            : 0
        : !selected || Object.keys(selected).length === 0
            ? 0
            : 1;
};
const useUnselected = (props, { rowSelectionEnabled, rowMultiSelectionEnabled, }, computedPropsRef) => {
    let [unselected, setUnselected] = useProperty(props, 'unselected');
    let [unselectedCount, setUnselectedCount] = useState(unselected ? Object.keys(unselected).length : 0);
    if (!rowSelectionEnabled) {
        return {
            unselected: null,
            setUnselected,
        };
    }
    if (!rowMultiSelectionEnabled) {
        return {
            unselected: null,
            setUnselected,
        };
    }
    return {
        unselected,
        setUnselected,
    };
};
const useSelected = (props, computedProps, computedPropsRef) => {
    let [selected, setSelected] = useProperty(props, 'selected', undefined, {
        onChange: (selected, { silent, unselected, data, } = {}) => {
            const { current: computedProps } = computedPropsRef;
            if (props.onSelectionChange && !silent) {
                props.onSelectionChange({
                    selected,
                    data,
                    unselected: unselected !== undefined
                        ? unselected
                        : computedProps != null
                            ? computedProps.computedUnselected
                            : null,
                });
            }
        },
    });
    const rowSelectionEnabled = isSelectionEnabled(props);
    const rowMultiSelectionEnabled = isMultiSelect(props);
    if (!rowSelectionEnabled) {
        return {
            selected: null,
            setSelected,
            rowSelectionEnabled,
            rowMultiSelectionEnabled,
        };
    }
    if (isSelectionControlled(props)) {
        return {
            selected,
            setSelected,
            rowSelectionEnabled,
            rowMultiSelectionEnabled,
        };
    }
    if (rowMultiSelectionEnabled &&
        (typeof selected != 'object' || !selected) &&
        selected !== true) {
        selected = EMPTY_OBJECT;
    }
    return {
        selected,
        setSelected,
        rowSelectionEnabled,
        rowMultiSelectionEnabled,
    };
};
export default (props, computedProps, computedPropsRef) => {
    const { selected: computedSelected, setSelected, rowMultiSelectionEnabled, rowSelectionEnabled, } = useSelected(props, computedProps, computedPropsRef);
    const computedRowSelectionEnabled = rowSelectionEnabled;
    const computedRowMultiSelectionEnabled = rowMultiSelectionEnabled;
    const { unselected: computedUnselected, setUnselected } = useUnselected(props, {
        rowSelectionEnabled,
        rowMultiSelectionEnabled,
    }, computedPropsRef);
    const computedSelectedCount = getSelectedCountFromProps({
        computedPagination: computedProps.computedPagination,
        computedRemoteData: computedProps.computedRemoteData,
        paginationCount: computedProps.paginationCount,
        computedRowMultiSelectionEnabled,
        computedRowSelectionEnabled,
    }, computedSelected, computedUnselected);
    const computedUnselectedCount = getUnselectedCountFromProps({
        computedRowMultiSelectionEnabled,
        computedRowSelectionEnabled,
    }, computedUnselected);
    const isSelectionEmpty = useCallback(() => {
        const selected = computedSelected;
        let selectionEmpty = false;
        if (selected == null) {
            selectionEmpty = true;
        }
        if (typeof selected === 'object' && selected !== null) {
            selectionEmpty = Object.keys(selected).length === 0;
        }
        return selectionEmpty;
    }, [computedSelected]);
    const getSelectedMap = useCallback(() => {
        if (computedRowMultiSelectionEnabled) {
            return computedSelected;
        }
        return { [computedSelected]: true };
    }, [computedRowMultiSelectionEnabled, computedSelected]);
    const getUnselected = useCallback(() => getUnselectedFromProps(computedPropsRef.current), []);
    const getUnselectedMap = useCallback(() => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return {};
        }
        const unselected = getUnselected();
        if (computedProps.computedRowMultiSelectionEnabled) {
            return unselected || {};
        }
        return {};
    }, [getUnselected]);
    const getUnselectedCount = (unselected) => getUnselectedCountFromProps(computedPropsRef.current, unselected);
    const getSelectedCount = (selected, unselected) => getSelectedCountFromProps(computedPropsRef.current, selected, unselected);
    const isRowSelected = useCallback((data) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return false;
        }
        if (typeof data == 'number') {
            data = computedProps.getItemAt(data);
        }
        const selectedMap = getSelectedMap();
        const id = computedProps.getItemId(data);
        if (selectedMap === true) {
            const unselectedMap = getUnselectedMap();
            return !unselectedMap[id];
        }
        return !!selectedMap[id];
    }, [getSelectedMap, getUnselectedMap]);
    // we need this here (temp used variable)
    // to compute hasRowNavigation below
    // but the actual computedCellSelection is computed in useCellSelection
    const cellSelectionTmp = props.cellSelection || props.defaultCellSelection;
    const activeCellDefined = props.activeCell !== undefined || props.defaultActiveCell !== undefined;
    let computedHasRowNavigation = (computedRowSelectionEnabled || !cellSelectionTmp) &&
        computedProps.computedActiveIndex > -1
        ? true
        : props.enableKeyboardNavigation !== false &&
            !cellSelectionTmp &&
            !activeCellDefined;
    if (props.enableKeyboardNavigation === false) {
        computedHasRowNavigation = false;
    }
    const { computedCellSelection, setCellSelection, cellSelectionEnabled: computedCellSelectionEnabled, cellMultiSelectionEnabled: computedCellMultiSelectionEnabled, cellNavigationEnabled: computedCellNavigationEnabled, computedActiveCell, incrementActiveCell, getCellSelectionIdKey, getCellSelectionBetween, toggleActiveCellSelection, onCellEnter, setActiveCell, getCellSelectionKey, cellDragStartRowIndex, setCellDragStartRowIndex, onCellSelectionDraggerMouseDown, } = computedProps.useCellSelection(props, {
        rowSelectionEnabled,
        listenOnCellEnter: computedProps.listenOnCellEnter,
        hasRowNavigation: computedHasRowNavigation,
    }, computedPropsRef);
    const selectAll = useCallback(() => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        if (!computedProps.computedRowSelectionEnabled) {
            return;
        }
        let data = computedProps.data;
        let dataMap = computedProps.dataMap;
        if (computedProps.computedGroupBy) {
            // need to filter out groups
            dataMap = {};
            data = data.filter(d => {
                const id = computedProps.getItemId(d);
                if (!d.__group) {
                    dataMap[id] = id;
                    return true;
                }
            });
        }
        notifySelection(computedProps, computedProps.computedRemoteData || computedProps.computedPagination
            ? true
            : dataMap, data, null);
    }, []);
    const deselectAll = useCallback(() => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        notifySelection(computedProps, {}, [], null);
    }, []);
    const setRowSelected = useCallback((index, selected, event) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        const queue = batchUpdate();
        if (computedProps.checkboxSelectEnableShiftKey &&
            computedProps.computedRowMultiSelectionEnabled) {
            if (event && event.target) {
                const { shiftKey, metaKey, ctrlKey } = event;
                if (shiftKey) {
                    const rowProps = {
                        data: computedProps.getItemAt(index),
                        rowIndex: index,
                    };
                    handleSelection(rowProps, computedProps, { shiftKey, metaKey, ctrlKey }, queue);
                    return;
                }
                computedProps.shiftKeyIndexRef.current = index;
                computedProps.selectionIndexRef.current = index;
            }
        }
        computedProps.setSelectedAt(index, selected, queue);
        queue.commit();
    }, [computedProps.initialProps.checkboxSelectEnableShiftKey]);
    const setSelectedAt = useCallback((index, selected, queue) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        const data = computedProps.data[index];
        if (!data) {
            return;
        }
        const id = computedProps.getItemId(data);
        computedProps.setSelectedById(id, selected, queue);
    }, []);
    const setSelectedById = useCallback((id, selected, queue) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        const data = computedProps.dataMap ? computedProps.dataMap[id] : null;
        if (!data) {
            return;
        }
        const isSelected = computedProps.isRowSelected(data);
        const multiSelect = computedProps.computedRowMultiSelectionEnabled;
        if (isSelected === selected) {
            return;
        }
        if (multiSelect) {
            const selectedMap = computedProps.computedSelected;
            let unselectedMap = selectedMap === true ? computedProps.computedUnselected || {} : null;
            let clone = selectedMap;
            if (selectedMap === true) {
                if (unselectedMap) {
                    unselectedMap = Object.assign({}, unselectedMap);
                }
                if (!selected && unselectedMap) {
                    unselectedMap[id] = true;
                    const totalCount = computedProps.paginationCount;
                    if (Object.keys(unselectedMap).length === totalCount) {
                        computedProps.deselectAll();
                        return;
                    }
                }
                else {
                    if (unselectedMap) {
                        delete unselectedMap[id];
                    }
                    if (getUnselectedCountFromProps(computedProps, unselectedMap) === 0) {
                        unselectedMap = null;
                    }
                }
            }
            else {
                clone = Object.assign({}, selectedMap);
                if (selected) {
                    clone[id] = data;
                }
                else {
                    delete clone[id];
                }
            }
            notifySelection(computedProps, clone, data, unselectedMap, queue);
        }
        else {
            notifySelection(computedProps, selected ? id : null, data, null, queue);
        }
    }, []);
    return {
        selectAll,
        deselectAll,
        setRowSelected,
        setSelectedAt,
        setSelectedById,
        setCellSelection,
        computedCellSelection,
        computedCellSelectionEnabled,
        computedCellMultiSelectionEnabled,
        computedCellNavigationEnabled,
        computedActiveCell,
        getCellSelectionBetween,
        incrementActiveCell,
        cellDragStartRowIndex,
        setCellDragStartRowIndex,
        onCellEnter,
        onCellSelectionDraggerMouseDown,
        toggleActiveCellSelection,
        computedHasRowNavigation,
        computedRowSelectionEnabled,
        computedRowMultiSelectionEnabled,
        computedSelected,
        setSelected,
        computedUnselected,
        setUnselected,
        isSelectionEmpty,
        getSelectedMap,
        getUnselectedMap,
        isRowSelected,
        getUnselectedCount,
        getSelectedCount,
        computedUnselectedCount,
        computedSelectedCount,
        getCellSelectionIdKey,
        setActiveCell,
        getCellSelectionKey,
    };
};
