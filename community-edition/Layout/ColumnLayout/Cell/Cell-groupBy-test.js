/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { findDOMNode } from 'react-dom';
import DataGrid from '../../../../src';
import { render } from '../../../testUtils';
import '../../../../style/index.scss';

const GROUP_CELLS_SELECTOR =
  '.InovuaReactDataGrid__cell--group-cell:not(.InovuaReactDataGrid__cell--hidden)';

function simulateMouseEvent(eventType, target) {
  var evt = new MouseEvent(eventType, {
    bubbles: true,
    cancelable: true,
    view: window,
  });
  target.dispatchEvent(evt);
}

describe('DataGrid.groupBy Cell', () => {
  it('should render group cells of correct width, when grid has no scroll', done => {
    const gridInstance = render(
      <DataGrid
        columns={[
          { name: 'firstName', width: 100 },
          { name: 'email', width: 200 },
          { name: 'country', width: 300 },
        ]}
        idProperty="id"
        groupBy={['country']}
        dataSource={[
          {
            firstName: 'john',
            email: 'john@gmail.com',
            id: 1,
            country: 'uk',
          },
          {
            firstName: 'marry',
            email: 'marry@gmail.com',
            id: 2,
            country: 'uk',
          },
          {
            firstName: 'paul',
            email: 'paul@gmail.com',
            id: 3,
            country: 'usa',
          },
        ]}
      />
    );

    setTimeout(() => {
      const countryGroupCells = [
        ...findDOMNode(gridInstance).querySelectorAll(GROUP_CELLS_SELECTOR),
      ];
      expect(countryGroupCells.length).to.equal(4);

      expect(countryGroupCells[1].innerText).to.equal('uk\n');
      expect(countryGroupCells[3].innerText).to.equal('usa\n');

      expect(countryGroupCells[1].offsetWidth).to.equal(300);
      expect(countryGroupCells[3].offsetWidth).to.equal(300);

      gridInstance.unmount();
      done();
    }, 20);
  });

  it('should render group cells of correct width, when grid has scroll & hideGroupByColumns is false', done => {
    const gridInstance = render(
      <DataGrid
        columns={[
          { name: 'firstName', width: 100 },
          { name: 'email', width: 200 },
          { name: 'country', width: 3000 },
        ]}
        hideGroupByColumns={false}
        idProperty="id"
        groupBy={['country']}
        renderGroupTitle={({ value, namePath }) =>
          `${namePath.toString()}: ${value} `
        }
        dataSource={[
          {
            firstName: 'john',
            email: 'john@gmail.com',
            id: 1,
            country: 'uk',
          },
          {
            firstName: 'marry',
            email: 'marry@gmail.com',
            id: 2,
            country: 'uk',
          },
          {
            firstName: 'paul',
            email: 'paul@gmail.com',
            id: 3,
            country: 'usa',
          },
        ]}
      />
    );

    setTimeout(() => {
      const countryGroupCells = [
        ...findDOMNode(gridInstance).querySelectorAll(GROUP_CELLS_SELECTOR),
      ];
      expect(countryGroupCells.length).to.equal(4);

      expect(countryGroupCells[1].innerText).to.equal('country: uk\n');
      expect(countryGroupCells[3].innerText).to.equal('country: usa\n');

      expect(countryGroupCells[1].offsetWidth).to.equal(3300);
      expect(countryGroupCells[3].offsetWidth).to.equal(3300);

      gridInstance.unmount();
      done();
    }, 20);
  });

  it('should expand/collapse group on click on group tool', done => {
    const gridInstance = render(
      <DataGrid
        columns={[
          { name: 'firstName', width: 100 },
          { name: 'email', width: 200 },
          { name: 'country', width: 300 },
        ]}
        idProperty="id"
        groupBy={['country']}
        dataSource={[
          {
            firstName: 'john',
            email: <b className="john">john@gmail.com</b>,
            id: 1,
            country: 'uk',
          },
          {
            firstName: 'marry',
            email: <span className="marry">marry@gmail.com</span>,
            id: 2,
            country: 'uk',
          },
          {
            firstName: 'paul',
            email: <span className="paul">paul@gmail.com</span>,
            id: 3,
            country: 'usa',
          },
        ]}
      />
    );

    setTimeout(() => {
      const gridNode = findDOMNode(gridInstance);
      const countryGroupCells = [
        ...gridNode.querySelectorAll(GROUP_CELLS_SELECTOR),
      ];
      expect(countryGroupCells.length).to.equal(4);

      const expandToolCells = [countryGroupCells[0], countryGroupCells[2]];

      // collapse
      simulateMouseEvent('mousedown', expandToolCells[0].querySelector('svg'));

      // for best consistency, make sure we wait for the event to be dispatched
      // and for the DOM to be updated
      setTimeout(() => {
        const johnNodes = gridNode.querySelectorAll('.john');
        expect(johnNodes.length).to.equal(0);

        // expand
        simulateMouseEvent(
          'mousedown',
          expandToolCells[0].querySelector('svg')
        );

        setTimeout(() => {
          const johnNodes = gridNode.querySelectorAll('.john');
          expect(johnNodes.length).to.equal(1);

          gridInstance.unmount();
          done();
        }, 1);
      }, 1);
    }, 20);
  });
});

describe('DataGrid.groupBy Cell - with locked cells', () => {
  it('should render locked group cells of correct width, when grid has no scroll', done => {
    const gridInstance = render(
      <DataGrid
        columns={[
          { name: 'firstName', width: 100, locked: true },
          { name: 'lastName', width: 200, locked: true },
          { name: 'email', width: 300 },
          { name: 'x', width: 400 },
          { name: 'country', width: 3000 },
        ]}
        idProperty="id"
        groupBy={['country']}
        dataSource={[
          {
            firstName: 'john',
            email: 'john@gmail.com',
            id: 1,
            country: 'uk',
            lastName: 'silas',
          },
          {
            firstName: 'marry',
            email: 'marry@gmail.com',
            id: 2,
            country: 'uk',
            lastName: 'bilas',
          },
          {
            firstName: 'paul',
            email: 'paul@gmail.com',
            id: 3,
            country: 'usa',
            lastName: 'cilas',
          },
        ]}
      />
    );

    setTimeout(() => {
      const countryGroupCells = [
        ...findDOMNode(gridInstance).querySelectorAll(GROUP_CELLS_SELECTOR),
      ];
      expect(countryGroupCells.length).to.equal(6);

      // make sure the first cell in the first group expands to all locked cells
      expect(countryGroupCells[1].offsetWidth).to.equal(300);

      // get the first row
      const row1 = findDOMNode(gridInstance).querySelector(
        '.InovuaReactDataGrid__row'
      );

      // expect the row to have:
      // 1 wrapper for first two locked cells
      // 2 other cells - there are 3 total, but one is hidden, since hideGroupByColumns is true
      expect(row1.children.length).to.equal(3);

      // the first unlocked cell should fill the space reserved for 'email' & 'x' columns
      expect(row1.children[1].offsetWidth).to.equal(700);
      expect(row1.children[1].innerText).to.equal('');

      // the last column should be hidden
      expect(row1.children[2].style.visibility).to.equal('hidden');
      expect(row1.children[2].innerText).to.equal('');

      gridInstance.unmount();
      done();
    }, 20);
  });

  it('should render locked group cells of correct width, when grid has scroll & hideGroupByColumns is false', done => {
    const gridInstance = render(
      <DataGrid
        columns={[
          { name: 'country', width: 3000 },
          { name: 'firstName', width: 100, locked: true },
          { name: 'lastName', width: 200, locked: true },
          { name: 'email', width: 300 },
          { name: 'x', width: 400 },
        ]}
        hideGroupByColumns={false}
        groupNestingSize={40}
        idProperty="id"
        groupBy={['country']}
        dataSource={[
          {
            firstName: 'john',
            email: 'john@gmail.com',
            id: 1,
            country: 'uk',
          },
          {
            firstName: 'marry',
            email: 'marry@gmail.com',
            id: 2,
            country: 'uk',
          },
          {
            firstName: 'paul',
            email: 'paul@gmail.com',
            id: 3,
            country: 'usa',
          },
        ]}
      />
    );

    setTimeout(() => {
      // get the first row
      const row1 = findDOMNode(gridInstance).querySelector(
        '.InovuaReactDataGrid__row'
      );

      // expect the row to have:
      // 1 wrapper for first two locked cells
      // 3 other cells
      expect(row1.children.length).to.equal(4);
      const [one, two, three, four] = row1.children;

      expect(one.children[0].offsetWidth).to.equal(40);
      // the column reserverd for group nesting size
      expect(one.children[1].innerText).to.equal('uk\n');

      // the space for column title
      // expect first unlocked cell to have correct width & no content
      expect(two.innerText).to.equal('');
      expect(two.offsetWidth).to.equal(3700);

      expect(three.style.visibility).to.equal('hidden');
      expect(four.style.visibility).to.equal('hidden');

      gridInstance.unmount();
      done();
    }, 50);
  });
});
