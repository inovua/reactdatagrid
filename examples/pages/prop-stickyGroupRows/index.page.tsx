import React, { useState } from 'react';

import ReactDataGrid from '@inovua/reactdatagrid-enterprise';

const dataSource = Array.from(Array(100).keys()).map(i => ({
  id: i,
  group: i % 10,
  name: `Name ${i}`,
  description: `Description ${i}`,
}));

const columns = [
  {
    name: 'group',
    locked: 'start',
    header: 'Group',
    renderGroupTitle: value => `Group ${value}`,
  },
  { name: 'name', header: 'Name', locked: 'start', defaultWidth: 200 },
  { name: 'description', header: 'Description', defaultWidth: 1000 },
];

const gridStyle = {
  minHeight: 300,
  width: 700,
};
const App = () => {
  return (
    <div>
      <h3>Grouped grid with expandGroupTitle and stickyGroupRows</h3>
      <div>To see the issue, scroll the grid horizontally</div>
      <ReactDataGrid
        columns={columns}
        style={gridStyle}
        defaultGroupBy={['group']}
        expandGroupTitle={true}
        licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
        dataSource={dataSource}
      />
    </div>
  );
};

export default () => <App />;
