/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import RowHeightManager from '../RowHeightManager';

const getManager = (rowHeight, map) => {
  const manager = new RowHeightManager(rowHeight, map);
  manager.setCache(null);
  return manager;
};
test('RowHeightManager with no other different heights', () => {
  const manager = getManager(10);
  expect(manager.getRowAt(0)).toEqual(0);
  expect(manager.getRowAt(-20)).toEqual(0);
  expect(manager.getRowAt(3)).toEqual(0);
  expect(manager.getRowAt(12)).toEqual(1);
  expect(manager.getRowAt(10)).toEqual(1);
  expect(manager.getRowAt(10000)).toEqual(1000);
});

test('getTotalSize(count) - RowManager get total size should correctly return the size for the given count', () => {
  const manager = getManager(10, {
    3: 50,
    5: 20,
    7: 20,
    8: 30,
  });

  expect(manager.getTotalSize(10)).toEqual(10 * 10 + 40 + 10 + 10 + 20);
  expect(manager.getTotalSize(4)).toEqual(10 + 10 + 10 + 50);
});

test('getMinHeight', () => {
  const manager = getManager(40, {
    3: 50,
    5: 15,
    7: 20,
    8: 30,
  });

  expect(manager.getMinHeight()).toEqual(15);
});

test('getMaxHeight', () => {
  const manager = getManager(40, {
    3: 50,
    5: 15,
    7: 20,
    8: 30,
  });

  expect(manager.getMaxHeight()).toEqual(50);
});

test('getMaxHeight 2', () => {
  const manager = getManager(40, {
    3: 10,
  });

  expect(manager.getMaxHeight()).toEqual(40);
});

test('getMinHeight 2', () => {
  const manager = getManager(40, {
    3: 50,
  });

  expect(manager.getMinHeight()).toEqual(40);
});

test('getRowAt - RowManager with rowHeight 10 and a few extra rows', () => {
  const manager = getManager(10, {
    3: 50,
    5: 20,
    7: 20,
    8: 30,
  });

  expect(manager.getRowAt(1)).toEqual(0);
  expect(manager.getRowAt(10)).toEqual(1);
  expect(manager.getRowAt(35)).toEqual(3);
  expect(manager.getRowAt(40)).toEqual(3);
  expect(manager.getRowAt(45)).toEqual(3);
  expect(manager.getRowAt(79)).toEqual(3);
  expect(manager.getRowAt(80)).toEqual(4);
  expect(manager.getRowAt(90)).toEqual(5);
  expect(manager.getRowAt(99)).toEqual(5);
  expect(manager.getRowAt(109)).toEqual(5);
  expect(manager.getRowAt(110)).toEqual(6);
  expect(manager.getRowAt(122)).toEqual(7);
  expect(manager.getRowAt(132)).toEqual(7);
  expect(manager.getRowAt(139)).toEqual(7);
  expect(manager.getRowAt(140)).toEqual(8);
  expect(manager.getRowAt(169)).toEqual(8);
  expect(manager.getRowAt(170)).toEqual(9);
  expect(manager.getRowAt(180)).toEqual(10);
});

test('getRowOffset - RowManager with rowHeight 10 and a few extra rows', () => {
  const manager = getManager(10, {
    3: 50,
    5: 20,
    7: 20,
    8: 30,
  });

  expect(manager.getRowOffset(0)).toEqual(0);
  expect(manager.getRowOffset(1)).toEqual(10);
  expect(manager.getRowOffset(2)).toEqual(20);
  expect(manager.getRowOffset(3)).toEqual(30);
  expect(manager.getRowOffset(4)).toEqual(80);
  expect(manager.getRowOffset(5)).toEqual(90);
  expect(manager.getRowOffset(6)).toEqual(110);
  expect(manager.getRowOffset(7)).toEqual(120);
  expect(manager.getRowOffset(8)).toEqual(140);
  expect(manager.getRowOffset(9)).toEqual(170);
});

test('RowHeightManager setRowHeight', () => {
  const manager = getManager(10, {
    3: 50,
    5: 20,
    7: 20,
    8: 30,
  });

  expect(manager.getRowAt(1)).toEqual(0);
  expect(manager.getRowAt(10)).toEqual(1);
  expect(manager.getRowAt(35)).toEqual(3);
  expect(manager.getRowAt(40)).toEqual(3);
  expect(manager.getRowAt(45)).toEqual(3);
  expect(manager.getRowAt(79)).toEqual(3);
  expect(manager.getRowAt(80)).toEqual(4);
  expect(manager.getRowAt(90)).toEqual(5);
  expect(manager.getRowAt(99)).toEqual(5);
  expect(manager.getRowAt(109)).toEqual(5);
  expect(manager.getRowAt(110)).toEqual(6);
  expect(manager.getRowAt(122)).toEqual(7);
  expect(manager.getRowAt(132)).toEqual(7);
  expect(manager.getRowAt(139)).toEqual(7);
  expect(manager.getRowAt(140)).toEqual(8);
  expect(manager.getRowAt(169)).toEqual(8);
  expect(manager.getRowAt(170)).toEqual(9);
  expect(manager.getRowAt(180)).toEqual(10);

  manager.setRowHeight({
    index: 6,
    height: 30,
  });

  expect(manager.getRowAt(110)).toEqual(6);
  expect(manager.getRowAt(139)).toEqual(6);
  expect(manager.getRowAt(140)).toEqual(7);
  expect(manager.getRowAt(160)).toEqual(8);
  expect(manager.getRowAt(189)).toEqual(8);
  expect(manager.getRowAt(190)).toEqual(9);
  expect(manager.getRowAt(200)).toEqual(10);
});
