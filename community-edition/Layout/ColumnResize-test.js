/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { findDOMNode } from 'react-dom';
import assign from 'object-assign';
import DataGrid from '../';
import { render } from '../testUtils';
import '../../style/index.scss';

const fakeEvent = props => {
  return assign(
    {
      stopPropagation: () => {},
      preventDefault: () => {},
    },
    props
  );
};

const dragSetup = (gridInstance, { index: colIndex, diff }, dropProps) => {
  const body = gridInstance.body;
  const header = body.columnLayout.headerLayout.header;
  const headerNode = findDOMNode(header);
  const headers = [...headerNode.children];

  const firstFlexIndex = body.props.visibleColumns.reduce((index, col, i) => {
    if (col.flex != null && index == -1) {
      return i;
    }
    return index;
  }, -1);

  return {
    headers,
    headerNode,
    drag: () => {
      const colHeaderNode = headers[colIndex];
      const currentTarget = colHeaderNode.querySelector(
        '.InovuaReactDataGrid__column-resize-handle'
      );

      const shareSpace =
        dropProps && dropProps.shareSpace !== undefined
          ? dropProps.shareSpace
          : gridInstance.props.shareSpaceOnResize;

      const initialSize = parseInt(colHeaderNode.style.width, 10);
      const nextColumn = headers[colIndex + 1];
      const nextColumnSize = nextColumn
        ? parseInt(nextColumn.style.width, 10)
        : null;

      body.columnLayout.onResizeMouseDown(
        {
          visibleIndex: colIndex,
        },
        {
          colHeaderNode: headers[colIndex],
          event: fakeEvent({ currentTarget }),
        }
      );

      body.columnLayout.onResizeDrop(
        assign(
          {},
          {
            index: colIndex,
            offset: 0,
            diff,
            size: initialSize + diff,
            nextColumnSize: shareSpace ? nextColumnSize - diff : nextColumnSize,
            firstFlexIndex,
            shareSpace,
          },
          dropProps
        )
      );
    },
  };
};

describe('DataGrid Column resize (no groups)', () => {
  it('should correctly resize a flex column with keepFlex', done => {
    const columns = [
      { name: 'firstName' },
      { name: 'lastName' },
      { name: 'age', flex: 1, keepFlex: true },
      { name: 'email' },
    ];
    const dataSource = [{ firstName: 'john', email: 'john@gmail.com', id: 1 }];

    let resizeColumn = [];
    let resizeSize = [];
    let resizeFlex = [];
    const onColumnResize = ({ column, size, flex }) => {
      resizeColumn.push(column);
      resizeSize.push(size);
      resizeFlex.push(flex);
    };
    const gridInstance = render(
      <DataGrid
        onColumnResize={onColumnResize}
        dataSource={dataSource}
        idProperty="id"
        style={{ width: 900 }}
        columnDefaultWidth={100}
        columns={columns}
      />
    );

    setTimeout(() => {
      const { headers, drag } = dragSetup(
        gridInstance,
        { index: 2, diff: -98 },
        { shareSpace: true, size: null }
      );

      expect(headers.map(h => h.style.width)).to.eql([
        '100px',
        '100px',
        '598px',
        // we have 900px available, 3x100px cols and left-right borders of 1px each
        // so 598 remaining space
        '100px',
      ]);

      drag();

      expect(headers.map(h => h.style.width)).to.eql([
        '100px',
        '100px',
        '500px',
        '198px',
      ]);

      expect(resizeColumn[0].name).to.equal('email');
      expect(resizeSize[0]).to.equal(198);
      expect(resizeFlex[0]).to.equal(false);

      expect(resizeColumn[1].name).to.equal('age');
      expect(resizeSize[1]).to.equal(500);
      expect(resizeFlex[1]).to.equal(true);

      expect(resizeFlex.length).to.equal(2);

      const g = gridInstance.rerender(
        <DataGrid
          dataSource={dataSource}
          idProperty="id"
          style={{ width: 1000 }}
          columnDefaultWidth={100}
          columns={columns}
        />
      );

      expect(g).to.equal(gridInstance);

      // the flex column should still take up the space, even if it was
      // resized, since it has keepFlex: true
      setTimeout(() => {
        expect(headers.map(h => h.style.width)).to.eql([
          '100px',
          '100px',
          '600px',
          '198px',
        ]);

        gridInstance.unmount();
        done();
      }, 50);
    }, 20);
  });

  it('should correctly resize a flex column without keepFlex', done => {
    const columns = [
      { name: 'firstName' },
      { name: 'lastName' },
      { name: 'age', flex: 1 },
      { name: 'email' },
    ];
    const dataSource = [{ firstName: 'john', email: 'john@gmail.com', id: 1 }];

    let resizeColumn = [];
    let resizeSize = [];
    let resizeFlex = [];
    const onColumnResize = ({ column, size, flex }) => {
      resizeColumn.push(column);
      resizeSize.push(size);
      resizeFlex.push(flex);
    };
    const gridInstance = render(
      <DataGrid
        onColumnResize={onColumnResize}
        dataSource={dataSource}
        idProperty="id"
        style={{ width: 900 }}
        columnDefaultWidth={100}
        columns={columns}
      />
    );

    setTimeout(() => {
      const { headers, drag } = dragSetup(
        gridInstance,
        { index: 2, diff: -98 },
        { shareSpace: false, size: null }
      );

      expect(headers.map(h => h.style.width)).to.eql([
        '100px',
        '100px',
        '598px',
        // we have 900px available, 3x100px cols and left-right borders of 1px each
        // so 598 remaining space
        '100px',
      ]);
      drag();

      expect(headers.map(h => h.style.width)).to.eql([
        '100px',
        '100px',
        '500px',
        '100px',
      ]);

      expect(resizeColumn[0].name).to.equal('age');
      expect(resizeSize[0]).to.equal(500);
      expect(resizeFlex[0]).to.equal(true);

      expect(resizeColumn.length).to.equal(1);

      gridInstance.unmount();
      done();
    }, 20);
  });

  it('should correctly resize a flex column', done => {
    const columns = [
      { name: 'firstName' },
      { name: 'lastName' },
      { name: 'age', flex: 1 },
      { name: 'email' },
    ];
    const dataSource = [{ firstName: 'john', email: 'john@gmail.com', id: 1 }];

    const gridInstance = render(
      <DataGrid
        dataSource={dataSource}
        idProperty="id"
        style={{ width: 1000 }}
        columnDefaultWidth={100}
        columns={columns}
      />
    );

    setTimeout(() => {
      const { headers, drag } = dragSetup(gridInstance, {
        index: 2,
        diff: -98,
      });

      expect(headers.map(h => h.style.width)).to.eql([
        '100px',
        '100px',
        '698px',
        // we have 1000px available, 3x100px cols and left-right borders of 1px each
        // so 698 remaining space
        '100px',
      ]);

      drag();

      expect(headers.map(h => h.style.width)).to.eql([
        '100px',
        '100px',
        '600px',
        '100px',
      ]);

      gridInstance.rerender(
        <DataGrid
          dataSource={dataSource}
          idProperty="id"
          style={{ width: 900 }}
          columnDefaultWidth={100}
          columns={columns}
        />
      );

      // the flex column should be 100px less when total available grid width is 900 instead of 1000px which was initial
      setTimeout(() => {
        expect(headers.map(h => h.style.width)).to.eql([
          '100px',
          '100px',
          '500px',
          '100px',
        ]);
        gridInstance.unmount();
        done();
      }, 50);
    }, 20);
  });

  it('should correctly resize a nonflex column, with a flex sibling and shareSpaceOnResize', done => {
    const columns = [
      { name: 'firstName' },
      { name: 'lastName' },
      { name: 'age', flex: 1 },
      { name: 'email' },
    ];
    const dataSource = [{ firstName: 'john', email: 'john@gmail.com', id: 1 }];

    const gridInstance = render(
      <DataGrid
        dataSource={dataSource}
        idProperty="id"
        style={{ width: 900 }}
        columnDefaultWidth={100}
        columns={columns}
        shareSpaceOnResize
      />
    );

    setTimeout(() => {
      const { headers, drag } = dragSetup(gridInstance, {
        index: 1,
        diff: -30,
      });

      expect(headers.map(h => h.style.width)).to.eql([
        '100px',
        '100px',
        '598px',
        // we have 900px available, 3x100px cols and left-right borders of 1px each
        // so 598 remaining space
        '100px',
      ]);

      drag();

      expect(headers.map(h => h.style.width)).to.eql([
        '100px',
        '70px',
        '628px',
        '100px',
      ]);

      gridInstance.rerender(
        <DataGrid
          dataSource={dataSource}
          idProperty="id"
          style={{ width: 1000 }}
          columnDefaultWidth={100}
          shareSpaceOnResize
          columns={columns}
        />
      );

      // after the resize, the flex column should take all available space
      setTimeout(() => {
        expect(headers.map(h => h.style.width)).to.eql([
          '100px',
          '70px',
          '728px',
          '100px',
        ]);
        gridInstance.unmount();
        done();
      }, 50);
    }, 20);
  });

  it('should correctly resize columns in a simple case - all non-flex columns, shareSpaceOnResize=false', done => {
    const gridInstance = render(
      <DataGrid
        dataSource={[{ firstName: 'john', email: 'john@gmail.com', id: 1 }]}
        idProperty="id"
        columnDefaultWidth={100}
        columns={[
          { name: 'firstName' },
          { name: 'lastName' },
          { name: 'age' },
          { name: 'email' },
        ]}
      />
    );

    setTimeout(() => {
      const { headers, drag } = dragSetup(gridInstance, {
        index: 1,
        diff: 69,
      });

      expect(headers.map(h => h.style.width)).to.eql([
        '100px',
        '100px',
        '100px',
        '100px',
      ]);

      drag();

      expect(headers.map(h => h.style.width)).to.eql([
        '100px',
        '169px',
        '100px',
        '100px',
      ]);

      const { drag: dragAgain } = dragSetup(gridInstance, {
        index: 1,
        diff: 31,
      });
      dragAgain();

      expect(headers.map(h => h.style.width)).to.eql([
        '100px',
        '200px',
        '100px',
        '100px',
      ]);

      gridInstance.unmount();
      done();
    }, 20);
  });

  it('should correctly resize columns with shareSpaceOnResize', done => {
    const gridInstance = render(
      <DataGrid
        shareSpaceOnResize
        dataSource={[{ firstName: 'john', email: 'john@gmail.com', id: 1 }]}
        idProperty="id"
        columnDefaultWidth={200}
        columns={[
          { name: 'firstName' },
          { name: 'lastName' },
          { name: 'age' },
          { name: 'email' },
        ]}
      />
    );

    setTimeout(() => {
      const { headers, drag } = dragSetup(gridInstance, {
        index: 1,
        diff: 50,
      });

      expect(headers.map(h => h.style.width)).to.eql([
        '200px',
        '200px',
        '200px',
        '200px',
      ]);

      drag();

      expect(headers.map(h => h.style.width)).to.eql([
        '200px',
        '250px',
        '150px',
        '200px',
      ]);
      gridInstance.unmount();
      done();
    }, 20);
  });
});
