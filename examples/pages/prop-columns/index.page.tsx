/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DataGrid from '../../../enterprise-edition';

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
class App extends React.Component<{}, { columns: any[]; dataSource: any[] }> {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { name: 'id', type: 'number', defaultWidth: 80 },
        { name: 'firstName', defaultFlex: 1, xdefaultLocked: 'start' },
        { name: 'country', defaultFlex: 1, xdefaultLocked: 'end' },
        { name: 'age', type: 'number', defaultFlex: 1 },
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
        columns={this.state.columns}
        groupColumn
        stickyGroupRows
        dataSource={this.state.dataSource}
      />
    );
  }
}

export default () => <App />;
