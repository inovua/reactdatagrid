/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';

import { TypeSize } from '../types';

export default (defaultSize: TypeSize): [TypeSize, (s: TypeSize) => any] => {
  let size: TypeSize;
  let setSize: (s: TypeSize) => any;

  [size, setSize] = useState(defaultSize);

  return [
    size,
    (
      newSize:
        | TypeSize
        | { width: number; height?: number }
        | { height: number; width?: number }
    ) => {
      setSize({
        width: Math.round(newSize.width || size.width || 0),
        height: Math.round(newSize.height || size.height || 0),
      });
    },
  ];
};
