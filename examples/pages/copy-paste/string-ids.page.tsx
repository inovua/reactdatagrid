import React from 'react';

import ReactDataGrid from '@inovua/reactdatagrid-enterprise';

const columns = [
  { name: 'name', header: 'Name', minWidth: 50, defaultFlex: 2 },
  { name: 'age', header: 'Age', maxWidth: 1000, defaultFlex: 1 },
];

const gridStyle = { minHeight: 550 };

const dataSource = [
  { id: 'a', name: 'John McQueen', age: 35 },
  { id: 'b', name: 'Mary Stones', age: 25 },
  { id: 'c', name: 'Robert Fil', age: 27 },
  { id: 'd', name: 'Roger Robson', age: 81 },
  { id: 'e', name: 'Billary Konwik', age: 18 },
];

const App = () => {
  return (
    <ReactDataGrid
      defaultCellSelection={{}}
      enableClipboard
      idProperty="id"
      columns={columns}
      dataSource={dataSource}
      style={gridStyle}
    />
  );
};

export default () => <App />;
