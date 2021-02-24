/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import DataGrid from '@inovua/reactdatagrid-enterprise';
const columns = [{ name: 'firstName', defaultFlex: 1, header: 'First Name' }];

const people = [
  { id: 1, firstName: 'Paul' },
  { id: 2, firstName: 'Paul' },
  { id: 3, firstName: 'Paul' },
  { id: 4, firstName: 'Paul' },
  { id: 5, firstName: 'Paul' },
  { id: 6, firstName: 'Paul' },
  { id: 7, firstName: 'Paul' },
  { id: 8, firstName: 'Paul' },
  { id: 9, firstName: 'Paul' },
  { id: 10, firstName: 'Paul' },
  { id: 11, firstName: 'Paul' },
  { id: 12, firstName: 'Paul' },
  { id: 13, firstName: 'Paul' },
  { id: 14, firstName: 'Paul' },
  { id: 15, firstName: 'Paul' },
  { id: 16, firstName: 'Paul' },
  { id: 17, firstName: 'Paul' },
  { id: 18, firstName: 'Paul' },
  { id: 19, firstName: 'Paul' },
  { id: 20, firstName: 'Paul' },
  { id: 21, firstName: 'Paul' },
  { id: 22, firstName: 'Paul' },
  { id: 23, firstName: 'Paul' },
  { id: 24, firstName: 'Paul' },
];

const App = () => {
  return (
    <div>
      <DataGrid columns={columns} dataSource={people} style={{ height: 200 }} />
    </div>
  );
};

export default () => <App />;
