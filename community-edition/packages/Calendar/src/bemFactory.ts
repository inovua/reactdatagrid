/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const bemFactory = (className: string) => {
  return (element: string, modifier: string) => {
    const el = element ? `-${element}` : '';
    const mod = modifier ? `--${modifier}` : '';

    return `${className}${el}${mod}`;
  };
};

export default bemFactory;
