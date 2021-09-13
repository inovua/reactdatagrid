import { initialState, State } from './initialState';

const SET_THEME = 'SET_THEME';
const SET_DATA = 'SET_DATA';
const SET_RECORDS = 'SET_RECORDS';
const SET_INTERVAL = 'SET_INTERVAL';
const SET_UPDATE_RECORDS = 'SET_UPDATE_RECORDS';
const SET_LOAD = 'SET_LOAD';
const SET_CELL_SELECTION = 'SET_CELL_SELECTION';

const getActions = (dispatch: any) => {
  return {
    setTheme: (theme: string) => {
      dispatch({
        type: SET_THEME,
        payload: theme,
      });
    },

    loadDataSource: (data: any[]) => {
      dispatch({
        type: SET_DATA,
        payload: data,
      });
    },

    setRecords: (records: number) => {
      dispatch({
        type: SET_RECORDS,
        payload: records,
      });
    },

    setUpdateRecords: (records: number) => {
      dispatch({
        type: SET_UPDATE_RECORDS,
        payload: records,
      });
    },

    setTimer: (interval: number) => {
      dispatch({
        type: SET_INTERVAL,
        payload: interval,
      });
    },

    setLoad: (load: boolean) => {
      dispatch({
        type: SET_LOAD,
      });
    },

    setCellSelection: (cells: any) => {
      dispatch({
        type: SET_CELL_SELECTION,
        payload: cells,
      });
    },
  };
};

const setTheme = (state: State, action: any) => {
  return {
    ...state,
    theme: action.payload.theme,
  };
};

const loadDataSource = (state: State, action: any) => {
  return {
    ...state,
    data: action.payload,
  };
};

const setRecords = (state: State, action: any) => {
  return {
    ...state,
    records: action.payload,
  };
};

const setUpdateRecords = (state: State, action: any) => {
  return {
    ...state,
    updateRecords: action.payload,
  };
};

const setTimer = (state: State, action: any) => {
  return {
    ...state,
    interval: action.payload,
  };
};

const setLoad = (state: State, action: any) => {
  return {
    ...state,
    load: !state.load,
  };
};

const setCellSelection = (state: State, action: any) => {
  return {
    ...state,
    cellSelection: action.payload,
  };
};

const reducers: any = {
  SET_THEME: setTheme,
  SET_DATA: loadDataSource,
  SET_RECORDS: setRecords,
  SET_INTERVAL: setTimer,
  SET_UPDATE_RECORDS: setUpdateRecords,
  SET_LOAD: setLoad,
  SET_CELL_SELECTION: setCellSelection,
};

const appReducer = (
  state: State = initialState,
  action: { type: any; payload?: any }
) => {
  const fn = reducers[action.type];
  if (fn) {
    return fn(state, action);
  }

  return state;
};

export { getActions };
export default appReducer;
