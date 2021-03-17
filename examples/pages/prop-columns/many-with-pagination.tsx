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

const times = (arr, n, fn?) => {
  const result = [];

  for (var i = 0; i < n; i++) {
    result.push(
      ...arr.map(x => {
        if (fn) {
          return fn(x, i);
        }
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
    const COLS = 100;
    const columns = times([{ name: 'id' }], COLS, (_, i) => {
      return {
        name: i ? `id-${i}` : 'id',
        id: i ? `id-${i}` : 'id',
        // defaultLocked: i < 2 ? 'start' : i > COLS - 2 ? 'end' : false,
        // colspan: () => 1,
        // render: ({ value, rowIndex }) => {
        //   // console.log(`render ${rowIndex} - ${i}`);
        //   return value;
        // },
      };
    });
    this.state = {
      columns,
      dataSource: times(
        [
          [...new Array(COLS)].reduce(
            (acc, _, i) => {
              acc[`id-${i}`] = i;
              return acc;
            },
            { id: 0 }
          ),
        ],
        125
      ),
    };
    console.log(this.state.dataSource);
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
        handle={x => {
          global.x = x;
        }}
        pagination
        enablePagination
        columns={this.state.columns}
        licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
        dataSource={this.state.dataSource}
      />
    );
  }
}

export default () => <App />;
