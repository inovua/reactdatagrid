/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 *  This is a dummy component
 *  it's sole purpose it for configuration of columns
 */
export default class Column extends React.Component {
  render() {
    return null;
  }
}

Column.defaultProps = {
  // used to check if element is column
  isColumn: true,
  keepFlex: true,
};

Column.propTypes = {
  keepFlex: PropTypes.bool,
  id: props => {
    if (!props.name && !props.id) {
      return new Error('Each column should have a "name" or an "id" property!');
    }
  },
};
