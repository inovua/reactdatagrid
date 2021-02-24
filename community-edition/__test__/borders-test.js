/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { findDOMNode } from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import DataGrid from '..';
import { render } from '../testUtils';
import '../../style/index.scss';
import Cell from '../Layout/ColumnLayout/Cell';
import Row from '../Layout/ColumnLayout/Content/Row';

const LOCK_MARGIN_WIDTH = 4;

const findCellsInRow = row => {
  return ReactTestUtils.findAllInRenderedTree(row, cmp => {
    return cmp.constructor === Cell;
  });
};

const findRowAt = (tree, index) => {
  const rows = ReactTestUtils.findAllInRenderedTree(tree, cmp => {
    return cmp.constructor === Row && cmp.props.rowIndex == index;
  });

  return rows[0];
};

describe('showCellBorders: true', () => {
  it('should correctly set borders to all cells, when we have groupBy & expandGroupTitle', done => {
    const columns = [
      { name: 'country', defaultWidth: 100, locked: true },
      { name: 'firstName', defaultWidth: 100 },
      { name: 'lastName', defaultWidth: 100, locked: true },
      { name: 'lastName1', defaultWidth: 100 },
      { name: 'email', defaultWidth: 100, locked: 'end' },
      { name: 'x', defaultWidth: 100, locked: 'end' },
    ];
    const gridInstance = render(
      <DataGrid
        columns={columns}
        hideGroupByColumns={false}
        virtualizeColumns={false}
        idProperty="id"
        groupBy={['country', 'email', 'firstName']}
        expandGroupTitle
        showCellBorders={true}
        dataSource={[
          {
            lastName: 'a last name',
            firstName:
              'john is a very long name so it better be ellipsed in a ',
            email: 'john@gmail.com',
            id: 1,
            country: 'uk',
          },
          {
            firstName: 'john2',
            email: 'john@gmail.com',
            id: 11,
            country: 'uk',
          },
          {
            firstName:
              'john is a very long name so it better be ellipsed in a ',
            email: 'john@gmail.com',
            id: 12,
            country: 'uk',
          },
          {
            firstName: 'marry',
            email: 'marry@gmail.com',
            id: 2,
            country: 'uk',
          },
          {
            firstName: 'marry',
            email: 'marry@gmail.com',
            id: 122,
            country: 'uk',
          },
        ]}
      />
    );

    setTimeout(() => {
      let rows = [
        ...findDOMNode(gridInstance).querySelectorAll(
          '.InovuaReactDataGrid__row'
        ),
      ];

      expect(rows.length).to.equal(11);

      const rowIndexes = [...Array(11)].map((_, i) => i);

      rows = rowIndexes.map(i => findRowAt(gridInstance, i));

      const cellBorders = rows.map(row => {
        const cells = findCellsInRow(row);

        return cells.map(cell => {
          const style = getComputedStyle(findDOMNode(cell));

          const top = parseInt(style['border-top-width']);
          const right = parseInt(style['border-right-width']);
          const bottom = parseInt(style['border-bottom-width']);
          const left = parseInt(style['border-left-width']);

          return `${top};${right};${bottom};${left}`;
        });
      });

      const totalColumns = columns.length + 3;

      // 9
      expect(cellBorders.length).to.equal(11);
      expect(cellBorders[0].length).to.equal(totalColumns);

      const hiddenCell = '0;0;0;0';
      const hiddenFirstCell = '1;0;0;0';
      // | > | ....

      expect(cellBorders[0]).to.deep.equal([
        `1;0;0;0`,
        `1;1;0;0`,
        hiddenFirstCell,
        hiddenFirstCell,
        hiddenFirstCell,
        hiddenFirstCell,
        hiddenFirstCell,
        hiddenFirstCell,
        hiddenFirstCell,
      ]);

      // |  | > | ...
      expect(cellBorders[1]).to.deep.equal([
        hiddenCell,
        `1;0;0;1`,
        `1;1;0;0`,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
      ]);

      // |  |   | > | ...

      expect(cellBorders[2]).to.deep.equal([
        hiddenCell,
        `0;0;0;1`,
        `1;0;0;1`,
        `1;1;0;0`,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
      ]);

      // |  |   |   | content
      // this is the first row that is not a group row

      expect(cellBorders[3]).to.deep.equal([
        hiddenCell,
        `0;0;0;1`,
        `0;0;0;1`,
        `1;0;1;1`,
        `1;${LOCK_MARGIN_WIDTH};1;1`,
        `1;0;1;0`,
        `1;0;1;1`,
        `1;0;1;${LOCK_MARGIN_WIDTH}`,
        `1;1;1;1`,
      ]);

      expect(cellBorders[4]).to.deep.equal([
        hiddenCell,
        '0;0;0;1',
        '0;0;0;1',
        '0;0;0;1',
        `0;${LOCK_MARGIN_WIDTH};0;1`,
        hiddenCell,
        '0;0;0;1',
        `0;0;0;${LOCK_MARGIN_WIDTH}`,
        `0;1;0;1`,
      ]);

      // |  |   | > | ...
      expect(cellBorders[5]).to.deep.equal(cellBorders[2]);

      // content row
      expect(cellBorders[6]).to.deep.equal([
        hiddenCell,
        `0;0;0;1`,
        `0;0;0;1`,
        `1;0;0;1`,
        `1;${LOCK_MARGIN_WIDTH};0;1`,
        `1;0;0;0`,
        `1;0;0;1`,
        `1;0;0;${LOCK_MARGIN_WIDTH}`,
        `1;1;0;1`,
      ]);

      // |  |  > | ...
      expect(cellBorders[7]).to.deep.equal(cellBorders[1]);

      // |  |   | > | ...
      expect(cellBorders[8]).to.deep.equal(cellBorders[2]);

      // content row
      expect(cellBorders[9]).to.deep.equal(cellBorders[3]);

      expect(cellBorders[10]).to.deep.equal([
        `0;0;1;0`,
        `0;0;1;1`,
        `0;0;1;1`,
        `0;0;1;1`,
        `0;${LOCK_MARGIN_WIDTH};1;1`,
        `0;0;1;0`,
        `0;0;1;1`,
        `0;0;1;${LOCK_MARGIN_WIDTH}`,
        `0;1;1;1`,
      ]);

      gridInstance.unmount();
      done();
    }, 100);
  });
});

describe('showCellBorders: true and grid.width > availableWidth', () => {
  it('should correctly set borders to all cells, when we have groupBy & expandGroupTitle', done => {
    const columns = [
      { name: 'country', defaultWidth: 500, locked: true },
      { name: 'firstName', defaultWidth: 500 },
      { name: 'lastName', defaultWidth: 500, locked: true },
      { name: 'lastName1', defaultWidth: 500 },
      { name: 'email', defaultWidth: 500, locked: 'end' },
      { name: 'x', defaultWidth: 500, locked: 'end' },
    ];
    const gridInstance = render(
      <DataGrid
        columns={columns}
        hideGroupByColumns={false}
        virtualizeColumns={false}
        idProperty="id"
        groupBy={['country', 'email', 'firstName']}
        expandGroupTitle
        showCellBorders
        dataSource={[
          {
            lastName: 'a last name',
            firstName:
              'john is a very long name so it better be ellipsed in a ',
            email: 'john@gmail.com',
            id: 1,
            country: 'uk',
          },
          {
            firstName: 'john2',
            email: 'john@gmail.com',
            id: 11,
            country: 'uk',
          },
          {
            firstName:
              'john is a very long name so it better be ellipsed in a ',
            email: 'john@gmail.com',
            id: 12,
            country: 'uk',
          },
          {
            firstName: 'marry',
            email: 'marry@gmail.com',
            id: 2,
            country: 'uk',
          },
          {
            firstName: 'marry',
            email: 'marry@gmail.com',
            id: 122,
            country: 'uk',
          },
        ]}
      />
    );

    setTimeout(() => {
      let rows = [
        ...findDOMNode(gridInstance).querySelectorAll(
          '.InovuaReactDataGrid__row'
        ),
      ];

      expect(rows.length).to.equal(11);

      const rowIndexes = [...Array(11)].map((_, i) => i);

      rows = rowIndexes.map(i => findRowAt(gridInstance, i));

      const cellBorders = rows.map(row => {
        const cells = findCellsInRow(row);

        return cells.map(cell => {
          const style = getComputedStyle(findDOMNode(cell));

          const top = parseInt(style['border-top-width']);
          const right = parseInt(style['border-right-width']);
          const bottom = parseInt(style['border-bottom-width']);
          const left = parseInt(style['border-left-width']);

          return `${top};${right};${bottom};${left}`;
        });
      });

      const totalColumns = columns.length + 3;

      // 9
      expect(cellBorders.length).to.equal(11);
      expect(cellBorders[0].length).to.equal(totalColumns);

      const hiddenCell = '0;0;0;0';
      const hiddenFirstCell = '1;0;0;0';
      // | > | ....

      expect(cellBorders[0]).to.deep.equal([
        `1;0;0;0`,
        `1;0;0;0`,
        hiddenFirstCell,
        hiddenFirstCell,
        hiddenFirstCell,
        hiddenFirstCell,
        hiddenFirstCell,
        hiddenFirstCell,
        hiddenFirstCell,
      ]);

      // |  | > | ...
      expect(cellBorders[1]).to.deep.equal([
        hiddenCell,
        `1;0;0;1`,
        `1;0;0;0`,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
      ]);

      // |  |   | > | ...

      expect(cellBorders[2]).to.deep.equal([
        hiddenCell,
        `0;0;0;1`,
        `1;0;0;1`,
        `1;0;0;0`,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
      ]);

      // |  |   |   | content
      // this is the first row that is not a group row

      expect(cellBorders[3]).to.deep.equal([
        hiddenCell,
        `0;0;0;1`,
        `0;0;0;1`,
        `1;0;1;1`,
        `1;${LOCK_MARGIN_WIDTH};1;1`,
        `1;0;1;0`,
        `1;0;1;1`,
        `1;0;1;${LOCK_MARGIN_WIDTH}`,
        `1;0;1;1`,
      ]);

      expect(cellBorders[4]).to.deep.equal([
        hiddenCell,
        '0;0;0;1',
        '0;0;0;1',
        '0;0;0;1',
        `0;${LOCK_MARGIN_WIDTH};0;1`,
        hiddenCell,
        '0;0;0;1',
        `0;0;0;${LOCK_MARGIN_WIDTH}`,
        `0;0;0;1`,
      ]);

      // |  |   | > | ...
      expect(cellBorders[5]).to.deep.equal(cellBorders[2]);

      // content row
      expect(cellBorders[6]).to.deep.equal([
        hiddenCell,
        `0;0;0;1`,
        `0;0;0;1`,
        `1;0;0;1`,
        `1;${LOCK_MARGIN_WIDTH};0;1`,
        `1;0;0;0`,
        `1;0;0;1`,
        `1;0;0;${LOCK_MARGIN_WIDTH}`,
        `1;0;0;1`,
      ]);

      // |  |  > | ...
      expect(cellBorders[7]).to.deep.equal(cellBorders[1]);

      // |  |   | > | ...
      expect(cellBorders[8]).to.deep.equal(cellBorders[2]);

      // content row
      expect(cellBorders[9]).to.deep.equal(cellBorders[3]);

      expect(cellBorders[10]).to.deep.equal([
        `0;0;1;0`,
        `0;0;1;1`,
        `0;0;1;1`,
        `0;0;1;1`,
        `0;${LOCK_MARGIN_WIDTH};1;1`,
        `0;0;1;0`,
        `0;0;1;1`,
        `0;0;1;${LOCK_MARGIN_WIDTH}`,
        `0;0;1;1`,
      ]);

      gridInstance.unmount();
      done();
    }, 100);
  });
});

describe('showCellBorders: false', () => {
  it('should correctly set borders to all cells, when we have groupBy & expandGroupTitle', done => {
    const columns = [
      { name: 'country', defaultWidth: 100, locked: true },
      { name: 'firstName', defaultWidth: 100 },
      { name: 'lastName', defaultWidth: 100, locked: true },
      { name: 'lastName1', defaultWidth: 100 },
      { name: 'email', defaultWidth: 100, locked: 'end' },
      { name: 'x', defaultWidth: 100, locked: 'end' },
    ];
    const gridInstance = render(
      <DataGrid
        columns={columns}
        hideGroupByColumns={false}
        virtualizeColumns={false}
        idProperty="id"
        groupBy={['country', 'email', 'firstName']}
        expandGroupTitle
        showCellBorders={false}
        dataSource={[
          {
            lastName: 'a last name',
            firstName:
              'john is a very long name so it better be ellipsed in a ',
            email: 'john@gmail.com',
            id: 1,
            country: 'uk',
          },
          {
            firstName: 'john2',
            email: 'john@gmail.com',
            id: 11,
            country: 'uk',
          },
          {
            firstName:
              'john is a very long name so it better be ellipsed in a ',
            email: 'john@gmail.com',
            id: 12,
            country: 'uk',
          },
          {
            firstName: 'marry',
            email: 'marry@gmail.com',
            id: 2,
            country: 'uk',
          },
          {
            firstName: 'marry',
            email: 'marry@gmail.com',
            id: 122,
            country: 'uk',
          },
        ]}
      />
    );

    setTimeout(() => {
      let rows = [
        ...findDOMNode(gridInstance).querySelectorAll(
          '.InovuaReactDataGrid__row'
        ),
      ];

      expect(rows.length).to.equal(11);

      const rowIndexes = [...Array(11)].map((_, i) => i);

      rows = rowIndexes.map(i => findRowAt(gridInstance, i));

      const cellBorders = rows.map(row => {
        const cells = findCellsInRow(row);

        return cells.map(cell => {
          const style = getComputedStyle(findDOMNode(cell));

          const top = parseInt(style['border-top-width']);
          const right = parseInt(style['border-right-width']);
          const bottom = parseInt(style['border-bottom-width']);
          const left = parseInt(style['border-left-width']);

          return `${top};${right};${bottom};${left}`;
        });
      });

      const totalColumns = columns.length + 3;

      // 9
      expect(cellBorders.length).to.equal(11);
      expect(cellBorders[0].length).to.equal(totalColumns);

      const hiddenCell = '0;0;0;0';
      const hiddenFirstCell = '1;0;0;0';
      // | > | ....

      expect(cellBorders[0]).to.deep.equal([
        `1;0;0;0`,
        `1;1;0;0`,
        hiddenFirstCell,
        hiddenFirstCell,
        hiddenFirstCell,
        hiddenFirstCell,
        hiddenFirstCell,
        hiddenFirstCell,
        hiddenFirstCell,
      ]);

      // |  | > | ...
      expect(cellBorders[1]).to.deep.equal([
        hiddenCell,
        `1;0;0;1`,
        `1;1;0;0`,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
      ]);

      // |  |   | > | ...

      expect(cellBorders[2]).to.deep.equal([
        hiddenCell,
        `0;0;0;1`,
        `1;0;0;1`,
        `1;1;0;0`,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
      ]);

      // |  |   |   | content
      // this is the first row that is not a group row

      expect(cellBorders[3]).to.deep.equal([
        hiddenCell,
        `0;0;0;1`,
        `0;0;0;1`,
        `1;0;0;1`,
        `1;${LOCK_MARGIN_WIDTH};0;0`,
        `1;0;0;0`,
        `1;0;0;0`,
        `1;0;0;${LOCK_MARGIN_WIDTH}`,
        `1;1;0;0`,
      ]);

      expect(cellBorders[4]).to.deep.equal([
        hiddenCell,
        '0;0;0;1',
        '0;0;0;1',
        '0;0;0;1',
        `0;${LOCK_MARGIN_WIDTH};0;0`,
        hiddenCell,
        '0;0;0;0',
        `0;0;0;${LOCK_MARGIN_WIDTH}`,
        `0;1;0;0`,
      ]);

      // |  |   | > | ...
      expect(cellBorders[5]).to.deep.equal(cellBorders[2]);

      // content row
      expect(cellBorders[6]).to.deep.equal([
        hiddenCell,
        `0;0;0;1`,
        `0;0;0;1`,
        `1;0;0;1`,
        `1;${LOCK_MARGIN_WIDTH};0;0`,
        `1;0;0;0`,
        `1;0;0;0`,
        `1;0;0;${LOCK_MARGIN_WIDTH}`,
        `1;1;0;0`,
      ]);

      // |  |  > | ...
      expect(cellBorders[7]).to.deep.equal(cellBorders[1]);

      // |  |   | > | ...
      expect(cellBorders[8]).to.deep.equal(cellBorders[2]);

      // content row
      expect(cellBorders[9]).to.deep.equal(cellBorders[3]);

      expect(cellBorders[10]).to.deep.equal([
        `0;0;1;0`,
        `0;0;1;1`,
        `0;0;1;1`,
        `0;0;1;1`,
        `0;${LOCK_MARGIN_WIDTH};1;0`,
        `0;0;1;0`,
        `0;0;1;0`,
        `0;0;1;${LOCK_MARGIN_WIDTH}`,
        `0;1;1;0`,
      ]);
      gridInstance.unmount();
      done();
    }, 100);
  });
});

describe('showCellBorders: horizontal', () => {
  it('should correctly set borders to all cells, when we have groupBy & expandGroupTitle', done => {
    const columns = [
      { name: 'country', defaultWidth: 100, locked: true },
      { name: 'firstName', defaultWidth: 100 },
      { name: 'lastName', defaultWidth: 100, locked: true },
      { name: 'lastName1', defaultWidth: 100 },
      { name: 'email', defaultWidth: 100, locked: 'end' },
      { name: 'x', defaultWidth: 100, locked: 'end' },
    ];
    const gridInstance = render(
      <DataGrid
        columns={columns}
        hideGroupByColumns={false}
        virtualizeColumns={false}
        idProperty="id"
        groupBy={['country', 'email', 'firstName']}
        expandGroupTitle
        showCellBorders={'horizontal'}
        dataSource={[
          {
            lastName: 'a last name',
            firstName:
              'john is a very long name so it better be ellipsed in a ',
            email: 'john@gmail.com',
            id: 1,
            country: 'uk',
          },
          {
            firstName: 'john2',
            email: 'john@gmail.com',
            id: 11,
            country: 'uk',
          },
          {
            firstName:
              'john is a very long name so it better be ellipsed in a ',
            email: 'john@gmail.com',
            id: 12,
            country: 'uk',
          },
          {
            firstName: 'marry',
            email: 'marry@gmail.com',
            id: 2,
            country: 'uk',
          },
          {
            firstName: 'marry',
            email: 'marry@gmail.com',
            id: 122,
            country: 'uk',
          },
        ]}
      />
    );

    setTimeout(() => {
      let rows = [
        ...findDOMNode(gridInstance).querySelectorAll(
          '.InovuaReactDataGrid__row'
        ),
      ];

      expect(rows.length).to.equal(11);

      const rowIndexes = [...Array(11)].map((_, i) => i);

      rows = rowIndexes.map(i => findRowAt(gridInstance, i));

      const cellBorders = rows.map(row => {
        const cells = findCellsInRow(row);

        return cells.map(cell => {
          const style = getComputedStyle(findDOMNode(cell));

          const top = parseInt(style['border-top-width']);
          const right = parseInt(style['border-right-width']);
          const bottom = parseInt(style['border-bottom-width']);
          const left = parseInt(style['border-left-width']);

          return `${top};${right};${bottom};${left}`;
        });
      });

      const totalColumns = columns.length + 3;

      // 9
      expect(cellBorders.length).to.equal(11);
      expect(cellBorders[0].length).to.equal(totalColumns);

      const hiddenCell = '0;0;0;0';
      const hiddenFirstCell = '1;0;0;0';
      // | > | ....

      expect(cellBorders[0]).to.deep.equal([
        `1;0;0;0`,
        `1;1;0;0`,
        hiddenFirstCell,
        hiddenFirstCell,
        hiddenFirstCell,
        hiddenFirstCell,
        hiddenFirstCell,
        hiddenFirstCell,
        hiddenFirstCell,
      ]);

      // |  | > | ...
      expect(cellBorders[1]).to.deep.equal([
        hiddenCell,
        `1;0;0;1`,
        `1;1;0;0`,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
      ]);

      // |  |   | > | ...

      expect(cellBorders[2]).to.deep.equal([
        hiddenCell,
        `0;0;0;1`,
        `1;0;0;1`,
        `1;1;0;0`,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
      ]);

      // |  |   |   | content
      // this is the first row that is not a group row

      expect(cellBorders[3]).to.deep.equal([
        hiddenCell,
        `0;0;0;1`,
        `0;0;0;1`,
        `1;0;1;1`,
        `1;${LOCK_MARGIN_WIDTH};1;0`,
        `1;0;1;0`,
        `1;0;1;0`,
        `1;0;1;${LOCK_MARGIN_WIDTH}`,
        `1;1;1;0`,
      ]);
      expect(cellBorders[4]).to.deep.equal([
        hiddenCell,
        '0;0;0;1',
        '0;0;0;1',
        '0;0;0;1',
        `0;${LOCK_MARGIN_WIDTH};0;0`,
        hiddenCell,
        '0;0;0;0',
        `0;0;0;${LOCK_MARGIN_WIDTH}`,
        `0;1;0;0`,
      ]);

      // |  |   | > | ...
      expect(cellBorders[5]).to.deep.equal(cellBorders[2]);

      // content row
      expect(cellBorders[6]).to.deep.equal([
        hiddenCell,
        `0;0;0;1`,
        `0;0;0;1`,
        `1;0;0;1`,
        `1;${LOCK_MARGIN_WIDTH};0;0`,
        `1;0;0;0`,
        `1;0;0;0`,
        `1;0;0;${LOCK_MARGIN_WIDTH}`,
        `1;1;0;0`,
      ]);
      // |  |  > | ...
      expect(cellBorders[7]).to.deep.equal(cellBorders[1]);

      // |  |   | > | ...
      expect(cellBorders[8]).to.deep.equal(cellBorders[2]);

      // content row
      expect(cellBorders[9]).to.deep.equal(cellBorders[3]);

      expect(cellBorders[10]).to.deep.equal([
        `0;0;1;0`,
        `0;0;1;1`,
        `0;0;1;1`,
        `0;0;1;1`,
        `0;${LOCK_MARGIN_WIDTH};1;0`,
        `0;0;1;0`,
        `0;0;1;0`,
        `0;0;1;${LOCK_MARGIN_WIDTH}`,
        `0;1;1;0`,
      ]);
      gridInstance.unmount();
      done();
    }, 100);
  });
});

describe('showCellBorders: vertical', () => {
  it('should correctly set borders to all cells, when we have groupBy & expandGroupTitle', done => {
    const columns = [
      { name: 'country', defaultWidth: 100, locked: true },
      { name: 'firstName', defaultWidth: 100 },
      { name: 'lastName', defaultWidth: 100, locked: true },
      { name: 'lastName1', defaultWidth: 100 },
      { name: 'email', defaultWidth: 100, locked: 'end' },
      { name: 'x', defaultWidth: 100, locked: 'end' },
    ];
    const gridInstance = render(
      <DataGrid
        columns={columns}
        hideGroupByColumns={false}
        virtualizeColumns={false}
        idProperty="id"
        groupBy={['country', 'email', 'firstName']}
        expandGroupTitle
        showCellBorders={'vertical'}
        dataSource={[
          {
            lastName: 'a last name',
            firstName:
              'john is a very long name so it better be ellipsed in a ',
            email: 'john@gmail.com',
            id: 1,
            country: 'uk',
          },
          {
            firstName: 'john2',
            email: 'john@gmail.com',
            id: 11,
            country: 'uk',
          },
          {
            firstName:
              'john is a very long name so it better be ellipsed in a ',
            email: 'john@gmail.com',
            id: 12,
            country: 'uk',
          },
          {
            firstName: 'marry',
            email: 'marry@gmail.com',
            id: 2,
            country: 'uk',
          },
          {
            firstName: 'marry',
            email: 'marry@gmail.com',
            id: 122,
            country: 'uk',
          },
        ]}
      />
    );

    setTimeout(() => {
      let rows = [
        ...findDOMNode(gridInstance).querySelectorAll(
          '.InovuaReactDataGrid__row'
        ),
      ];

      expect(rows.length).to.equal(11);

      const rowIndexes = [...Array(11)].map((_, i) => i);

      rows = rowIndexes.map(i => findRowAt(gridInstance, i));

      const cellBorders = rows.map(row => {
        const cells = findCellsInRow(row);

        return cells.map(cell => {
          const style = getComputedStyle(findDOMNode(cell));

          const top = parseInt(style['border-top-width']);
          const right = parseInt(style['border-right-width']);
          const bottom = parseInt(style['border-bottom-width']);
          const left = parseInt(style['border-left-width']);

          return `${top};${right};${bottom};${left}`;
        });
      });

      const totalColumns = columns.length + 3;

      // 9
      expect(cellBorders.length).to.equal(11);
      expect(cellBorders[0].length).to.equal(totalColumns);

      const hiddenCell = '0;0;0;0';
      const hiddenFirstCell = '1;0;0;0';
      // | > | ....

      expect(cellBorders[0]).to.deep.equal([
        `1;0;0;0`,
        `1;1;0;0`,
        hiddenFirstCell,
        hiddenFirstCell,
        hiddenFirstCell,
        hiddenFirstCell,
        hiddenFirstCell,
        hiddenFirstCell,
        hiddenFirstCell,
      ]);

      // |  | > | ...
      expect(cellBorders[1]).to.deep.equal([
        hiddenCell,
        `1;0;0;1`,
        `1;1;0;0`,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
      ]);

      // |  |   | > | ...

      expect(cellBorders[2]).to.deep.equal([
        hiddenCell,
        `0;0;0;1`,
        `1;0;0;1`,
        `1;1;0;0`,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
      ]);

      // |  |   |   | content
      // this is the first row that is not a group row

      expect(cellBorders[3]).to.deep.equal([
        hiddenCell,
        `0;0;0;1`,
        `0;0;0;1`,
        `1;0;0;1`,
        `1;${LOCK_MARGIN_WIDTH};0;1`,
        `1;0;0;0`,
        `1;0;0;1`,
        `1;0;0;${LOCK_MARGIN_WIDTH}`,
        `1;1;0;1`,
      ]);

      expect(cellBorders[4]).to.deep.equal([
        hiddenCell,
        '0;0;0;1',
        '0;0;0;1',
        '0;0;0;1',
        `0;${LOCK_MARGIN_WIDTH};0;1`,
        hiddenCell,
        '0;0;0;1',
        `0;0;0;${LOCK_MARGIN_WIDTH}`,
        `0;1;0;1`,
      ]);
      // |  |   | > | ...
      expect(cellBorders[5]).to.deep.equal(cellBorders[2]);

      // content row
      expect(cellBorders[6]).to.deep.equal([
        hiddenCell,
        `0;0;0;1`,
        `0;0;0;1`,
        `1;0;0;1`,
        `1;${LOCK_MARGIN_WIDTH};0;1`,
        `1;0;0;0`,
        `1;0;0;1`,
        `1;0;0;${LOCK_MARGIN_WIDTH}`,
        `1;1;0;1`,
      ]);

      // |  |  > | ...
      expect(cellBorders[7]).to.deep.equal(cellBorders[1]);

      // |  |   | > | ...
      expect(cellBorders[8]).to.deep.equal(cellBorders[2]);

      // content row
      expect(cellBorders[9]).to.deep.equal(cellBorders[3]);

      expect(cellBorders[10]).to.deep.equal([
        `0;0;1;0`,
        `0;0;1;1`,
        `0;0;1;1`,
        `0;0;1;1`,
        `0;${LOCK_MARGIN_WIDTH};1;1`,
        `0;0;1;0`,
        `0;0;1;1`,
        `0;0;1;${LOCK_MARGIN_WIDTH}`,
        `0;1;1;1`,
      ]);
      gridInstance.unmount();
      done();
    }, 100);
  });
});
