/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useMemo } from 'react';
const EMPTY_ARRAY = [];
export default (props) => {
    const computedLockedStartRows = useMemo(() => props.lockedRows
        ? props.lockedRows.filter(r => r.position !== 'end')
        : EMPTY_ARRAY, [props.lockedRows]);
    const computedLockedEndRows = useMemo(() => props.lockedRows
        ? props.lockedRows.filter(r => r.position === 'end')
        : EMPTY_ARRAY, [props.lockedRows]);
    const result = {
        computedLockedRows: props.lockedRows || EMPTY_ARRAY,
        computedLockedStartRows,
        computedLockedEndRows,
    };
    return result;
};
