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
interface IQueryInfo {
  account: string;
  baseinfo: any;
  transferinfo: Array<{
    peer: string;
    amount: number;
    memo: string;
    blockNum: number;
    timestamp: string;
  }>;
  statsinfo: any;
}
const nullQueryInfo: IQueryInfo = {
  account: "",
  baseinfo: {},
  transferinfo: [],
  statsinfo:{}
};
export function getQueryInfo(): IQueryInfo {
  return getVars().queryinfo || nullQueryInfo;
}
export function setQueryInfo(info: IQueryInfo): IQueryInfo {
  setVars("queryinfo", info);
  return getQueryInfo();
}

export async function startQuery(account: string) {
  setQueryStatus(QUERY_STATUS.ONGOING);
  let queryinfo = setQueryInfo(nullQueryInfo); // erase older query info

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
      let info = getQueryInfo();
      info.transferinfo.push({peer, amount, memo, blockNum, timestamp});
      // Todo: add statsinfo
      setQueryInfo(info);
    },
    () => {
      stopQuery();
    },
    (msg) => {
      console.log(msg);
      stopQuery();
    });
    return;
}

export function stopQuery() {
  setQueryStatus(QUERY_STATUS.STOPPED);
  dfuse.closeStream();
}