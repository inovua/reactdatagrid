/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import isMobile from '../../../common/isMobile';

const ARROWS = {
  right: (
    <path
      fillRule="evenodd"
      d="M4.738 5.262L.632 9.368c-.144.144-.379.144-.524 0C.04 9.298 0 9.204 0 9.106V.894C0 .69.166.524.37.524c.099 0 .193.039.262.108l4.106 4.106c.145.145.145.38 0 .524z"
    />
  ),
  left: (
    <path
      fillRule="evenodd"
      d="M.262 4.738L4.368.632c.144-.144.379-.144.524 0C4.96.702 5 .796 5 .894v8.212c0 .204-.166.37-.37.37-.099 0-.193-.039-.262-.108L.262 5.262c-.145-.145-.145-.38 0-.524z"
    />
  ),
  down: (
    <path
      fillRule="evenodd"
      d="M4.738 4.738L.632.632C.488.488.488.253.632.108.702.04.796 0 .894 0h8.212c.204 0 .37.166.37.37 0 .099-.039.193-.108.262L5.262 4.738c-.145.145-.38.145-.524 0z"
    />
  ),
  up: (
    <path
      fillRule="evenodd"
      d="M5.262.262l4.106 4.106c.144.144.144.379 0 .524-.07.069-.164.108-.262.108H.894c-.204 0-.37-.166-.37-.37 0-.099.039-.193.108-.262L4.738.262c.145-.145.38-.145.524 0z"
    />
  ),
};

const Arrow = ({ name, className, size = isMobile ? 25 : 20 }) => {
  return (
    <svg
      className={`${className} ${className}--${name}`}
      height={size.height || size}
      width={size.width || size}
      viewBox="0 0 10 20"
    >
      <g transform="translate(2.5, 5)">{ARROWS[name]}</g>
    </svg>
  );
};

export default Arrow;
