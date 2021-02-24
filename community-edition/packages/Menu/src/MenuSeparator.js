/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import assign from '../../../common/assign';
import Component from '../../../packages/react-class';
import join from '../../../common/join';

class MenuSeparator extends Component {
  render() {
    const props = this.prepareProps(this.props);

    return (
      <tr className={props.className}>
        <td colSpan={100}>
          <div
            className={`${props.rootClassName}__menu-separator__tool`}
            style={props.style}
          />
        </td>
      </tr>
    );
  }

  prepareProps(thisProps) {
    const props = {};

    assign(props, thisProps);

    props.style = this.prepareStyle(props);
    props.className = this.prepareClassName(props);

    return props;
  }

  prepareClassName(props) {
    const className = join(
      `${props.rootClassName}__menu-separator`,
      props.className
    );

    return className;
  }

  prepareStyle(props) {
    return assign({}, props.style, props.menuSeparatorStyle);
  }
}

MenuSeparator.defaultProps = {
  isSeparator: true,
};

export default MenuSeparator;
