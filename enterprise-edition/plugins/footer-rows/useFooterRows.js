/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
const EMPTY_ARRAY = [];
export default (props) => {
    const rows = (props.footerRows || EMPTY_ARRAY).map(r => {
        return {
            ...r,
            position: 'end',
        };
    });
    const result = {
        computedFooterRows: rows.length ? rows : null,
    };
    return result;
};
