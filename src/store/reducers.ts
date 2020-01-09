import { combineReducers } from "redux";
import { IVarsAction, IVarsState } from "./types";

const varsReducer = (state: IVarsState = {}, action: IVarsAction) => {
  if (action.type === "SET_VARS") {
    return { ...state, [action.key]: action.value };
  }
  return state;
};

export const allReducers = combineReducers({ varsReducer });
