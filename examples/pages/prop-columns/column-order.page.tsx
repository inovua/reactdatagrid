/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DataGrid from '@inovua/reactdatagrid-enterprise';

import people from '../people';

const gridStyle = { height: '80vh', margin: 20 };

const columns = [
  { name: 'id', type: 'number', defaultWidth: 80 },
  { name: 'firstName', defaultFlex: 1, xdefaultLocked: 'start' },
  { name: 'country', defaultFlex: 1, xdefaultLocked: 'end' },
  { name: 'age', type: 'number', defaultFlex: 1 },
  {
    id: 'desc',
    header: 'Description',
    defaultFlex: 2,
    render: ({ data }) =>
      data.firstName + ', aged: ' + data.age + '. Lives in ' + data.country,
  },
];

const App = () => {
  const [columnOrder, setColumnOrder] = React.useState<string[]>([
    'firstName',
    'age',
  ]);

  return (
    <>
      <button
        onClick={() => {
          setColumnOrder(['firstName', 'age']);
        }}
      >
        firstName, age
      </button>
      <button
        onClick={() => {
          setColumnOrder(['firstName', 'age', 'id']);
        }}
      >
        firstName, age, id
      </button>
      <DataGrid
        idProperty="id"
        style={gridStyle}
        theme="default-light"
        licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
        columns={columns}
        columnOrder={columnOrder}
        onColumnOrderChange={setColumnOrder}
        dataSource={people}
      />
    </>
  );
};

export default () => <App />;
