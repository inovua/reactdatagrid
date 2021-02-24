/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DataGrid from '@inovua/reactdatagrid-enterprise';

import people from '../people';

const gridStyle = {
  height: '80vh',
};
class App extends React.Component<{}, {}> {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: people,
      columns: [
        {
          name: 'id',
          resizable: false,
          showColumnMenuTool: false,
        },
        {
          type: 'number',

          name: 'age',
        },
        {
          name: 'firstName',
        },
        {
          name: 'name',
        },
        {
          name: 'country',
        },
        {
          name: 'city',
        },
      ],
    };
  }

  onRowReorderHandle = ({ data, dragRowIndex, insertRowIndex }) => {
    console.log('[onRowReorder]', data, dragRowIndex, insertRowIndex);

    let newData = [...this.state.dataSource];
    newData.splice(dragRowIndex, 1);
    newData.splice(insertRowIndex, 0, data);

    this.setState({ dataSource: newData });
  };

  render = () => {
    return (
      <>
        <DataGrid
          idProperty="id"
          theme="default-light"
          checkboxColumn
          licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
          showZebraRows={false}
          style={gridStyle}
          columnDefaultWidth={400}
          defaultSortInfo={[]}
          allowUnsort={false}
          columns={this.state.columns}
          dataSource={this.state.dataSource}
          onContextMenu={(...args) => {
            console.log('context menu', args);
          }}
          onRowContextMenu={(...args) => {
            console.log('row context menu', args);
          }}
          onRowReorder={this.onRowReorderHandle}
        />
      </>
    );
  };
}

export default App;
