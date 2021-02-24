/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import setComputedColumnWiths from './setComputedColumnWidths';
describe('setComputedColumnWiths', () => {
    it('should work okay when min and max widths are provided as defaults, and honoured', () => {
        expect(setComputedColumnWiths({
            id: 'a',
            width: 200,
        }, {
            columnMinWidth: 100,
            columnMaxWidth: 300,
            columnDefaultWidth: 150,
            columnSizes: {},
            columnFlexes: {},
        })).toEqual({
            id: 'a',
            width: 200,
            computedWidth: 200,
            computedFlex: null,
            computedMinWidth: 100,
            computedMaxWidth: 300,
        });
    });
    xit('should work when columns have defaultWidth', () => {
        expect(setComputedColumnWiths({
            id: 'a',
            defaultWidth: 200,
        }, {
            columnMinWidth: 100,
            columnMaxWidth: 300,
            columnDefaultWidth: 250,
            columnSizes: {},
            columnFlexes: {},
        })).toEqual({
            id: 'a',
            defaultWidth: 200,
            computedWidth: 200,
            computedFlex: null,
            computedMinWidth: 100,
            computedMaxWidth: 300,
        });
    });
    it('should work when columns have defaultWidth and no min and max widths ', () => {
        expect(setComputedColumnWiths({
            id: 'a',
            defaultWidth: 200,
        }, {
            columnDefaultWidth: 250,
            columnSizes: {},
            columnFlexes: {},
        })).toEqual({
            id: 'a',
            defaultWidth: 200,
            computedWidth: 200,
            computedFlex: null,
        });
    });
    it('should work okay when min and max widths are not provided', () => {
        expect(setComputedColumnWiths({
            id: 'a',
            width: 200,
        }, {
            columnDefaultWidth: 150,
            columnSizes: {},
            columnFlexes: {},
        })).toEqual({
            id: 'a',
            width: 200,
            computedWidth: 200,
            computedFlex: null,
            computedMinWidth: undefined,
            computedMaxWidth: undefined,
        });
    });
    it('should work fine', () => {
        expect(setComputedColumnWiths({
            id: 'a',
        }, {
            columnDefaultWidth: 150,
            columnSizes: {},
            columnFlexes: {},
        })).toEqual({
            id: 'a',
            computedWidth: 150,
            computedFlex: null,
            computedMinWidth: undefined,
            computedMaxWidth: undefined,
        });
    });
    it('should work fine 2', () => {
        expect(setComputedColumnWiths({
            id: 'a',
        }, {
            columnSizes: {},
            columnFlexes: {},
        })).toEqual({
            id: 'a',
            computedWidth: 150,
            computedFlex: null,
            computedMinWidth: undefined,
            computedMaxWidth: undefined,
        });
    });
    it('should work fine 3', () => {
        expect(setComputedColumnWiths({
            id: 'a',
        }, {
            columnSizes: {
                a: 200,
            },
            columnFlexes: {},
        })).toEqual({
            id: 'a',
            computedWidth: 200,
            computedFlex: null,
            computedMinWidth: undefined,
            computedMaxWidth: undefined,
        });
    });
    it('should work fine 4', () => {
        expect(setComputedColumnWiths({
            id: 'a',
        }, {
            columnSizes: {},
            columnFlexes: {},
            columnMinWidth: 300,
            columnMaxWidth: 500,
        })).toEqual({
            id: 'a',
            computedWidth: 300,
            computedFlex: null,
            computedMinWidth: 300,
            computedMaxWidth: 500,
        });
    });
    it('should work fine 5', () => {
        expect(setComputedColumnWiths({
            id: 'a',
        }, {
            columnSizes: {},
            columnFlexes: {},
            columnMinWidth: 500,
            columnMaxWidth: 300,
        })).toEqual({
            id: 'a',
            computedWidth: 300,
            computedFlex: null,
            computedMinWidth: 300,
            computedMaxWidth: 500,
        });
    });
    it('should work fine 6', () => {
        expect(setComputedColumnWiths({
            id: 'a',
        }, {
            columnSizes: {},
            columnFlexes: {},
            columnDefaultWidth: 600,
            columnMinWidth: 500,
            columnMaxWidth: 300,
        })).toEqual({
            id: 'a',
            computedWidth: 500,
            computedFlex: null,
            computedMinWidth: 300,
            computedMaxWidth: 500,
        });
    });
    it('should work fine 7', () => {
        expect(setComputedColumnWiths({
            id: 'a',
            minWidth: 200,
        }, {
            columnSizes: {},
            columnFlexes: {},
            columnMinWidth: 300,
            columnMaxWidth: 500,
        })).toEqual({
            id: 'a',
            minWidth: 200,
            computedWidth: 200,
            computedFlex: null,
            computedMinWidth: 200,
            computedMaxWidth: 500,
        });
    });
    it('should work fine 8', () => {
        expect(setComputedColumnWiths({
            id: 'a',
            minWidth: 200,
            maxWidth: 500,
            width: 600,
        }, {
            columnSizes: {},
            columnFlexes: {},
            columnMinWidth: 400,
            columnMaxWidth: 450,
        })).toEqual({
            id: 'a',
            minWidth: 200,
            maxWidth: 500,
            width: 600,
            computedWidth: 500,
            computedFlex: null,
            computedMinWidth: 200,
            computedMaxWidth: 500,
        });
    });
    it('should work fine 9', () => {
        expect(setComputedColumnWiths({
            id: 'a',
            minWidth: 200,
            maxWidth: 500,
        }, {
            columnDefaultWidth: 400,
            columnSizes: {},
            columnFlexes: {},
            columnMinWidth: 400,
            columnMaxWidth: 450,
        })).toEqual({
            id: 'a',
            minWidth: 200,
            maxWidth: 500,
            computedWidth: 400,
            computedFlex: null,
            computedMinWidth: 200,
            computedMaxWidth: 500,
        });
    });
    it('should work fine 10', () => {
        expect(setComputedColumnWiths({
            id: 'a',
            minWidth: 200,
            maxWidth: 500,
        }, {
            columnSizes: { a: 380 },
            columnFlexes: {},
            columnMinWidth: 400,
            columnMaxWidth: 450,
        })).toEqual({
            id: 'a',
            minWidth: 200,
            maxWidth: 500,
            computedWidth: 380,
            computedFlex: null,
            computedMinWidth: 200,
            computedMaxWidth: 500,
        });
    });
    it('should be fine', () => {
        expect(setComputedColumnWiths({
            id: 'a',
            flex: 2,
        }, {
            columnSizes: {},
            columnFlexes: { a: 10 },
            columnMinWidth: 500,
            columnMaxWidth: 300,
        })).toEqual({
            id: 'a',
            computedWidth: undefined,
            computedFlex: 2,
            flex: 2,
            computedMinWidth: 300,
            computedMaxWidth: 500,
        });
    });
    it('should be fine 1', () => {
        expect(setComputedColumnWiths({
            id: 'a',
            defaultFlex: 2,
        }, {
            columnSizes: {},
            columnFlexes: { a: 10 },
            columnMinWidth: 500,
            columnMaxWidth: 300,
        })).toEqual({
            id: 'a',
            computedWidth: undefined,
            computedFlex: 10,
            defaultFlex: 2,
            computedMinWidth: 300,
            computedMaxWidth: 500,
        });
    });
});
