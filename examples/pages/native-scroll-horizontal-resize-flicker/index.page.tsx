/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from 'react';

import DataGrid from '@inovua/reactdatagrid-enterprise';

import people from '../people';

const gridStyle = { minHeight: 600 };

const defaultColumns = [
  {
    name: 'id',
    header: 'Id',
    defaultVisible: false,
    type: 'number',
    defaultWidth: 120,
  },
  { name: 'firstName', header: 'Name', defaultWidth: 120 },
  {
    name: 'country',
    header: 'Country',
    defaultWidth: 100,
  },
  { name: 'age', header: 'Age', defaultWidth: 120 },
];

const App = () => {
  const [width, setWidth] = React.useState(700);

  return (
    <>
      <button
        onClick={() => {
          setWidth(width === 500 ? 700 : 500);
        }}
        style={{ marginBottom: 20 }}
      >
        Click Me
      </button>
      <div
        style={{
          width,
        }}
      >
        <DataGrid
          idProperty="id"
          style={gridStyle}
          licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
          columns={defaultColumns}
          dataSource={people}
          nativeScroll
        />
      </div>
    </>
  );
};

export default () => <App />;
