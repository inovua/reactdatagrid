/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import maybeAddCheckboxColumn from './maybeAddCheckboxColumn';
// import updateWithShowingColumns from './updateWithShowingColumns';
// import updateWithHidingColumns from './updateWithHidingColumns';
// const notInTransition = c => {
//   c = assign({}, c);
//   c.inTransition = false;
//   return c;
// };
export default function (columns, props) {
    if (props.maybeAddColumns) {
        columns = props.maybeAddColumns(columns, props);
    }
    columns = maybeAddCheckboxColumn(columns, props);
    // columns = columns.map(notInTransition);
    // columns = updateWithShowingColumns(columns, props, state, context);
    // columns = updateWithHidingColumns(columns, props, state, context);
    return columns;
}
