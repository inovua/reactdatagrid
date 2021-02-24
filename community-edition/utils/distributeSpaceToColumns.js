/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import computeFlexWidths from './flex/computeFlexWidths';
import clamp from './clamp';
export default (space, columns) => {
    const flexes = columns.map(_ => 1);
    const sign = Math.sign(space);
    const positiveSpace = Math.abs(space);
    // computeFlexWidths only accepts positive spaces
    let newWidths = computeFlexWidths({
        flexes,
        availableSize: positiveSpace,
    });
    if (sign == -1) {
        newWidths = newWidths.map(w => (w != null ? -w : null));
    }
    let reportedDiff = 0;
    let distributedSpace = 0;
    let distributedSum = 0;
    let fullColumnsCount = 0;
    const fullColumnsArray = columns.map(_ => false);
    const distributedWidths = columns.map(_ => 0);
    const columnWidths = columns.map(c => c.computedWidth || c.minWidth || 0);
    while (fullColumnsCount < columns.length &&
        Math.abs(distributedSum) < positiveSpace) {
        columns.forEach((col, i) => {
            if (fullColumnsArray[i]) {
                // this column is already full, no point in checking for space in it
                return;
            }
            const sizeToAdd = Math.round((newWidths[i] || 0) + reportedDiff);
            newWidths[i] = 0;
            reportedDiff = 0;
            const currentSize = columnWidths[i];
            const newSize = Math.round(currentSize + sizeToAdd);
            const adjustedNewSize = clamp(newSize, col.minWidth, col.maxWidth);
            if (newSize !== adjustedNewSize) {
                distributedSpace = sizeToAdd - (newSize - adjustedNewSize);
                distributedWidths[i] += distributedSpace;
                reportedDiff += sizeToAdd - distributedSpace;
                fullColumnsCount++;
                fullColumnsArray[i] = true;
            }
            else {
                distributedSpace = sizeToAdd;
                distributedWidths[i] += sizeToAdd;
            }
            columnWidths[i] = adjustedNewSize;
            distributedSum += distributedSpace;
        });
    }
    return {
        widths: distributedWidths,
        columnWidths,
        distributedSum,
        remaining: space - distributedSum,
    };
};
