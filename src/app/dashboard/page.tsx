/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect, SetStateAction } from "react";
import { Connection } from "@solana/web3.js";
import { Buffer } from "buffer";
import WalletProvider, { useWallet } from "../components/WalletProvider";
import SwapModal from "../components/SwapModal";
import {
  Copy,
  ArrowDownUp,
  Send,
  Wallet,
  Clock,
  Menu,
  X,
  RefreshCw,
  LogOut,
} from "lucide-react";

// Client-side polyfills
if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

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
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("assets");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSwapOpen, setIsSwapOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);

  // Sample data
  const mockAssets = [
    {
      symbol: "SOL",
      name: "Solana",
      balance: "1.5",
      value: 150.75,
      change: 2.3,
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      balance: "200.45",
      value: 200.45,
      change: 0.01,
    },
  ];

  const [assets, setAssets] = useState<
    {
      symbol: string;
      name: string;
      balance: string;
      value: number;
      change: number;
    }[]
  >([]);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    setIsClient(true);
    // Simulate loading data
    setTimeout(() => {
      setAssets(mockAssets);
      setTotalValue(mockAssets.reduce((sum, asset) => sum + asset.value, 0));
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSwap = (token: SetStateAction<null>) => {
    setSelectedToken(token);
    setIsSwapOpen(true);
  };

  const copyAddress = () => {
    if (publicKey) navigator.clipboard.writeText(publicKey.toString());
  };

  const navItems = [
    { id: "assets", label: "Assets", icon: <Wallet size={18} /> },
    { id: "swap", label: "Swap", icon: <ArrowDownUp size={18} /> },
    { id: "send", label: "Send", icon: <Send size={18} /> },
    { id: "history", label: "History", icon: <Clock size={18} /> },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 flex">
      {/* Mobile menu toggle */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-blue-500 text-white rounded-full shadow-lg"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar - desktop permanent, mobile as overlay */}
      <div
        className={`
        ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        } 
        fixed md:static z-20 transition-transform duration-300
        bg-white border-r w-64 h-screen flex flex-col shadow-lg
      `}
      >
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">Wallet Dashboard</h1>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    flex items-center space-x-3 w-full p-3 rounded-lg transition-colors
                    ${
                      activeTab === item.id
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "hover:bg-gray-100"
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={disconnect}
            className="flex items-center space-x-2 text-red-500 p-3 w-full rounded-lg hover:bg-red-50"
          >
            <LogOut size={18} />
            <span>Disconnect</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b p-4 flex items-center justify-between shadow-sm">
          <h2 className="text-xl font-semibold">
            {navItems.find((item) => item.id === activeTab)?.label ||
              "Dashboard"}
          </h2>

          {publicKey && (
            <div
              onClick={copyAddress}
              className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-200"
            >
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm">{`${publicKey
                .toString()
                .slice(0, 4)}...${publicKey.toString().slice(-4)}`}</span>
              <Copy size={14} className="text-gray-500" />
            </div>
          )}
        </header>

        {/* Dynamic content area */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          {activeTab === "assets" && (
            <div className="space-y-6">
              {/* Balance card */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
                <p className="text-blue-100">Total Balance</p>
                <h3 className="text-3xl font-bold">${totalValue.toFixed(2)}</h3>
              </div>

              {/* Assets list */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-4 border-b">
                  <h3 className="font-medium">Your Assets</h3>
                </div>
                <div className="divide-y">
                  {assets.map((asset, index) => (
                    <div
                      key={index}
                      className="p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            asset.symbol === "SOL"
                              ? "bg-blue-500"
                              : "bg-green-500"
                          } text-white font-bold`}
                        >
                          {asset.symbol.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{asset.name}</div>
                          <div className="text-sm text-gray-500">
                            {asset.balance} {asset.symbol}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ${asset.value.toFixed(2)}
                        </div>
                        <div
                          className={
                            asset.change >= 0
                              ? "text-green-500 text-sm"
                              : "text-red-500 text-sm"
                          }
                        >
                          {asset.change >= 0 ? "+" : ""}
                          {asset.change}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab("swap")}
                  className="bg-blue-500 text-white p-4 rounded-xl flex items-center justify-center space-x-2 shadow-sm hover:bg-blue-600"
                >
                  <ArrowDownUp size={18} />
                  <span>Swap</span>
                </button>
                <button
                  onClick={() => setActiveTab("send")}
                  className="bg-white text-gray-800 p-4 rounded-xl flex items-center justify-center space-x-2 shadow-sm border hover:bg-gray-50"
                >
                  <Send size={18} />
                  <span>Send</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === "swap" && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-medium mb-4">Swap Tokens</h3>
              <p className="text-gray-500">
                Select tokens to swap from the assets list
              </p>
            </div>
          )}

          {activeTab === "send" && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-medium mb-4">Send Tokens</h3>
              <p className="text-gray-500">
                Send your tokens to another wallet
              </p>
            </div>
          )}

          {activeTab === "history" && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-medium mb-4">Transaction History</h3>
              <p className="text-gray-500">
                Your recent transactions will appear here
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Swap Modal */}
      {isSwapOpen && selectedToken && publicKey && (
        <SwapModal
          token={selectedToken}
          publicKey={publicKey}
          onClose={() => setIsSwapOpen(false)}
        />
      )}
    </div>
  );
}
