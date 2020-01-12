import { getVars, setVars } from "./store";
import { dfuse } from "./network/dfuse";
import { eos } from "./network/eos";

// query status
export enum QUERY_STATUS {
  STOPPED,
  ONGOING
}
export function getQueryStatus(): QUERY_STATUS {
  return getVars().querystatus || QUERY_STATUS.STOPPED;
}
export function setQueryStatus(status: QUERY_STATUS) {
  setVars("querystatus", status);
}

// query info
export interface ITxInfo {
  peer: string;
  amount: number;
  memo: string;
  blockNum: number;
  timestamp: string;
}
export interface IQueryInfo {
  account: string;
  baseinfo: any;
  transferinfo: Array<ITxInfo>;
  statsinfo: any;
}
const newQueryInfo = (): IQueryInfo => {
  return {
    account: "",
    baseinfo: {},
    transferinfo: [],
    statsinfo:{}
  }
};
export function getQueryInfo(): IQueryInfo {
  return getVars().queryinfo || newQueryInfo();
}
export function setQueryInfo(info: IQueryInfo) {
  setVars("queryinfo", info);
}

export async function startQuery(account: string) {
  setQueryStatus(QUERY_STATUS.ONGOING);
  let queryinfo = newQueryInfo();
  setQueryInfo(queryinfo); // erase older query info
  console.log(queryinfo);

  queryinfo.account = account;
  queryinfo.baseinfo = await eos.fetchAccountInfo(account);
  setQueryInfo(queryinfo);

  const highBlockNum = await dfuse.fetchBlockIdByTime(new Date());
  dfuse.subscribeTransferInfo(account, 1024, highBlockNum,
    ({from, to, quantity, memo, blockNum, timestamp}) => {
      let peer = ""
      let amount = parseFloat(quantity) * 10000;
      if (from !== account && to === account) {
        peer = from
      } else if (from === account && to !== account) {
        peer = to
        amount = -amount
      } else {
       return;
      }

      queryinfo.transferinfo.push({peer, amount, memo, blockNum, timestamp});
      // Todo: add statsinfo
      setQueryInfo(queryinfo);
    },
    () => {
      setQueryStatus(QUERY_STATUS.STOPPED);
    },
    (msg) => {
      console.log(msg);
      setQueryStatus(QUERY_STATUS.STOPPED);
      queryinfo = newQueryInfo();
      setQueryInfo(queryinfo);
    });
    return;
}
