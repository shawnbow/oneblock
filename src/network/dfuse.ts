import { createDfuseClient, DfuseClient } from "@dfuse/client";

const DFUSE_NETWORK = "mainnet";
const DFUSE_API_KEY = "web_ddaf4dcba8fd11d0f52566a27b4ffc1e";
const client: DfuseClient = createDfuseClient({
    network: DFUSE_NETWORK,
    apiKey: DFUSE_API_KEY
  });

export async function fetchBlockIdByTime(date: Date) {
  const { block } = await client.fetchBlockIdByTime(date, "gte");
  return block.num;
}

export async function fetchBalance(account: string, atBlock?: number): Promise<{ balance: string; blockNum: number | undefined }> {
  const options = { blockNum: atBlock === undefined ? undefined : atBlock, json: true }
  const response = await client.stateTable<{ balance: string }>(
    "eosio.token",
    account,
    "accounts",
    options
  );

  return {
    balance: (response.rows.length > 0 && response.rows[0].json !== undefined ? response.rows[0].json!.balance : "0.0000 EOS"),
    blockNum: response.up_to_block_num
  }
}

export interface ITransferInfo {
  from: string;
  to: string;
  quantity: string;
  memo: string;
}
export async function gqlTransferInfo(account: string, lowBlock: number, callback: (tx: ITransferInfo)=>void ) {
  const gql = `subscription ($cursor: String) {
    searchTransactionsForward(
      query: "account:eosio.token receiver:eosio.token (data.from:${account} OR data.to:${account})",
      cursor: $cursor, lowBlockNum: ${lowBlock}
    ) {
      undo
      cursor
      block { num timestamp }
      trace {
        matchingActions {
          json
        }
      }
    }
  }`;
  const stream = await client.graphql(gql, (message) => {
    if (message.type === "error") {
      console.log("An error occurred", message.errors, message.terminal)
      return;
    }

    if (message.type === "data") {
      const data = message.data.searchTransactionsForward
      const actions = data.trace.matchingActions

      actions.forEach(({ json }: any) => {
        const { from, to, quantity, memo } = json
        console.log(`Transfer [${from} -> ${to}, ${quantity}] (${memo})`)
        callback(json);
      })
      stream.mark({ cursor: data.cursor })
    }

    if (message.type === "complete") {
      console.log("Stream completed");
      return;
    }
  });
}