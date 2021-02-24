/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import isControlledProperty from '../../utils/isControlledProperty';
import batchUpdate from '../../utils/batchUpdate';
const ua = global.navigator ? global.navigator.userAgent : '';
// see usage of isSafari const
// needed in order to fix tickets/128
const isSafari = ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1;
const delay35 = (fn) => () => setTimeout(fn, 35);
const now = (fn) => () => fn();
/**
 * Here is how multi selection is implemented - trying to emulate behavior in OSX Finder
 *
 * When there is no selection, and an initial click for
 * selection is done, keep that index (SELINDEX)
 *
 * Next, if we shift+click, we mark as selected the items from initial index to current click index.
 *
 * Now, if we ctrl+click elsewhere, keep the selection, but also add the selected file,
 * and set SELINDEX to the new index. Now on any subsequent clicks, have the same behavior,
 * selecting/deselecting items starting from SELINDEX to the new click index
 */
export const findInitialSelectionIndex = (computedProps) => {
    const selected = computedProps.getSelectedMap();
    let index = null;
    if (!selected || !Object.keys(selected).length) {
        return index;
    }
    let i = 0;
    const { data } = computedProps;
    const len = data.length;
    let id;
    for (; i < len; i++) {
        id = computedProps.getItemId(data[i]);
        if (selected[id]) {
            index = i;
        }
    }
    return index;
};
export const notifySelection = (computedProps, selected, data, unselected, queue) => {
    const queueDefined = !!queue;
    queue = queue || batchUpdate();
    const onSelectionChange = (isSafari ? delay35 : now)(() => {
        if (typeof computedProps.onSelectionChange == 'function') {
            computedProps.onSelectionChange({ selected, data, unselected });
        }
    });
    if (!isControlledProperty(computedProps.initialProps, 'unselected')) {
        const unselectedCount = computedProps.getUnselectedCount(unselected);
        queue(() => {
            computedProps.setUnselected(unselected);
        });
    }
    if (!isControlledProperty(computedProps.initialProps, 'selected')) {
        queue(() => {
            computedProps.setSelected(selected, { silent: true });
        });
    }
    onSelectionChange();
    if (!queueDefined) {
        queue.commit();
    }
};
export const handleSingleSelection = (rowProps, computedProps, event, queue) => {
    const { data } = rowProps;
    const rowSelected = computedProps.isRowSelected(data);
    let newSelected = !rowSelected;
    const ctrlKey = event.metaKey || event.ctrlKey;
    if (!computedProps.toggleRowSelectOnClick &&
        rowSelected &&
        event &&
        !ctrlKey) {
        // if already selected and not ctrl, keep selected
        newSelected = true;
    }
    const selectedId = newSelected ? computedProps.getItemId(data) : null;
    notifySelection(computedProps, selectedId, data, null, queue);
};
export const handleMultiSelection = (computedProps, data, config, queue) => {
    const selIndex = config.selIndex;
    const prevShiftKeyIndex = config.prevShiftKeyIndex;
    const map = selIndex == null ? {} : Object.assign({}, computedProps.computedSelected);
    if (prevShiftKeyIndex != null && selIndex != null) {
        const min = Math.min(prevShiftKeyIndex, selIndex);
        const max = Math.max(prevShiftKeyIndex, selIndex);
        const removeArray = computedProps.data.slice(min, max + 1) || [];
        removeArray.forEach(item => {
            if (item) {
                const id = computedProps.getItemId(item);
                delete map[id];
            }
        });
    }
    data.forEach(item => {
        if (item) {
            const id = computedProps.getItemId(item);
            map[id] = item;
        }
    });
    notifySelection(computedProps, map, data, null, queue);
};
export const handleMultiSelectionRowToggle = (computedProps, data, queue) => {
    const selected = computedProps.computedSelected;
    const isSelected = computedProps.isRowSelected(data);
    if (selected !== true) {
        const clone = Object.assign({}, selected);
        const id = computedProps.getItemId(data);
        if (isSelected) {
            delete clone[id];
        }
        else {
            clone[id] = data;
        }
        notifySelection(computedProps, clone, data, null, queue);
    }
    else {
        const id = computedProps.getItemId(data);
        const unselected = Object.assign({}, computedProps.computedUnselected);
        if (isSelected) {
            unselected[id] = data;
        }
        else {
            delete unselected[id];
        }
        notifySelection(computedProps, true, data, unselected, queue);
    }
    return isSelected;
};
export const handleSelection = (rowProps, computedProps, event, queue) => {
    const queueDefined = !!queue;
    if (!queue) {
        queue = batchUpdate();
    }
    if (!computedProps.computedRowSelectionEnabled) {
        return;
    }
    if (!computedProps.computedRowMultiSelectionEnabled) {
        handleSingleSelection(rowProps, computedProps, event, queue);
        if (!queueDefined) {
            queue.commit();
        }
        return;
    }
    let selIndex = computedProps.selectionIndexRef.current;
    if (selIndex === null) {
        selIndex = findInitialSelectionIndex(computedProps);
    }
    // multi selection
    const index = rowProps.rowIndex;
    const prevShiftKeyIndex = computedProps.shiftKeyIndexRef.current;
    let start;
    let end;
    let data;
    if (event.metaKey ||
        event.ctrlKey ||
        (computedProps.toggleRowSelectOnClick &&
            computedProps.getSelectedCount() === 1 &&
            computedProps.isRowSelected(computedProps.data[index]))) {
        computedProps.selectionIndexRef.current = index;
        computedProps.shiftKeyIndexRef.current = null;
        const unselect = handleMultiSelectionRowToggle(computedProps, computedProps.data[index], queue);
        if (!queueDefined) {
            queue.commit();
        }
        if (unselect) {
            computedProps.selectionIndexRef.current++;
            computedProps.shiftKeyIndexRef.current = prevShiftKeyIndex;
            return false;
        }
        return;
    }
    if (!event.shiftKey) {
        // set selIndex, for future use
        computedProps.selectionIndexRef.current = index;
        computedProps.shiftKeyIndexRef.current = null;
        // should not select many, so make selIndex null
        selIndex = null;
    }
    else {
        computedProps.shiftKeyIndexRef.current = index;
    }
    if (selIndex == null) {
        data = [computedProps.data[index]];
    }
    else {
        start = Math.min(index, selIndex);
        end = Math.max(index, selIndex) + 1;
        data = computedProps.data.slice(start, end);
    }
    handleMultiSelection(computedProps, data, {
        selIndex,
        prevShiftKeyIndex,
    }, queue);
    if (!queueDefined) {
        queue.commit();
    }
};
