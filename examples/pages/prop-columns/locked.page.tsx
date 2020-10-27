/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DataGrid from '@inovua/reactdatagrid-enterprise';

import people from '../people';

const gridStyle = { minHeight: '80vh', margin: 20 };

const times = (arr, n) => {
  const result = [];

  for (var i = 0; i < n; i++) {
    result.push(
      ...arr.map(x => {
        return {
          ...x,
          id: `${i}-${x.id}`,
        };
      })
    );
  }

  return result;
};
const defaultGroupBy = ['country'];

const defaultCellSelection = { '0-4,id': true, '0-4,desc': true };
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { name: 'id', type: 'number', defaultWidth: 80, defaultLocked: 'end' },
        { name: 'firstName', defaultFlex: 1, defaultLocked: 'start' },
        { name: 'country', defaultFlex: 1, defaultLocked: 'end' },
        { name: 'age', type: 'number', defaultLocked: 'start' },
        {
          id: 'test1',
          header: 'test1',
          render: ({ rowIndex }) => `test1 ${rowIndex}`,
        },
        {
          id: 'test2',
          header: 'test2',
          render: ({ rowIndex }) => `test2 ${rowIndex}`,
        },
        {
          id: 'test3',
          header: 'test3',
          colspan: () => 1,
          render: ({ rowIndex }) => `test3 ${rowIndex}`,
        },
        {
          id: 'test4',
          header: 'test4',
          render: ({ rowIndex }) => `test4 ${rowIndex}`,
        },
        {
          id: 'test5',
          header: 'test5',
          render: ({ rowIndex }) => `test5 ${rowIndex}`,
        },
        {
          id: 'test6',
          header: 'test6',
          render: ({ rowIndex }) => `test6 ${rowIndex}`,
        },
        {
          id: 'test7',
          header: 'test7',
          render: ({ rowIndex }) => `test7 ${rowIndex}`,
        },
        {
          id: 'test8',
          header: 'test8',
          render: ({ rowIndex }) => `test8 ${rowIndex}`,
        },
        {
          id: 'test9',
          header: 'test9',
          render: ({ rowIndex }) => `test9 ${rowIndex}`,
        },
        {
          id: 'test10',
          header: 'test10',
          render: ({ rowIndex }) => `test10 ${rowIndex}`,
        },
        {
          id: 'test11',
          header: 'test11',
          render: ({ rowIndex }) => `test11 ${rowIndex}`,
        },
        {
          id: 'test12',
          header: 'test12',
          render: ({ rowIndex }) => `test12 ${rowIndex}`,
        },
        {
          id: 'test13',
          header: 'test13',
          render: ({ rowIndex }) => `test13 ${rowIndex}`,
        },
        {
          id: 'desc',
          header: 'Description',
          defaultFlex: 2,
          render: ({ data }) =>
            data.firstName +
            ', aged: ' +
            data.age +
            '. Lives in ' +
            data.country,
        },
      ],
      dataSource: times(people, 50),
    };
  }

  render() {
    if (!process.browser) {
      return null;
    }
    return (
      <DataGrid
        idProperty="id"
        style={gridStyle}
        theme="default-light"
        defaultGroupBy={defaultGroupBy}
        licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
        columns={this.state.columns}
        groupColumn
        virtualizeColumns={false}
        dataSource={this.state.dataSource}
      />
    );
  }
}

export default () => <App />;
