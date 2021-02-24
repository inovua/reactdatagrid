/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useMemo, useRef } from 'react';

type TypeDeps = { [key: string]: any };

export default (
  fn: () => any,
  deps: TypeDeps,
  equalityCheck: (a: TypeDeps, b: TypeDeps) => boolean
) => {
  const refId = useRef<number>(Number.MIN_SAFE_INTEGER);

  const depsRef = useRef<TypeDeps>(deps);
  const prevDeps = depsRef.current;
  if (!equalityCheck(deps, prevDeps)) {
    refId.current++;
  }

  depsRef.current = deps;

  return useMemo(fn, [refId.current]);
};
