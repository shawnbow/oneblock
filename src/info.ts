import { getVars, setVars } from "./store";
import {gqlTransferInfo, ITransferInfo} from "./network/dfuse";

// Transfer Info
// function fillTransfer(tx: ITransferInfo) {
//   const account = "";
//   if (account.length === 0) {
//     eraseTransferStatsInfo();
//     return;
//   }

//   let txstatsinfo = getTransferStatsInfo();
//   let txAccount = ""
//   let quantity = parseFloat(tx.quantity) * 10000;
//   if (tx.from !== account && tx.to === account) {
//     txAccount = tx.from
//   } else if (tx.from === account && tx.to !== account) {
//     txAccount = tx.to
//     quantity = -quantity
//   } else {
//     return;
//   }
//   let stats = txstatsinfo[txAccount] || {quantity:0, txCount:0};
//   stats.quantity += quantity;
//   stats.txCount ++;
//   setVars("txstatsinfo", {...txstatsinfo, [txAccount]: stats });
// }
// function eraseTransferStatsInfo() {
//   setVars("txstatsinfo", {});
// }

// query status
export enum QUERY_STATUS {
  STOPPED,
  ONGOING
}
export function getQueryStatus(): boolean {
  let status =  getVars().querystatus || QUERY_STATUS.STOPPED;
  return status === QUERY_STATUS.ONGOING;
}
export function setQueryStatus(status: QUERY_STATUS) {
  setVars("querystatus", status);
}

// query info
interface IQueryInfo {
  account: string;
  baseinfo: any;
  transferinfo: any;
  statsinfo: any;
}
const nullQueryInfo: IQueryInfo = {
  account: "",
  baseinfo: {},
  transferinfo: {},
  statsinfo:{}
};
export function getQueryInfo(): IQueryInfo {
  return getVars().queryinfo || nullQueryInfo;
}
export function setQueryInfo(info: IQueryInfo) {
  setVars("queryinfo", info);
}

export async function startQuery(account: string) {
  setQueryStatus(QUERY_STATUS.ONGOING);
  setQueryInfo(nullQueryInfo); // erase older query info

  let queryinfo = getQueryInfo();
  setQueryInfo({...queryinfo, account: account});

  // const {client, stream} = await gqlTransferInfo(getAccount(), 100, fillTransfer);
  // console.log("afdsAFASDFASDFASDFASDFASDFASDFASDFADSF")
}

export function stopQuery() {
  setQueryStatus(QUERY_STATUS.STOPPED);
}