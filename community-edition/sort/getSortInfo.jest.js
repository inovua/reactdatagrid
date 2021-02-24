/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import getSortInfo from './getSortInfo';
describe('getSortInfo', () => {
    it('should return controlled when sortInfo is on props', () => {
        const props = {
            sortInfo: { dir: 1, name: 'name' },
        };
        const state = {};
        expect(getSortInfo(props, state)).toEqual({ dir: 1, name: 'name' });
    });
    it('should return uncontrolled when sortInfo is on state', () => {
        const props = {};
        const state = {
            sortInfo: { dir: -1, name: 'state' },
        };
        expect(getSortInfo(props, state)).toEqual({ dir: -1, name: 'state' });
    });
});
