//@ts-ignore
import React from 'react';
import DateInput from '@inovua/reactdatagrid-community/packages/Calendar/DateInput';
//@ts-ignore
import Calendar from '@inovua/reactdatagrid-community/packages/Calendar';

const App = () => {
  return (
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
  );
};

export default () => <App />;
