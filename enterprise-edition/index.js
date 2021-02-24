/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import { plugins } from '@inovua/reactdatagrid-community';
import Factory, { filterTypes } from '@inovua/reactdatagrid-community/factory';
import rowDetails from './plugins/row-details';
import lockedColumns from './plugins/locked-columns';
import groupAndPivot from './plugins/group-and-pivot';
import treePlugin from './plugins/tree';
import licensePlugin from './plugins/license';
import rowReorder from './plugins/row-reorder';
import livePagination from './plugins/live-pagination';
import rowIndexColumn from './plugins/row-index-column';
import footerRows from './plugins/footer-rows';
import lockedRows from './plugins/locked-rows';
const enterprisePlugins = [
    ...plugins,
    treePlugin,
    groupAndPivot,
    lockedRows,
    footerRows,
    licensePlugin,
    rowDetails,
    lockedColumns,
    rowReorder,
    rowIndexColumn,
    livePagination,
];
export default Factory({
    plugins: enterprisePlugins,
}, 'enterprise');
export { filterTypes };
