import { getVars, setVars } from "./store";

// account
export function getAccount(): string | undefined {
  return getVars().account;
}

export function setAccount(account:string) {
  setVars("account", account);
}


// Query
export enum QUERY_STATUS {
  STOPPED,
  ONGOING
}
export function getQueryStatus():QUERY_STATUS {
  return getVars().queryStatus | QUERY_STATUS.STOPPED;
}

export function startQuery() {
  setVars("queryStatus", QUERY_STATUS.ONGOING);
}

export function stopQuery() {
  setVars("queryStatus", QUERY_STATUS.STOPPED);
}