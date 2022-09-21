import React, { useState, useCallback } from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import CheckBox from '@inovua/reactdatagrid-community/packages/CheckBox';

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
  { name: 'country', defaultWidth: 150, header: 'Country' },
  { name: 'city', defaultWidth: 150, header: 'City' },
  { name: 'age', defaultWidth: 100, type: 'number', header: 'Age' },
  { name: 'email', defaultWidth: 150, defaultFlex: 1, header: 'Email' },
];

const App = () => {
  const [people] = useState([
    {
      id: 1,
      name: 'George',
      country: 'UK',
      city: 'London',
      age: 30,
      email: 'joe@example.com',
    },
    {
      id: 2,
      name: 'Joe',
      country: 'USA',
      city: 'New York',
      age: 70,
      email: 'joe@example.com',
    },

    //
    // Workaround #1: It expands fine if there is more than 1 in the group by.
    //
    // {
    //   id: 3,
    //   name: "Peter",
    //   country: "UK",
    //   city: "York",
    //   age: 34,
    //   email: "joe@example.com"
    // },

    {
      id: 4,
      name: 'Fiona',
      country: 'USA',
      city: 'Orlando',
      age: 60,
      email: 'joe@example.com',
    },
  ]);

  const [defaultGroupBy] = useState(['country', 'city']);

  const [stickyGroupRows, setStickyGroupRows] = useState(true);

  const [collapsedGroups, setCollapsedGroups] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState({});

  const onGroupCollapseChange = useCallback((cGroups, eGroups) => {
    setCollapsedGroups(cGroups);
    setExpandedGroups(eGroups);
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <CheckBox checked={stickyGroupRows} onChange={setStickyGroupRows}>
          stickyGroupRows
        </CheckBox>
      </div>
      <ReactDataGrid
        idProperty="id"
        style={gridStyle}
        stickyGroupRows={stickyGroupRows} // If this is removed there is no problem.
        defaultGroupBy={defaultGroupBy}
        columns={columns}
        dataSource={people}
        columnUserSelect={true}
        disableGroupByToolbar
        showGroupSummaryRow={true}
        onGroupCollapseChange={onGroupCollapseChange}
        collapsedGroups={collapsedGroups}
        expandedGroups={expandedGroups}
        groupColumn={{
          defaultWidth: 280,
          renderGroupValue: ({ value, data }) => {
            return (
              <React.Fragment>
                {value}{' '}
                {`(${data.array.length} person${
                  data.array.length > 1 ? 's' : ''
                })`}
              </React.Fragment>
            );
          },
        }}
      />
    </div>
  );
};

export default () => <App />;
