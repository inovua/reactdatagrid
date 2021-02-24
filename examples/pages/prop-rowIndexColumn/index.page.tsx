/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DataGrid from '@inovua/reactdatagrid-community';

import people from '../people';

const gridStyle = { minHeight: 350, margin: 20 };

const columns = [
  { name: 'id', type: 'number', autoLock: true, defaultWidth: 80 },
  { name: 'firstName', defaultFlex: 1, draggable: false },
  { name: 'country', defaultFlex: 1 },
  { name: 'country1', defaultFlex: 1 },
  { name: 'country2', defaultFlex: 1 },
  { name: 'country3', defaultFlex: 1 },
  { name: 'country4', defaultFlex: 1 },
  { name: 'country5', defaultFlex: 1 },
  { name: 'country6', defaultFlex: 1 },
  { name: 'country7', defaultFlex: 1 },
  { name: 'country8', defaultFlex: 1 },
  { name: 'country9', defaultFlex: 1 },
  { name: 'country10', defaultFlex: 1 },
  { name: 'country11', defaultFlex: 1 },
  { name: 'country12', defaultFlex: 1 },
  { name: 'age', type: 'number', defaultFlex: 1 },
];

const dataSource = people.map(x => ({ ...x }));

const App = () => {
  return (
    <div style={{ minHeight: '200vh' }}>
      <DataGrid
        columns={columns}
        idProperty="id"
        style={gridStyle}
        dataSource={dataSource}
        editable={true}
        defaultCellSelection={[]}
        licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
        checkboxColumn={false}
        rowIndexColumn={true}
        onRowReorder={true}
        defaultGroupBy={[]}
        maxRowHeight={150}
        minRowHeight={20}
      />
    </div>
  );
};
export default () => <App />;
