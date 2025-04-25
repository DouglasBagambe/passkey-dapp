/* eslint-disable @typescript-eslint/no-unused-vars */
// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Buffer } from "buffer";
import WalletProvider, { useWallet } from "../components/WalletProvider";
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
  Zap,
  Key,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";

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

// Main Dashboard wrapper component
export default function Dashboard() {
  return (
    <WalletProvider connection={connection}>
      <DashboardContent />
    </WalletProvider>
  );
}

// DashboardContent component that uses the wallet context
function DashboardContent() {
  const { isConnected, publicKey, disconnect } = useWallet();
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

  const [portfolio, setPortfolio] = useState<Token[]>([]);
  const [isSwapOpen, setIsSwapOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<{
    mint: string;
    symbol: string;
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

  // Handle wallet connection effect
  useEffect(() => {
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
  }, [isConnected, publicKey, isLoading]);

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
        {
          mint: "RLBxxFkseAZ4RgJH3Sqn8jXxhmGoz9jWxDNJMh8pL7a",
          symbol: "JTO",
          name: "Jito",
          icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/JitoSOLkwqnnpqe3wvjPP1xBYxEMGFKASCHFcbypdHu/logo.png",
          balance: "15.75",
          usdValue: 85.36,
          price: 5.42,
          change24h: 3.8,
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
    // Could add a toast notification here
  };

  // Loading state
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

  // Main dashboard UI with dark theme
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-900 h-16 flex items-center px-6 border-b border-gray-800">
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>

          {/* Wallet Controls */}
          <div className="flex items-center space-x-4">
            <div className="bg-gray-800 rounded-full py-1 px-4 flex items-center">
              <div className="bg-green-500 h-2 w-2 rounded-full mr-2"></div>
              <span className="text-sm text-gray-300 mr-2 hidden md:inline">
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

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-black p-6">
          {/* Portfolio Overview */}
          <div className="lg:grid lg:grid-cols-4 gap-6 mb-8">
            <div className="col-span-3 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/60 shadow-xl mb-6 lg:mb-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Portfolio Overview</h2>
                <button className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center">
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

              {/* Portfolio Chart (Placeholder) */}
              <div className="bg-gray-800/50 rounded-xl h-64 flex items-center justify-center border border-gray-700/30">
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Portfolio Chart</p>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/60 shadow-xl">
              <h2 className="text-xl font-bold mb-6">Quick Actions</h2>

              <div className="space-y-4">
                <button className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl transition-colors flex items-center justify-center">
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
                    Solana Mainnet
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

          {/* Portfolio Assets */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/60 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Your Assets</h2>
              <div className="flex space-x-2">
                <button className="text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg px-3 py-1 text-sm">
                  Sort by Value
                </button>
                <button className="text-gray-400 hover:text-white transition-colors bg-gray-800/50 hover:bg-gray-700/50 rounded-lg px-3 py-1 text-sm">
                  Filter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
                    <th className="pb-4 pl-4">Asset</th>
                    <th className="pb-4">Balance</th>
                    <th className="pb-4">Price</th>
                    <th className="pb-4">Value</th>
                    <th className="pb-4">24h</th>
                    <th className="pb-4 text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((token) => (
                    <tr
                      key={token.mint}
                      className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors"
                    >
                      <td className="py-4 pl-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`h-10 w-10 rounded-lg bg-gradient-to-br ${getTokenBgColor(
                              token.symbol
                            )} flex items-center justify-center font-bold text-white`}
                          >
                            {token.symbol}
                          </div>
                          <div>
                            <div className="font-medium">{token.name}</div>
                            <div className="text-sm text-gray-400">
                              {token.symbol}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="font-mono">
                          {parseFloat(token.balance).toLocaleString(undefined, {
                            maximumFractionDigits:
                              token.symbol === "BONK" ? 0 : 4,
                          })}
                        </div>
                      </td>
                      <td>
                        <div className="font-mono">
                          $
                          {token.price < 0.01
                            ? token.price.toExponential(2)
                            : token.price.toFixed(2)}
                        </div>
                      </td>
                      <td>
                        <div className="font-medium">
                          ${token.usdValue.toFixed(2)}
                        </div>
                      </td>
                      <td>
                        <div
                          className={`flex items-center ${
                            token.change24h >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {token.change24h >= 0 ? (
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 mr-1" />
                          )}
                          {Math.abs(token.change24h).toFixed(2)}%
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() =>
                              handleSwap({
                                mint: token.mint,
                                symbol: token.symbol,
                                balance: token.balance,
                              })
                            }
                            className="bg-indigo-600/20 hover:bg-indigo-600/40 p-2 rounded-lg transition-colors"
                          >
                            <RefreshCw className="h-4 w-4 text-indigo-400" />
                          </button>
                          <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors">
                            <ArrowUpRight className="h-4 w-4" />
                          </button>
                          <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors">
                            <ArrowDownRight className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Swap Modal */}
      {isSwapOpen && selectedToken && (
        <TokenSwapModal
          token={selectedToken}
          onClose={() => setIsSwapOpen(false)}
        />
      )}
    </div>
  );
}

// Token Swap Modal Component
function TokenSwapModal({
  token,
  onClose,
}: {
  token: { mint: string; symbol: string; balance: string };
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [targetToken, setTargetToken] = useState("USDC");
  const [isSwapping, setIsSwapping] = useState(false);
  const [quote, setQuote] = useState({
    rate: 0,
    receiveAmount: 0,
    fee: 0,
    slippage: 0.5,
  });

  // Token options for swap
  const tokenOptions = ["USDC", "SOL", "ETH", "BONK", "JTO"].filter(
    (t) => t !== token.symbol
  );

  // Calculate mock quote on amount change
  useEffect(() => {
    if (!amount || isNaN(parseFloat(amount))) {
      setQuote({
        rate: 0,
        receiveAmount: 0,
        fee: 0,
        slippage: 0.5,
      });
      return;
    }

    // Mock exchange rates
    const rates: { [key: string]: { [key: string]: number } } = {
      SOL: { USDC: 100.5, ETH: 0.03, BONK: 1000000, JTO: 20 },
      USDC: { SOL: 0.01, ETH: 0.0003, BONK: 10000, JTO: 0.2 },
      ETH: { SOL: 33, USDC: 3500, BONK: 30000000, JTO: 700 },
      BONK: { SOL: 0.000001, USDC: 0.0000001, ETH: 0.00000003, JTO: 0.00002 },
      JTO: { SOL: 0.05, USDC: 5, ETH: 0.0015, BONK: 50000 },
    };

    const rate = rates[token.symbol]?.[targetToken] || 0;
    const inputAmount = parseFloat(amount);
    const outputAmount = inputAmount * rate;
    const fee = outputAmount * 0.005; // 0.5% fee

    setQuote({
      rate,
      receiveAmount: outputAmount - fee,
      fee,
      slippage: 0.5,
    });
  }, [amount, targetToken, token.symbol]);

  const handleSwap = () => {
    setIsSwapping(true);

    // Simulate API call
    setTimeout(() => {
      setIsSwapping(false);
      onClose();
    }, 2000);
  };

  const maxAmount = parseFloat(token.balance);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-bold">Swap Tokens</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">From</label>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700/50">
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <div
                    className={`h-8 w-8 rounded-lg bg-gradient-to-br ${
                      token.symbol === "SOL"
                        ? "from-blue-600 to-purple-600"
                        : token.symbol === "USDC"
                        ? "from-blue-500 to-blue-600"
                        : token.symbol === "ETH"
                        ? "from-purple-600 to-indigo-600"
                        : token.symbol === "BONK"
                        ? "from-yellow-500 to-orange-500"
                        : "from-indigo-600 to-purple-600"
                    } 
                    flex items-center justify-center font-bold text-sm mr-2`}
                  >
                    {token.symbol}
                  </div>
                  <span className="font-medium">{token.symbol}</span>
                </div>
                <div className="text-sm text-gray-400">
                  Balance: {parseFloat(token.balance).toLocaleString()}
                </div>
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  className="bg-transparent border-0 text-xl font-medium focus:outline-none flex-1"
                />
                <button
                  onClick={() => setAmount(token.balance)}
                  className="text-xs bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-400 px-2 rounded transition-colors"
                >
                  MAX
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center -my-2">
            <button className="bg-gray-800 p-2 rounded-full border border-gray-700 hover:bg-gray-700 transition-colors">
              <RefreshCw className="h-5 w-5 text-indigo-400" />
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">To</label>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700/50">
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <div className="relative">
                    <select
                      value={targetToken}
                      onChange={(e) => setTargetToken(e.target.value)}
                      className="appearance-none bg-transparent border border-gray-700 rounded-lg pl-10 pr-8 py-1 focus:outline-none focus:border-indigo-500"
                    >
                      {tokenOptions.map((option) => (
                        <option
                          key={option}
                          value={option}
                          className="bg-gray-800"
                        >
                          {option}
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-10">
                      <div
                        className={`h-6 w-6 rounded-full bg-gradient-to-br ${
                          targetToken === "SOL"
                            ? "from-blue-600 to-purple-600"
                            : targetToken === "USDC"
                            ? "from-blue-500 to-blue-600"
                            : targetToken === "ETH"
                            ? "from-purple-600 to-indigo-600"
                            : targetToken === "BONK"
                            ? "from-yellow-500 to-orange-500"
                            : "from-green-500 to-emerald-600"
                        } 
                        flex items-center justify-center font-bold text-xs`}
                      >
                        {targetToken.slice(0, 1)}
                      </div>
                    </div>
                    <div className="absolute right-0 top-0 bottom-0 flex items-center pr-2">
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={
                    quote.receiveAmount ? quote.receiveAmount.toFixed(6) : "0.0"
                  }
                  readOnly
                  className="bg-transparent border-0 text-xl font-medium focus:outline-none flex-1"
                />
              </div>
            </div>
          </div>

          {amount && !isNaN(parseFloat(amount)) && (
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6 text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Rate</span>
                <span>
                  1 {token.symbol} ≈ {quote.rate.toFixed(6)} {targetToken}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Fee (0.5%)</span>
                <span>
                  {quote.fee.toFixed(6)} {targetToken}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Slippage Tolerance</span>
                <span>{quote.slippage}%</span>
              </div>
            </div>
          )}

          <button
            onClick={handleSwap}
            disabled={
              !amount ||
              isNaN(parseFloat(amount)) ||
              parseFloat(amount) <= 0 ||
              parseFloat(amount) > maxAmount ||
              isSwapping
            }
            className={`w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center
              ${
                isSwapping
                  ? "bg-indigo-700 cursor-not-allowed"
                  : !amount ||
                    isNaN(parseFloat(amount)) ||
                    parseFloat(amount) <= 0 ||
                    parseFloat(amount) > maxAmount
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-900/50"
              }`}
          >
            {isSwapping ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Swapping...
              </>
            ) : !amount || isNaN(parseFloat(amount)) ? (
              "Enter an amount"
            ) : parseFloat(amount) > maxAmount ? (
              "Insufficient balance"
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                Swap Tokens
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
