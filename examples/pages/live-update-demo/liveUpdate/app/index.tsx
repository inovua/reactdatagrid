import React, { useState } from 'react';

import Grid from './grid';
import Configurator from './configurator';

const App = () => {
  const [gridRef, setGridRef] = useState(null);

  return (
    <div className="app">
      <div className="app-content-wrapper">
        <h2 style={{ marginTop: 35 }}>React Data Grid live updates</h2>
        <div className="app-content">
          <Grid setGridRef={setGridRef} />
          <Configurator gridRef={gridRef} />
        </div>
      </div>
    </div>
  );
};

export default App;
