/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import useLicense from './useLicense';
import LicenseNotice from './LicenseNotice';
export default {
    name: 'license',
    hook: useLicense,
    defaultProps: () => {
        return {};
    },
    renderLicenseNotice: () => {
        return React.createElement(LicenseNotice, null);
    },
};
