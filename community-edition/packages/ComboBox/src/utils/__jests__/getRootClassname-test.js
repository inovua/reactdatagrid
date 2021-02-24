/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getRootClassName from '../getRootClassName';

describe('getRootClassName', () => {
  it('adds correct classnames', () => {
    const props = {
      rootClassName: 'root',
      className: 'hello',
    };

    expect(getRootClassName({ props })).toContain('root hello');
  });
  it('adds rtl', () => {
    const props = {
      rtl: true,
      rootClassName: 'root',
    };

    expect(getRootClassName({ props })).toContain('root root--rtl');
  });
});
