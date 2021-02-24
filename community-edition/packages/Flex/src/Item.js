/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import shouldComponentUpdate from './shouldComponentUpdate';
import join from '../../../common/join';
import props2className from './props2className';
import cleanup from './cleanup';

class InovuaFlexItem extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const shouldUpdate = shouldComponentUpdate(this, nextProps, nextState);

    return shouldUpdate;
  }

  render() {
    const props = this.props;
    const className = join(
      'inovua-react-toolkit-flex-item',
      props2className(props)
    );

    const allProps = { ...props };

    cleanup(allProps);

    allProps.className = className;

    if (props.factory) {
      return props.factory(allProps);
    }

    return <div {...allProps} />;
  }
}

InovuaFlexItem.defaultProps = { flex: 1 };

InovuaFlexItem.propTypes = {
  shouldComponentUpdate: PropTypes.func,
  display: PropTypes.oneOf(['flex', 'inline-flex']),
  inline: (props, propName) => {
    if (props[propName] !== undefined) {
      return new Error(
        `"inline" prop should not be used on "Item". Use "display='inline-flex'" instead`
      );
    }
  },
  flex: PropTypes.any,
  flexGrow: PropTypes.any,
  flexShrink: PropTypes.any,
  flexBasis: PropTypes.any,
};

export default InovuaFlexItem;
