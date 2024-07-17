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

export type EntryPoints =
  | typeof ENTRYPOINT_ADDRESS_V07
  | typeof ENTRYPOINT_ADDRESS_V06;

type NetworkPaymasterMap = Record<EntryPoints, Record<number, `0x${string}`>>;

export const NETWORK_LIST = [
  78600,
  2040
]

export const TESTNET_MAP: Record<number, boolean> = {
  78600: true,
  2040: false
}

export const NETWORK_PAYMASTER_MAP: NetworkPaymasterMap = {
  "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789": {
    78600: "0x6acB5d1392910a8117931DB7436DB70ca0719EE5",
    2040: "0x1128D65A1Fab382B3bfDEe6Add5eB4160f1cB4f3",
  },
  "0x0000000071727De22E5E9d8BAf0edAc6f37da032": {
    78600: "0xd3Cb60f55F8154A55ecA2F512a157b46CF70Aca3",
    2040: "0xe0e7Da3F07745fa3c3b3c3d41db9Ea8d7C514633",
  },
};

export const DefaultsForUserOp = {
  sender: "0x0000000000000000000000000000000000000000",
  nonce: 0,
  initCode: "0x",
  callData: "0x",
  callGasLimit: 0,
  verificationGasLimit: 150000, // default verification gas. will add create2 cost (3200+200*length) if initCode exists
  preVerificationGas: 21000, // should also cover calldata cost.
  maxFeePerGas: 0,
  maxPriorityFeePerGas: 1e9,
  paymaster: "0x0000000000000000000000000000000000000000",
  paymasterData: "0x",
  paymasterVerificationGasLimit: 3e5,
  paymasterPostOpGasLimit: 0,
  signature: "0x",
};

export const MINIMUM_PAYMASTER_BALANCE = parseEther("1");