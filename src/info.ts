import { getVars, setVars } from "./store";
import {fetchBalance, ITransferInfo} from "./network/dfuse";

// account
export function getAccount(): string {
  return getVars().account || "";
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
  return getVars().queryStatus || QUERY_STATUS.STOPPED;
}

export function getTransferStatsInfo() {
  return getVars().txstatsinfo || {};
}
function fillTransfer(tx: ITransferInfo) {
  const account = getAccount();
  if (account.length === 0) {
    eraseTransferStatsInfo();
    return;
  }

  let txstatsinfo = getTransferStatsInfo();
  let txAccount = ""
  let quantity = parseFloat(tx.quantity) * 10000;
  if (tx.from !== account && tx.to === account) {
    txAccount = tx.from
    quantity = quantity;
  } else if (tx.from === account && tx.to !== account) {
    txAccount = tx.to
    quantity = -quantity
  } else {
    return;
  }
  let stats = txstatsinfo[txAccount] || {quantity:0, txCount:0};
  stats.quantity += quantity;
  stats.txCount ++;
  setVars("txstatsinfo", {...txstatsinfo, txAccount: stats });
}
function eraseTransferStatsInfo() {
  setVars("txstatsinfo", {});
}

export function startQuery() {
  setVars("queryStatus", QUERY_STATUS.ONGOING);
  const {balance} = await fetchBalance(getAccount());
  console.log(balance);
}

export function stopQuery() {
  setVars("queryStatus", QUERY_STATUS.STOPPED);
}