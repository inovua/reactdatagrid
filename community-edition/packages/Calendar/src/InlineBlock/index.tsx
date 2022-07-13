/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, CSSProperties } from 'react';

type TypeInlineBlockProps = {
  style: CSSProperties;
};

const defaultProps = {
  style: {},
};
class InovuaInlineBlock extends Component<TypeInlineBlockProps, {}> {
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
    return <div {...props} />;
  }
}

export { TypeInlineBlockProps };
export default InovuaInlineBlock;
