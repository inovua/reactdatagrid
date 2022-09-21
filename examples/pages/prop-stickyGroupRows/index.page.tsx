import React, { useState } from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-enterprise';

import CheckBox from '@inovua/reactdatagrid-community/packages/CheckBox';

import people from '../people';
import flags from '../flags';

const gridStyle = { minHeight: 400 };

const columns = [
  {
    name: 'id',
    type: 'number',
    defaultWidth: 80,
    groupBy: false,
    header: 'Id',
    defaultVisible: false,
  },
  { name: 'name', defaultFlex: 1, header: 'Name' },
  {
    name: 'country',
    defaultWidth: 150,
    header: 'Country',
    render: ({ value }) => (flags[value] ? flags[value] : value),
  },
  { name: 'city', defaultWidth: 150, header: 'City' },
  { name: 'age', defaultWidth: 100, type: 'number', header: 'Age' },
  { name: 'email', defaultWidth: 150, defaultFlex: 1, header: 'Email' },
];

const App = () => {
  const [defaultGroupBy, setDefaultGroupBy] = useState(['country']);
  const [stickyGroupRows, setStickyGroupRows] = useState(true);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <CheckBox checked={stickyGroupRows} onChange={setStickyGroupRows}>
          Use sticky group rows
        </CheckBox>
      </div>
      <ReactDataGrid
        idProperty="id"
        style={gridStyle}
        stickyGroupRows={stickyGroupRows}
        stickyTreeNodes
        defaultGroupBy={defaultGroupBy}
        columns={columns}
        dataSource={people}
        checkboxColumn
      />
    </div>
  );
};

export default () => <App />;
