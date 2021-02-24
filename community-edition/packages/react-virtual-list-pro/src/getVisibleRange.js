/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export default ({ size, scrollTop, count, rowHeightManager, naturalRowHeight, showEmptyRows, }) => {
    const start = rowHeightManager.getRowAt(scrollTop);
    let end = naturalRowHeight
        ? rowHeightManager.getRowAt(scrollTop + size.height) + 1
        : start + Math.ceil(size.height / rowHeightManager.getDefaultRowHeight());
    if (!showEmptyRows) {
        end = Math.min(count - 1, end);
    }
    return { start, end };
};
