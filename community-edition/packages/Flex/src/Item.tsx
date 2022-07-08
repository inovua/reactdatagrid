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
import { TypeItemProps, TypeItemState } from './types';

const defaultProps = { flex: 1 };

const propTypes = {
  shouldComponentUpdate: PropTypes.func,
  display: PropTypes.oneOf(['flex', 'inline-flex']),
  inline: (props: TypeItemProps, propName: string) => {
    if (props[propName as keyof TypeItemProps] !== undefined) {
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
class InovuaFlexItem extends Component<TypeItemProps, TypeItemState> {
  static defaultProps = defaultProps;
  static propTypes = propTypes;

  shouldComponentUpdate(
    nextProps: TypeItemProps,
    nextState: TypeItemState
  ): boolean {
    const shouldUpdate: boolean = shouldComponentUpdate(
      this,
      nextProps,
      nextState
    );

    return shouldUpdate;
  }

  render() {
    const props: TypeItemProps = this.props;
    const className: string = join(
      'inovua-react-toolkit-flex-item',
      props2className(props)
    );

    const allProps: TypeItemProps = { ...props };

    cleanup(allProps);

    allProps.className = className;

    if (props.factory) {
      return props.factory(allProps);
    }

    return <div {...allProps} />;
  }
}

export default InovuaFlexItem;
