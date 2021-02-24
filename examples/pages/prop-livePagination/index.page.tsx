/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DataGrid from '@inovua/reactdatagrid-enterprise';

const DATASET_URL = 'https://demos.reactdatagrid.io/api/v1/';

const gridStyle = { minHeight: '70vh', margin: 20 };
const columns = [
  { name: 'id', type: 'number', maxWidth: 40 },
  { name: 'lastName', header: 'Name', defaultFlex: 2 },
  { name: 'firstName', header: 'First', defaultFlex: 2 },
  { name: 'email', defaultFlex: 3 },
];

const defaultFilterValue = [
  {
    name: 'firstName',
    type: 'string',
    value: '',
    operator: 'contains',
  },
];

const dataSource = ({ skip, sortInfo, limit, filterValue }) =>
  fetch(
    DATASET_URL +
      '/contacts?skip=' +
      skip +
      '&limit=' +
      limit +
      '&filterBy=' +
      JSON.stringify(filterValue) +
      '&sortInfo=' +
      JSON.stringify(sortInfo)
  ).then(response => {
    const totalCount = response.headers.get('X-Total-Count');
    return response.json().then(data => {
      return { data, count: parseInt(totalCount) };
    });
  });
const App = () => {
  return (
    <div style={{ height: '200vh' }}>
      <DataGrid
        idProperty="id"
        style={gridStyle}
        defaultLimit={15}
        columns={columns}
        handle={x => {
          (global as any).x = x;
        }}
        livePagination
        licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
        defaultFilterValue={defaultFilterValue}
        dataSource={dataSource}
      />
    </div>
  );
};

export default () => <App />;
