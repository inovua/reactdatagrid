/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export const isRowExpandEnabled_FromProps = (props) => {
    const { enableRowExpand, expandedRows, defaultExpandedRows, renderRowDetails, renderDetailsGrid, } = props;
    if (enableRowExpand !== undefined) {
        return !!enableRowExpand;
    }
    const tmpComputedExpandedRows = expandedRows || defaultExpandedRows;
    return (tmpComputedExpandedRows !== undefined ||
        typeof renderRowDetails === 'function' ||
        typeof renderDetailsGrid === 'function');
};
