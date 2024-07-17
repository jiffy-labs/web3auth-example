/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-console */
"use client";

import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { createPublicClient, createWalletClient, custom, parseUnits } from 'viem';
import { mainnet } from 'viem/chains';

const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x13", // hex of 19 for Songbird Canary network
  rpcTarget: "https://songbird-api.flare.network/ext/C/rpc",
  displayName: "Songbird canary network",
  blockExplorerUrl: "https://songbird-explorer.flare.network",
  ticker: "SGB",
  tickerName: "SGB",
  logo: "https://cryptologos.cc/logos/flare-flr-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider,
});

function App() {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const walletClient = createWalletClient({
      chain: mainnet,
      transport: custom(provider),
    });

    try {
      const addresses = await walletClient.getAddresses();
      uiConsole(addresses);
      return addresses[0]; // Assuming the first address is used
    } catch (error) {
      console.error("Error getting accounts:", error);
    }
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const publicClient = createPublicClient({
      chain: mainnet,
      transport: custom(provider),
    });

    try {
      const address = await getAccounts();
      if (!address) {
        throw new Error("Address not found");
      }
      const balance = await publicClient.getBalance({ address });
      uiConsole({ balance: balance.toString() }); // Convert BigInt to string
    } catch (error) {
      console.error("Error getting balance:", error);
    }
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const walletClient = createWalletClient({
      chain: mainnet,
      transport: custom(provider),
    });

    try {
      const fromAddress = await getAccounts();
      if (!fromAddress) {
        throw new Error("Address not found");
      }
      const destination = "0x9e18Ee47aA93b6082B933e41E8eCB150b5c7d6DC"; // Replace with recipient address
      const amount = parseUnits("0.0001", 18); // Amount to send in Ether

      const hash = await walletClient.sendTransaction({
        account: fromAddress,
        to: destination,
        value: amount,
      });

      uiConsole("Transaction Hash:", hash);

      // Wait for transaction receipt if needed
      const publicClient = createPublicClient({
        chain: mainnet,
        transport: custom(provider),
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      uiConsole("Transaction Receipt:", receipt);
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const walletClient = createWalletClient({
      chain: mainnet,
      transport: custom(provider),
    });

    try {
      const address = await getAccounts();
      if (!address) {
        throw new Error("Address not found");
      }
      const originalMessage = "YOUR_MESSAGE";

      // Sign the message
      const signedMessage = await walletClient.signMessage({
        account: address[0],
        message: originalMessage,
      });

      uiConsole(signedMessage);
    } catch (error) {
      console.error("Error signing message:", error);
    }
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args.map(arg => typeof arg === 'bigint' ? arg.toString() : arg) || {}, null, 2);
      console.log(...args);
    }
  }

  const loggedInView = (
    <div className="flex flex-col gap-4 mt-8">
      <button onClick={getAccounts} className="btn">
        Get Accounts
      </button>
      <button onClick={getBalance} className="btn">
        Get Balance
      </button>
      <button onClick={sendTransaction} className="btn">
        Send Transaction
      </button>
      <button onClick={signMessage} className="btn">
        Sign Message
      </button>
      <button onClick={logout} className="btn">
        Log Out
      </button>
    </div>
  );

  const unloggedInView = (
    <button onClick={login} className="btn">
      Login
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-8">Web3Auth & Viem Integration</h1>
      <div className="w-full max-w-md mx-auto">
        <div className="grid gap-4">{loggedIn ? loggedInView : unloggedInView}</div>
        <div id="console" className="mt-4">
          <p className="bg-gray-800 p-4 rounded">{/* Console output goes here */}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
