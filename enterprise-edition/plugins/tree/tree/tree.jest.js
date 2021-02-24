/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  expandAtIndex,
  expandAtIndexes,
  expandByIds,
  expandByIdsWithInfo,
  collapseAtIndexes,
  collapseAtIndex,
  sortTreeData,
} from './index';

xdescribe('expandAtIndexes', () => {
  it('index', () => {
    const dataSource = expandAtIndexes(
      [
        { id: 2, nodes: [{ id: 3 }, { id: 4 }] },
        { id: 5, nodes: [{ id: 6, nodes: [{ id: 8 }] }] },
        { id: 7 },
      ],
      [0, 1],
      { generateIdFromPath: true }
    );

    const level1DataSource = [
      { id: 2, nodes: [{ id: 3 }, { id: 4 }] },
      {
        id: '2/3',
        __nodeProps: { childIndex: 0, parentNodeId: 2, path: '2/3', depth: 1 },
      },
      {
        id: '2/4',
        __nodeProps: { childIndex: 1, parentNodeId: 2, path: '2/4', depth: 1 },
      },
      { id: 5, nodes: [{ id: 6, nodes: [{ id: 8 }] }] },
      {
        id: '5/6',
        nodes: [{ id: 8 }],
        __nodeProps: { childIndex: 0, parentNodeId: 5, path: '5/6', depth: 1 },
      },
      { id: 7 },
    ];

    expect(dataSource).toEqual(level1DataSource);

    const level2DataSource = expandAtIndexes(level1DataSource, [4], {
      generateIdFromPath: true,
    });

    expect(level2DataSource).toEqual([
      { id: 2, nodes: [{ id: 3 }, { id: 4 }] },
      {
        id: '2/3',
        __nodeProps: { childIndex: 0, parentNodeId: 2, path: '2/3', depth: 1 },
      },
      {
        id: '2/4',
        __nodeProps: { childIndex: 1, parentNodeId: 2, path: '2/4', depth: 1 },
      },
      { id: 5, nodes: [{ id: 6, nodes: [{ id: 8 }] }] },
      {
        id: '5/6',
        nodes: [{ id: 8 }],
        __nodeProps: { childIndex: 0, parentNodeId: 5, path: '5/6', depth: 1 },
      },
      {
        id: '5/6/8',
        __nodeProps: {
          childIndex: 0,
          parentNodeId: '5/6',
          path: '5/6/8',
          depth: 2,
        },
      },
      { id: 7 },
    ]);
  });
});

xdescribe('collapseAtIndexes', () => {
  it('index', () => {
    const dataSource = [
      { id: 2, nodes: [{ id: 3 }, { id: 4 }] },
      { id: 3, __nodeProps: { parentNodeId: 2, path: '2/3' } },
      { id: 4, __nodeProps: { parentNodeId: 2, path: '2/4' } },
      { id: 5, nodes: [{ id: 6 }] },
      { id: 6, __nodeProps: { parentNodeId: 5, path: '5/6' } },
      { id: 7 },
    ];
    const newDataSource = collapseAtIndexes(dataSource, [0, 3], {
      generateIdFromPath: false,
    });

    expect(newDataSource).toEqual([
      { id: 2, nodes: [{ id: 3 }, { id: 4 }] },
      { id: 5, nodes: [{ id: 6 }] },
      { id: 7 },
    ]);
  });
});

xdescribe('expandByIds', () => {
  it('index', () => {
    // 1
    // 2
    // 3 - x
    //    4
    //    5 - x
    //      6 - x
    //        7
    //      8
    //    9 - x
    //      10
    // 11 - x
    //    12

    const six = { id: 6, nodes: [{ id: 7 }] };
    const nine = { id: 9, nodes: [{ id: 10 }] };
    const five = { id: 5, nodes: [six, { id: 8 }] };
    const three = {
      id: 3,
      nodes: [{ id: 4 }, five, nine],
    };
    const dataSource = [
      { id: 1 },
      { id: 2 },
      three,
      { id: 11, nodes: [{ id: 12 }] },
    ];

    const { data: expandedSource, idToIndexMap } = expandByIdsWithInfo(
      dataSource,
      {
        11: true,
        3: true,
        5: true,
        9: true,
        6: true,
      },
      { idToIndexMap: { 1: 0, 2: 1, 3: 2, 11: 3 }, nodeProps: () => undefined }
    );

    expect(expandedSource).toEqual([
      { id: 1 },
      { id: 2 },
      three,
      { id: 4, __nodeProps: undefined },
      { ...five, __nodeProps: undefined },
      { ...six, __nodeProps: undefined },
      { id: 7, __nodeProps: undefined },
      { id: 8, __nodeProps: undefined },
      { ...nine, __nodeProps: undefined },
      { id: 10, __nodeProps: undefined },
      { id: 11, nodes: [{ id: 12 }], __nodeProps: undefined },
      { id: 12, __nodeProps: undefined },
    ]);

    expect(idToIndexMap).toEqual({
      1: 0,
      2: 1,
      3: 2,
      4: 3,
      5: 4,
      6: 5,
      7: 6,
      8: 7,
      9: 8,
      10: 9,
      11: 10,
      12: 11,
    });
  });
});
xdescribe('expandAtIndex', () => {
  it('index', () => {
    const dataSource = expandAtIndex(
      [{ id: 2 }, { id: 3, nodes: [{ id: 4 }] }, { id: 5 }],
      1,
      { generateIdFromPath: true }
    );

    expect(dataSource).toEqual([
      {
        id: 2,
      },
      { id: 3, nodes: [{ id: 4 }] },
      {
        id: '3/4',
        __nodeProps: { childIndex: 0, depth: 1, parentNodeId: 3, path: '3/4' },
      },
      { id: 5 },
    ]);
  });

  it('index without generateIdFromPath', () => {
    const dataSource = expandAtIndex(
      [{ id: 2 }, { id: 3, nodes: [{ id: 4 }] }, { id: 5 }],
      1,
      { generateIdFromPath: false }
    );

    expect(dataSource).toEqual([
      {
        id: 2,
      },
      { id: 3, nodes: [{ id: 4 }] },
      {
        id: 4,
        __nodeProps: { childIndex: 0, parentNodeId: 3, path: '3/4', depth: 1 },
      },
      { id: 5 },
    ]);
  });
  it('expandAtIndex with non-existent index', () => {
    const dataSource = [{ id: 2 }, { id: 3, nodes: [{ id: 4 }] }, { id: 5 }];

    expect(expandAtIndex(dataSource, 100)).toBe(dataSource);
  });

  it('expandAtIndex with existent index with no nodes', () => {
    const dataSource = [{ id: 2 }, { id: 3, nodes: [{ id: 4 }] }, { id: 5 }];

    expect(expandAtIndex(dataSource, 0)).toBe(dataSource);
  });

  it('idProperty is generated correctly', () => {
    const dataSource = [
      { name: 2 },
      { name: 3, nodes: [{ name: 4 }] },
      { name: 5 },
    ];

    const newDataSource = expandAtIndex(dataSource, 1, {
      generateIdFromPath: true,
      pathSeparator: '/',
      idProperty: 'name',
    });

    expect(newDataSource).toEqual([
      {
        name: 2,
      },
      { name: 3, nodes: [{ name: 4 }] },
      {
        name: '3/4',
        __nodeProps: { childIndex: 0, parentNodeId: 3, path: '3/4', depth: 1 },
      },
      { name: 5 },
    ]);
  });
});

xdescribe('collapseAtIndex', () => {
  it('index', () => {
    const dataSource = collapseAtIndex(
      [
        {
          name: 2,
        },
        { name: 3, id: 3, nodes: [{ name: 4 }, { name: 6 }] },
        { name: '3/4', __nodeProps: { parentNodeId: 3, path: '3/4' } },
        { name: '3/6', __nodeProps: { parentNodeId: 3, path: '3/6' } },
        { name: 5 },
      ],
      1,
      { generateIdFromPath: true }
    );

    expect(dataSource).toEqual([
      {
        name: 2,
      },
      { name: 3, id: 3, nodes: [{ name: 4 }, { name: 6 }] },
      { name: 5 },
    ]);
  });

  it('with no valid index', () => {
    const dataSource = [{ name: 3 }];
    const newDataSource = collapseAtIndex(dataSource, 2);

    expect(newDataSource).toBe(dataSource);
  });
});

describe('sorting', () => {
  it('sortTreeData shallow sort', () => {
    const dataSource = [
      { id: 2, __nodeProps: { path: '2', depth: 0 } },
      {
        id: '2/3',
        name: 'z',
        __nodeProps: { path: '2/3', depth: 1 },
      },
      {
        id: '2/3/1',
        name: 'z',
        __nodeProps: { path: '2/3/1', depth: 2 },
      },
      {
        id: '2/3/1/1',
        name: 'za',
        __nodeProps: { path: '2/3/1/1', depth: 3 },
      },
      {
        id: '2/3/2',
        name: 'y',
        __nodeProps: { path: '2/3/2', depth: 2 },
      },
      {
        id: '2/4',
        name: 'y',
        __nodeProps: { path: '2/4', depth: 1 },
      },
      {
        id: '2/4/1',
        name: 'z',
        __nodeProps: { path: '2/4/1', depth: 2 },
      },
      {
        id: '2/4/2',
        name: 'y',
        __nodeProps: { path: '2/4/2', depth: 2 },
      },
      {
        id: 5,
        __nodeProps: { path: '5', depth: 0 },
      },
      {
        id: '5/6',
        name: 'r',
        __nodeProps: { path: '5/6', depth: 1 },
      },
      {
        id: '5/6/8',
        name: 'a',
        __nodeProps: { path: '5/6/8', depth: 2 },
      },
      {
        id: '5/11',
        name: 'q',
        __nodeProps: { path: '5/11', depth: 1 },
      },

      { id: 7, __nodeProps: { path: '7', depth: 0 } },
    ];

    const result = sortTreeData({ name: 'name', dir: 1 }, dataSource, {
      depth: 1,
      deep: false,
    });

    expect(result).toEqual([
      { id: 2, __nodeProps: { path: '2', depth: 0 } },
      {
        id: '2/4',
        name: 'y',
        __nodeProps: { path: '2/4', depth: 1 },
      },
      {
        id: '2/4/1',
        name: 'z',
        __nodeProps: { path: '2/4/1', depth: 2 },
      },
      {
        id: '2/4/2',
        name: 'y',
        __nodeProps: { path: '2/4/2', depth: 2 },
      },
      {
        id: '2/3',
        name: 'z',
        __nodeProps: { path: '2/3', depth: 1 },
      },
      {
        id: '2/3/1',
        name: 'z',
        __nodeProps: { path: '2/3/1', depth: 2 },
      },
      {
        id: '2/3/1/1',
        name: 'za',
        __nodeProps: { path: '2/3/1/1', depth: 3 },
      },
      {
        id: '2/3/2',
        name: 'y',
        __nodeProps: { path: '2/3/2', depth: 2 },
      },
      {
        id: 5,
        __nodeProps: { path: '5', depth: 0 },
      },
      {
        id: '5/11',
        name: 'q',
        __nodeProps: { path: '5/11', depth: 1 },
      },
      {
        id: '5/6',
        name: 'r',
        __nodeProps: { path: '5/6', depth: 1 },
      },
      {
        id: '5/6/8',
        name: 'a',
        __nodeProps: { path: '5/6/8', depth: 2 },
      },

      { id: 7, __nodeProps: { path: '7', depth: 0 } },
    ]);
  });

  it('sortTreeData deep sort', () => {
    const dataSource = [
      { id: 2, __nodeProps: { path: '2', depth: 0 } },
      {
        id: '2/3',
        name: 'z',
        __nodeProps: { path: '2/3', depth: 1 },
      },
      {
        id: '2/3/1',
        name: 'z',
        __nodeProps: { path: '2/3/1', depth: 2 },
      },
      {
        id: '2/3/1/1',
        name: 'za',
        __nodeProps: { path: '2/3/1/1', depth: 3 },
      },
      {
        id: '2/3/2',
        name: 'y',
        __nodeProps: { path: '2/3/2', depth: 2 },
      },
      {
        id: '2/4',
        name: 'y',
        __nodeProps: { path: '2/4', depth: 1 },
      },
      {
        id: '2/4/1',
        name: 'z',
        __nodeProps: { path: '2/4/1', depth: 2 },
      },
      {
        id: '2/4/2',
        name: 'y',
        __nodeProps: { path: '2/4/2', depth: 2 },
      },
      {
        id: 5,
        __nodeProps: { path: '5', depth: 0 },
      },
      {
        id: '5/6',
        name: 'r',
        __nodeProps: { path: '5/6', depth: 1 },
      },
      {
        id: '5/6/8',
        name: 'a',
        __nodeProps: { path: '5/6/8', depth: 2 },
      },
      {
        id: '5/11',
        name: 'q',
        __nodeProps: { path: '5/11', depth: 1 },
      },

      { id: 7, __nodeProps: { path: '7', depth: 0 } },
    ];

    const result = sortTreeData({ name: 'name', dir: 1 }, dataSource, {
      depth: 1,
      deep: true,
    });

    expect(result).toEqual([
      { id: 2, __nodeProps: { path: '2', depth: 0 } },
      {
        id: '2/4',
        name: 'y',
        __nodeProps: { path: '2/4', depth: 1 },
      },
      {
        id: '2/4/2',
        name: 'y',
        __nodeProps: { path: '2/4/2', depth: 2 },
      },
      {
        id: '2/4/1',
        name: 'z',
        __nodeProps: { path: '2/4/1', depth: 2 },
      },
      {
        id: '2/3',
        name: 'z',
        __nodeProps: { path: '2/3', depth: 1 },
      },
      {
        id: '2/3/2',
        name: 'y',
        __nodeProps: { path: '2/3/2', depth: 2 },
      },
      {
        id: '2/3/1',
        name: 'z',
        __nodeProps: { path: '2/3/1', depth: 2 },
      },
      {
        id: '2/3/1/1',
        name: 'za',
        __nodeProps: { path: '2/3/1/1', depth: 3 },
      },
      {
        id: 5,
        __nodeProps: { path: '5', depth: 0 },
      },
      {
        id: '5/11',
        name: 'q',
        __nodeProps: { path: '5/11', depth: 1 },
      },
      {
        id: '5/6',
        name: 'r',
        __nodeProps: { path: '5/6', depth: 1 },
      },
      {
        id: '5/6/8',
        name: 'a',
        __nodeProps: { path: '5/6/8', depth: 2 },
      },

      { id: 7, __nodeProps: { path: '7', depth: 0 } },
    ]);
  });

  it('should sort data correctly', () => {
    const dataSource = [
      {
        id: 1,
        __nodeProps: { path: '1', depth: 0 },
      },
      {
        id: '1/1',
        __nodeProps: { path: '1/1', depth: 1 },
      },
      {
        id: '1/2',
        __nodeProps: { path: '1/2', depth: 1 },
      },
      {
        id: '1/3',
        __nodeProps: { path: '1/3', depth: 1 },
      },
      {
        id: 2,
        __nodeProps: { path: '2', depth: 0 },
      },
      {
        id: '2/1',
        __nodeProps: { path: '2/1', depth: 1 },
      },
      {
        id: '2/2',
        __nodeProps: { path: '2/2', depth: 1 },
      },
      {
        id: '2/3',
        __nodeProps: { path: '2/3', depth: 1 },
      },
      {
        id: 3,
        __nodeProps: { path: '3', depth: 0 },
      },
      {
        id: '3/1',
        __nodeProps: { path: '3/1', depth: 1 },
      },
      {
        id: '3/1/1',
        __nodeProps: { path: '3/1/1', depth: 2 },
      },
      {
        id: '3/1/2',
        __nodeProps: { path: '3/1/2', depth: 2 },
      },
      {
        id: '3/2',
        __nodeProps: { path: '3/2', depth: 1 },
      },
    ];

    const result = sortTreeData([{ name: 'id', dir: -1 }], dataSource, {
      depth: 0,
      deep: true,
    });

    expect(result).toEqual([
      {
        id: 3,
        __nodeProps: { path: '3', depth: 0 },
      },

      {
        id: '3/2',
        __nodeProps: { path: '3/2', depth: 1 },
      },
      {
        id: '3/1',
        __nodeProps: { path: '3/1', depth: 1 },
      },
      {
        id: '3/1/2',
        __nodeProps: { path: '3/1/2', depth: 2 },
      },
      {
        id: '3/1/1',
        __nodeProps: { path: '3/1/1', depth: 2 },
      },

      {
        id: 2,
        __nodeProps: { path: '2', depth: 0 },
      },

      {
        id: '2/3',
        __nodeProps: { path: '2/3', depth: 1 },
      },

      {
        id: '2/2',
        __nodeProps: { path: '2/2', depth: 1 },
      },
      {
        id: '2/1',
        __nodeProps: { path: '2/1', depth: 1 },
      },
      {
        id: 1,
        __nodeProps: { path: '1', depth: 0 },
      },

      {
        id: '1/3',
        __nodeProps: { path: '1/3', depth: 1 },
      },
      {
        id: '1/2',
        __nodeProps: { path: '1/2', depth: 1 },
      },
      {
        id: '1/1',
        __nodeProps: { path: '1/1', depth: 1 },
      },
    ]);
  });
});
