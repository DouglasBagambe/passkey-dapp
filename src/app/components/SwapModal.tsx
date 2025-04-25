/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/components/SwapModal.tsx
import React, { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { RefreshCw, ChevronDown, Zap, Loader2 } from "lucide-react";

interface SwapModalProps {
  token: { mint: string; balance: string } | null;
  publicKey: PublicKey | null;
  onClose: () => void;
}

// Mock token data for the demo
const mockTokens = [
  {
    mint: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    name: "Solana",
    price: 100.5,
    color: "from-blue-600 to-purple-600",
  },
  {
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
    name: "USD Coin",
    price: 1.0,
    color: "from-blue-500 to-blue-600",
  },
  {
    mint: "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs",
    symbol: "ETH",
    name: "Ethereum (Wormhole)",
    price: 3502.5,
    color: "from-purple-600 to-indigo-600",
  },
  {
    mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    symbol: "BONK",
    name: "Bonk",
    price: 0.00001234,
    color: "from-yellow-500 to-orange-500",
  },
  {
    mint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
    symbol: "mSOL",
    name: "Marinade staked SOL",
    price: 101.2,
    color: "from-green-500 to-emerald-600",
  },
];

export default function SwapModal({
  token,
  publicKey,
  onClose,
}: SwapModalProps) {
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [selectedToToken, setSelectedToToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [swapState, setSwapState] = useState<
    "initial" | "processing" | "success" | "error"
  >("initial");
  const [swapMessage, setSwapMessage] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fromToken =
    mockTokens.find((t) => t.mint === token?.mint) || mockTokens[0];
  const toToken = mockTokens.find((t) => t.mint === selectedToToken);

  // Set initial to token (different from from token)
  useEffect(() => {
    if (token) {
      const defaultToToken = mockTokens.find((t) => t.mint !== token.mint);
      if (defaultToToken) {
        setSelectedToToken(defaultToToken.mint);
      }
    }
  }, [token]);

  // Update to amount when from amount changes
  useEffect(() => {
    if (fromAmount && fromToken && toToken) {
      const fromValueInUsd = parseFloat(fromAmount) * fromToken.price;
      const toTokenAmount = fromValueInUsd / toToken.price;
      setToAmount(toTokenAmount.toFixed(6));
    } else {
      setToAmount("");
    }
  }, [fromAmount, selectedToToken, fromToken]);

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFromAmount(value);
    }
  };

  const handleToTokenSelect = (mint: string) => {
    setSelectedToToken(mint);
    setIsDropdownOpen(false);
  };

  const handleSwap = async () => {
    if (!fromAmount || !toAmount || !fromToken || !toToken) return;

    setSwapState("processing");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSwapState("success");
      setSwapMessage(
        `Successfully swapped ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken?.symbol}`
      );
      setIsLoading(false);

      // Close modal after success
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 2000);
  };

  const tokenOptions = mockTokens.filter((t) => t.mint !== token?.mint);
  const maxAmount = token ? parseFloat(token.balance) : 0;

  if (!token) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Swap Tokens</h3>
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

        {swapState === "success" ? (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-900/30 mb-4">
              <svg
                className="h-8 w-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              Swap Successful!
            </h3>
            <p className="text-sm text-gray-300">{swapMessage}</p>
          </div>
        ) : swapState === "error" ? (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/30 mb-4">
              <svg
                className="h-6 w-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Swap Failed</h3>
            <p className="text-sm text-gray-300">{swapMessage}</p>
            <button
              onClick={() => setSwapState("initial")}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="p-6">
            {/* From Token */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">From</label>
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700/50">
                <div className="flex justify-between mb-4">
                  <div className="flex items-center">
                    <div
                      className={`h-8 w-8 rounded-lg bg-gradient-to-br ${fromToken.color} 
                      flex items-center justify-center font-bold text-sm mr-2`}
                    >
                      {fromToken.symbol}
                    </div>
                    <span className="font-medium text-white">
                      {fromToken.symbol}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Balance: {parseFloat(token.balance).toLocaleString()}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={fromAmount}
                    onChange={handleFromAmountChange}
                    placeholder="0.0"
                    className="bg-transparent border-0 text-xl font-medium focus:outline-none flex-1 text-white"
                  />
                  <button
                    onClick={() => setFromAmount(token.balance)}
                    className="text-xs bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-400 px-2 rounded transition-colors"
                  >
                    MAX
                  </button>
                </div>
              </div>
            </div>

            {/* Swap Icon */}
            <div className="flex justify-center -my-2">
              <button className="bg-gray-800 p-2 rounded-full border border-gray-700 hover:bg-gray-700 transition-colors">
                <RefreshCw className="h-5 w-5 text-indigo-400" />
              </button>
            </div>

            {/* To Token */}
            <div className="mb-6 mt-4">
              <label className="block text-sm text-gray-400 mb-2">
                To (estimated)
              </label>
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700/50">
                <div className="flex justify-between mb-4">
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center space-x-2"
                    >
                      {toToken && (
                        <div
                          className={`h-8 w-8 rounded-lg bg-gradient-to-br ${toToken.color} 
                          flex items-center justify-center font-bold text-sm mr-2`}
                        >
                          {toToken.symbol}
                        </div>
                      )}
                      <span className="font-medium text-white">
                        {toToken?.symbol}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-400 ml-1" />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10 max-h-60 overflow-y-auto">
                        {tokenOptions.map((option) => (
                          <button
                            key={option.mint}
                            onClick={() => handleToTokenSelect(option.mint)}
                            className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-700 text-white"
                          >
                            <div
                              className={`h-6 w-6 rounded-lg bg-gradient-to-br ${option.color} 
                              flex items-center justify-center font-bold text-xs mr-2`}
                            >
                              {option.symbol}
                            </div>
                            <span>{option.symbol}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    {toToken &&
                      `≈ $${(
                        parseFloat(toAmount || "0") * toToken.price
                      ).toFixed(2)}`}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={toAmount}
                    readOnly
                    placeholder="0.0"
                    className="bg-transparent border-0 text-xl font-medium focus:outline-none flex-1 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">
                  Slippage Tolerance
                </span>
                <div className="flex space-x-2">
                  {["0.5", "1", "2"].map((value) => (
                    <button
                      key={value}
                      onClick={() => setSlippage(value)}
                      className={`px-2 py-1 text-xs rounded ${
                        slippage === value
                          ? "bg-indigo-600/30 text-indigo-400 font-medium"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {value}%
                    </button>
                  ))}
                  <div className="relative">
                    <input
                      type="text"
                      value={slippage}
                      onChange={(e) => setSlippage(e.target.value)}
                      className="w-12 px-2 py-1 text-xs rounded bg-gray-700 text-white"
                    />
                    <span className="absolute right-2 top-1 text-xs text-gray-400">
                      %
                    </span>
                  </div>
                </div>
              </div>

              {fromToken && toToken && (
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Rate</span>
                    <span className="font-medium text-white">
                      1 {fromToken.symbol} ≈{" "}
                      {(fromToken.price / toToken.price).toFixed(6)}{" "}
                      {toToken.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Network Fee</span>
                    <span className="font-medium text-white">
                      ≈ 0.000005 SOL
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={handleSwap}
              disabled={
                !fromAmount ||
                !toAmount ||
                isLoading ||
                swapState === "processing" ||
                parseFloat(fromAmount) <= 0 ||
                parseFloat(fromAmount) > maxAmount
              }
              className={`w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center
                ${
                  isLoading || swapState === "processing"
                    ? "bg-indigo-700 cursor-not-allowed"
                    : !fromAmount ||
                      !toAmount ||
                      parseFloat(fromAmount) <= 0 ||
                      parseFloat(fromAmount) > maxAmount
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-900/50"
                }`}
            >
              {isLoading || swapState === "processing" ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Swapping...
                </>
              ) : !fromAmount || parseFloat(fromAmount) <= 0 ? (
                "Enter an amount"
              ) : parseFloat(fromAmount) > maxAmount ? (
                "Insufficient balance"
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Swap Tokens
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
