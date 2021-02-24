/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useMemo, useRef } from 'react';
export default (fn, deps, equalityCheck) => {
    const refId = useRef(Number.MIN_SAFE_INTEGER);
    const depsRef = useRef(deps);
    const prevDeps = depsRef.current;
    if (!equalityCheck(deps, prevDeps)) {
        refId.current++;
    }
    depsRef.current = deps;
    return useMemo(fn, [refId.current]);
};
