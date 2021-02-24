/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DataGrid from '@inovua/reactdatagrid-community';

import people from '../people';

const gridStyle = { minHeight: 550 };

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: people,
      columns: [
        {
          name: 'id',
          defaultWidth: 50,
          type: 'number',
          colspan: ({ data, column, columns }) => {
            // return 1;
            // make every other row cell expand for 2 columns if the next column is the age column
            if (
              data.id % 2 &&
              columns[column.computedVisibleIndex] &&
              columns[column.computedVisibleIndex + 1].name === 'age'
            ) {
              return 2;
            }

            return 1;
          },
        },
        { name: 'age', defaultFlex: 1, type: 'number' },
        { name: 'name', defaultFlex: 1 },
        {
          name: 'country',
          defaultFlex: 1,
          rowspan: ({ value, dataSourceArray, rowIndex, column }) => {
            let rowspan = 1;

            const prevData = dataSourceArray[rowIndex - 1];
            if (prevData && prevData[column.name] === value) {
              return rowspan;
            }
            let currentRowIndex = rowIndex + 1;
            while (
              dataSourceArray[currentRowIndex] &&
              dataSourceArray[currentRowIndex][column.name] === value
            ) {
              rowspan++;
              currentRowIndex++;
              if (rowspan > 9) {
                break;
              }
            }
            return rowspan;
          },
        },
      ],
    };
  }

  render() {
    return (
      <div>
        <h3>Rowspan and colspan example</h3>
        <DataGrid
          style={gridStyle}
          columns={this.state.columns}
          dataSource={this.state.dataSource}
          defaultGroupBy={['age']}
          licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
        />
      </div>
    );
  }
}

export default () => <App />;
