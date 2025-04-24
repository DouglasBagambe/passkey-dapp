/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
// client/pages/dashboard.tsx
"use client";

import { useState, useEffect, ReactNode } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Buffer } from "buffer";
import WalletControls from "../components/WalletControls";
import PortfolioTable from "../components/PortfolioTable";
import SwapModal from "../components/SwapModal";
import WalletProvider from "../components/WalletProvider";

// Client-side polyfills
if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

// Connection is initialized only on the client
const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com"
);

// Disable SSR for this page
export const dynamic = "force-dynamic";

// Define the type for the render prop function
type WalletRenderProps = {
  isConnected: boolean;
  publicKey: PublicKey | null;
  disconnect: () => void;
};

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  interface Token {
    mint: string;
    symbol: string;
    name: string;
    icon: string;
    balance: string;
    usdValue: number;
    price: number;
    change24h: number;
  }

  const [portfolio, setPortfolio] = useState<Token[]>([]);
  const [isSwapOpen, setIsSwapOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<{
    mint: string;
    balance: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [walletStats, setWalletStats] = useState({
    totalValue: 0,
    dailyChange: 0,
    changePct: 0,
  });

  // Ensure we're on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle wallet functions
  const handleWalletConnect = (
    isConnected: boolean,
    publicKey: PublicKey | null
  ) => {
    if (isConnected && publicKey) {
      console.log(
        "Dashboard initialized, wallet connected:",
        publicKey.toString()
      );

      // Fetch mock portfolio data
      fetchMockPortfolioData();
    } else if (!isConnected && !isLoading) {
      // If not connected and not in initial loading state, redirect to home
      window.location.href = "/";
    }
  };

  const fetchMockPortfolioData = () => {
    // Simulate API call delay
    setTimeout(() => {
      const mockPortfolio = [
        {
          mint: "So11111111111111111111111111111111111111112",
          symbol: "SOL",
          name: "Solana",
          icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
          balance: "1.5",
          usdValue: 150.75,
          price: 100.5,
          change24h: 2.3,
        },
        {
          mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          symbol: "USDC",
          name: "USD Coin",
          icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
          balance: "200.45",
          usdValue: 200.45,
          price: 1.0,
          change24h: 0.01,
        },
        {
          mint: "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs",
          symbol: "ETH",
          name: "Ethereum (Wormhole)",
          icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs/logo.png",
          balance: "0.1",
          usdValue: 350.25,
          price: 3502.5,
          change24h: -1.2,
        },
        {
          mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
          symbol: "BONK",
          name: "Bonk",
          icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png",
          balance: "100000",
          usdValue: 12.34,
          price: 0.0000001234,
          change24h: 5.6,
        },
      ];

      setPortfolio(mockPortfolio);

      // Calculate wallet statistics
      const totalValue = mockPortfolio.reduce(
        (sum, token) => sum + token.usdValue,
        0
      );
      const previousDayValue = mockPortfolio.reduce(
        (sum, token) => sum + token.usdValue / (1 + token.change24h / 100),
        0
      );
      const dailyChange = totalValue - previousDayValue;
      const changePct = (dailyChange / previousDayValue) * 100;

      setWalletStats({
        totalValue,
        dailyChange,
        changePct,
      });

      setIsLoading(false);
    }, 1000);
  };

  const handleSwap = (token: { mint: string; balance: string }) => {
    setSelectedToken(token);
    setIsSwapOpen(true);
  };

  // Loading state
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-64 bg-gray-200 rounded w-full max-w-4xl mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 max-w-lg bg-white rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4">Portfolio Dashboard</h1>
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
            <p className="text-red-600">{error}</p>
          </div>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Create a properly typed render function
  const renderWalletContent = (props: WalletRenderProps): ReactNode => {
    const { isConnected, publicKey, disconnect } = props;

    // Call handler after component mount
    useEffect(() => {
      handleWalletConnect(isConnected, publicKey);
    }, [isConnected, publicKey]);

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Passkey DeFi dApp
              </h1>
              <WalletControls publicKey={publicKey} disconnect={disconnect} />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Portfolio Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-500 mb-1">Total Balance</p>
              <h2 className="text-3xl font-bold">
                ${walletStats.totalValue.toFixed(2)}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-500 mb-1">24h Change</p>
              <h2
                className={`text-3xl font-bold ${
                  walletStats.dailyChange >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {walletStats.dailyChange >= 0 ? "+" : ""}$
                {walletStats.dailyChange.toFixed(2)}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-500 mb-1">Percentage Change</p>
              <h2
                className={`text-3xl font-bold ${
                  walletStats.changePct >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {walletStats.changePct >= 0 ? "+" : ""}
                {walletStats.changePct.toFixed(2)}%
              </h2>
            </div>
          </div>

          {/* Tabs (for future expansion) */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button className="border-indigo-500 text-indigo-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Portfolio
              </button>
              <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Swap
              </button>
              <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Activity
              </button>
            </nav>
          </div>

          {/* Main content */}
          <PortfolioTable portfolio={portfolio} onSwap={handleSwap} />

          {/* Swap Modal */}
          {isSwapOpen && (
            <SwapModal
              token={selectedToken}
              publicKey={publicKey}
              onClose={() => setIsSwapOpen(false)}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              Powered by LazorKit — Secure, non-custodial wallet with passkey
              authentication
            </p>
          </div>
        </footer>
      </div>
    );
  };

  return (
    <WalletProvider connection={connection}>
      {(isConnected, publicKey, disconnect) =>
        renderWalletContent({ isConnected, publicKey, disconnect })
      }
    </WalletProvider>
  );
}
