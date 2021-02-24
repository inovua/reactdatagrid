/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import isControlledProperty from './isControlledProperty';
const getProperty = (props, state, propName) => {
    if (isControlledProperty(props, propName)) {
        return props[propName];
    }
    return state[propName];
};
export default getProperty;
