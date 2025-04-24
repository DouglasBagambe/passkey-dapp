/* eslint-disable @typescript-eslint/no-unused-vars */
// client/pages/index.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Buffer } from "buffer";
import dynamic from "next/dynamic";
import { Connection } from "@solana/web3.js";
import { useWallet, LazorConnect } from "../components/WalletProvider";

// Client-side polyfills
if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

// Connection is initialized only on the client
const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com"
);

// Import WalletProvider dynamically to prevent SSR issues
const DynamicWalletProvider = dynamic(
  () => import("../components/WalletProvider"),
  { ssr: false }
);

// Disable SSR for this page
export const dynamicConfig = "force-dynamic";

export default function Home() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ensure we're on the client
  useEffect(() => {
    setIsClient(true);
    setIsLoading(false);
  }, []);

  // Handle successful wallet connection
  const handleWalletConnected = () => {
    try {
      router.push("/dashboard");
    } catch (err) {
      console.error("Navigation error:", err);
      setError(
        `Navigation failed: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  // Loading state
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md w-full">
          <div className="animate-pulse">
            <div className="h-8 bg-indigo-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto mb-6"></div>
            <div className="h-12 bg-indigo-200 rounded-lg w-2/3 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md w-full">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            Passkey DeFi dApp
          </h1>
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
            <p className="text-red-600">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <DynamicWalletProvider connection={connection}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">
            Passkey DeFi dApp
          </h1>

          <p className="text-gray-600 mb-8 text-center">
            Access your Solana portfolio with secure passkey authentication. No
            seed phrases required.
          </p>

          <WalletConnectButton onConnect={handleWalletConnected} />

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-center mb-4">
              <div className="h-px bg-gray-300 w-full"></div>
              <span className="px-4 text-sm text-gray-500">FEATURES</span>
              <div className="h-px bg-gray-300 w-full"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-indigo-500 mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium">Token Portfolio</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-indigo-500 mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8z" />
                    <path d="M12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">Token Swaps</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-indigo-500 mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium">Passkey Auth</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-indigo-500 mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium">Non-custodial</p>
              </div>
            </div>
          </div>

          <p className="mt-8 text-xs text-center text-gray-500">
            Secure, non-custodial wallet powered by LazorKit
          </p>
        </div>
      </div>
    </DynamicWalletProvider>
  );
}

// Client-side only component
function WalletConnectButton({ onConnect }: { onConnect: () => void }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const { isConnected, publicKey, connect } = useWallet();

  // Redirect if already connected
  useEffect(() => {
    if (isConnected && publicKey) {
      onConnect();
    }
  }, [isConnected, publicKey, onConnect]);

  // Connect wallet handler
  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await connect();
      onConnect();
    } catch (err) {
      console.error("Connection failed:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center shadow-md"
    >
      {isConnecting ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Connecting...
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
              clipRule="evenodd"
            />
          </svg>
          Connect with Passkey
        </>
      )}
    </button>
  );
}
