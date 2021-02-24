/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useState, useContext } from 'react';
export default (defaultValue, theContext, name) => {
    const context = useContext(theContext);
    if (context.state[name] !== undefined) {
        defaultValue = context.state[name];
    }
    const [value, setValue] = useState(defaultValue);
    return [
        value,
        (newValue) => {
            if (typeof newValue === 'function') {
                newValue = newValue(value);
            }
            context.state[name] = newValue;
            setValue(newValue);
        },
    ];
};
