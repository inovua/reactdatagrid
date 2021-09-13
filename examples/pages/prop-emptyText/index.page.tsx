import React, { useState } from 'react';
import ReactDataGrid from '../../../enterprise-edition';

const gridStyle = { minHeight: 550 };

const emptyText = (
  <b
    style={{
      padding: 8,
      border: '1px solid #7986cb',
      color: '#ef9a9a',
      borderRadius: 4,
    }}
  >
    No contents here !!!
  </b>
);

const columns = [
  { name: 'id', type: 'number', header: 'Id', defaultVisible: false },
  { name: 'name', defaultFlex: 1, minWidth: 80, header: 'Name' },
  { name: 'country', defaultFlex: 1, minWidth: 80, header: 'Country' },
  { name: 'city', defaultFlex: 1, minWidth: 80, header: 'City' },
  { name: 'age', minWidth: 80, type: 'number', header: 'Age' },
];

const App = () => {
  const [data, setData] = useState([]);

  return (
    <div>
      <ReactDataGrid
        idProperty="id"
        theme="default-dark"
        licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
        style={gridStyle}
        // emptyText={emptyText}
        columns={columns}
        dataSource={data}
      />
    </div>
  );
};

export default () => <App />;
