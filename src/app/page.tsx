/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
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
  Wallet,
  Activity,
  Settings,
  Key,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";

if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com"
);

export const dynamic = "force-dynamic";

export default function Dashboard() {
  return (
    <WalletProvider connection={connection}>
      <DashboardContent />
    </WalletProvider>
  );
}

function DashboardContent() {
  const { isConnected, publicKey, disconnect, programClient } = useWallet();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  interface PortfolioStats {
    totalValue: number;
    dailyChange: number;
    changePct: number;
  }

  const [portfolio, setPortfolio] = useState<Token[]>([]);
  const [walletStats, setWalletStats] = useState<PortfolioStats>({
    totalValue: 0,
    dailyChange: 0,
    changePct: 0,
  });
  const [isSwapOpen, setIsSwapOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<{
    mint: string;
    symbol: string;
    balance: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isConnected && publicKey && programClient) {
      fetchPortfolioData();
    } else if (!isConnected && !isLoading) {
      window.location.href = "/";
    }
  }, [isConnected, publicKey, programClient, isLoading]);

  const fetchPortfolioData = async () => {
    if (!publicKey || !programClient) return;

    setIsLoading(true);
    try {
      let portfolioData = await programClient.fetchPortfolio(publicKey);
      if (!portfolioData) {
        // Initialize portfolio if it doesn't exist
        await programClient.initializePortfolio(publicKey);
        portfolioData = await programClient.fetchPortfolio(publicKey);
      }

      if (!portfolioData) {
        throw new Error("Failed to initialize or fetch portfolio");
      }

      // Fetch token accounts for additional data
      const response = await fetch(
        `/api/portfolio?publicKey=${publicKey.toString()}`
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Since the program doesn't store token data, we'll use the API response
      // For now, we'll use mock token data as a placeholder until the program is extended
      const mockTokens: Token[] = [
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

      setPortfolio(mockTokens);

      // Update wallet stats based on portfolio data
      const totalValue =
        parseFloat(portfolioData.totalValue) ||
        mockTokens.reduce((sum, token) => sum + token.usdValue, 0);
      const previousDayValue = totalValue * 0.99; // Mock previous day value
      const dailyChange = totalValue - previousDayValue;
      const changePct = (dailyChange / previousDayValue) * 100;

      setWalletStats({
        totalValue,
        dailyChange,
        changePct,
      });
    } catch (err) {
      console.error("Error fetching portfolio:", err);
      setError(err instanceof Error ? err.message : "Failed to load portfolio");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwap = (token: {
    mint: string;
    symbol: string;
    balance: string;
  }) => {
    setSelectedToken(token);
    setIsSwapOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-indigo-800 border-t-indigo-500 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Key className="h-6 w-6 text-indigo-500" />
            </div>
          </div>
          <p className="text-indigo-500 animate-pulse">Loading Portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-red-500 p-8 rounded-2xl max-w-lg w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-red-900/30 h-16 w-16 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-center text-white">
            Dashboard Error
          </h1>
          <div className="bg-red-900/30 border border-red-800 p-4 rounded-lg mb-6">
            <p className="text-red-300 text-center">{error}</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all duration-300 shadow-lg shadow-indigo-700/50"
            >
              Retry
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getTokenBgColor = (symbol: string) => {
    const colors: { [key: string]: string } = {
      SOL: "from-blue-600 to-purple-600",
      USDC: "from-blue-500 to-blue-600",
      ETH: "from-purple-600 to-indigo-600",
      BONK: "from-yellow-500 to-orange-500",
      JTO: "from-green-500 to-emerald-600",
    };
    return colors[symbol] || "from-indigo-600 to-purple-600";
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
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
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ChevronDown
              className={`h-5 w-5 transform ${
                isSidebarOpen ? "" : "rotate-180"
              }`}
            />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {[
              {
                name: "Portfolio",
                icon: <BarChart3 className="h-5 w-5" />,
                id: "portfolio",
              },
              {
                name: "Swap",
                icon: <RefreshCw className="h-5 w-5" />,
                id: "swap",
              },
              {
                name: "Send",
                icon: <ArrowUpRight className="h-5 w-5" />,
                id: "send",
              },
              {
                name: "Receive",
                icon: <ArrowDownRight className="h-5 w-5" />,
                id: "receive",
              },
              {
                name: "Activity",
                icon: <Activity className="h-5 w-5" />,
                id: "activity",
              },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center ${
                  isSidebarOpen ? "justify-start px-4" : "justify-center"
                } 
                py-3 rounded-lg transition-colors w-full ${
                  activeTab === item.id
                    ? "bg-indigo-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {isSidebarOpen && <span className="ml-3">{item.name}</span>}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => disconnect()}
            className={`flex items-center ${
              isSidebarOpen ? "justify-start space-x-2 px-4" : "justify-center"
            } 
            py-3 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors w-full`}
          >
            <LogOut className="h-5 w-5" />
            {isSidebarOpen && <span>Disconnect</span>}
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-900 h-16 flex items-center px-6 border-b border-gray-800">
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gray-800 rounded-full py-1 px-4 flex items-center">
              <div className="bg-green-500 h-2 w-2 rounded-full mr-2"></div>
              <span className=" Fauxt-sm text-gray-300 mr-2 hidden md:inline">
                Connected
              </span>
              <div
                className="text-sm text-gray-300 cursor-pointer flex items-center group"
                onClick={() =>
                  copyToClipboard(publicKey ? publicKey.toString() : "")
                }
              >
                {publicKey && (
                  <span className="hidden md:inline">
                    {publicKey.toString().slice(0, 4)}...
                    {publicKey.toString().slice(-4)}
                  </span>
                )}
                <Copy className="h-4 w-4 ml-1 opacity-50 group-hover:opacity-100" />
              </div>
            </div>
            <button className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-black p-6">
          <div className="lg:grid lg:grid-cols-4 gap-6 mb-8">
            <div className="col-span-3 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/60 shadow-xl mb-6 lg:mb-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Portfolio Overview</h2>
                <button
                  onClick={fetchPortfolioData}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  <span className="text-sm">Refresh</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                  <div className="text-sm text-gray-400">Total Balance</div>
                  <div className="text-2xl font-bold mt-1">
                    ${walletStats.totalValue.toFixed(2)}
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                  <div className="text-sm text-gray-400">24h Change</div>
                  <div
                    className={`text-2xl font-bold mt-1 flex items-center ${
                      walletStats.dailyChange >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {walletStats.dailyChange >= 0 ? (
                      <ArrowUpRight className="h-5 w-5 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5 mr-1" />
                    )}
                    ${Math.abs(walletStats.dailyChange).toFixed(2)}
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                  <div className="text-sm text-gray-400">Percentage Change</div>
                  <div
                    className={`text-2xl font-bold mt-1 flex items-center ${
                      walletStats.changePct >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {walletStats.changePct >= 0 ? (
                      <ArrowUpRight className="h-5 w-5 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5 mr-1" />
                    )}
                    {Math.abs(walletStats.changePct).toFixed(2)}%
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-xl h-64 flex items-center justify-center border border-gray-700/30">
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Portfolio Chart</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/60 shadow-xl">
              <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <button
                  onClick={() =>
                    portfolio.length > 0 &&
                    handleSwap({
                      mint: portfolio[0].mint,
                      symbol: portfolio[0].symbol,
                      balance: portfolio[0].balance,
                    })
                  }
                  className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl transition-colors flex items-center justify-center"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  <span>Swap Tokens</span>
                </button>
                <button className="w-full bg-gray-800 hover:bg-gray-700 py-3 rounded-xl transition-colors flex items-center justify-center">
                  <ArrowUpRight className="h-5 w-5 mr-2" />
                  <span>Send</span>
                </button>
                <button className="w-full bg-gray-800 hover:bg-gray-700 py-3 rounded-xl transition-colors flex items-center justify-center">
                  <ArrowDownRight className="h-5 w-5 mr-2" />
                  <span>Receive</span>
                </button>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-800">
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                  <span>Network</span>
                  <span className="flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                    Solana Devnet
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Protection</span>
                  <span className="flex items-center text-green-500">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
          <PortfolioTable portfolio={portfolio} onSwap={handleSwap} />
        </main>
      </div>
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
