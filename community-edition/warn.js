/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export const warn = (msg) => {
    console.warn(`**************************************** INOVUA REACTDATAGRID COMMUNITY EDITION WARNING ****************************************

                             ${msg}

*********************************************************************************************************************************
    `);
};
const onceMessages = {};
export const warnOnce = (msg) => {
    if (onceMessages[msg]) {
        return;
    }
    onceMessages[msg] = true;
    console.warn(`**************************************** INOVUA REACTDATAGRID COMMUNITY EDITION WARNING ****************************************

                             ${msg}

*********************************************************************************************************************************
    `);
};
export const communityFeatureWarn = (featureName, checkObj) => {
    if (checkObj[featureName]) {
        return;
    }
    checkObj[featureName] = true;
    warn(`${featureName} is only supported in ENTERPRISE Edition, but you're using the Community Edition!`);
};
