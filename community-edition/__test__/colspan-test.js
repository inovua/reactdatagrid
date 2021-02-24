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

describe('computedColspan', () => {
  it('should set computedColspan, last, lastInSection correctly when groupBy is used with expandGroupTitle', done => {
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

      const cellProps = rows.map(row => {
        const cells = findCellsInRow(row);

        return cells.map(cell => {
          const props = cell.getProps();
          return {
            hidden: props.hidden,
            computedColspan: props.computedColspan,
            last: props.last,
            lastInSection: props.lastInSection,
          };
        });
      });

      const totalColumns = columns.length + 3;

      // 9
      expect(cellProps.length).to.equal(11);
      expect(cellProps[0].length).to.equal(totalColumns);

      const hiddenCell = {
        hidden: true,
        computedColspan: undefined,
        last: false,
        lastInSection: false,
      };

      // | > | ....
      expect(cellProps[0]).to.deep.equal([
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: false,
        },
        {
          hidden: false,
          computedColspan: totalColumns - 1,
          last: true,
          lastInSection: true,
        },
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
      ]);

      // |  | > | ...
      expect(cellProps[1]).to.deep.equal([
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: false,
        },
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: false,
        },
        {
          hidden: false,
          computedColspan: totalColumns - 2,
          last: true,
          lastInSection: true,
        },
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
      ]);

      // |  |   | > | ...
      expect(cellProps[2]).to.deep.equal([
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: false,
        },
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: false,
        },
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: false,
        },
        {
          hidden: false,
          computedColspan: totalColumns - 3,
          last: true,
          lastInSection: true,
        },
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
        hiddenCell,
      ]);

      // |  |   |   | content
      // this is the first row that is not a group row
      expect(cellProps[3]).to.deep.equal([
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: false,
        },
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: false,
        },
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: false,
        },
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: false,
        },
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: true,
        },
        // last in locked start
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: false,
        },
        // last in locked start
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: true,
        },
        // last in unlocked
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: false,
        },
        // last in locked end
        {
          hidden: false,
          computedColspan: undefined,
          last: true,
          lastInSection: true,
        },
      ]);

      expect(cellProps[4]).to.deep.equal(cellProps[3]);

      // |  |   | > | ...
      expect(cellProps[5]).to.deep.equal(cellProps[2]);

      // content row
      expect(cellProps[6]).to.deep.equal(cellProps[3]);

      // |  |  > | ...
      expect(cellProps[7]).to.deep.equal(cellProps[1]);

      // |  |   | > | ...
      expect(cellProps[8]).to.deep.equal(cellProps[2]);

      // content row
      expect(cellProps[9]).to.deep.equal(cellProps[3]);
      expect(cellProps[10]).to.deep.equal(cellProps[3]);

      gridInstance.unmount();
      done();
    }, 20);
  });

  it('should set computedColspan, last, lastInSection correctly when groupBy is used with expandGroupTitle=false', done => {
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
        expandGroupTitle={false}
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

      const cellProps = rows.map(row => {
        const cells = findCellsInRow(row);

        return cells.map(cell => {
          const props = cell.getProps();
          return {
            hidden: props.hidden,
            computedColspan: props.computedColspan,
            last: props.last,
            lastInSection: props.lastInSection,
          };
        });
      });

      const totalColumns = columns.length + 3;

      // 9
      expect(cellProps.length).to.equal(11);
      expect(cellProps[0].length).to.equal(totalColumns);

      const hiddenCell = {
        hidden: true,
        computedColspan: undefined,
        last: false,
        lastInSection: false,
      };

      // | > | ....
      expect(cellProps[0]).to.deep.equal([
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: false,
        },
        { hidden: false, computedColspan: 4, last: false, lastInSection: true },
        hiddenCell,
        hiddenCell,
        hiddenCell,
        { hidden: false, computedColspan: 2, last: false, lastInSection: true },
        hiddenCell,
        { hidden: false, computedColspan: 2, last: true, lastInSection: true },
        hiddenCell,
      ]);

      // |  | > | ...
      expect(cellProps[1]).to.deep.equal([
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: false,
        },
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: false,
        },
        { hidden: false, computedColspan: 3, last: false, lastInSection: true },
        hiddenCell,
        hiddenCell,
        { hidden: false, computedColspan: 2, last: false, lastInSection: true },
        hiddenCell,
        { hidden: false, computedColspan: 2, last: true, lastInSection: true },
        hiddenCell,
      ]);

      // |  |   | > | ...
      expect(cellProps[2]).to.deep.equal([
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: false,
        },
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: false,
        },
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: false,
        },
        { hidden: false, computedColspan: 2, last: false, lastInSection: true },
        hiddenCell,
        { hidden: false, computedColspan: 2, last: false, lastInSection: true },
        hiddenCell,
        { hidden: false, computedColspan: 2, last: true, lastInSection: true },
        hiddenCell,
      ]);

      // |  |   |   | content
      // this is the first row that is not a group row
      expect(cellProps[3]).to.deep.equal([
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: false,
        },
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: false,
        },
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: false,
        },
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: false,
        },
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: true,
        },
        // last in locked start
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: false,
        },
        // last in locked start
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: true,
        },
        // last in unlocked
        {
          hidden: false,
          computedColspan: undefined,
          last: false,
          lastInSection: false,
        },
        // last in locked end
        {
          hidden: false,
          computedColspan: undefined,
          last: true,
          lastInSection: true,
        },
      ]);

      expect(cellProps[4]).to.deep.equal(cellProps[3]);

      // |  |   | > | ...
      expect(cellProps[5]).to.deep.equal(cellProps[2]);

      // // content row
      expect(cellProps[6]).to.deep.equal(cellProps[3]);

      // // |  |  > | ...
      expect(cellProps[7]).to.deep.equal(cellProps[1]);

      // // |  |   | > | ...
      expect(cellProps[8]).to.deep.equal(cellProps[2]);

      // content row
      expect(cellProps[9]).to.deep.equal(cellProps[3]);
      expect(cellProps[10]).to.deep.equal(cellProps[3]);

      gridInstance.unmount();
      done();
    }, 20);
  });
});
