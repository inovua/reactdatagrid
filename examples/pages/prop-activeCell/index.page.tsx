/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';

import DataGrid from '@inovua/reactdatagrid-enterprise';

const gridStyle = { minHeight: 400 };

const DEFAULT_ACTIVE_CELL = [0, 3];

const cols = 'abcdefghijklmnopqrstuvwxyz';
const columns = cols.split('').map(letter => {
  return {
    defaultWidth: 100,
    header: letter.toUpperCase(),
    name: letter,
  };
});

const initialData = [...new Array(100)].map((_, index) => {
  const result = {
    id: index,
  };

  cols.split('').map(letter => {
    result[letter] = letter.toUpperCase() + (index + 1);
  });

  return result;
});

const App = () => {
  let inEdit;
  const [gridRef, setGridRef] = useState(null);
  const [dataSource, setDataSource] = useState(initialData);

  const onEditStart = () => {
    inEdit = true;
  };

  const onEditStop = () => {
    requestAnimationFrame(() => {
      inEdit = false;
      gridRef.current.focus();
    });
  };

  const onKeyDown = event => {
    if (inEdit) {
      return;
    }

    const grid = gridRef.current;
    let [rowIndex, colIndex] = grid.computedActiveCell;

    if (event.key === ' ' || event.key === 'Enter') {
      const column = grid.getColumnBy(colIndex);
      if (!column) {
        return;
      }
      grid.startEdit({ columnId: column.name, rowIndex });
      event.preventDefault();
      return;
    }
    if (event.key !== 'Tab') {
      return;
    }
    event.preventDefault();
    event.stopPropagation();

    const direction = event.shiftKey ? -1 : 1;

    const columns = grid.visibleColumns;
    const rowCount = grid.count;

    colIndex += direction;
    if (colIndex === -1) {
      colIndex = columns.length - 1;
      rowIndex -= 1;
    }
    if (colIndex === columns.length) {
      rowIndex += 1;
      colIndex = 0;
    }
    if (rowIndex < 0 || rowIndex === rowCount) {
      return;
    }

    grid.setActiveCell([rowIndex, colIndex]);
  };

  const onEditComplete = ({ value, columnId, rowIndex }) => {
    const data = [...dataSource];
    data[rowIndex] = Object.assign({}, data[rowIndex], { [columnId]: value });

    setDataSource(data);
  };

  return (
    <div>
      <h3>Grid with Excel-like cell navigation</h3>
      <DataGrid
        onReady={gridApiRef => setGridRef(gridApiRef)}
        idProperty="id"
        style={gridStyle}
        rowIndexColumn
        showZebraRows={false}
        rowHeight={40}
        defaultActiveCell={DEFAULT_ACTIVE_CELL}
        onEditComplete={onEditComplete}
        onEditStart={onEditStart}
        onEditStop={onEditStop}
        editable={true}
        licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
        columns={columns}
        dataSource={dataSource}
      />
    </div>
  );
};
export default () => <App />;
