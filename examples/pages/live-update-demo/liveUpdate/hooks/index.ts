import { useContext } from 'react';
import appContext from '../redux/context';

export const useAppState = () => {
  const { state } = useContext(appContext);
  return state;
};

export const useAppDispatch = () => {
  const { dispatch } = useContext(appContext);
  return dispatch;
};

export const useAppActions = () => {
  const { actions } = useContext(appContext);
  return actions;
};

export const useAppContext = () => {
  return useContext(appContext);
};
