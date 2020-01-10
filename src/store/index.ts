import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { allReducers } from "./reducers";

export const store = createStore(
  allReducers,
  composeWithDevTools(applyMiddleware(reduxThunk))
);
