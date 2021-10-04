import React, { useReducer } from 'react';

import App from './app';
import AppContext from './redux/context';
import { initialState } from './redux/initialState';
import appReducer, { getActions } from './redux/reducer';

const AppContainer = (props: any) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const actions = getActions(dispatch);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        actions,
      }}
    >
      <App {...props} />
    </AppContext.Provider>
  );
};

export default AppContainer;
