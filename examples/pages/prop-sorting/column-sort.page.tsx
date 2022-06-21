import { useState } from 'react';
import Table from '@inovua/reactdatagrid-community';
import {
  TypeColumn,
  TypeSortInfo,
} from '@inovua/reactdatagrid-community/types';
import CheckBox from '@inovua/reactdatagrid-community/packages/CheckBox';

interface RowData {
  firstName: string;
}

const dataSource: RowData[] = [
  {
    firstName: 'Jane',
  },
  {
    firstName: 'Bob',
  },
  {
    firstName: 'Alice',
  },
];

const columns: TypeColumn[] = [
  {
    id: 'firstName',
    header: 'First Name',
    sortable: true,
    render: params => {
      return params.data.firstName;
    },
    sort: (a: RowData, b: RowData) => {
      console.log('sort', a, b);
      return a.firstName?.localeCompare(b.firstName);
    },
  },
];

export default function App() {
  const [sortInfo, setSortInfo] = useState<TypeSortInfo | null>({
    name: 'firstName',
    dir: 1,
  });
  const [controlled, setControlled] = useState(true);

  const checkboxProps: any = {
    checked: controlled,
    onChange: setControlled,
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <CheckBox {...checkboxProps}>Controlled prop</CheckBox>
      </div>

      <Table
        key={`${controlled}`}
        dataSource={dataSource}
        columns={columns}
        sortInfo={controlled ? sortInfo : undefined}
        onSortInfoChange={controlled ? setSortInfo : undefined}
        defaultSortInfo={
          !controlled
            ? {
                name: 'firstName',
                dir: 1,
              }
            : undefined
        }
      />
    </div>
  );
}
