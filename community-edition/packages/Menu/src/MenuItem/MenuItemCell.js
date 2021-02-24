/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Component from '../../../../packages/react-class';
import join from '../../../../common/join';
import cleanProps from '../../../../common/cleanProps';

export default class MenuItemCell extends Component {
  render() {
    const { props } = this;
    const { cellProps, rootClassName, align, rtl } = props;

    const children = props.expander || props.children;
    const className = join(
      props.className,
      cellProps.className,
      `${rootClassName}__cell`,
      rtl ? `${rootClassName}__cell--rtl` : `${rootClassName}__cell--ltr`,
      props.isDescription && `${rootClassName}__cell--secondaryLabel`,
      props.isIcon && `${rootClassName}__cell--icon`
    );

    const style = {
      ...props.style,
      ...cellProps.style,
    };

    if (align) {
      style.textAlign = align;
    }

    return (
      <td
        {...cleanProps(props, MenuItemCell.propTypes)}
        {...cellProps}
        style={style}
        className={className}
      >
        {children}
      </td>
    );
  }
}

MenuItemCell.defaultProps = {
  cellProps: {},
};

MenuItemCell.propTypes = {
  isDescription: PropTypes.bool,
  isIcon: PropTypes.bool,
  rootClassName: PropTypes.string,
  column: PropTypes.object,
  cellProps: PropTypes.object,
  rtl: PropTypes.bool,
  expander: PropTypes.node,
  align: PropTypes.oneOf(['start', 'end', 'center', 'left', 'right']),
};
