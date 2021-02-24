/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DataGrid from '@inovua/reactdatagrid-enterprise';

const columns = [
  { name: 'id', type: 'number', defaultWidth: 50 },
  { name: 'firstName', group: 'personalInfo', defaultFlex: 2 },
  { name: 'age', group: 'personalInfo', type: 'number' },
  { name: 'email', group: 'contactInfo', defaultFlex: 2, draggable: false },
  { name: 'phone', group: 'contactInfo', draggable: false },
  { name: 'city', group: 'location' },
  { name: 'streetName', group: 'street', defaultFlex: 1 },
  { name: 'streetNo', group: 'street', type: 'number' },
];
const groups = [
  { name: 'street', group: 'location' },
  { name: 'personalInfo', group: 'details' },
  { name: 'contactInfo', group: 'details' },
  { name: 'location', group: 'details' },
  { name: 'details', header: 'Detailed info' },
];

const dataSource = [
  {
    id: 0,
    firstName: 'Bob',
    age: 25,
    email: 'bobby@whocares.com',
    phone: '+7403 456 768',
    city: 'Paris',
    streetName: 'Champs Elysee',
    streetNo: 34,
  },
  {
    id: 1,
    firstName: 'Lynda',
    age: 38,
    email: 'lynda@idont.com',
    phone: '+7103 66 98 768',
    city: 'London',
    streetName: 'St Mary',
    streetNo: 14,
  },
  {
    id: 2,
    firstName: 'Richard',
    age: 18,
    email: 'richy@rich.com',
    phone: '+173 668 08 83',
    city: 'Manchester',
    streetName: 'St Robert',
    streetNo: 53,
  },
  {
    id: 3,
    firstName: 'Michael',
    age: 45,
    email: 'mike@mikey.com',
    phone: '+075 0628 156 74',
    city: 'Los Angeles',
    streetName: 'Greenfield',
    streetNo: 24,
  },
  {
    id: 4,
    firstName: 'Martin',
    age: 12,
    email: 'martin@bobson.com',
    phone: '+173 5624 675 462',
    city: 'San Jose',
    streetName: 'Patrick Ball',
    streetNo: 67,
  },
];
const gridStyle = { minHeight: 550 };

export default () => (
  <div>
    <h3>Stacked columns example</h3>
    <DataGrid
      idProperty="id"
      style={gridStyle}
      columnMinWidth={200}
      columns={columns}
      licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
      groups={groups}
      allowGroupSplitOnReorder={false}
      dataSource={dataSource}
    />
  </div>
);
