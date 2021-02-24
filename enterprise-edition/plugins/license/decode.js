/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
import hash from './hash';
export const decode = (licenseKey) => {
    const fieldsMap = {};
    const fields = licenseKey
        .split(',')
        .map((str) => {
        const [name, value] = str.split('=');
        fieldsMap[name] = { name, value };
        return [name, value];
    })
        .sort((a, b) => {
        return a[0].localeCompare(b[0]);
    });
    const basicDecodeInfo = fields.reduce((acc, [key, value]) => {
        return {
            [key]: value,
            ...acc,
        };
    }, {});
    let seed = fieldsMap['ExpiryDate']
        ? +new Date(fieldsMap['ExpiryDate'].value)
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
