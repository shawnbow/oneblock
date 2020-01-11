import { Api, JsonRpc } from 'eosjs';
import {JsSignatureProvider} from "eosjs/dist/eosjs-jssig";

class EosContext {
  private _config = {
    kylin: {
      chainId: "5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191",
      endpoints: [
        "https://api-kylin.eoslaomao.com",
        "https://api-kylin.eosasia.one",
      ],
      defaultKeys: {
        public: "EOS5HTvrQgZTsjmo8cR3och2YFnXnWpXUMKWCPUQQdUC9eD1a3jQ6",
        private: "5KcUwAYzTu1jRu7WSm8GkFZbfdnwareCb9QoGfYTKxTiMuAiN8s",
      },
    },
    mainnet: {
      chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
      endpoints: [
        'https://mainnet.eos.dfuse.io',
        "https://eospush.tokenpocket.pro",
        "https://eos.greymass.com",
        "https://api.eosn.io",
        "https://mainnet.meet.one",
        "https://nodes.get-scatter.com",
        "https://api1.eosasia.one",
        "https://mainnet-tw.meet.one",
        'https://eos.eoscafeblock.com',
        'https://api.eosdetroit.io',
        'https://eos.newdex.one',
        'https://api.eosnewyork.io',
        'https://api-mainnet.starteos.io',
        'https://api.main.alohaeos.com',
        'https://api.redpacketeos.com',
        'https://api.eoseoul.io',
        'https://eos.infstones.io',
        "https://api.eossweden.se",
        'https://api.eossweden.org',
        'https://mainnet.eoscannon.io',
        'https://bp.whaleex.com',
        'https://api.helloeos.com.cn',
        'https://api.zbeos.com',
        'https://api.eosrio.io',
        "https://mainnet.eoscanada.com",
        'https://api.eoslaomao.com',
        'https://api.eosbeijing.one',
      ],
      defaultKeys: {
        public: "EOS5HTvrQgZTsjmo8cR3och2YFnXnWpXUMKWCPUQQdUC9eD1a3jQ6",
        private: "5KcUwAYzTu1jRu7WSm8GkFZbfdnwareCb9QoGfYTKxTiMuAiN8s",
      },
    },
  };
  rpc: JsonRpc;
  api: Api;
  constructor() {
    this.rpc = new JsonRpc(this._config.mainnet.endpoints[0]);
    this.api = new Api({
      rpc: this.rpc,
      chainId: this._config.mainnet.chainId,
      signatureProvider: new JsSignatureProvider([this._config.mainnet.defaultKeys.private])
    });
  }

  async fetchAccountInfo(account: string) {
    return await this.rpc.get_account(account);
  }
}

export const eos = new EosContext();