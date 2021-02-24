/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import useFooterRows from './useFooterRows';
import Footer from './Footer';
export default {
    name: 'footer-rows',
    hook: useFooterRows,
    Footer,
    defaultProps: () => {
        return {};
    },
};
