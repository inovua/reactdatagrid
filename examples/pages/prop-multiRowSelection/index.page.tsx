/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';

import DataGrid from '@inovua/reactdatagrid-enterprise';

import people from '../people';

const gridStyle = { minHeight: 350 };

const columns = [
  { name: 'id', type: 'number', defaultWidth: 80 },
  { name: 'firstName', flex: 1 },
  { name: 'country', flex: 1 },
  { name: 'age', type: 'number', flex: 1, defaultLocked: 'end' },
];

const dataSource = people;

const App = () => {
  return (
    <DataGrid
      columns={columns}
      idProperty="id"
      style={gridStyle}
      licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
      dataSource={dataSource}
      defaultSelected={{ 3: true, 5: true }}
      checkboxColumn
    />
  );
};
export default () => <App />;
