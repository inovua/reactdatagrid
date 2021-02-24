/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const ua = global.navigator ? global.navigator.userAgent : '';
// see usage of isSafari const
// needed in order to fix tickets/128
const isSafari = ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1;

const delay35 = fn => () => setTimeout(fn, 35);
const now = fn => () => fn();

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
export default {
  findInitialSelectionIndex(props = this.props) {
    const selected = this.getSelectedMap(props);
    let index = undefined;

    if (!selected || !Object.keys(selected).length) {
      return index;
    }

    let i = 0;
    const data = this.p.data;
    const len = data.length;
    let id;

    for (; i < len; i++) {
      id = this.getItemId(data[i]);

      if (selected[id]) {
        index = i;
      }
    }

    return index;
  },
  notifySelection(selected, data, unselected) {
    let handled = false;

    const onSelectionChange = (isSafari ? delay35 : now)(() => {
      if (typeof this.props.onSelectionChange == 'function') {
        this.props.onSelectionChange({ selected, data, unselected });
      }
    });

    if (!this.isUnselectedControlled()) {
      const unselectedCount = this.getUnselectedCount(
        undefined,
        undefined,
        unselected
      );
      handled = true;
      this.update(
        {
          unselected,
          unselectedCount,
        },
        onSelectionChange
      );
    }

    if (!this.isSelectionControlled()) {
      handled = true;
      this.update(
        {
          selected,
          selectedCount: this.getSelectedCount(
            undefined,
            undefined,
            selected,
            unselected
          ),
        },
        onSelectionChange
      );
    }

    if (!handled) {
      onSelectionChange();
    }
  },
  handleSingleSelection(data, event) {
    const rowSelected = this.isRowSelected(data);
    let newSelected = !rowSelected;

    const ctrlKey = event.metaKey || event.ctrlKey;
    if (
      !this.props.toggleRowSelectOnClick &&
      rowSelected &&
      event &&
      !ctrlKey
    ) {
      // if already selected and not ctrl, keep selected
      newSelected = true;
    }

    const selectedId = newSelected ? this.getItemId(data) : null;

    this.notifySelection(selectedId, data);
  },
  handleMultiSelection(data, event, config) {
    const selIndex = config.selIndex;
    const prevShiftKeyIndex = config.prevShiftKeyIndex;

    const props = this.p;
    const map =
      selIndex == null
        ? {}
        : Object.assign({}, this.getSelected(props, this.state));

    if (prevShiftKeyIndex != null && selIndex != null) {
      const min = Math.min(prevShiftKeyIndex, selIndex);
      const max = Math.max(prevShiftKeyIndex, selIndex);

      const removeArray = props.data.slice(min, max + 1) || [];

      removeArray.forEach(item => {
        if (item) {
          const id = this.getItemId(item);
          delete map[id];
        }
      });
    }

    data.forEach(item => {
      if (item) {
        const id = this.getItemId(item);
        map[id] = item;
      }
    });

    this.notifySelection(map, data);
  },
  handleMultiSelectionRowToggle(data) {
    const selected = this.p.selected;
    const isSelected = this.isRowSelected(data);

    if (selected !== true) {
      const clone = Object.assign({}, selected);
      const id = this.getItemId(data);

      if (isSelected) {
        delete clone[id];
      } else {
        clone[id] = data;
      }

      this.notifySelection(clone, data);
    } else {
      const id = this.getItemId(data);
      const unselected = Object.assign({}, this.getUnselected());
      if (isSelected) {
        unselected[id] = data;
      } else {
        delete unselected[id];
      }
      this.notifySelection(true, data, unselected);
    }

    return isSelected;
  },
  handleSelection(rowProps, event) {
    const props = this.p;

    if (!this.isSelectionEnabled()) {
      return;
    }

    const multiSelect = this.isMultiSelect();

    if (!multiSelect) {
      this.handleSingleSelection(rowProps.data, event);
      return;
    }

    if (this.selIndex === undefined) {
      this.selIndex = this.findInitialSelectionIndex();
    }

    let selIndex = this.selIndex;

    // multi selection
    const index = rowProps.rowIndex;
    const prevShiftKeyIndex = this.shiftKeyIndex;
    let start;
    let end;
    let data;

    if (
      event.metaKey ||
      event.ctrlKey ||
      (this.props.toggleRowSelectOnClick &&
        this.getSelectedCount() === 1 &&
        this.isRowSelected(props.data[index]))
    ) {
      this.selIndex = index;
      this.shiftKeyIndex = null;

      const unselect = this.handleMultiSelectionRowToggle(
        props.data[index],
        event
      );

      if (unselect) {
        this.selIndex++;
        this.shiftKeyIndex = prevShiftKeyIndex;
        return false;
      }

      return;
    }

    if (!event.shiftKey) {
      // set selIndex, for future use
      this.selIndex = index;
      this.shiftKeyIndex = null;

      // should not select many, so make selIndex null
      selIndex = null;
    } else {
      this.shiftKeyIndex = index;
    }

    if (selIndex == null) {
      data = [props.data[index]];
    } else {
      start = Math.min(index, selIndex);
      end = Math.max(index, selIndex) + 1;
      data = props.data.slice(start, end);
    }

    this.handleMultiSelection(data, event, { selIndex, prevShiftKeyIndex });
  },
};
