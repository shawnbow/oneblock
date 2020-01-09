// Vars
export interface IVarsAction {
  type: "SET_VARS";
  key: string;
  value: unknown;
}
export interface IVarsState {
  [varName: string]: any;
}
