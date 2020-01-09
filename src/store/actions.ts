import { IVarsAction } from "./types";

export function setVars(key: string, value: unknown): IVarsAction {
  return {
    type: "SET_VARS",
    key,
    value
  };
}
