import React, { useState } from 'react';

import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import CheckBox from '@inovua/reactdatagrid-community/packages/CheckBox';

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
        nodes: null,
      },
      {
        id: 2,
        name: 'iMovie',
        size: '106Mb',
        nodes: null,
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
    name: '3 Downloads - uncollapsible',
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

const columns = [
  { name: 'name', header: 'Name', defaultFlex: 1 },
  { name: 'size', header: 'Size', defaultWidth: 160 },
];

const loadNode = ({ node, nodeProps }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (nodeProps.depth >= 4) {
        resolve([
          { id: 1, name: 'First child of ' + node.name },
          { id: 2, name: 'Second child of ' + node.name },
        ]);
      }
      resolve([
        { id: 1, name: 'First child of ' + node.name, nodes: null },
        { id: 2, name: 'Second child of ' + node.name, nodes: null },
      ]);
    }, 200);
  });
};

const defaultExpandedNodes = {
  1: true,
  3: true,
};

const onNodeCollapse = ({ data }) => {
  if (data.id == 3) {
    return false;
  }
};

const App = () => {
  const [rtl, setRtl] = useState(true);
  const [nativeScroll, setNativeScroll] = useState(false);
  const [small, setSmall] = useState(true);

  return (
    <div>
      <h3>TreeGrid with RTL</h3>
      <p>The "Downloads" node is not collapsible</p>
      <div style={{ marginBottom: 20 }}>
        <CheckBox checked={rtl} onChange={setRtl}>
          Enable RTL
        </CheckBox>
      </div>
      <div style={{ marginBottom: 20 }}>
        <CheckBox checked={nativeScroll} onChange={setNativeScroll}>
          Enable Native Scroll
        </CheckBox>
      </div>
      <div style={{ marginBottom: 20 }}>
        <CheckBox checked={small} onChange={setSmall}>
          Set small
        </CheckBox>
      </div>
      <ReactDataGrid
        treeColumn="name"
        key={`grid-${nativeScroll}-${small}`}
        rtl={rtl}
        nativeScroll={nativeScroll}
        licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
        defaultExpandedNodes={defaultExpandedNodes}
        loadNode={loadNode}
        onNodeCollapse={onNodeCollapse}
        style={{ minHeight: small ? 300 : 650 }}
        columns={columns}
        dataSource={treeData}
      />
    </div>
  );
};

export default () => <App />;

ReactDataGrid.defaultProps.theme = 'default-dark';
CheckBox.defaultProps.theme = 'default-dark';
