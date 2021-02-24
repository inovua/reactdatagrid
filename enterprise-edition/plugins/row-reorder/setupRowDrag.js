/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import DragHelper from '@inovua/reactdatagrid-community/packages/drag-helper';
const emptyFn = () => { };
export default (event, region, cfg) => {
    const onDrag = cfg.onDrag || emptyFn;
    const onDrop = cfg.onDrop || emptyFn;
    DragHelper(event, {
        region,
        onDrag(event, config) {
            event.preventDefault();
            onDrag(event, config);
        },
        onDrop(event, config) {
            onDrop(event, config);
        },
    });
};
