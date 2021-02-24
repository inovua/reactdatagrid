/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const emptyObject = Object.freeze ? Object.freeze({}) : {};
const DEFAULT_WIDTH = 150;
const computeColumnWidths = (col, { columnMinWidth, columnWidth, columnMaxWidth, columnDefaultWidth = DEFAULT_WIDTH, columnSizes = emptyObject, columnFlexes = emptyObject, }) => {
    if (columnMinWidth && columnMaxWidth && columnMinWidth > columnMaxWidth) {
        [columnMinWidth, columnMaxWidth] = [columnMaxWidth, columnMinWidth];
    }
    let computedDefaultWidth = col.defaultWidth;
    let computedWidth = col.width;
    let computedFlex = col.defaultFlex;
    let computedMinWidth = col.minWidth;
    let computedMaxWidth = col.maxWidth;
    if (col.defaultWidth == null && columnDefaultWidth != null) {
        computedDefaultWidth = columnDefaultWidth;
    }
    if (columnFlexes[col.id]) {
        computedFlex = columnFlexes[col.id];
    }
    if (col.flex) {
        // controlled flex wins over stateful flex
        computedFlex = col.flex;
    }
    if (!computedFlex &&
        computedWidth === undefined &&
        columnSizes[col.id] !== undefined) {
        computedFlex = null;
        computedWidth = columnSizes[col.id];
    }
    if (!computedFlex) {
        computedFlex = null;
    }
    if (computedFlex != null && computedWidth == null && columnWidth != null) {
        computedWidth = columnWidth;
    }
    if (computedMinWidth == null && columnMinWidth != null) {
        computedMinWidth = columnMinWidth;
    }
    if (computedMaxWidth == null && columnMaxWidth != null) {
        computedMaxWidth = columnMaxWidth;
    }
    // ensure defaultWidth >= minWidth
    if (computedDefaultWidth != null &&
        computedMinWidth != null &&
        computedDefaultWidth < computedMinWidth) {
        computedDefaultWidth = computedMinWidth;
    }
    // ensure defaultWidth <= maxWidth
    if (computedDefaultWidth != null &&
        computedMaxWidth != null &&
        computedDefaultWidth > computedMaxWidth) {
        computedDefaultWidth = computedMaxWidth;
    }
    // ensure width >= minWidth
    if (computedWidth != null &&
        computedMinWidth != null &&
        computedWidth < computedMinWidth) {
        computedWidth = computedMinWidth;
    }
    // ensure width <= maxWidth
    if (computedWidth != null &&
        computedMaxWidth != null &&
        computedWidth > computedMaxWidth) {
        computedWidth = computedMaxWidth;
    }
    if (computedFlex == null) {
        computedWidth = computedWidth || computedDefaultWidth || computedMinWidth;
    }
    col.computedMinWidth = computedMinWidth;
    col.computedMaxWidth = computedMaxWidth;
    col.computedWidth = computedWidth;
    col.computedFlex = computedFlex;
    return col;
};
export default computeColumnWidths;
