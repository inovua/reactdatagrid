/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useMemo } from 'react';
import { decode } from './decode';
import packageJSON from '../../package.json';
const err = (msg) => {
    console.error(`*********************************************** INOVUA REACTDATAGRID ENTERPRISE EDITION ***********************************************

***************************** This is the Enterprise Edition of ReactDataGrid - all enterprise features are unlocked. ******************************\n
************* You can only use this package to EVALUATE ReactDataGrid - it is not licensed for a development or production environment *************\n
******************* If you want to purchase the Enterprise Edition or hide the license notice, email us contact@reactdatagrid.io *******************\n
\n
${msg}
\n\n
*****************************************************************************************************************************************
    `);
};
export default (props) => {
    const LICENSE_KEY = props.licenseKey ||
        (typeof window !== undefined
            ? window.REACTDATAGRID_LICENSE_KEY
            : '');
    const computedLicenseValid = useMemo(() => {
        if (!LICENSE_KEY) {
            err(`No license key found in "licenseKey" prop`);
            return false;
        }
        const licenseInfo = decode(LICENSE_KEY);
        if (!licenseInfo || licenseInfo.Corrupt) {
            err(`Corrupt license key found in "licenseKey" prop.`);
            return false;
        }
        const currentVersionDate = new Date(packageJSON.versionTimestamp);
        const licenseExpiryDate = new Date(licenseInfo.ExpiryDate);
        if (licenseExpiryDate < currentVersionDate) {
            err(`Your license key expired on ${licenseInfo.ExpiryDate} but you're trying to use a version published on ${currentVersionDate}`);
            return false;
        }
        return true;
    }, [LICENSE_KEY]);
    return {
        computedLicenseValid,
    };
};
