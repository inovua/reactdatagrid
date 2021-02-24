/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import join from '../../../packages/join';

const DEFAULT_SIZE = 10;

export default ({ sortable, size, direction, renderSortTool }, extraProps) => {
  if (!sortable) {
    return null;
  }

  size = size || DEFAULT_SIZE;
  if (renderSortTool) {
    return renderSortTool(direction, extraProps);
  }

  let visibilityClassName = 'InovuaReactDataGrid__sort-icon';

  if (!direction) {
    visibilityClassName += ' InovuaReactDataGrid__sort-icon--hidden';
  }

  return (
    <div className="InovuaReactDataGrid__sort-icon-wrapper" key="iconWrapper">
      <svg
        key="sortToolAsc"
        className={join(
          visibilityClassName,
          'InovuaReactDataGrid__sort-icon--asc',
          direction === 1 && 'InovuaReactDataGrid__sort-icon--active'
        )}
        width={size}
        height={size / 2}
        viewBox="0 0 10 5"
      >
        <path
          fillRule="evenodd"
          d="M4.767.276L8.395 4.04c.142.147.138.382-.01.524-.069.066-.16.104-.257.104H.872c-.205 0-.37-.166-.37-.37 0-.097.036-.189.103-.258L4.233.276c.142-.147.377-.151.524-.009l.01.01z"
        />
      </svg>
      <svg
        key="sortToolDesc"
        className={join(
          visibilityClassName,
          'InovuaReactDataGrid__sort-icon--desc',
          direction === -1 && 'InovuaReactDataGrid__sort-icon--active'
        )}
        width={size}
        height={size / 2}
        viewBox="0 0 10 5"
      >
        <path
          fillRule="evenodd"
          d="M4.233 4.724L.605.96C.463.814.467.579.615.437.684.371.775.333.872.333h7.256c.205 0 .37.166.37.37 0 .097-.036.189-.103.258L4.767 4.724c-.142.147-.377.151-.524.009l-.01-.01z"
        />
      </svg>
    </div>
  );
};
