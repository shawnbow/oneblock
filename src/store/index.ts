import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { allReducers } from "./reducers";
import {actSetVars} from "./actions";

export const reduxStore = createStore(
  allReducers,
  composeWithDevTools(applyMiddleware(reduxThunk))
);

export const reduxDispatch = (action: any) => {
  reduxStore.dispatch(action);
}

export const getVars = () => {
  return reduxStore.getState().vars;
}

export const setVars = (key:string, value:unknown) => {
  return reduxDispatch(actSetVars(key, value));
}
