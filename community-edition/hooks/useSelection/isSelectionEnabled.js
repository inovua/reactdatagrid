/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const isSelectionEnabled = (props) => {
    const { selected, defaultSelected, enableSelection, cellSelection, checkboxColumn, } = props;
    if (enableSelection !== undefined) {
        return !!enableSelection;
    }
    return (selected !== undefined ||
        (defaultSelected !== undefined && cellSelection === undefined) ||
        !!checkboxColumn);
};
export default isSelectionEnabled;
