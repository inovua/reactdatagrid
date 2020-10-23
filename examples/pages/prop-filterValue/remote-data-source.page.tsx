import React, { useState, useCallback } from 'react';

import ReactDataGrid from '@inovua/reactdatagrid-enterprise';

const DATASET_URL: string = 'https://demos.reactdatagrid.io/api/v1';

const gridStyle = { minHeight: 550, marginTop: 10 };

const columns = [
  {
    name: 'id',
    type: 'number',
    maxWidth: 40,
    header: 'ID',
    defaultVisible: false,
  },
  { name: 'firstName', defaultFlex: 2, header: 'First Name' },
  { name: 'lastName', defaultFlex: 2, header: 'Last Name' },
  { name: 'email', defaultFlex: 3, header: 'Email' },
];

const loadData = ({ skip, limit, sortInfo, filterValue }) => {
  const url =
    DATASET_URL +
    '/contacts?skip=' +
    skip +
    '&limit=' +
    limit +
    (sortInfo ? '&sortInfo=' + JSON.stringify(sortInfo) : '') +
    '&filterBy=' +
    JSON.stringify(filterValue);

  return fetch(url).then(response => {
    const totalCount = response.headers.get('X-Total-Count');
    return response.json().then(data => {
      return Promise.resolve({ data, count: parseInt(totalCount) });
    });
  });
};

const defaultFilterValue = [
  {
    name: 'firstName',
    type: 'string',
    value: '',
    operator: 'startsWith',
  },
];

const App = () => {
  const dataSource = useCallback(loadData, []);

  return (
    <div>
      <h3>Remote data and pagination example</h3>
      <ReactDataGrid
        idProperty="id"
        style={gridStyle}
        columns={columns}
        licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
        defaultFilterValue={defaultFilterValue}
        pagination
        dataSource={dataSource}
        defaultLimit={10}
      />
    </div>
  );
};

export default () => <App />;
