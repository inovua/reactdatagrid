import React, { useState } from 'react';

import ReactDataGrid from '../../../../../../enterprise-edition';
import buildColumns from './columns';
import { useAppState, useAppActions } from '../../hooks';

const gridStyles = {
  height: 500,
};
const emptyText = (
  <div style={{ fontSize: 14, color: '#9ba7b4' }}>No records available</div>
);

const DataGrid = (props: any) => {
  const { theme, data, cols, load, cellSelection } = useAppState();
  const { setCellSelection } = useAppActions();
  const [groupBy, setGroupBy] = useState([]);

  const [columns] = React.useState(() => buildColumns(cols));

  const onGroupByChange = (groupBy: any[]) => {
    setGroupBy(groupBy);
  };

  const gridDOMProps: any = {
    key: `${load}`,
    idProperty: 'id',
    theme,
    handle: props.setGridRef,
    style: gridStyles,
    licenseKey: process.env.NEXT_PUBLIC_LICENSE_KEY,
    columns,
    dataSource: data || [],
    rowIndexColumn: true,
    emptyText,
    cellSelection,
    onCellSelectionChange: setCellSelection,
    clearDataSourceCacheOnChange: false,
    groupBy,
    onGroupByChange,
  };

  return <ReactDataGrid {...gridDOMProps} />;
};

export default DataGrid;
