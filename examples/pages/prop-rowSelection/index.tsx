import React, { useState, useCallback } from 'react';

import ReactDataGrid from '../../../community-edition';

import people from '../people';
import flags from '../flags';

const gridStyle = { minHeight: 550 };

const columns = [
  {
    name: 'id',
    header: 'Id',
    defaultVisible: false,
    defaultWidth: 60,
    type: 'number',
  },
  { name: 'name', header: 'Name', defaultFlex: 1 },
  {
    name: 'country',
    header: 'Country',
    defaultFlex: 1,
    render: ({ value }) => (flags[value] ? flags[value] : value),
  },
  { name: 'city', header: 'City', defaultFlex: 1 },
  { name: 'age', header: 'Age', defaultFlex: 1, type: 'number' },
];

const App = () => {
  const [selected, setSelected] = useState(null);

  const onSelectionChange = useCallback(({ selected: selectedMap, data }) => {
    const newSelected = Object.keys(selectedMap).map(id => id * 1);

    setSelected(newSelected);
  }, []);

  return (
    <div>
      <h3>Multiple row selection - uncontrolled</h3>
      <ReactDataGrid
        idProperty="id"
        theme="default-dark"
        enableSelection
        multiSelect
        onSelectionChange={onSelectionChange}
        style={gridStyle}
        columns={columns}
        dataSource={people}
      />
      <p>
        Selected rows: {selected == null ? 'none' : JSON.stringify(selected)}.
      </p>
    </div>
  );
};

export default () => <App />;
