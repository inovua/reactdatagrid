/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DataGrid, {
  TypeFooterRow,
  TypeLockedRow,
} from '@inovua/reactdatagrid-enterprise';

import people from '../people';

const gridStyle = { minHeight: 550, margin: 10 };

const columns = [
  {
    name: 'id',
    type: 'number',
    defaultLocked: 'start' as 'start',
    lockedRowCellRender: (value: any) => {
      return value + '!';
    },
  },
  { name: 'firstName', flex: 1, defaultLocked: 'start' as 'start' },
  { name: 'firstName3', flex: 1, defaultLocked: 'end' as 'end' },
  { name: 'firstName1', flex: 1, minWidth: 700 },
  { name: 'firstName2', flex: 1, minWidth: 700 },
  { name: 'country', flex: 1, minWidth: 700 },
  { name: 'age', type: 'number', defaultLocked: 'end' as 'end' },
];

const dataSource = people;

const footerRows: TypeFooterRow[] = [
  {
    render: {
      id: <b>xxX</b>,
      firstName1: 'one',
      firstName: <b>First </b>,
      country: 'ccc',
      age: (value, { computedSummary: summary }) => {
        return (
          <div>
            AGE: <br /> avg - {summary}
          </div>
        );
      },
    },

    cellStyle: {
      color: 'red',
    },
  },
  {
    render: {
      id: 'y',
      firstName: 'firstname',
      country: 'ccc',
      age: 12,
      firstName3: 'fn3',
    },
  },
];
const lockedRows: TypeLockedRow[] = [
  {
    position: 'start',
    render: {
      id: <b>xxX</b>,
      firstName1: 'one',
      firstName: <b>First </b>,
      country: 'ccc',
      age: (value, { computedSummary: summary }) => {
        return (
          <div>
            AGE: <br /> avg - {summary}
          </div>
        );
      },
    },

    cellStyle: {
      color: 'red',
    },
  },
  {
    render: {
      id: 'y',
      firstName: 'firstname',
      country: 'ccc',
      age: 12,
      firstName3: 'fn3',
    },
  },
];
const App = () => {
  return (
    <DataGrid
      idProperty="id"
      style={gridStyle}
      columns={columns}
      columnMinWidth={300}
      columnMaxWidth={400}
      footerCellClassName={x => {
        return `cls`;
      }}
      defaultGroupBy={[]}
      summaryReducer={{
        initialValue: 0,
        reducer: (acc, item) => acc + (item.age || 0),
        complete: (summary, data) => (data.length ? summary / data.length : 0),
      }}
      showCellBorders={true}
      rtl={false}
      pagination
      hideGroupByColumns={false}
      showEmptyRows
      showHoverRows
      licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
      columnDefaultWidth={500}
      footerRows={footerRows}
      lockedRows={lockedRows}
      theme="default-light"
      dataSource={dataSource}
    />
  );
};
export default () => <App />;
