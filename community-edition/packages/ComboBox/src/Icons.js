/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';

function CloseIcon({ size = 10, className, svgProps, ...rest }) {
  return (
    <div {...rest} className={className}>
      <svg {...svgProps} width={size} height={size} viewBox="0 0 10 10">
        <path
          fill="none"
          fillRule="evenodd"
          strokeLinecap="round"
          strokeWidth="1.33"
          d="M1 1l8 8m0-8L1 9"
        />
      </svg>
    </div>
  );
}

CloseIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
};

function ToggleIcon({ onClick, className, expanded, size = 10, ...rest }) {
  return (
    <div {...rest} className={className} onClick={onClick}>
      <svg width={size} height={size / 2} viewBox="0 0 10 5">
        {expanded ? (
          <path
            fillRule="evenodd"
            d="M5.262.262l4.106 4.106c.144.144.144.379 0 .524-.07.069-.164.108-.262.108H.894c-.204 0-.37-.166-.37-.37 0-.099.039-.193.108-.262L4.738.262c.145-.145.38-.145.524 0z"
          />
        ) : (
          <path
            fillRule="evenodd"
            d="M4.738 4.738L.632.632C.488.488.488.253.632.108.702.04.796 0 .894 0h8.212c.204 0 .37.166.37.37 0 .099-.039.193-.108.262L5.262 4.738c-.145.145-.38.145-.524 0z"
          />
        )}
      </svg>
    </div>
  );
}

function LoadingIcon({ size = 17, svgProps = {}, className, ...rest }) {
  return (
    <div {...rest} className={className}>
      <svg {...svgProps} width={size} height={size} viewBox="0 0 24 24">
        <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z" />
      </svg>
    </div>
  );
}

LoadingIcon.propTypes = {
  size: PropTypes.number,
};

export { CloseIcon, ToggleIcon, LoadingIcon };
