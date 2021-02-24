/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';

class InovuaInlineBlock extends Component {
  render() {
    const { props } = this;
    const domProps = {
      ...props,
      style: {
        display: 'inline-block',
        ...props.style,
      },
    };
    return <div {...props} />;
  }
}

InovuaInlineBlock.defaultProps = {
  style: {},
};

export default InovuaInlineBlock;
