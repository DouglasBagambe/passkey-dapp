/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/components/WalletProvider.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { PasskeyDappClient } from "../lib/anchorClient";

// Define types for our wallet context
type WalletContextType = {
  isConnected: boolean;
  publicKey: PublicKey | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  connection: Connection;
  programClient: PasskeyDappClient | null;
};

// Create context with default values
const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  publicKey: null,
  connect: async () => {},
  disconnect: () => {},
  connection: new Connection("https://api.devnet.solana.com"),
  programClient: null,
});

// Custom hook to use wallet context
export const useWallet = (conn?: Connection) => useContext(WalletContext);

type WalletProviderProps = {
  children: ReactNode;
  connection: Connection;
};

// Mock implementation of a browser credential store
const mockCredentialStore = {
  create: async () => {
    console.log("Creating new credential");
    return { id: "mock-credential-id" };
  },
  get: async () => {
    console.log("Getting credential");
    return { id: "mock-credential-id" };
  },
};

// Generate a deterministic public key for demo purposes
function generateDemoPublicKey(): PublicKey {
  return new PublicKey("5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8");
}

const WalletProvider: React.FC<WalletProviderProps> = ({
  children,
  connection,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [programClient, setProgramClient] = useState<PasskeyDappClient | null>(
    null
  );

  useEffect(() => {
    // Check if user was previously connected
    const checkConnection = async () => {
      try {
        const storedWallet = localStorage.getItem("walletConnected");
        if (storedWallet === "true") {
          const demoPublicKey = generateDemoPublicKey();
          setPublicKey(demoPublicKey);
          setIsConnected(true);
          // Initialize program client
          const wallet = {
            publicKey: demoPublicKey,
            signTransaction: async (tx: any) => tx,
            signAllTransactions: async (txs: any[]) => txs,
          };
          const client = new PasskeyDappClient(connection, wallet);
          setProgramClient(client);
        }
      } catch (error) {
        console.error("Failed to restore connection:", error);
      }
    };

    checkConnection();
  }, [connection]);

  const connect = async () => {
    try {
      await mockCredentialStore.get();
      const demoPublicKey = generateDemoPublicKey();
      setPublicKey(demoPublicKey);
      setIsConnected(true);
      localStorage.setItem("walletConnected", "true");
      // Initialize program client
      const wallet = {
        publicKey: demoPublicKey,
        signTransaction: async (tx: any) => tx,
        signAllTransactions: async (txs: any[]) => txs,
      };
      const client = new PasskeyDappClient(connection, wallet);
      setProgramClient(client);
    } catch (error) {
      console.error("Connection failed:", error);
      throw error;
    }
  };

  const disconnect = () => {
    setPublicKey(null);
    setIsConnected(false);
    setProgramClient(null);
    localStorage.removeItem("walletConnected");
  };

  const contextValue = {
    isConnected,
    publicKey,
    connect,
    disconnect,
    connection,
    programClient,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;

export const LazorConnect = ({
  children,
  onConnect,
  className,
}: {
  children: ReactNode;
  onConnect: () => void;
  className?: string;
}) => {
  const { connect } = useWallet();

  const handleClick = async () => {
    try {
      await connect();
      if (onConnect) {
        onConnect();
      }
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
};
