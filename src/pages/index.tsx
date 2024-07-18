/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-console */
"use client";

import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { createPublicClient, createWalletClient, custom, parseUnits, Address } from "viem";
import { NETWORK_RPC_MAP } from "./constants";
import useSmartAccount from "@/hooks/smartAccount";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;

const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x13308", // hex of 19 for Songbird Canary network
    rpcTarget: "https://rpc-vanguard.vanarchain.com/",
    displayName: "Vanar Network",
    blockExplorerUrl: "https://explorer-vanguard.vanarchain.com/",
    ticker: "VANRY",
    tickerName: "VANRY",
    logo: "https://cryptologos.cc/logos/flare-flr-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig },
});

const web3auth = new Web3Auth({
    clientId: clientId || "",
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider,
});

function App() {
    const { provider, setProvider, sendTransaction: sendSmartTransaction } = useSmartAccount();
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

    const getAccounts = async (): Promise<Address | undefined> => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }

        const walletClient = createWalletClient({
            chain: NETWORK_RPC_MAP[78600],
            transport: custom(provider),
        });

        try {
            const addresses = await walletClient.getAddresses();
            uiConsole(addresses);
            return addresses[0] as Address; // Assuming the first address is used
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
            chain: NETWORK_RPC_MAP[78600],
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

        try {
            const receipt = await sendSmartTransaction("0x0B3074cd5891526420d493B13439f3D4b8be6144", BigInt("0"));
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
            chain: NETWORK_RPC_MAP[78600],
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
                account: address,
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
            el.innerHTML = JSON.stringify(args.map((arg) => (typeof arg === "bigint" ? arg.toString() : arg)) || {}, null, 2);
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
