/* eslint-disable @typescript-eslint/no-unused-vars */
// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Buffer } from "buffer";
import dynamic from "next/dynamic";
import { Connection } from "@solana/web3.js";
import { useWallet } from "./components/WalletProvider";
import { Loader2, Key, RefreshCcw, ShieldCheck, Wallet } from "lucide-react";

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
  () => import("./components/WalletProvider"),
  { ssr: false }
);

// Disable SSR for this page
export const dynamicConfig = "force-dynamic";

export default function Home() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connectStage, setConnectStage] = useState(0); // 0: not started, 1: authenticating, 2: connecting, 3: success
  const [error, setError] = useState<string | null>(null);

  // Ensure we're on the client
  useEffect(() => {
    setIsClient(true);
    setIsLoading(false);
  }, []);

  // Handle successful wallet connection
  const handleWalletConnected = () => {
    // Show success animation before redirecting
    setConnectStage(3);

    // Add delay before redirect for better UX
    setTimeout(() => {
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
    }, 2000);
  };

  // Loading state
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <Loader2 className="h-16 w-16 text-indigo-500 animate-spin mb-4" />
          <div className="h-4 bg-indigo-900 rounded w-32"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-red-500 p-8 rounded-2xl max-w-md w-full">
          <h1 className="text-3xl font-bold mb-4 text-indigo-400">
            Connection Error
          </h1>
          <div className="bg-red-900/30 border border-red-700 p-4 rounded-lg mb-6">
            <p className="text-red-300">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all duration-300 shadow-lg shadow-indigo-700/50"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <DynamicWalletProvider connection={connection}>
      <div className="min-h-screen bg-gradient-to-b from-black to-indigo-950 text-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background Effect */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

          {/* Animated Gradient Orb */}
          <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 left-40 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>

          <div className="container mx-auto px-6 py-16 relative z-10">
            <nav className="flex justify-between items-center mb-16">
              <div className="flex items-center space-x-2">
                <div className="bg-indigo-600 rounded-lg p-2">
                  <Key className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  LAZOR<span className="text-indigo-400">VAULT</span>
                </span>
              </div>

              <div className="hidden md:flex space-x-8 text-gray-300 text-sm">
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  Features
                </a>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  Security
                </a>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  Docs
                </a>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  About
                </a>
              </div>
            </nav>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="lg:w-1/2">
                <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    Next-Gen DeFi
                  </span>
                  <br />
                  <span className="text-white">Powered by Passkeys</span>
                </h1>

                <p className="text-gray-300 text-lg mb-8 max-w-lg">
                  Access your Solana assets with unparalleled security. No seed
                  phrases, no compromises – just seamless blockchain interaction
                  secured by biometric authentication.
                </p>

                <WalletConnectButton
                  onConnect={handleWalletConnected}
                  connectStage={connectStage}
                  setConnectStage={setConnectStage}
                />

                <div className="flex items-center mt-8 text-sm text-gray-400">
                  <ShieldCheck className="h-5 w-5 mr-2 text-indigo-400" />
                  <span>Your keys, your crypto. Always non-custodial.</span>
                </div>
              </div>

              <div className="lg:w-1/2 relative">
                <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-lg border border-indigo-800/50 rounded-2xl p-6 shadow-2xl">
                  <div className="absolute -top-4 -right-4 bg-indigo-600 rounded-lg p-2 shadow-lg">
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>

                  <div className="flex items-center mb-6">
                    <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <div className="text-sm text-gray-400">My Portfolio</div>
                      <div className="text-sm text-indigo-400">$1,432.89</div>
                    </div>
                    <div className="bg-indigo-900/50 h-1 rounded-full">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1 rounded-full w-3/4"></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        icon: "SOL",
                        name: "Solana",
                        amount: "1.5 SOL",
                        value: "$150.75",
                        change: "+2.3%",
                      },
                      {
                        icon: "USDC",
                        name: "USD Coin",
                        amount: "200.45 USDC",
                        value: "$200.45",
                        change: "+0.01%",
                      },
                      {
                        icon: "ETH",
                        name: "Ethereum",
                        amount: "0.1 ETH",
                        value: "$350.25",
                        change: "-1.2%",
                      },
                    ].map((token, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-black/20 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 h-8 w-8 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-xs font-bold">
                              {token.icon}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{token.name}</div>
                            <div className="text-sm text-gray-400">
                              {token.amount}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div>{token.value}</div>
                          <div
                            className={`text-sm ${
                              token.change.startsWith("+")
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {token.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center py-2 bg-indigo-800/50 hover:bg-indigo-700/50 rounded-lg text-sm transition-colors">
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      Swap
                    </button>
                    <button className="flex items-center justify-center py-2 bg-indigo-800/50 hover:bg-indigo-700/50 rounded-lg text-sm transition-colors">
                      <Wallet className="h-4 w-4 mr-2" />
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-6 py-24">
          <h2 className="text-center text-3xl font-bold mb-16">
            Cutting-Edge Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Wallet className="h-8 w-8" />,
                title: "Non-Custodial",
                description:
                  "Full control of your assets with no intermediaries",
              },
              {
                icon: <ShieldCheck className="h-8 w-8" />,
                title: "Passkey Security",
                description: "Biometric authentication with no seed phrases",
              },
              {
                icon: <RefreshCcw className="h-8 w-8" />,
                title: "Instant Swaps",
                description: "Trade tokens with lightning-fast execution",
              },
              {
                icon: <Key className="h-8 w-8" />,
                title: "Cross-Chain",
                description: "Access DeFi across multiple blockchain networks",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-indigo-900/20 backdrop-blur-sm border border-indigo-800/30 rounded-xl p-6 hover:bg-indigo-800/20 transition-colors"
              >
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-lg inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-indigo-900/50 py-8">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="bg-indigo-800 rounded-lg p-1">
                  <Key className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-bold">
                  LAZOR<span className="text-indigo-400">VAULT</span>
                </span>
              </div>

              <div className="text-sm text-gray-500">
                Powered by LazorKit — Advanced Web3 Authentication
              </div>
            </div>
          </div>
        </footer>
      </div>
    </DynamicWalletProvider>
  );
}

// Client-side only component with a multi-stage authentication process
function WalletConnectButton({
  onConnect,
  connectStage,
  setConnectStage,
}: {
  onConnect: () => void;
  connectStage: number;
  setConnectStage: (stage: number) => void;
}) {
  const [animationComplete, setAnimationComplete] = useState(false);
  const { isConnected, publicKey, connect } = useWallet();

  // Redirect if already connected
  useEffect(() => {
    if (isConnected && publicKey && connectStage === 3) {
      onConnect();
    }
  }, [isConnected, publicKey, onConnect, connectStage]);

  // Connect wallet handler with staged approach
  const handleConnect = async () => {
    try {
      // Stage 1: Authenticating
      setConnectStage(1);

      // Add a deliberate delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Stage 2: Connecting
      setConnectStage(2);

      // Connect to wallet
      await connect();

      // Stage 3: Success
      setConnectStage(3);

      // Animation before redirect
      setTimeout(() => {
        setAnimationComplete(true);
        onConnect();
      }, 1000);
    } catch (err) {
      console.error("Connection failed:", err);
      setConnectStage(0);
    }
  };

  // Staged button states
  const buttonContent = () => {
    switch (connectStage) {
      case 1:
        return (
          <>
            <Loader2 className="animate-spin mr-3 h-5 w-5" />
            Authenticating with Passkey...
          </>
        );
      case 2:
        return (
          <>
            <Loader2 className="animate-spin mr-3 h-5 w-5" />
            Connecting to Wallet...
          </>
        );
      case 3:
        return (
          <>
            <ShieldCheck className="mr-3 h-5 w-5" />
            Connection Successful!
          </>
        );
      default:
        return (
          <>
            <Key className="mr-3 h-5 w-5" />
            Connect with Passkey
          </>
        );
    }
  };

  return (
    <button
      onClick={connectStage === 0 ? handleConnect : undefined}
      disabled={connectStage !== 0}
      className={`flex items-center justify-center px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 shadow-lg ${
        connectStage === 3
          ? "bg-green-600 shadow-green-700/50"
          : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-700/50"
      } ${connectStage !== 0 ? "cursor-default" : "cursor-pointer"}`}
    >
      {buttonContent()}
    </button>
  );
}
