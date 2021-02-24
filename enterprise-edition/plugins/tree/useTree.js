/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import computeTreeData from './computeTreeData';
import useTreeColumn from './useTreeColumn';
export default (props, computedProps, computedPropsRef) => {
    Object.assign(computedProps, useTreeColumn(props, computedProps, computedPropsRef));
    computedProps.computeTreeData = computeTreeData;
};
