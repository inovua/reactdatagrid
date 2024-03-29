import CheckBox from '@inovua/reactdatagrid-community/packages/CheckBox';
import React, { useState, useCallback } from 'react';

import ReactDataGrid from '../../../enterprise-edition';

const gridStyle = { minHeight: 550 };

const colsString = 'abcdefghijk';

const largeCmp = ({ value, data }: any) => {
  const start = Date.now();
  // while (Date.now() < start + 100) {}
  return <div className="prop-checkboxColumns__large-comp">{value}</div>;
};

const buildColumns = (cols: string) => {
  return cols.split('').map((letter: string) => {
    if (letter === 'b') {
      return {
        defaultWidth: 120,
        header: letter.toUpperCase(),
        name: letter,
        render: largeCmp,
      };
    }
    return {
      defaultWidth: 120,
      header: letter.toUpperCase(),
      name: letter,
    };
  });
};

const buildDataSource = (
  records: number,
  cols: string,
  callback?: Function
) => {
  if (callback) {
    return callback();
  }

  type Result = {
    [key: string | number]: string | number | undefined;
  };

  const dataSource = [...new Array(records)].map(
    (_: unknown, index: number) => {
      const result: Result = {
        id: index,
      };

      cols.split('').map((letter: string) => {
        result[letter] = letter.toUpperCase() + ' ' + (index + 1);
      });

      return result;
    }
  );

  return dataSource;
};

const dataSource = buildDataSource(1000, colsString);
const columns = buildColumns(colsString);

const App = () => {
  const [selected, setSelected] = useState();
  const [checkboxColumn, setCheckboxColumn] = useState(true);

  const onSelectionChange = useCallback(({ selected }) => {
    setSelected(selected);
  }, []);

  return (
    <div>
      <h3>Performance issues with large components</h3>
      <div style={{ marginBottom: 20 }}>
        <CheckBox checked={checkboxColumn} onChange={setCheckboxColumn}>
          checkboxColumn
        </CheckBox>
      </div>
      <ReactDataGrid
        idProperty="id"
        selected={selected}
        checkboxColumn={checkboxColumn}
        onSelectionChange={onSelectionChange}
        style={gridStyle}
        columns={columns}
        dataSource={dataSource}
      />
    </div>
  );
};

export default () => <App />;
