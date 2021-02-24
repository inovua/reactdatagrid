/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getDropIndex from './getDropIndex';

describe('getDropIndex', () => {
  describe('from header to header', () => {
    it('should return 0 when there are 3 columns and the second is dragged before the first', () => {
      const res = getDropIndex({
        dropTarget: 'header',
        dragTarget: 'header',
        dir: -1,
        ranges: [
          { left: 0, right: 100, index: 0 },
          { left: 100, right: 200, index: 1 },
          { left: 200, right: 300, index: 2 },
        ],
        dragRange: { left: 30, right: 130, index: 1 },
      }).index;

      expect(res).toEqual(0);
    });

    it('should return correct when there are locked columns', () => {
      const res = getDropIndex({
        dropTarget: 'header',
        dragTarget: 'header',
        dir: -1,
        ranges: [
          { left: 0, right: 100, index: 0 },
          { left: 100, right: 200, index: 1 },
          { left: 200, right: 300, index: 2 },
        ],
        dragRange: { left: 30, right: 130, index: 1 },
      }).index;

      expect(res).toEqual(0);
    });

    it('should return 1 when there are 4 items and the last one is dragged over the first one', () => {
      const res = getDropIndex({
        dropTarget: 'header',
        dragTarget: 'header',
        dir: -1,
        ranges: [
          { left: 0, right: 100, index: 0 },
          { left: 100, right: 200, index: 1 },
          { left: 200, right: 300, index: 2 },
          { left: 300, right: 400, index: 3 },
        ],
        dragRange: { left: 120, right: 220, index: 3 },
      }).index;

      expect(res).toEqual(1);
    });

    it('should return 2 when there are 2 items and dragging the first one to the right', () => {
      const res = getDropIndex({
        dropTarget: 'header',
        dragTarget: 'header',
        dir: 1,
        ranges: [
          { left: 11, right: 1452, index: 0 },
          { left: 1452, right: 1582, index: 1 },
        ],
        dragRange: { left: 110, right: 1551, index: 0 },
      }).index;

      expect(res).toEqual(2);
    });

    it('should return 1 when there are 3 columns and the second is dragged just a bit to the left', () => {
      const res = getDropIndex({
        dropTarget: 'header',
        dragTarget: 'header',
        dir: -1,
        ranges: [
          { left: 0, right: 100, index: 0 },
          { left: 100, right: 200, index: 1 },
          { left: 200, right: 300, index: 2 },
        ],
        dragRange: { left: 90, right: 190, index: 1 },
      }).index;

      expect(res).toEqual(1);
    });
  });
  describe('from header to group', () => {
    it('should return 2 when there are 2 groupBy and a column is dragged at the end', () => {
      const res = getDropIndex({
        dropTarget: 'group',
        dragTarget: 'header',
        dir: -1,
        ranges: [
          { left: 0, right: 100, index: 0 },
          { left: 105, right: 205, index: 1 },
        ],
        dragRange: { left: 320, right: 420, index: 6 },
      }).index;

      expect(res).toEqual(2);
    });

    it('should return 1 when there are no groupBy and column is dragged', () => {
      const res = getDropIndex({
        dragTarget: 'header',
        dropTarget: 'group',
        dir: -1,
        ranges: [],
        dragRange: { left: 600, right: 700, index: 3 },
      }).index;

      expect(res).toEqual(0);
    });

    it('should return 1 when there are 3 groupBy and a column is dragged in between the last 2', () => {
      const res = getDropIndex({
        dropTarget: 'group',
        dragTarget: 'header',
        dir: -1,
        ranges: [
          { left: 16, right: 91, index: 0 },
          { left: 96, right: 171, index: 1 },
          { left: 176, right: 252, index: 2 },
        ],
        dragRange: { left: 186, right: 636, index: 4 },
      }).index;

      expect(res).toEqual(2);
    });
  });

  describe('from group to header', () => {
    it('should be able to drag the only box from header to the many boxes in header, at position 1', () => {
      const res = getDropIndex({
        dragTarget: 'group',
        dropTarget: 'header',
        dir: 1,
        ranges: [
          { left: 0, right: 100, index: 0 },
          { left: 100, right: 200, index: 1 },
          { left: 200, right: 300, index: 2 },
          { left: 300, right: 400, index: 3 },
        ],
        dragRange: { left: 60, right: 160, index: 0 },
      }).index;

      expect(res).toEqual(1);
    });
  });

  describe('from group to group', () => {
    it('should return 2 when there are 2 items, and dragging the first one over the second one', () => {
      const res = getDropIndex({
        dropTarget: 'group',
        dragTarget: 'group',
        dir: 1,
        ranges: [
          { left: 0, right: 100, index: 0 },
          { left: 100, right: 200, index: 1 },
        ],
        dragRange: { left: 80, right: 180, index: 0 },
      }).index;

      expect(res).toEqual(2);
    });

    it('should return 3 when there are 3 items, and dragging the first one past the last one', () => {
      const res = getDropIndex({
        dropTarget: 'group',
        dragTarget: 'group',
        dir: 1,
        ranges: [
          { left: 0, right: 100, index: 0 },
          { left: 100, right: 200, index: 1 },
          { left: 200, right: 300, index: 2 },
        ],
        dragRange: { left: 580, right: 680, index: 0 },
      }).index;

      expect(res).toEqual(3);
    });

    it('should return 2 when there are 3 items, and dragging the first over the second one', () => {
      const res = getDropIndex({
        dropTarget: 'group',
        dragTarget: 'group',
        dir: 1,
        ranges: [
          { left: 0, right: 100, index: 0 },
          { left: 100, right: 200, index: 1 },
          { left: 200, right: 300, index: 2 },
        ],
        dragRange: { left: 60, right: 160, index: 0 },
      }).index;

      expect(res).toEqual(2);
    });

    it('should return 0 when there are 3 items, and dragging the first over the first half of the first one', () => {
      const res = getDropIndex({
        dropTarget: 'group',
        dragTarget: 'group',
        dir: 1,
        ranges: [
          { left: 0, right: 100, index: 0 },
          { left: 100, right: 200, index: 1 },
          { left: 200, right: 300, index: 2 },
        ],
        dragRange: { left: 49, right: 140, index: 0 },
      }).index;

      expect(res).toEqual(0);
    });

    it('should return 0 when there are 3 items, and dragging the first over the first half of the first one - more complex scenario', () => {
      const ranges = [
        { left: 16, right: 91, index: 0 },
        { left: 96, right: 171, index: 1 },
        { left: 176, right: 252, index: 2 },
      ];

      const res = getDropIndex({
        ranges,
        dir: 1,
        dragTarget: 'group',
        dropTarget: 'group',
        dragRange: { left: 58, right: 133, index: 0 },
      }).index;

      expect(res).toEqual(0);
    });

    it('should return 0 when dragging the first item over itself', () => {
      const res = getDropIndex({
        dropTarget: 'group',
        dragTarget: 'group',
        dir: 1,
        ranges: [
          { left: 0, right: 100, index: 0 },
          { left: 100, right: 200, index: 1 },
        ],
        dragRange: { left: 8, right: 108, index: 0 },
      }).index;

      expect(res).toEqual(0);
    });

    it('should return 2 when there are 3 items and dragging the last to the right', () => {
      const res = getDropIndex({
        dropTarget: 'group',
        dragTarget: 'group',
        dir: 1,
        ranges: [
          { left: 0, right: 100, index: 0 },
          { left: 100, right: 200, index: 1 },
          { left: 200, right: 300, index: 2 },
        ],
        dragRange: { left: 350, right: 450, index: 2 },
      }).index;

      expect(res).toEqual(2);
    });

    it('should return 3 when there are 3 items and dragging the middle one to the right', () => {
      const res = getDropIndex({
        dropTarget: 'group',
        dragTarget: 'group',
        dir: 1,
        ranges: [
          { left: 0, right: 100, index: 0 },
          { left: 100, right: 200, index: 1 },
          { left: 200, right: 300, index: 2 },
        ],
        dragRange: { left: 350, right: 450, index: 1 },
      }).index;

      expect(res).toEqual(3);
    });

    it('should return 0 when there are 3 items and dragging the first to the left', () => {
      const res = getDropIndex({
        dropTarget: 'group',
        dragTarget: 'group',
        dir: -1,
        ranges: [
          { left: 0, right: 100, index: 0 },
          { left: 100, right: 200, index: 1 },
          { left: 200, right: 300, index: 2 },
        ],
        dragRange: { left: -100, right: 0, index: 0 },
      }).index;

      expect(res).toEqual(0);
    });
  });

  describe('from header to header, with validPositions', () => {
    it(`should return 2 when there are 3 items and dragging the
      first one to the right, with only 1 & 2 being valid positions`, () => {
      const res = getDropIndex({
        dropTarget: 'header',
        dragTarget: 'header',
        dir: 1,
        ranges: [
          { left: 0, right: 100, index: 0 },
          { left: 100, right: 200, index: 1 },
          { left: 200, right: 300, index: 2 },
        ],
        dragRange: { left: 300, right: 400, index: 0 },
        validDropPositions: { 0: true, 1: true, 2: true },
      }).index;

      expect(res).toEqual(2);
    });

    it(`should return 1 when there are 4 items and dragging the
      second one to the right, with only 1 being valid position`, () => {
      const res = getDropIndex({
        dropTarget: 'header',
        dragTarget: 'header',
        dir: 1,
        ranges: [
          { left: 0, right: 100, index: 0 },
          { left: 100, right: 200, index: 1 },
          { left: 200, right: 300, index: 2 },
          { left: 300, right: 400, index: 3 },
        ],
        dragRange: { left: 400, right: 500, index: 1 },
        validDropPositions: { 1: true },
      }).index;

      expect(res).toEqual(1);
    });

    it('should return 3 when there are 5 columns, validPositions: 0, 1, 3, 4 and dragging the first one just before the first half of the third one', () => {
      const res = getDropIndex({
        dropTarget: 'header',
        dragTarget: 'header',
        dir: 1,
        ranges: [
          { left: 0, right: 100, index: 0 },
          { left: 100, right: 200, index: 1 },
          { left: 200, right: 300, index: 2 },
          { left: 300, right: 400, index: 3 },
          { left: 400, right: 500, index: 4 },
        ],
        dragRange: { left: 240, right: 340, index: 0 },
        validDropPositions: { 0: true, 1: true, 3: true, 4: true },
      }).index;

      expect(res).toEqual(3);
    });

    it('should return 2 when there are 5 columns, validPositions: 0, 2, 4 and dragging the first one just before the first half of the third one', () => {
      const res = getDropIndex({
        dropTarget: 'header',
        dragTarget: 'header',
        dir: 1,
        ranges: [
          { left: 0, right: 100, index: 0 },
          { left: 100, right: 200, index: 1 },
          { left: 200, right: 300, index: 2 },
          { left: 300, right: 400, index: 3 },
          { left: 400, right: 500, index: 4 },
        ],
        dragRange: { left: 240, right: 340, index: 0 },
        validDropPositions: { 0: true, 2: true, 4: true },
      }).index;

      expect(res).toEqual(2);
    });

    it('should return 4 when there are 5 columns, validPositions: 0, 1, 3, 4 and dragging the first one after the first half of the third one', () => {
      const res = getDropIndex({
        dropTarget: 'header',
        dragTarget: 'header',
        dir: 1,
        ranges: [
          { left: 0, right: 100, index: 0 },
          { left: 100, right: 200, index: 1 },
          { left: 200, right: 300, index: 2 },
          { left: 300, right: 400, index: 3 },
          { left: 400, right: 500, index: 4 },
        ],
        dragRange: { left: 360, right: 460, index: 0 },
        validDropPositions: { 0: true, 1: true, 3: true, 4: true },
      }).index;

      expect(res).toEqual(4);
    });
  });
});
