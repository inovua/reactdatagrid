/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import Button from '../../Button';

import join from '../../../common/join';

const ICON_CLASS_NAME = 'inovua-react-pagination-toolbar__icon';

export default class PaginationIcon extends React.Component {
  render() {
    const { icon, size, disabled, action, name, theme } = this.props;

    const className = join(
      ICON_CLASS_NAME,
      `${ICON_CLASS_NAME}--named--${name}`
    );

    return (
      <Button
        disabled={disabled}
        className={className}
        icon={cloneElement(icon, { width: size, height: size })}
        onClick={action}
        theme={theme}
      />
    );
  }
}

PaginationIcon.propTypes = {
  name: PropTypes.string,
  action: PropTypes.func,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  size: PropTypes.number,
};
