/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import shallowequal from '../shallowequal';

describe('shallowequal', () => {
  it('returns true if it is the same object', () => {
    const a = {};
    expect(shallowequal(a, a)).toBe(true);
    expect(shallowequal(null, null)).toBe(true);
  });
  it('returns false if any of them a is null or not an object', () => {
    expect(shallowequal({}, null)).toBe(false);
    expect(shallowequal(null, {})).toBe(false);
  });
  it('returns true when the keys of the objects are the same', () => {
    const a = { a: 2, b: 3 };
    const b = { a: 2, b: 3 };
    expect(shallowequal(a, b)).toBe(true);
  });
  it('returns false if object have different key length', () => {
    const a = { a: 2, b: 3 };
    const b = { a: 2, b: 3, c: 3 };
    expect(shallowequal(a, b)).toBe(false);
  });
  it('returns false if object have one or more keys different', () => {
    const a = { a: 2, b: 3, c: 4 };
    const b = { a: 2, b: 3, c: 3 };
    const c = { a: 2, b: 1, c: 3 };

    expect(shallowequal(a, b)).toBe(false);
    expect(shallowequal(a, c)).toBe(false);
  });
});
