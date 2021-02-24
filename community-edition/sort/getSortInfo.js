/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import isSortControlled from './isSortControlled';
export default (props, state) => {
    return isSortControlled(props) ? props.sortInfo : state.sortInfo;
};
