/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import usePivot from './usePivot';
import renderGroupToolbar from './renderGroupToolbar';
import DragGroupItem from './DragGroupItem';
import React from 'react';
import maybeAddGroupColumn from './maybeAddGroupColumn';
export default {
    name: 'group-and-pivot',
    hook: usePivot,
    maybeAddColumns(columns, props) {
        if (props.groupBy && props.groupBy.length) {
            columns = maybeAddGroupColumn(columns, props);
        }
        return columns;
    },
    defaultProps: () => {
        return {
            renderGroupToolbar,
            renderDragGroupItem(ref) {
                return React.createElement(DragGroupItem, { ref: ref });
            },
        };
    },
};
