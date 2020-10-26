import React, { useState, useCallback } from 'react';

import ReactDataGrid from '@inovua/reactdatagrid-enterprise';

import CheckBox from '@inovua/reactdatagrid-community/packages/CheckBox';

const DATASET_URL: string = 'https://demos.reactdatagrid.io/api/v1';

const gridStyle = { minHeight: 400 };

const groupColumn = {
  renderGroupValue: ({ value }) =>
    value === 'true' ? 'Yes' : value === 'false' ? 'No' : value,
};

const columns = [
  {
    name: 'id',
    header: 'Id',
    defaultVisible: false,
    type: 'number',
    defaultWidth: 60,
  },
  { name: 'firstName', header: 'First Name', defaultFlex: 1 },
  { name: 'lastName', header: 'Last Name', defaultFlex: 1 },
  { name: 'email', header: 'Email', groupBy: false, defaultFlex: 1 },
  {
    name: 'permissionToCall',
    header: 'Permission to call',
    minWidth: 80,
    render: ({ data }) => (data.permissionToCall ? 'Yes' : 'No'),
    renderGroupTitle: value =>
      value === true || value === 'true' ? 'Calls allowed' : 'No calls allowed',
  },
];

const loadData = ({ sortInfo }) => {
  return fetch(
    DATASET_URL + '/leads?skip=0&limit=50&sortInfo=' + JSON.stringify(sortInfo)
  ).then(response => response.json());
};

const App = () => {
  const [stickyGroupRows, setStickyGroupRows] = useState(true);
  const [showGroupColumn, setShowGroupColumn] = useState(false);
  const [groupBy, setGroupBy] = useState(['permissionToCall']);

  const dataSource = useCallback(loadData, []);

  return (
    <div>
      <h3 style={{ color: '#fafafa' }}>
        GroupBy example with default grouping
      </h3>

      <div style={{ marginBottom: 20 }}>
        <CheckBox
          theme="default-dark"
          checked={stickyGroupRows}
          onChange={setStickyGroupRows}
        >
          Use sticky group rows
        </CheckBox>
      </div>

      <div style={{ marginBottom: 20 }}>
        <CheckBox
          theme="default-dark"
          checked={showGroupColumn}
          onChange={setShowGroupColumn}
        >
          Use dedicated group column
        </CheckBox>
      </div>

      <ReactDataGrid
        idProperty="id"
        theme="default-dark"
        licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
        style={gridStyle}
        groupColumn={showGroupColumn ? groupColumn : null}
        stickyGroupRows={stickyGroupRows}
        defaultGroupBy={groupBy}
        columns={columns}
        dataSource={dataSource}
      />
    </div>
  );
};

export default () => <App />;
