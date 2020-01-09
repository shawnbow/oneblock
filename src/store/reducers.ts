import { combineReducers } from "redux";
import { IVarsAction, IVarsState } from "./types";

const vars = (state: IVarsState = {}, action: IVarsAction) => {
  if (action.type === "SET_VARS") {
    return { ...state, [action.key]: action.value };
  }
  return state;
};

export const allReducers = combineReducers({ vars });
