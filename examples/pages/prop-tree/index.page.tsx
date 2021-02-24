/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DataGrid, { TypeFooterRow } from '@inovua/reactdatagrid-enterprise';

const gridStyle = { minHeight: 550 };

const treeData = [
  {
    id: 1,
    name: 'Applications',
    folder: true,
    nodes: [
      {
        id: 1,
        name: 'App store',
        size: '4.5Mb',
      },
      {
        id: 2,
        name: 'iMovie',
        size: '106Mb',
      },
      {
        id: 3,
        name: 'IRecall',
        size: '200Mb',
      },
    ],
  },
  {
    id: 2,
    name: 'Documents',
    nodes: [
      {
        id: 1,
        name: 'Todo.md',
        size: '2Kb',
      },
      {
        id: 2,
        name: 'Calendar.md',
        size: '15.2Kb',
      },
      { id: 3, name: 'Shopping list.csv', size: '20Kb' },
    ],
  },
  {
    id: 3,
    name: '3 Downloads',
    nodes: [
      {
        id: 1,
        name: 'Email data',
        nodes: [
          {
            id: 1,
            name: 'Personal.xls',
            size: '100Gb',
          },
          { id: 2, name: 'Work.xls' },
        ],
      },
      { id: 2, name: 'MacRestore.gzip' },
    ],
  },
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedNodes: { 1: true, 2: true, '3/1': true },
      columns: [
        { name: 'name', defaultFlex: 1 },
        { name: 'size', defaultWidth: 120 },
        {
          id: 'toggle',
          render: data => {
            return (
              <button onClick={() => data.toggleNodeExpand()}>toggle</button>
            );
          },
        },
      ],
      dataSource: treeData,
    };
    this.onExpandedNodesChange = this.onExpandedNodesChange.bind(this);
  }
  onExpandedNodesChange({ expandedNodes }) {
    this.setState({
      expandedNodes,
    });
  }

  render() {
    const { expandedNodes } = this.state;
    return (
      <div>
        <p>
          Expanded nodes:{' '}
          {expandedNodes == null
            ? 'none'
            : JSON.stringify(expandedNodes, null, 2)}
          .
        </p>
        <DataGrid
          treeColumn="name"
          expandedNodes={expandedNodes}
          licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
          onExpandedNodesChange={this.onExpandedNodesChange}
          style={gridStyle}
          columns={this.state.columns}
          dataSource={this.state.dataSource}
        />
      </div>
    );
  }
}

export default () => <App />;
