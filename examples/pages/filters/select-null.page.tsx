import React from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter';

import filterTypes from '@inovua/reactdatagrid-community/filterTypes';
import { TypeColumn } from '@inovua/reactdatagrid-community/types';
// filterTypes.select.emptyValue = undefined;

const columns: TypeColumn[] = [
  { name: 'country', defaultFlex: 1, header: 'Country' },
  { name: 'firstName', defaultFlex: 1, header: 'First Name' },
  { name: 'age', type: 'number', defaultFlex: 1, header: 'Age' },
  {
    name: 'enlisted',
    defaultFlex: 1,
    header: 'Enlisted',
    render: ({ value }) => {
      if (value === null) {
        return '';
      }
      return value ? 'Yes' : 'No';
    },
    filterEditor: SelectFilter,
    filterEditorProps: {
      dataSource: [
        { id: true, label: 'Yes' },
        { id: false, label: 'No' },
        { id: null, label: 'Blank' },
      ],
    },
  },
];

const people = [
  { id: 1, firstName: 'Paul', country: 'usa', age: 20, enlisted: true },
  { id: 2, firstName: 'Paul', country: 'uk', age: 20, enlisted: false },
  { id: 3, firstName: 'Paul', country: 'usa', age: 19, enlisted: null },
];

const defaultFilterValue = [
  {
    name: 'enlisted',
    operator: 'eq',
    type: 'select',
    value: null,
    emptyValue: undefined,
  },
];

const App = () => {
  return (
    <div>
      <ReactDataGrid
        theme="default-dark"
        enableFiltering
        columns={columns}
        defaultFilterValue={defaultFilterValue}
        licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
        dataSource={people}
        style={{ minHeight: 550 }}
      />
    </div>
  );
};

export default () => <App />;
