/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import autoBind from './autoBind';
class ReactClass extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);
    }
}
export default ReactClass;
export { autoBind, ReactClass as Component };
