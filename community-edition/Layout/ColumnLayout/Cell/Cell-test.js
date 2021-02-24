/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { findDOMNode } from 'react-dom';
import DataGrid from '../../../../src';
import { wait, render } from '../../../testUtils';
import '../../../../style/index.scss';

describe('DataGrid HeaderCell', () => {
  it('should respect headerEllipsis: false for columns', () => {
    const gridInstance = render(
      <DataGrid
        dataSource={[]}
        columns={[
          {
            name: 'firstName',
            width: 100,
            headerEllipsis: false,
            header: <span className="no-ellipsis">FIRST</span>,
          },
          { name: 'email', flex: 1 },
        ]}
        idProperty="id"
      />
    );

    return wait().then(() => {
      const domNode = findDOMNode(gridInstance);
      const headersWithEllipsis = [
        ...domNode.querySelectorAll(
          '.InovuaReactDataGrid__column-header__content.InovuaReactDataGrid__box--ellipsis'
        ),
      ];

      expect(headersWithEllipsis.length).to.equal(1);
      expect(headersWithEllipsis[0].innerText).to.equal('Email');

      const spanNoEllipsis = [...domNode.querySelectorAll('.no-ellipsis')];
      expect(spanNoEllipsis.length).to.equal(1);
      expect(spanNoEllipsis[0].innerText).to.equal('FIRST');

      gridInstance.unmount();
    });
  });

  it('should respect columnResizeHandleWidth', done => {
    const gridInstance = render(
      <DataGrid
        columnResizeHandleWidth={20}
        dataSource={[]}
        columns={[
          { name: 'firstName', width: 100, resizable: false },
          { name: 'email', flex: 1 },
        ]}
        idProperty="id"
      />
    );

    setTimeout(() => {
      const domNode = findDOMNode(gridInstance);
      const resizeHandles = [
        ...domNode.querySelectorAll(
          '.InovuaReactDataGrid__column-resize-handle'
        ),
      ];

      expect(resizeHandles.length).to.equal(1);
      expect(resizeHandles[0].style.width).to.equal('20px');

      gridInstance.unmount();
      done();
    }, 20);
  });
});
describe('DataGrid Cell', () => {
  it('should render cells of correct width', done => {
    const gridInstance = render(
      <DataGrid
        columns={[
          { name: 'firstName', width: 100 },
          { name: 'email', flex: 1 },
        ]}
        idProperty="id"
        dataSource={[
          { firstName: 'john', email: 'john@gmail.com', id: 1 },
          { firstName: 'marry', email: 'marry@gmail.com', id: 2 },
          { firstName: 'paul', email: 'paul@gmail.com', id: 3 },
        ]}
      />
    );

    setTimeout(() => {
      const rows = [
        ...findDOMNode(gridInstance).querySelectorAll(
          '.InovuaReactDataGrid__row'
        ),
      ];
      expect(rows.length).to.equal(3);

      const [firstCell, secondCell] = rows[0].children;

      expect(getComputedStyle(firstCell).width).to.equal('100px');

      const secondCellComputedStyle = getComputedStyle(secondCell);
      expect(secondCellComputedStyle.width).to.equal('898px');
      // so 900 - 2 to account for default border width
      gridInstance.unmount();
      done();
    }, 50);
  });

  it('should render cells at correct positions, without virtualization', done => {
    const gridInstance = render(
      <DataGrid
        columns={[
          { name: 'firstName', width: 100 },
          { name: 'email', flex: 1 },
        ]}
        rowHeight={40}
        idProperty="id"
        dataSource={[
          { firstName: 'john', email: 'john@gmail.com', id: 1 },
          { firstName: 'marry', email: 'marry@gmail.com', id: 2 },
          { firstName: 'paul', email: 'paul@gmail.com', id: 3 },
        ]}
      />
    );

    setTimeout(() => {
      const rows = [
        ...findDOMNode(gridInstance).querySelectorAll(
          '.InovuaReactDataGrid__row'
        ),
      ];
      const [firstCell, secondCell] = rows[0].children;

      expect(secondCell.getBoundingClientRect().left).to.equal(
        firstCell.getBoundingClientRect().left + 100
      );

      expect(getComputedStyle(secondCell).position).to.equal('relative');

      gridInstance.unmount();
      done();
    }, 50);
  });

  it('should render cells at correct positions with virtualization', done => {
    const gridInstance = render(
      <DataGrid
        columns={[
          { name: 'firstName', width: 100 },
          { name: 'email', flex: 1 },
        ]}
        virtualizeColumns
        rowHeight={40}
        idProperty="id"
        dataSource={[
          { firstName: 'john', email: 'john@gmail.com', id: 1 },
          { firstName: 'marry', email: 'marry@gmail.com', id: 2 },
          { firstName: 'paul', email: 'paul@gmail.com', id: 3 },
        ]}
      />
    );

    setTimeout(() => {
      const rows = [
        ...findDOMNode(gridInstance).querySelectorAll(
          '.InovuaReactDataGrid__row'
        ),
      ];
      const [firstCell, secondCell] = rows[0].children;

      expect(secondCell.getBoundingClientRect().left).to.equal(
        firstCell.getBoundingClientRect().left + 100
      );

      const secondPosition = getComputedStyle(secondCell).position;
      expect(secondPosition === 'absolute').to.equal(true);
      expect(secondCell.style.transform).to.equal(
        'translate3d(100px, 0px, 0px)'
      );

      gridInstance.unmount();
      done();
    }, 50);
  });

  it('should render virtualized cells when columns.length >= virtualizeColumnsThreshold', done => {
    const gridInstance = render(
      <DataGrid
        columns={[
          { name: 'firstName', width: 100 },
          { name: 'email', flex: 1 },
        ]}
        virtualizeColumnsThreshold={2}
        idProperty="id"
        rowHeight={40}
        dataSource={[
          { firstName: 'john', email: 'john@gmail.com', id: 1 },
          { firstName: 'marry', email: 'marry@gmail.com', id: 2 },
          { firstName: 'paul', email: 'paul@gmail.com', id: 3 },
        ]}
      />
    );

    setTimeout(() => {
      const rows = [
        ...findDOMNode(gridInstance).querySelectorAll(
          '.InovuaReactDataGrid__row'
        ),
      ];
      const secondCell = rows[0].children[1];

      expect(getComputedStyle(secondCell).position).to.equal('absolute');
      expect(secondCell.style.transform).to.equal(
        'translate3d(100px, 0px, 0px)'
      );

      gridInstance.unmount();
      done();
    }, 50);
  });

  it('should render unvirtualized cells when columns.length < virtualizeColumnsThreshold', done => {
    const gridInstance = render(
      <DataGrid
        columns={[
          { name: 'firstName', width: 100 },
          { name: 'email', flex: 1 },
        ]}
        rowHeight={40}
        virtualizeColumnsThreshold={3}
        idProperty="id"
        dataSource={[
          { firstName: 'john', email: 'john@gmail.com', id: 1 },
          { firstName: 'marry', email: 'marry@gmail.com', id: 2 },
          { firstName: 'paul', email: 'paul@gmail.com', id: 3 },
        ]}
      />
    );

    setTimeout(() => {
      const rows = [
        ...findDOMNode(gridInstance).querySelectorAll(
          '.InovuaReactDataGrid__row'
        ),
      ];
      const secondCell = rows[0].children[1];

      expect(getComputedStyle(secondCell).position).to.equal('relative');

      gridInstance.unmount();
      done();
    }, 50);
  });

  it('should respect textEllipsis: false & headerEllipsis: false', done => {
    const gridInstance = render(
      <DataGrid
        columns={[
          {
            name: 'firstName',
            defaultWidth: 100,
            header: () => <span className="header-noellipsis">First Name</span>,
            headerEllipsis: false,
            textEllipsis: false,
            render: ({ value }) => <span className="noellipsis">{value}</span>,
          },
          {
            name: 'email',
            flex: 1,
            header: () => <span className="header-ellipsis">Email</span>,
            render: ({ value }) => <span className="ellipsis">{value}</span>,
          },
        ]}
        virtualizeColumnsThreshold={3}
        idProperty="id"
        dataSource={[
          { firstName: 'john', email: 'john@gmail.com', id: 1 },
          { firstName: 'marry', email: 'marry@gmail.com', id: 2 },
          { firstName: 'paul', email: 'paul@gmail.com', id: 3 },
        ]}
      />
    );

    setTimeout(() => {
      const noEllipsisCells = [
        ...findDOMNode(gridInstance).querySelectorAll('.noellipsis'),
      ];
      const ellipsisCells = [
        ...findDOMNode(gridInstance).querySelectorAll('.ellipsis'),
      ];

      expect(noEllipsisCells.length).to.equal(3);
      expect(ellipsisCells.length).to.equal(3);

      const hasEllipsis = node =>
        getComputedStyle(node.parentElement)['text-overflow'] === 'ellipsis';

      expect(noEllipsisCells.map(hasEllipsis)).to.deep.equal([
        false,
        false,
        false,
      ]);
      expect(ellipsisCells.map(hasEllipsis)).to.deep.equal([true, true, true]);

      const noEllipsisHeaderCells = [
        ...findDOMNode(gridInstance).querySelectorAll('.header-noellipsis'),
      ];
      const ellipsisHeaderCells = [
        ...findDOMNode(gridInstance).querySelectorAll('.header-ellipsis'),
      ];

      expect(noEllipsisHeaderCells.length).to.equal(1);
      expect(ellipsisHeaderCells.length).to.equal(1);

      expect(noEllipsisHeaderCells.map(hasEllipsis)).to.deep.equal([false]);
      expect(ellipsisHeaderCells.map(hasEllipsis)).to.deep.equal([true]);

      gridInstance.unmount();
      done();
    }, 50);
  });
});
