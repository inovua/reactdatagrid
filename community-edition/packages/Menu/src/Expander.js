/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import join from '../../../common/join';

const Expander = ({
  className,
  rootClassName,
  size = 20,
  onClick,
  fill,
  rtl,
}) => {
  return (
    <div className={`${rootClassName}__expander-wrapper`}>
      <div className={`${rootClassName}__expander-icon`}>
        <svg
          className={join(className, `${rootClassName}__expander`)}
          onClick={onClick}
          fill={fill}
          height={size}
          width={size / 2}
          viewBox="0 0 5 10"
        >
          {rtl ? (
            <path
              fillRule="evenodd"
              d="M.262 4.738L4.368.632c.144-.144.379-.144.524 0C4.96.702 5 .796 5 .894v8.212c0 .204-.166.37-.37.37-.099 0-.193-.039-.262-.108L.262 5.262c-.145-.145-.145-.38 0-.524z"
            />
          ) : (
            <path
              fillRule="evenodd"
              d="M4.738 5.262L.632 9.368c-.144.144-.379.144-.524 0C.04 9.298 0 9.204 0 9.106V.894C0 .69.166.524.37.524c.099 0 .193.039.262.108l4.106 4.106c.145.145.145.38 0 .524z"
            />
          )}
        </svg>
      </div>
    </div>
  );
};

Expander.isExpander = true;

export default Expander;
