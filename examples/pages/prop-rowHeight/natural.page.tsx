/**
 * Copyright © INOVUA TRADING.
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

  let id = -1;
  for (var i = 0; i < n; i++) {
    result.push(
      ...arr.map(x => {
        return {
          ...x,
          id: `${++id}`,
        };
      })
    );
  }

  return result;
};
class App extends React.Component {
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
          render: ({ data, rowIndex }) => {
            let height = 50;
            if (rowIndex % 5 === 0) {
              height = 100;
            }
            return (
              <div style={{ height: height }}>
                {data.firstName +
                  ', aged: ' +
                  data.age +
                  '. Lives in ' +
                  data.country}
              </div>
            );
          },
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
        columns={this.state.columns}
        rowHeight={null}
        licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
        minRowHeight={50}
        columnMinWidth={400}
        dataSource={this.state.dataSource}
      />
    );
  }
}

export default () => <App />;
