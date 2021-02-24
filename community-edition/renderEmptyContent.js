/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

const STYLE = { display: 'inline-block' };

export default (content, name = 'empty', style) => {
  if (typeof content === 'function') {
    content = content();
  }

  if (content == null || content == false || content == '') {
    return null;
  }

  if (typeof content === 'string') {
    content = (
      <div className={`InovuaReactDataGrid__${name}-text`} style={STYLE}>
        {content}
      </div>
    );
  }

  return (
    <div
      key="emptyContentWrapper"
      className={`InovuaReactDataGrid__${name}-wrapper`}
      style={style}
    >
      {content}
    </div>
  );
};
