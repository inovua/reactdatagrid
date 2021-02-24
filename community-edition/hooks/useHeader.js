/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import useProperty from './useProperty';
export default (props, computedProps) => {
    const [computedShowHeader, setShowHeader] = useProperty(props, 'showHeader');
    const result = {
        computedShowHeader,
        setShowHeader,
    };
    if (computedShowHeader) {
        result.onHeaderSortClick = colProps => {
            if (computedProps.toggleColumnSort) {
                computedProps.toggleColumnSort(colProps.id);
            }
        };
    }
    return result;
};
