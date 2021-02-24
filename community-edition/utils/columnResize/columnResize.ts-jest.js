/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import columnResize from './index';
describe('columnResize shareSpaceOnResize=true', () => {
    it('should make a col smaller when we have maxAvailableWidthForColumns', () => {
        const result = columnResize({
            columns: [
                { id: 'x', computedWidth: 100 },
                { id: 'name', computedWidth: 200, computedFlex: 2, keepFlex: true },
                { id: 'age', computedWidth: 100, computedFlex: 1 },
            ],
            totalComputedWidth: 400,
            maxAvailableWidthForColumns: 400,
            shareSpaceOnResize: true,
            diff: -100,
            index: 1,
        });
        expect(result).toEqual({
            newColumnFlexes: { name: 100, age: 200 },
            maxAvailableWidthForColumns: 400,
        });
    });
    it('should resize two sized neighbouring columns', () => {
        const result = columnResize({
            columns: [
                { id: 'name', computedWidth: 200 },
                { id: 'age', computedWidth: 100 },
            ],
            shareSpaceOnResize: true,
            diff: -100,
            index: 0,
        });
        expect(result).toEqual({
            newColumnSizes: { name: 100, age: 200 },
        });
    });
    it('should resize last flexed column', () => {
        const result = columnResize({
            columns: [
                { id: 'id', computedWidth: 200, type: 'number' },
                { id: 'city', computedWidth: 200 },
                { id: 'age', computedFlex: 1, computedWidth: 400, type: 'number' },
            ],
            shareSpaceOnResize: true,
            totalComputedWidth: 800,
            index: 2,
            diff: -100,
        });
        expect(result).toEqual({
            newColumnSizes: { age: 300 },
        });
    });
    it('should resize two sized neighbouring columns, but the one on the right is not resizable', () => {
        const result = columnResize({
            columns: [
                { id: 'name', computedWidth: 200 },
                { id: 'age', computedWidth: 100, computedResizable: false },
                { id: 'age2', computedWidth: 100 },
            ],
            shareSpaceOnResize: true,
            diff: -100,
            index: 0,
        });
        expect(result).toEqual({
            newColumnSizes: { name: 100 },
        });
    });
    it('should resize two sized neighbouring columns, but the one on the right is not resizable - case 2', () => {
        const result = columnResize({
            columns: [
                { id: 'name', computedWidth: 200 },
                { id: 'age', computedWidth: 100, computedResizable: false },
            ],
            shareSpaceOnResize: true,
            diff: -100,
            index: 0,
        });
        expect(result).toEqual({
            newColumnSizes: { name: 100 },
        });
    });
    it(`should resize two sized neighbouring columns, but the
  one on the right is not resizable - case 2, and there are other flex columns`, () => {
        const result = columnResize({
            columns: [
                { id: 'name', computedWidth: 200 },
                { id: 'age', computedWidth: 100, computedResizable: false },
                { id: 'age2', computedWidth: 100, computedFlex: 1 },
            ],
            totalComputedWidth: 400,
            shareSpaceOnResize: true,
            diff: -100,
            index: 0,
        });
        expect(result).toEqual({
            newColumnSizes: { name: 100 },
            newColumnFlexes: {
                age2: 100,
            },
            maxAvailableWidthForColumns: 300,
        });
    });
    it('should resize flex column, next column resizable: false, other next flexible', () => {
        const result = columnResize({
            columns: [
                { id: 'id', computedWidth: 100, type: 'number' },
                { id: 'city', computedFlex: 2, computedWidth: 400 },
                { id: 'country', computedWidth: 100, computedResizable: false },
                { id: 'age', computedFlex: 1, type: 'number', computedWidth: 200 },
            ],
            totalComputedWidth: 800,
            shareSpaceOnResize: true,
            diff: -100,
            index: 1,
        });
        expect(result).toEqual({
            newColumnSizes: { city: 300 },
            newColumnFlexes: { age: 200 },
            maxAvailableWidthForColumns: 700,
        });
    });
    it('should resize flex column, next column resizable, other next flexible', () => {
        const result = columnResize({
            columns: [
                { id: 'id', computedWidth: 100, type: 'number' },
                { id: 'city', computedFlex: 2, computedWidth: 400 },
                { id: 'country', computedWidth: 100 },
                { id: 'age', computedFlex: 1, type: 'number', computedWidth: 200 },
            ],
            totalComputedWidth: 800,
            shareSpaceOnResize: true,
            diff: -100,
            index: 1,
        });
        expect(result).toEqual({
            newColumnSizes: { country: 200 },
            newColumnFlexes: { city: 300, age: 200 },
        });
    });
    it('should resize flex column keepFlex, next column resizable: false, other next flexible', () => {
        const result = columnResize({
            columns: [
                { id: 'id', computedWidth: 100, type: 'number' },
                { id: 'city', computedFlex: 2, computedWidth: 400, keepFlex: true },
                { id: 'country', computedWidth: 100, computedResizable: false },
                { id: 'age', computedFlex: 1, type: 'number', computedWidth: 100 },
            ],
            totalComputedWidth: 800,
            shareSpaceOnResize: true,
            diff: -100,
            index: 1,
        });
        expect(result).toEqual({
            newColumnFlexes: { city: 300, age: 100 },
            maxAvailableWidthForColumns: 700,
        });
    });
});
describe('columnResize shareSpaceOnResize=false', () => {
    it('should resize two sized neighbouring columns', () => {
        const result = columnResize({
            columns: [
                { id: 'name', computedWidth: 200 },
                { id: 'age', computedWidth: 100 },
            ],
            shareSpaceOnResize: false,
            diff: -100,
            index: 0,
        });
        expect(result).toEqual({
            newColumnSizes: { name: 100 },
        });
    });
    it('should resize a col, when flexible, and is the only flex column and no keepFlex', () => {
        const result = columnResize({
            columns: [
                { id: 'name', computedWidth: 200, computedFlex: 1 },
                { id: 'age', computedWidth: 100 },
            ],
            shareSpaceOnResize: false,
            diff: -100,
            index: 0,
        });
        expect(result).toEqual({
            newColumnSizes: { name: 100 },
        });
    });
    it('should resize a col, when flexible, and is the only flex column, but it has keepFlex', () => {
        const result = columnResize({
            columns: [
                { id: 'name', computedWidth: 200, computedFlex: 1, keepFlex: true },
                { id: 'age', computedWidth: 100 },
            ],
            shareSpaceOnResize: false,
            totalComputedWidth: 300,
            diff: -100,
            index: 0,
        });
        expect(result).toEqual({
            maxAvailableWidthForColumns: 200,
        });
    });
    it('should resize a col, when flexible and no keepFlex and there are other flexible columns as well', () => {
        const result = columnResize({
            columns: [
                { id: 'name', computedWidth: 200, computedFlex: 1 },
                { id: 'age', computedWidth: 100, computedFlex: 1 },
            ],
            shareSpaceOnResize: false,
            totalComputedWidth: 300,
            diff: -10,
            index: 0,
        });
        expect(result).toEqual({
            newColumnSizes: { name: 190 },
            newColumnFlexes: { age: 100 },
            maxAvailableWidthForColumns: 290,
        });
    });
    it('should resize a col, when flexible and keepFlex=true and there are other flexible columns as well', () => {
        const result = columnResize({
            columns: [
                { id: 'name', computedWidth: 200, computedFlex: 1, keepFlex: true },
                { id: 'age', computedWidth: 100, computedFlex: 1 },
            ],
            totalComputedWidth: 300,
            shareSpaceOnResize: false,
            diff: -10,
            index: 0,
        });
        expect(result).toEqual({
            newColumnFlexes: { name: 190, age: 100 },
            maxAvailableWidthForColumns: 290,
        });
    });
    it('should make a col bigger', () => {
        const result = columnResize({
            columns: [
                { id: 'name', computedWidth: 200, computedFlex: 2, keepFlex: true },
                { id: 'age', computedWidth: 100, computedFlex: 1 },
            ],
            totalComputedWidth: 300,
            maxAvailableWidthForColumns: 300,
            shareSpaceOnResize: false,
            diff: 100,
            index: 0,
        });
        expect(result).toEqual({
            newColumnFlexes: { name: 300, age: 100 },
            maxAvailableWidthForColumns: 400,
        });
    });
});
describe('resize column group', () => {
    it('should work for most basic scenario - shareSpace: false', () => {
        const result = columnResize({
            columns: [
                { id: 'name', computedWidth: 200, computedFlex: 2, keepFlex: true },
                { id: 'age', computedWidth: 100, computedFlex: 1 },
                { id: 'city', computedWidth: 100, computedFlex: 1 },
            ],
            groupColumns: ['name', 'age'],
            totalComputedWidth: 400,
            shareSpaceOnResize: false,
            diff: 100,
            index: 1,
        });
        expect(result).toEqual({
            newColumnFlexes: {
                name: 267,
                age: 133,
                city: 100,
            },
            maxAvailableWidthForColumns: 500,
        });
    });
    it('should work for most basic scenario, with one resizable: false column - shareSpace: false', () => {
        const result = columnResize({
            columns: [
                { id: 'name', computedWidth: 200 },
                { id: 'age', computedWidth: 100, computedResizable: false },
            ],
            groupColumns: ['name', 'age'],
            totalComputedWidth: 300,
            shareSpaceOnResize: false,
            diff: 100,
            index: 1,
        });
        expect(result).toEqual({
            newColumnSizes: {
                name: 300,
            },
        });
    });
    it('should work for most basic scenario - shareSpace: true', () => {
        const result = columnResize({
            columns: [
                { id: 'name', computedWidth: 200, computedFlex: 2, keepFlex: true },
                { id: 'age', computedWidth: 100, computedFlex: 1 },
                { id: 'city', computedWidth: 100, computedFlex: 1 },
            ],
            groupColumns: ['name', 'age'],
            totalComputedWidth: 400,
            shareSpaceOnResize: true,
            diff: 50,
            index: 1,
        });
        expect(result).toEqual({
            newColumnFlexes: {
                name: 233,
                age: 117,
                city: 50,
            },
        });
    });
    it('should work for most basic scenario - shareSpace: true but next col unresizable', () => {
        const result = columnResize({
            columns: [
                { id: 'name', computedWidth: 200, computedFlex: 2, keepFlex: true },
                { id: 'age', computedWidth: 100, computedFlex: 1 },
                {
                    id: 'city',
                    computedWidth: 100,
                    computedFlex: 1,
                    computedResizable: false,
                },
            ],
            groupColumns: ['name', 'age'],
            totalComputedWidth: 400,
            shareSpaceOnResize: true,
            diff: 50,
            index: 1,
        });
        expect(result).toEqual({
            maxAvailableWidthForColumns: 450,
            newColumnFlexes: {
                name: 233,
                age: 117,
                city: 100,
            },
        });
    });
    it('should work for flex + maxWidth scenario', () => {
        const result = columnResize({
            columns: [
                { id: 'name', computedWidth: 200, computedFlex: 2, keepFlex: true },
                {
                    id: 'age',
                    computedWidth: 100,
                    computedMaxWidth: 110,
                    computedFlex: 1,
                },
                { id: 'city', computedWidth: 100, computedFlex: 1 },
            ],
            groupColumns: ['name', 'age'],
            totalComputedWidth: 400,
            shareSpaceOnResize: false,
            diff: 90,
            index: 1,
        });
        expect(result).toEqual({
            maxAvailableWidthForColumns: 490,
            newColumnFlexes: {
                name: 280,
                age: 110,
                city: 100,
            },
        });
    });
    it('should work for fixed width + maxWidth scenario', () => {
        const result = columnResize({
            columns: [
                { id: 'name', computedWidth: 200 },
                { id: 'age', computedWidth: 100, computedMaxWidth: 110 },
                { id: 'city', computedWidth: 100 },
            ],
            groupColumns: ['name', 'age'],
            totalComputedWidth: 400,
            shareSpaceOnResize: false,
            diff: 90,
            index: 1,
        });
        expect(result).toEqual({
            newColumnSizes: {
                name: 280,
                age: 110,
            },
        });
    });
});
