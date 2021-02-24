/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import EnterpriseColumnLayout from '../../EnterpriseColumnLayout';
import maybeAddRowReorderColumn from './maybeAddRowReorderColumn';
export default {
    name: 'row-reorder',
    maybeAddColumns: maybeAddRowReorderColumn,
    defaultProps: () => {
        return {
            ColumnLayout: EnterpriseColumnLayout,
        };
    },
};
