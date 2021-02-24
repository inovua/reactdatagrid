/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DataGrid from '@inovua/reactdatagrid-enterprise';
import { TypeColumn } from '@inovua/reactdatagrid-community/types';

const groupToString = value =>
  value === null
    ? '<null>'
    : value === undefined
    ? '<undefined>'
    : value || '<empty>';

const renderGroupTitle = value => {
  if (value === '<null>') {
    return 'NULL';
  }
  if (value === '<undefined>') {
    return 'UNDEFINED';
  }
  if (value === '<empty>') {
    return 'EMPTY';
  }
  return value;
};
const columns: TypeColumn[] = [
  {
    name: 'country',
    defaultFlex: 1,
    header: 'Country',

    groupToString,
    renderGroupTitle,
  },
  { name: 'firstName', defaultFlex: 1, header: 'First Name' },
  {
    name: 'age',
    type: 'number',
    defaultFlex: 1,
    header: 'Age',
    groupToString,
    renderGroupTitle,
  },
];

const people = [
  { id: 1, firstName: 'Paul', country: 'usa', age: 20 },
  { id: 2, firstName: 'Paul', country: 'usa', age: 20 },
  { id: 3, firstName: 'Paul - empty 20', country: '', age: 20 },
  { id: 3, firstName: 'Paul - empty empty', country: '', age: '' },
  { id: 4, firstName: 'John - null', country: null, age: 20 },
  { id: 5, firstName: 'Paul - undefined 40', country: undefined, age: 40 },
  { id: 5, firstName: 'Paul - undefined empty', country: undefined, age: '' },
  { id: 6, firstName: 'Paul', country: 'uk', age: '' },
  { id: 6, firstName: 'Paul', country: 'uk', age: 10 },
];

const App = () => {
  return (
    <div>
      <DataGrid
        idProperty="id"
        defaultGroupBy={['country', 'age']}
        licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
        columns={columns}
        dataSource={people}
        style={{ minHeight: '90vh' }}
      />
    </div>
  );
};

export default () => <App />;
