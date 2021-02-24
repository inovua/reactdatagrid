/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import maybeAddRowExpandColumn from './maybeAddRowExpandColumn';
import useRowDetails from './useRowDetails';
export default {
    name: 'row-details',
    hook: useRowDetails,
    maybeAddColumns(columns, props) {
        columns = maybeAddRowExpandColumn(columns, props);
        return columns;
    },
    defaultProps: () => {
        return {};
    },
};
