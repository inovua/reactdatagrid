/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from 'react';
const defaultProps = {
    style: {},
};
class InovuaInlineBlock extends Component {
    static defaultProps = defaultProps;
    render() {
        const { props } = this;
        const domProps = {
            ...props,
            style: {
                display: 'inline-block',
                ...props.style,
            },
        };
        return React.createElement("div", { ...props });
    }
}
export default InovuaInlineBlock;
