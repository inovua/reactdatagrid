/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import computeDataStep from './computeDataStep';
import useStickyRows from './useStickyRows';
import useGroupBy from './useGroupBy';
import useGroups from './useGroups';
export default (props, computedProps, computedPropsRef) => {
    Object.assign(computedProps, useStickyRows(props, computedProps, computedPropsRef));
    Object.assign(computedProps, useGroupBy(props, computedProps, computedPropsRef));
    Object.assign(computedProps, useGroups(props, computedProps, computedPropsRef));
    return { computeDataStep };
};
