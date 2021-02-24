/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

function ToggleIcon({ onClick, className, expanded, size = 17, ...rest }) {
  return (
    <div {...rest} className={className} onClick={onClick}>
      <svg height={size} width={size} viewBox="0 0 24 24">
        {expanded ? (
          <path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" />
        ) : (
          <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
        )}
      </svg>
    </div>
  );
}

export default ToggleIcon;
