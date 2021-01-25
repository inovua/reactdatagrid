import React, { useState } from 'react';

import ReactDataGrid from '@inovua/reactdatagrid-enterprise';

import CheckBox from '@inovua/reactdatagrid-community/packages/CheckBox';

const columns = [
  {
    name: 'id',
    header: 'Id',
    defaultVisible: false,
    type: 'number',
    defaultWidth: 50,
  },
  {
    name: 'firstName',
    header: 'First Name',
    group: 'personalInfo',
    defaultFlex: 2,
  },
  { name: 'age', header: 'Age', group: 'personalInfo', type: 'number' },
  { name: 'email', header: 'Email', group: 'contactInfo', defaultFlex: 2 },
  { name: 'phone', header: 'Phone', group: 'contactInfo' },
  { name: 'city', header: 'City', group: 'location' },
  {
    name: 'streetName',
    header: 'Street name',
    group: 'street',
    defaultFlex: 1,
  },
  { name: 'streetNo', header: 'Street no', group: 'street', type: 'number' },
];

const groups = [
  { name: 'street', header: 'Street', group: 'location' },
  { name: 'personalInfo', header: 'Personal info', group: 'details' },
  { name: 'contactInfo', header: 'Contact info', group: 'details' },
  { name: 'location', header: 'Location', group: 'details' },
  { name: 'details', header: 'Detailed info' },
];

const data = [
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

const dataSource = [...data, ...data];

const App = () => {
  const [rtl, setRtl] = useState(true);
  const [nativeScroll, setNativeScroll] = useState(false);
  const [small, setSmall] = useState(false);

  return (
    <div>
      <h3>RTL + stacked columns example</h3>
      <div style={{ marginBottom: 20 }}>
        <CheckBox checked={rtl} onChange={setRtl}>
          Enable RTL
        </CheckBox>
      </div>
      <div style={{ marginBottom: 20 }}>
        <CheckBox checked={nativeScroll} onChange={setNativeScroll}>
          Enable Native Scroll
        </CheckBox>
      </div>
      <div style={{ marginBottom: 20 }}>
        <CheckBox checked={small} onChange={setSmall}>
          Set small
        </CheckBox>
      </div>
      <ReactDataGrid
        key={`grid-${nativeScroll}`}
        idProperty="id"
        rtl={rtl}
        nativeScroll={nativeScroll}
        style={{ minHeight: small ? 350 : 650 }}
        columnMinWidth={100}
        columns={columns}
        licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
        groups={groups}
        dataSource={dataSource}
      />
    </div>
  );
};

export default () => <App />;

ReactDataGrid.defaultProps.theme = 'default-dark';
CheckBox.defaultProps.theme = 'default-dark';
