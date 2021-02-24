/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import '../../community-edition/style/base.scss';
import '../../community-edition/style/theme/default-light/index.scss';
import '../../community-edition/style/theme/default-dark/index.scss';

export default function MyApp({ Component, pageProps }) {
  if (!(process as any).browser) {
    return null;
  }

  return (
    <>
      <React.StrictMode>
        <Component {...pageProps} />
      </React.StrictMode>

      <style global jsx>
        {`
          body {
            background: #2e3439;
            color: #fafafa;
            margin: 20px;
            height: calc(100% - 40px);
            width: calc(100% - 40px);
          }

          #__next {
            height: 100%;
          }
          html {
            height: 100vh;
          }
        `}
      </style>
    </>
  );
}
