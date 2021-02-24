/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import hash from './hash';

export type LICENSE_TYPE = 'single_app' | 'multi_app' | 'trial';

export type BasicInfo = {
  AppName: 'multi_app' | 'trial' | string;
  LicenseType: LICENSE_TYPE;
  ExpiryDate: string;
  LicenseDeveloperCount: string | number;
  Company: string;
  Ref: string;
  Z?: string;
};
export type DecodeInfo = BasicInfo & {
  Corrupt: boolean;
};

export const decode = (licenseKey: string): DecodeInfo | void => {
  const fieldsMap: {
    [key: string]: {
      name: string;
      value: string;
    };
  } = {};
  const fields: [string, string][] = licenseKey
    .split(',')
    .map((str): [string, string] => {
      const [name, value] = str.split('=') as [string, string];
      fieldsMap[name] = { name, value };
      return [name, value];
    })
    .sort((a: [string, string], b: [string, string]) => {
      return a[0].localeCompare(b[0]);
    });

  const basicDecodeInfo: BasicInfo = fields.reduce(
    (acc: any, [key, value]: [string, string]) => {
      return {
        [key]: value,
        ...acc,
      };
    },
    {} as any
  );

  let seed = fieldsMap['ExpiryDate']
    ? +new Date(fieldsMap['ExpiryDate']!.value)
    : Date.now();

  let newZ = fields
    .map(([name, value]) => {
      if (name === 'Z') {
        return '';
      }

      const result = hash(value || '', seed);

      return result;
    })
    .filter(x => x)
    .join('');

  const Corrupt = newZ !== basicDecodeInfo.Z;

  let result = { ...basicDecodeInfo, Corrupt };

  return result;
};
