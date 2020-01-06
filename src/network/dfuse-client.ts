import { createDfuseClient } from "@dfuse/client";

const dfuseClient = createDfuseClient({
  network: "mainnet",
  apiKey: "web_c6a6cd8cc05d2d5f8a394b7f5d40b25a"
});



const stream = await dfuseClient.streamTableRows(
  { code: "eosio", scope: "eosio", table: "global" },
  (message: InboundMessage) => {
    if (message.type === InboundMessageType.LISTENING) {
      console.log(prettifyJson(message.data))
      return
    }

    if (message.type === InboundMessageType.TABLE_SNAPSHOT) {
      console.log(prettifyJson(message.data))
      return
    }

    if (message.type === InboundMessageType.TABLE_DELTA) {
      console.log(prettifyJson(message.data))
      return
    }

    if (message.type === InboundMessageType.ERROR) {
      console.log(prettifyJson(message.data))
      return
    }
  },
  { fetch: true }
)