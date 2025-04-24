/* eslint-disable @typescript-eslint/no-unused-vars */
// client/pages/dashboard.tsx

"use client";
import { useWallet } from "@lazorkit/wallet";
import { Connection } from "@solana/web3.js";
import { SetStateAction, useEffect, useState } from "react";
import WalletControls from "../components/WalletControls";
import PortfolioTable from "../components/PortfolioTable";
import SwapModal from "../components/SwapModal";

const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com"
);

export default function Dashboard() {
  const { isConnected, publicKey, disconnect } = useWallet(connection);
  const [portfolio, setPortfolio] = useState([]);
  const [isSwapOpen, setIsSwapOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<{
    mint: string;
    balance: string;
  } | null>(null);

  useEffect(() => {
    if (isConnected && publicKey) {
      // Fetch portfolio data
      fetch(`/api/portfolio?publicKey=${publicKey}`)
        .then((res) => res.json())
        .then((data) => setPortfolio(data.tokens || []))
        .catch((err) => console.error("Portfolio fetch failed:", err));
    }
  }, [isConnected, publicKey]);

  const handleSwap = (token: { mint: string; balance: string }) => {
    setSelectedToken(token);
    setIsSwapOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Portfolio Dashboard</h1>
          <WalletControls publicKey={publicKey} disconnect={disconnect} />
        </div>
        <PortfolioTable portfolio={portfolio} onSwap={handleSwap} />
        {isSwapOpen && (
          <SwapModal
            token={selectedToken}
            publicKey={publicKey}
            onClose={() => setIsSwapOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
