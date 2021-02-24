/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import assign from '../../../common/assign';

function Arrow(props) {
  const style = assign({}, props.style);
  const wrapperStyle = assign({}, props.position);

  const arrowSize = {
    height: props.size,
    width: props.size,
  };
  assign(style, arrowSize);

  // 1/2 * H * 2^1/2
  const wrapperSize = 2 * (0.5 * props.size * Math.pow(2, 0.5));
  if (wrapperSize) {
    wrapperStyle.width = wrapperSize;
    wrapperStyle.height = wrapperSize;
  }

  return (
    <div className={props.wrapperClassName} style={wrapperStyle}>
      <div className={props.className} style={style} />
    </div>
  );
}

Arrow.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  size: PropTypes.number,
  position: PropTypes.shape({
    top: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    left: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
};

export default Arrow;
