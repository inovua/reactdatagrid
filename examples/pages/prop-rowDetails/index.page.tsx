/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DataGrid, { TypeFooterRow } from '@inovua/reactdatagrid-enterprise';

const renderRowDetails = ({ data }) => {
  return (
    <div style={{ padding: 20 }}>
      <h3>Row details:</h3>
      <table>
        {Object.keys(data).map(name => {
          return (
            <tr key={name}>
              <td>{name}</td>
              <td>{data[name]}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

import people from '../people';

const gridStyle = { minHeight: 550, margin: 10 };

const columns = [
  {
    name: 'id',
    type: 'number',
    xdefaultLocked: 'start' as 'start',
    lockedRowCellRender: (value: any) => {
      return value + '!';
    },
  },
  { name: 'firstName', flex: 1, defaultLocked: 'start' as 'start' },
  { name: 'firstName3', flex: 1, defaultLocked: 'end' as 'end' },
  { name: 'firstName1', flex: 1 },
  { name: 'firstName2', flex: 1 },
  { name: 'country', flex: 1 },
  { name: 'age', type: 'number', xdefaultLocked: 'end' as 'end' },
];

const dataSource = people;

const expandedRows = {
  1: true,
  3: true,
};
const App = () => {
  return (
    <DataGrid
      idProperty="id"
      style={gridStyle}
      columns={columns}
      columnMinWidth={300}
      columnMaxWidth={400}
      rowExpandHeight={250}
      defaultExpandedRows={expandedRows}
      licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
      renderRowDetails={renderRowDetails}
      columnDefaultWidth={500}
      dataSource={dataSource}
    />
  );
};
export default () => <App />;
