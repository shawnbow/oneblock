import { createDfuseClient, DfuseClient } from "@dfuse/client";

const DFUSE_NETWORK = "mainnet";
const DFUSE_API_KEY = "web_c6a6cd8cc05d2d5f8a394b7f5d40b25a";

export interface ITransferInfo {
  from: string;
  to: string;
  quantity: string;
  memo: string;
  blockNum: number;
  timestamp: string;
}

class DfuseContext {
  client: DfuseClient = createDfuseClient({
    network: DFUSE_NETWORK,
    apiKey: DFUSE_API_KEY
  });

  private _stream: any = undefined;

  async fetchBalance(account: string, atBlock?: number): Promise<{ balance: string; blockNum: number | undefined }> {
    const options = { blockNum: atBlock === undefined ? undefined : atBlock, json: true };
    const response = await this.client.stateTable<{ balance: string }>(
      "eosio.token",
      account,
      "accounts",
      options
    );
    return {
      balance: (response.rows.length > 0 && response.rows[0].json !== undefined ? response.rows[0].json!.balance : "0.0000 EOS"),
      blockNum: response.up_to_block_num,
    };
  }

  async fetchBlockIdByTime(date: Date) {
    const { block } = await this.client.fetchBlockIdByTime(date, "lte");
    return block.num;
  }

  async subscribeTransferInfo(account: string, lowBlockNum: number, highBlockNum: number, onData: (tx: ITransferInfo)=>void, onComplete: ()=>void, onError: (msg:any)=>void) {
    const gql = `subscription ($cursor: String) {
      searchTransactionsForward(
        query: "account:eosio.token receiver:eosio.token (data.from:${account} OR data.to:${account}) -data.quantity:'0.0001 EOS' -data.quantity:'0.0002 EOS' -data.quantity:'0.0003 EOS'",
        cursor: $cursor, lowBlockNum: ${lowBlockNum}, highBlockNum: ${highBlockNum}
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

    this._stream = await this.client.graphql(gql, (message, stream) => {
      if (message.type === "error") {
        console.log("An error occurred", message.errors, message.terminal);
        stream.close();
        onError(message);
        return;
      }

      if (message.type === "data") {
        const data = message.data.searchTransactionsForward
        const {num, timestamp} = data.block
        const actions = data.trace.matchingActions
        actions.forEach(({ json }: any) => {
          const { from, to, quantity, memo } = json
          onData({from, to , quantity, memo, blockNum: num, timestamp });
          console.log(`${from} transfer ${to} ${quantity} ${num}`);
        })
        stream.mark({ cursor: data.cursor })
      }

      if (message.type === "complete") {
        console.log("Stream completed");
        stream.close();
        onComplete();
        return;
      }
    });
  }

  async closeStream() {
    if (this._stream) {
      await this._stream.close();
      this._stream = undefined;
    }
  }
}

export const dfuse = new DfuseContext();
