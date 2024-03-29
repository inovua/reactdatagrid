import ReactDataGrid from '@inovua/reactdatagrid-enterprise';

const columns = [
  { name: 'name', header: 'Name', minWidth: 50, defaultFlex: 2 },
  { name: 'age', header: 'Age', maxWidth: 1000, defaultFlex: 1 },
];

const gridStyle = { minHeight: 550 };

const dataSource = [
  { id: '123number', name: 'John McQueen', age: 35 },
  { id: '2', name: 'Mary Stones', age: 25 },
  { id: '3', name: 'Robert Fil', age: 27 },
  { id: '4', name: 'Roger Robson', age: 81 },
  { id: '5', name: 'Billary Konwik', age: 18 },
];

const onCopySelectedRowsChange = (selected: any) => {
  console.log(selected);
};

const App = () => {
  return (
    <ReactDataGrid
      defaultCellSelection={{}}
      enableClipboard
      idProperty="id"
      columns={columns}
      dataSource={dataSource}
      style={gridStyle}
      onCopySelectedCellsChange={onCopySelectedRowsChange}
    />
  );
};

export default () => <App />;
