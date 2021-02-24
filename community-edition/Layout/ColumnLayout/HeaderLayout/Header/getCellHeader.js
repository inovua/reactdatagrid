/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import humanize from '../../../../utils/humanize';
export default (cellProps, column, headerProps, contextMenu) => {
    const { header, name } = cellProps;
    if (header !== undefined) {
        if (typeof header !== 'function') {
            return header;
        }
        return header(cellProps, { cellProps, column, headerProps, contextMenu });
    }
    return humanize(name || '');
};
