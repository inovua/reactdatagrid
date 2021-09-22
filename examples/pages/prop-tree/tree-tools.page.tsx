import CheckBox from '@inovua/reactdatagrid-community/packages/CheckBox';
import React, { useState } from 'react';
import ReactDataGrid from '../../../enterprise-edition';

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

const columns = [
  { name: 'name', header: 'Name', defaultFlex: 1 },
  { name: 'size', defaultWidth: 120, header: 'Size' },
];

const defaultExpandedNodes = { 1: true };

const App = () => {
  const [showTools, setShowTools] = useState(true);

  const renderCollapseTool = ({ domProps, size }) => {
    const style = Object.assign(domProps.style, { fill: 'red' });
    return (
      <svg {...domProps} height={size} viewBox="0 0 24 24" width={size}>
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M10 17l5-5-5-5v10z" />
      </svg>
    );
  };

  const renderExpandTool = ({ domProps, size }) => {
    const style = Object.assign(domProps.style, { fill: 'red' });
    return (
      <svg {...domProps} height={size} viewBox="0 0 24 24" width={size}>
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M7 10l5 5 5-5H7z" />
      </svg>
    );
  };

  const renderTreeLoadingTool = ({ domProps, size, className }) => {
    return (
      <svg
        {...domProps}
        className={className}
        height={size}
        viewBox="0 0 24 24"
        width={size}
        fill="#49ffff"
      >
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
      </svg>
    );
  };

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
      }, 2000);
    });
  };

  return (
    <div>
      <h3>TreeGrid with custom collapse tool</h3>

      <div style={{ marginBottom: 20 }}>
        <CheckBox
          theme="default-dark"
          checked={showTools}
          onChange={setShowTools}
        >
          Show custom tools
        </CheckBox>
      </div>

      <ReactDataGrid
        treeColumn="name"
        theme="default-dark"
        licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
        defaultExpandedNodes={defaultExpandedNodes}
        style={gridStyle}
        columns={columns}
        dataSource={treeData}
        renderTreeCollapseTool={showTools ? renderCollapseTool : null}
        renderTreeExpandTool={showTools ? renderExpandTool : null}
        renderTreeLoadingTool={showTools ? renderTreeLoadingTool : null}
        loadNode={loadNode}
        expandOnMouseDown
      />
    </div>
  );
};

export default () => <App />;
