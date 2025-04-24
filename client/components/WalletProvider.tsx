/* eslint-disable @typescript-eslint/no-unused-vars */
// components/WalletProvider.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Connection, PublicKey } from "@solana/web3.js";

// Define types for our wallet context
type WalletContextType = {
  isConnected: boolean;
  publicKey: PublicKey | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  connection: Connection;
};

// Create context with default values
const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  publicKey: null,
  connect: async () => {},
  disconnect: () => {},
  connection: new Connection("https://api.devnet.solana.com"),
});

// Custom hook to use wallet context
export const useWallet = (conn?: Connection) => useContext(WalletContext);

type WalletProviderProps = {
  children: ReactNode;
  connection: Connection;
};

// Mock implementation of a browser credential store
const mockCredentialStore = {
  // In a real implementation, this would interact with the WebAuthn API
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

  useEffect(() => {
    // Check if user was previously connected
    const checkConnection = async () => {
      try {
        const storedWallet = localStorage.getItem("walletConnected");
        if (storedWallet === "true") {
          // In a real implementation, we would verify the credential
          setPublicKey(generateDemoPublicKey());
          setIsConnected(true);
        }
      } catch (error) {
        console.error("Failed to restore connection:", error);
      }
    };

    checkConnection();
  }, []);

  const connect = async () => {
    try {
      // In a real implementation, this would use WebAuthn to create or get credentials
      await mockCredentialStore.get();

      // For demo purposes, we'll use a fixed public key
      const demoPublicKey = generateDemoPublicKey();
      setPublicKey(demoPublicKey);
      setIsConnected(true);
      localStorage.setItem("walletConnected", "true");
    } catch (error) {
      console.error("Connection failed:", error);
      throw error;
    }
  };

  const disconnect = () => {
    setPublicKey(null);
    setIsConnected(false);
    localStorage.removeItem("walletConnected");
  };

  const contextValue = {
    isConnected,
    publicKey,
    connect,
    disconnect,
    connection,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;

// LazorConnect component to be used in the app
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
