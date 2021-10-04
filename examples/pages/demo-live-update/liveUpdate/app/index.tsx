import React, { useState } from 'react';

import Grid from './grid';
import NormalGrid from './grid/normalGrid';
import Configurator from './configurator';
import CheckBox from '@inovua/reactdatagrid-community/packages/CheckBox';

const App = () => {
  const [gridRef, setGridRef] = useState(null);
  const [showGrid, setShowGrid] = useState(true);
  const [showNormal, setShowNormal] = useState(false);

  return (
    <div className="app">
      <div className="app-content-wrapper">
        <h2 style={{ marginTop: 35 }}>React Data Grid live updates</h2>
        <div style={{ marginBottom: 20 }}>
          <CheckBox
            theme="default-dark"
            checked={showGrid}
            onChange={setShowGrid}
          >
            Show grid
          </CheckBox>
        </div>
        <div style={{ marginBottom: 20 }}>
          <CheckBox
            theme="default-dark"
            checked={showNormal}
            onChange={setShowNormal}
          >
            Show normal grid
          </CheckBox>
        </div>

        <div className="app-content">
          {showGrid ? <Grid setGridRef={setGridRef} /> : null}
          <Configurator gridRef={gridRef} />
        </div>
        <div style={{ marginTop: 20 }}>
          {showNormal ? <NormalGrid /> : null}
        </div>
      </div>
    </div>
  );
};

export default App;
