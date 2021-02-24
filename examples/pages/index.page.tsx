/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import DataGrid from '@inovua/reactdatagrid-enterprise';

import {
  TypeRowProps,
  TypeColumn,
} from '@inovua/reactdatagrid-community/types';

const gridStyle = { minHeight: '80vh', margin: 20 };

import people from './people';

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
export default class App extends React.Component {
  state: {
    columns: TypeColumn[];
    dataSource: any[];
  };
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { name: 'id', type: 'number', defaultWidth: 80, autoLock: true },
        { name: 'firstName', defaultFlex: 1 },
        { name: 'country', defaultFlex: 1 },
        { name: 'age', type: 'number', defaultFlex: 1 },
        {
          id: 'desc',
          header: 'Description',
          type: 'string',
          defaultFlex: 2,
          render: ({ data }) =>
            data.firstName +
            ', aged: ' +
            data.age +
            '. Lives in ' +
            data.country,
        },
      ],
      dataSource: new Promise(resolve => {
        setTimeout(() => {
          resolve([]);
        }, 1000);
      }),
    };
  }

  renderRowContextMenu = (
    menuProps: any,
    { rowProps }: { rowProps: TypeRowProps }
  ) => {
    menuProps.items = [
      {
        label: 'Row ' + rowProps.rowIndex,
      },
      {
        label: 'Want to visit ' + rowProps.data.country + '?',
      },
    ];
  };

  render() {
    return (
      <>
        <button
          onClick={() => {
            this.setState({
              dataSource: [],
            });
          }}
        >
          clear
        </button>
        <DataGrid
          idProperty="id"
          style={gridStyle}
          renderRowContextMenu={this.renderRowContextMenu}
          licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
          theme="default-light"
          defaultGroupBy={[]}
          columns={this.state.columns}
          showEmptyRows
          dataSource={this.state.dataSource}
        />
      </>
    );
  }
}
