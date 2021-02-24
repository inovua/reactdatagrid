/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useState } from 'react';
export default (defaultSize) => {
    let size;
    let setSize;
    [size, setSize] = useState(defaultSize);
    return [
        size,
        (newSize) => {
            setSize({
                width: Math.round(newSize.width || size.width || 0),
                height: Math.round(newSize.height || size.height || 0),
            });
        },
    ];
};
