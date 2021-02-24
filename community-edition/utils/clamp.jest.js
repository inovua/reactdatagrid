/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import clamp from './clamp';
describe('clamp', () => {
    it('should work when in limits', () => {
        expect(clamp(5, 1, 7)).toEqual(5);
    });
    it('should work when < min', () => {
        expect(clamp(-1, 1, 7)).toEqual(1);
    });
    it('should work when > max', () => {
        expect(clamp(100, 1, 7)).toEqual(7);
    });
    it('should work when no max', () => {
        expect(clamp(100, 1, undefined)).toEqual(100);
        expect(clamp(0, 1, undefined)).toEqual(1);
    });
});
