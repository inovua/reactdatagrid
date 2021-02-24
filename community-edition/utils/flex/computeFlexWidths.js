/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const sum = (a, b) => (a || 0) + (b || 0);
const EMPTY_ARRAY = [];
export default ({ flexes, availableSize, maxWidths = EMPTY_ARRAY, minWidths = EMPTY_ARRAY, }) => {
    flexes = [...flexes];
    let sumOfAllFlexes = flexes.reduce(sum, 0);
    if (minWidths.length && minWidths.length != flexes.length) {
        throw 'minWidths.length needs to be === flexes.length';
    }
    if (maxWidths.length && maxWidths.length != flexes.length) {
        throw 'maxWidths.length needs to be === flexes.length';
    }
    let oneFlex = sumOfAllFlexes ? availableSize / sumOfAllFlexes : 0;
    const result = flexes.map(_ => null);
    // for each flex with minWidth,
    // we need to take into consideration if the size obtained
    // via flex is less than minWidth
    // in this iteration, we assign sizes only for flexes for which
    // the computed size is < corresponding minWidth, or > corresponding maxWidth
    flexes.forEach((flex, index) => {
        const minWidth = minWidths[index];
        flex = flex || 0;
        if (flex === 0) {
            return;
        }
        let size;
        let flexSize = Math.round(flex * oneFlex);
        let maxWidth = maxWidths[index];
        if (minWidth != null && flexSize < minWidth) {
            // if that's the case
            // just make this flex be 0 and assign the minWidth to it
            availableSize -= minWidth;
            flexes[index] = 0;
            size = minWidth;
            // which means we need to recompute the size available for flexboxes
            sumOfAllFlexes -= flex;
            oneFlex = sumOfAllFlexes ? availableSize / sumOfAllFlexes : 0;
        }
        else if (maxWidth != null && flexSize > maxWidth) {
            availableSize -= maxWidth;
            flexes[index] = 0;
            size = maxWidth;
            sumOfAllFlexes -= flex;
            oneFlex = sumOfAllFlexes ? availableSize / sumOfAllFlexes : 0;
        }
        if (size) {
            result[index] = size;
        }
    });
    const lastValidFlexIndex = flexes.reduce((acc, flex, index) => (flex ? index : acc), -1);
    flexes.forEach((flex, index) => {
        if (!flex) {
            return;
        }
        let flexSize = Math.round(flex * oneFlex);
        if (index === lastValidFlexIndex) {
            flexSize = availableSize;
        }
        if (minWidths[index] != null) {
            flexSize = Math.max(flexSize, minWidths[index] || 0);
        }
        if (maxWidths[index] != null) {
            flexSize = Math.min(flexSize, maxWidths[index] || Infinity);
        }
        availableSize -= Math.max(flexSize, 0);
        result[index] = flexSize;
    });
    return result;
};
