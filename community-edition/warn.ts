/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const warn = (msg: string): void => {
  console.warn(
    `**************************************** INOVUA REACTDATAGRID COMMUNITY EDITION WARNING ****************************************

                             ${msg}

*********************************************************************************************************************************
    `
  );
};

const onceMessages: { [key: string]: boolean } = {};

export const warnOnce = (msg: string): void => {
  if (onceMessages[msg]) {
    return;
  }

  onceMessages[msg] = true;
  console.warn(
    `**************************************** INOVUA REACTDATAGRID COMMUNITY EDITION WARNING ****************************************

                             ${msg}

*********************************************************************************************************************************
    `
  );
};

export const communityFeatureWarn = (featureName: string, checkObj: any) => {
  if (checkObj[featureName]) {
    return;
  }

  checkObj[featureName] = true;
  warn(
    `${featureName} is only supported in ENTERPRISE Edition, but you're using the Community Edition!`
  );
};
