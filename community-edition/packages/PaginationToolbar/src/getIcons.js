/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

const emptyObject = {};
const SIZE = 20;

const getIcons = ({ size, ...props } = emptyObject) => {
  size = size || SIZE;

  const FIRST_PAGE = (
    <svg {...props} height={size} viewBox="0 0 24 24" width={size}>
      <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z" />
    </svg>
  );

  const LAST_PAGE = (
    <svg {...props} height={size} viewBox="0 0 24 24" width={size}>
      <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z" />
    </svg>
  );

  const PREV_PAGE = (
    <svg {...props} height={size} viewBox="0 0 24 24" width={size}>
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
  );

  const NEXT_PAGE = (
    <svg {...props} height={size} viewBox="0 0 24 24" width={size}>
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
  );

  const REFRESH = (
    <svg {...props} height={size} viewBox="0 0 24 24" width={size}>
      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
    </svg>
  );

  return {
    FIRST_PAGE,
    LAST_PAGE,
    PREV_PAGE,
    NEXT_PAGE,
    REFRESH,
  };
};

const { FIRST_PAGE, LAST_PAGE, PREV_PAGE, NEXT_PAGE, REFRESH } = getIcons();

export default getIcons;

export { FIRST_PAGE, LAST_PAGE, PREV_PAGE, NEXT_PAGE, REFRESH };
