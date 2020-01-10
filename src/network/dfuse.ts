import { createDfuseClient, DfuseClient } from "@dfuse/client";

const DFUSE_API_KEY = "web_ddaf4dcba8fd11d0f52566a27b4ffc1e";
export const getClient = (network: string = "mainnet"): DfuseClient => {
  return createDfuseClient({
    network: network,
    apiKey: DFUSE_API_KEY
  })
}

interface IEOSTokenAccountsRow {
  balance: string;
}

export async function fetchBalance(account: string, atBlock?: number): Promise<{ balance: string; blockNum: number | undefined }> {
  const client = getClient();
  const options = { blockNum: atBlock === undefined ? undefined : atBlock, json: true }
  const response = await client.stateTable<IEOSTokenAccountsRow>(
    "eosio.token",
    account,
    "accounts",
    options
  );
  client.release();
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
export async function streamTransferInfo(account: string, lowBlock: number, callback) {
  const gql = `subscription ($cursor: String) {
    searchTransactionsForward(
      query: "account:eosio.token receiver:eosio.token (data.from:${account} OR data.to:${account})",
      cursor: $cursor, lowBlockNum: ${lowBlock}
    ) {
      cursor
      block { num timestamp }
      trace {
        matchingActions {
          json
        }
      }
    }
  }`;
  const client = getClient();
  const stream = await client.graphql(, (message) => {});
}