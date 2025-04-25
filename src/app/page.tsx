/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Connection } from "@solana/web3.js";
import { Buffer } from "buffer";
import WalletProvider, { useWallet } from "./components/WalletProvider";
import PortfolioTable from "./components/PortfolioTable";
import SwapModal from "./components/SwapModal";
import {
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  ChevronDown,
  LogOut,
  Copy,
  BarChart3,
  Activity,
  Settings,
  Key,
} from "lucide-react";
import { Token } from "./types";

if (typeof window !== "undefined") window.Buffer = Buffer;

const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com"
);

export default function Dashboard() {
  return (
    <WalletProvider connection={connection}>
      <DashboardContent />
    </WalletProvider>
  );
}

function DashboardContent() {
  const { isConnected, publicKey, disconnect } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSwapOpen, setIsSwapOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  // Mock data for immediate display
  const mockTokens = [
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
  ];

  const [portfolio, setPortfolio] = useState(mockTokens);
  const [walletStats, setWalletStats] = useState({
    totalValue: mockTokens.reduce((sum, token) => sum + token.usdValue, 0),
    dailyChange: 3.5,
    changePct: 1.2,
  });

  useEffect(() => {
    if (!isConnected && !isLoading) {
      window.location.href = "/";
    }
  }, [isConnected, isLoading]);

  const handleSwap = (token: Token): void => {
    setSelectedToken(token);
    setIsSwapOpen(true);
  };

  // Navigation items
  const navItems = [
    {
      id: "portfolio",
      name: "Portfolio",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    { id: "swap", name: "Swap", icon: <RefreshCw className="h-5 w-5" /> },
    { id: "send", name: "Send", icon: <ArrowUpRight className="h-5 w-5" /> },
    {
      id: "receive",
      name: "Receive",
      icon: <ArrowDownRight className="h-5 w-5" />,
    },
    {
      id: "activity",
      name: "Activity",
      icon: <Activity className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 h-screen ${
          isSidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 flex flex-col border-r border-gray-800`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-800 h-16">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 rounded-lg p-2">
              <Key className="h-5 w-5 text-white" />
            </div>
            {isSidebarOpen && <span className="font-bold">LAZORVAULT</span>}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-400 hover:text-white"
          >
            <ChevronDown
              className={`h-5 w-5 transform ${
                isSidebarOpen ? "" : "rotate-180"
              }`}
            />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center ${
                  isSidebarOpen ? "justify-start px-4" : "justify-center"
                } 
                py-3 rounded-lg w-full ${
                  activeTab === item.id
                    ? "bg-indigo-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                {isSidebarOpen && <span className="ml-3">{item.name}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* Disconnect button */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={disconnect}
            className={`flex items-center ${
              isSidebarOpen ? "justify-start px-4" : "justify-center"
            } 
            py-3 rounded-lg text-red-400 hover:bg-red-900/20 w-full`}
          >
            <LogOut className="h-5 w-5" />
            {isSidebarOpen && <span className="ml-2">Disconnect</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-900 h-16 flex items-center px-6 border-b border-gray-800">
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gray-800 rounded-full py-1 px-4 flex items-center">
              <div className="bg-green-500 h-2 w-2 rounded-full mr-2"></div>
              <span className="text-sm text-gray-300 mr-2 hidden md:inline">
                Connected
              </span>
              {publicKey && (
                <div className="text-sm text-gray-300 cursor-pointer flex items-center">
                  <span className="hidden md:inline">
                    {publicKey.toString().slice(0, 4)}...
                    {publicKey.toString().slice(-4)}
                  </span>
                  <Copy className="h-4 w-4 ml-1 opacity-50 hover:opacity-100" />
                </div>
              )}
            </div>
            <button className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Main area */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-black p-6">
          {activeTab === "portfolio" && (
            <>
              {/* Portfolio overview */}
              <div className="lg:grid lg:grid-cols-4 gap-6 mb-8">
                <div className="col-span-3 bg-gray-900/50 rounded-2xl p-6 border border-gray-800/60 mb-6 lg:mb-0">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Portfolio Overview</h2>
                    <button className="text-indigo-400 hover:text-indigo-300 flex items-center">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      <span className="text-sm">Refresh</span>
                    </button>
                  </div>

                  {/* Stats cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                      <div className="text-sm text-gray-400">Total Balance</div>
                      <div className="text-2xl font-bold mt-1">
                        ${walletStats.totalValue.toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                      <div className="text-sm text-gray-400">24h Change</div>
                      <div className="text-2xl font-bold mt-1 flex items-center text-green-500">
                        <ArrowUpRight className="h-5 w-5 mr-1" />$
                        {walletStats.dailyChange.toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                      <div className="text-sm text-gray-400">
                        Percentage Change
                      </div>
                      <div className="text-2xl font-bold mt-1 flex items-center text-green-500">
                        <ArrowUpRight className="h-5 w-5 mr-1" />
                        {walletStats.changePct.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  {/* Chart placeholder */}
                  <div className="bg-gray-800/50 rounded-xl h-64 flex items-center justify-center border border-gray-700/30">
                    <div className="text-center text-gray-500">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Portfolio Chart</p>
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/60">
                  <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                  <div className="space-y-4">
                    <button
                      onClick={() => handleSwap(portfolio[0])}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl flex items-center justify-center"
                    >
                      <RefreshCw className="h-5 w-5 mr-2" />
                      <span>Swap Tokens</span>
                    </button>
                    <button className="w-full bg-gray-800 hover:bg-gray-700 py-3 rounded-xl flex items-center justify-center">
                      <ArrowUpRight className="h-5 w-5 mr-2" />
                      <span>Send</span>
                    </button>
                    <button className="w-full bg-gray-800 hover:bg-gray-700 py-3 rounded-xl flex items-center justify-center">
                      <ArrowDownRight className="h-5 w-5 mr-2" />
                      <span>Receive</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Portfolio table */}
              <PortfolioTable portfolio={portfolio} onSwap={handleSwap} />
            </>
          )}

          {activeTab !== "portfolio" && (
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/60">
              <h2 className="text-2xl font-bold mb-6">
                {navItems.find((item) => item.id === activeTab)?.name}
              </h2>
              <p className="text-gray-400">This feature is coming soon.</p>
            </div>
          )}
        </main>
      </div>

      {/* Swap Modal */}
      {isSwapOpen && selectedToken && (
        <SwapModal
          token={selectedToken}
          publicKey={publicKey}
          onClose={() => setIsSwapOpen(false)}
        />
      )}
    </div>
  );
}
