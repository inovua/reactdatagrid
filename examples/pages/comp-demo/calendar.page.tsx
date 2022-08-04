//@ts-ignore
import React from 'react';
import DateInput from '@inovua/reactdatagrid-community/packages/Calendar/DateInput';
//@ts-ignore
import Calendar from '@inovua/reactdatagrid-community/packages/Calendar';
import TimeInput from '@inovua/reactdatagrid-community/packages/Calendar/TimeInput';

const App = () => {
  return (
    <div>
      <DateInput
        theme={'default-dark'}
        dateFormat="DD/MM/YY HH:mm:ss"
        showClock={true}
      >
        <Calendar
          okButtonText="Select..."
          cancelButtonText="Close..."
          showClock={true}
        />
      </DateInput>

      <div style={{ marginBottom: 20 }}></div>

      <TimeInput timeFormat="DD/MM/YY HH:mm:ss" value="14/20/30" />
    </div>
  );
};

export default () => <App />;
