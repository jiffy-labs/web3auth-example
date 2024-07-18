import { Chain, defineChain, parseEther } from "viem";
import { ENTRYPOINT_ADDRESS_V07, ENTRYPOINT_ADDRESS_V06 } from "permissionless";

export const NETWORK_RPC_MAP: { [key: number]: Chain } = {
  78600: defineChain({
    // vanar testnet
    id: 78600,
    name: "VANRY_TESTNET",
    nativeCurrency: {
      decimals: 18,
      name: "VANRY",
      symbol: "VANRY",
    },
    rpcUrls: {
      default: {
        http: ["https://rpca-vanguard.vanarchain.com/"],
        webSocket: ["wss://ws-vanguard.vanarchain.com/"],
      },
    },
    blockExplorers: {
      default: {
        name: "Explorer",
        url: "https://explorer-vanguard.vanarchain.com",
      },
    },
  }),
  2040: defineChain({
    id: 2040,
    name: "VANAR_MAINNET",
    nativeCurrency: {
      decimals: 18,
      name: "VANRY",
      symbol: "VANRY",
    },
    rpcUrls: {
      default: {
        http: ["https://rpc.vanarchain.com"],
        webSocket: ["wss://ws.vanarchain.com"],
      },
    },
    blockExplorers: {
      default: { name: "Explorer", url: "https://explorer.vanarchain.com" },
    },
  }),
};


