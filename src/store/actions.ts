import { IVarsAction } from "./types";

export function actSetVars(key: string, value: unknown): IVarsAction {
  return {
    type: "SET_VARS",
    key,
    value
  };
}
