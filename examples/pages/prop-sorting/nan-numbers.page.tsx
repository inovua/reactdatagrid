import React from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-enterprise';

const columns = [
  { name: 'name', header: 'Name', minWidth: 50, defaultFlex: 2 },
  {
    type: 'number',
    name: 'age',
    header: 'Age',
    maxWidth: 1000,
    defaultFlex: 1,
  },
];

const dataSource = [
  { id: 1, name: 'John McQueen', age: 22 },
  { id: 2, name: 'Mary Stones', age: 2 },
  { id: 3, name: 'Robert Fil', age: NaN },
  { id: 4, name: 'Cory Smith', age: 1 },
  { id: 5, name: 'Jim James', age: NaN },
  { id: 6, name: 'Abe Lincoln', age: 36 },
  { id: 7, name: 'Steven Book', age: 41 },
  { id: 8, name: 'John Jerry', age: 2 },
  { id: 9, name: 'David Heinz', age: 88 },
  { id: 10, name: 'Elizabeth Matthews', age: 11 },
];

const App = () => {
  return (
    <ReactDataGrid
      idProperty="id"
      columns={columns}
      dataSource={dataSource}
      style={{ minHeight: 500 }}
    />
  );
};

export default () => <App />;
