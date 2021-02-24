/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { assign } from '../assign';

describe('assign', () => {
  it('extends first object by mutating it and returning a reference to it', () => {
    const a = { a: 2, b: 3 };
    const b = { a: 3, c: 4 };

    const test = assign(a, b);
    const expected = { a: 3, b: 3, c: 4 };
    expect(a).toEqual(test);
    expect(test).toEqual(expected);
  });
  it('throws an error when first argument is null or undefined', () => {
    expect(() => assign(null, {})).toThrow(TypeError);
    expect(() => assign(undefined, {})).toThrow(TypeError);
  });
  it('extends multiple objects, of which can be null/undefined', () => {
    const target = { a: 2 };
    const input = [target, null, undefined, { b: 3, c: null }];
    const expected = { a: 2, b: 3, c: null };
    const test = assign(...input);
    expect(test).toEqual(expected);
    expect(target).toEqual(target);
  });
});
