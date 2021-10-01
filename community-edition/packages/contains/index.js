/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const DOCUMENT_POSITION_CONTAINED_BY = 16;
function contains(container, elem) {
    if (container.contains) {
        return container.contains(elem);
    }
    var comparison = container.compareDocumentPosition(elem);
    return comparison === 0 || comparison & DOCUMENT_POSITION_CONTAINED_BY;
}
export default contains;
