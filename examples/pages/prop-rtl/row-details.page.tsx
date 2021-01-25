import React, { useState, useCallback } from 'react';

import ReactDataGrid from '@inovua/reactdatagrid-enterprise';

import Button from '@inovua/reactdatagrid-community/packages/Button';
import CheckBox from '@inovua/reactdatagrid-community/packages/CheckBox';

import people from '../people';

const gridStyle = { minHeight: 550 };

const renderRowDetails = ({ data }) => {
  return (
    <div style={{ padding: 20 }}>
      <h3>Row details:</h3>
      <table>
        {Object.keys(data).map(name => {
          return (
            <tr key={name}>
              <td>{name}</td>
              <td>{data[name]}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

const columns = [
  { name: 'id', header: 'Id', defaultVisible: false, defaultWidth: 80 },
  { name: 'name', header: 'Name', defaultWidth: 120 },
  { name: 'country', header: 'Country', defaultWidth: 120 },
  { name: 'age', header: 'Age', type: 'number', defaultWidth: 120 },
];

const App = () => {
  const [rtl, setRtl] = useState(true);
  const [nativeScroll, setNativeScroll] = useState(false);
  const [expandedRows, setExpandedRows] = useState<any>({ 1: true, 2: true });
  const [collapsedRows, setCollapsedRows] = useState(null);

  const onExpandedRowsChange = useCallback(
    ({ expandedRows, collapsedRows }) => {
      setExpandedRows(expandedRows);
      setCollapsedRows(collapsedRows);
    },
    []
  );

  return (
    <div>
      <h3>Grid showing row details on expand - controlled</h3>
      <div style={{ marginBottom: 20 }}>
        <Button
          onClick={() => setExpandedRows(true)}
          style={{ marginRight: 10 }}
        >
          Expand all
        </Button>
        <Button onClick={() => setExpandedRows({})}>Collapse all</Button>
      </div>
      <div style={{ marginBottom: 20 }}>
        <CheckBox checked={rtl} onChange={setRtl}>
          Enable RTL
        </CheckBox>
      </div>
      <div style={{ marginBottom: 20 }}>
        <CheckBox checked={nativeScroll} onChange={setNativeScroll}>
          Enable native scroll
        </CheckBox>
      </div>
      <p>
        Expanded rows:{' '}
        {expandedRows == null ? 'none' : JSON.stringify(expandedRows, null, 2)}.
      </p>
      {expandedRows === true ? (
        <p>
          Collapsed rows:{' '}
          {collapsedRows == null
            ? 'none'
            : JSON.stringify(collapsedRows, null, 2)}
          .
        </p>
      ) : null}

      <ReactDataGrid
        idProperty="id"
        rtl={rtl}
        nativeScroll={nativeScroll}
        expandedRows={expandedRows}
        collapsedRows={collapsedRows}
        onExpandedRowsChange={onExpandedRowsChange}
        licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
        style={gridStyle}
        rowExpandHeight={400}
        renderRowDetails={renderRowDetails}
        columns={columns}
        dataSource={people}
      />
    </div>
  );
};

export default () => <App />;

ReactDataGrid.defaultProps.theme = 'default-dark';
CheckBox.defaultProps.theme = 'default-dark';
Button.defaultProps.theme = 'default-dark';
