import React, { useEffect, useRef } from 'react';

import Region from '../../../community-edition/packages/region';

const App = () => {
  const divRef = useRef(null);

  useEffect(() => {
    const region = Region(divRef.current);

    console.log(region);

    console.log('test', region._before());
  }, []);

  return <div ref={divRef} style={{ background: 'green', height: 100 }}></div>;
};

export default App;
