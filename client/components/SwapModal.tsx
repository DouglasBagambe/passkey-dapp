/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// components/SwapModal.tsx
import React, { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";

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
  },
  {
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
    name: "USD Coin",
    price: 1.0,
  },
  {
    mint: "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs",
    symbol: "ETH",
    name: "Ethereum (Wormhole)",
    price: 3502.5,
  },
  {
    mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    symbol: "BONK",
    name: "Bonk",
    price: 0.00001234,
  },
  {
    mint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
    symbol: "mSOL",
    name: "Marinade staked SOL",
    price: 101.2,
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

  if (!token) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Swap Tokens</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {swapState === "success" ? (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-8 w-8 text-green-600"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Swap Successful!
            </h3>
            <p className="text-sm text-gray-600">{swapMessage}</p>
          </div>
        ) : swapState === "error" ? (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Swap Failed
            </h3>
            <p className="text-sm text-gray-600">{swapMessage}</p>
            <button
              onClick={() => setSwapState("initial")}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* From Token */}
            <div className="bg-gray-50 p-4 rounded-lg mb-2">
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-500">From</label>
                <span className="text-sm text-gray-500">
                  Balance: {parseFloat(token.balance).toFixed(6)}{" "}
                  {fromToken?.symbol}
                </span>
              </div>
              <div className="flex items-center">
                <input
                  type="text"
                  value={fromAmount}
                  onChange={handleFromAmountChange}
                  placeholder="0.0"
                  className="bg-transparent text-xl font-medium focus:outline-none flex-1"
                />
                <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-1">
                  <div className="w-6 h-6 bg-gray-200 rounded-full mr-2"></div>
                  <span className="font-medium">{fromToken?.symbol}</span>
                </div>
              </div>
            </div>

            {/* Swap Icon */}
            <div className="flex justify-center -my-2">
              <div className="bg-white border border-gray-200 rounded-full p-2 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>

            {/* To Token */}
            <div className="bg-gray-50 p-4 rounded-lg mt-2 mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-500">To (estimated)</label>
                <span className="text-sm text-gray-500">
                  {toToken &&
                    `≈ $${(parseFloat(toAmount) * toToken.price).toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center">
                <input
                  type="text"
                  value={toAmount}
                  readOnly
                  placeholder="0.0"
                  className="bg-transparent text-xl font-medium focus:outline-none flex-1"
                />
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-1"
                  >
                    <div className="w-6 h-6 bg-gray-200 rounded-full mr-2"></div>
                    <span className="font-medium">{toToken?.symbol}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-60 overflow-y-auto">
                      {tokenOptions.map((option) => (
                        <button
                          key={option.mint}
                          onClick={() => handleToTokenSelect(option.mint)}
                          className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50"
                        >
                          <div className="w-6 h-6 bg-gray-200 rounded-full mr-2"></div>
                          <span>{option.symbol}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  Slippage Tolerance
                </span>
                <div className="flex space-x-2">
                  {["0.5", "1", "2"].map((value) => (
                    <button
                      key={value}
                      onClick={() => setSlippage(value)}
                      className={`px-2 py-1 text-xs rounded ${
                        slippage === value
                          ? "bg-indigo-100 text-indigo-700 font-medium"
                          : "bg-gray-100 text-gray-600"
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
                      className="w-12 px-2 py-1 text-xs rounded bg-gray-100 text-gray-800"
                    />
                    <span className="absolute right-2 top-1 text-xs text-gray-500">
                      %
                    </span>
                  </div>
                </div>
              </div>

              {fromToken && toToken && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Rate</span>
                    <span className="font-medium">
                      1 {fromToken.symbol} ≈{" "}
                      {(fromToken.price / toToken.price).toFixed(6)}{" "}
                      {toToken.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Network Fee</span>
                    <span className="font-medium">≈ 0.000005 SOL</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleSwap}
              disabled={
                !fromAmount ||
                !toAmount ||
                isLoading ||
                swapState === "processing"
              }
              className={`w-full py-3 px-4 rounded-lg font-medium 
                ${
                  !fromAmount ||
                  !toAmount ||
                  isLoading ||
                  swapState === "processing"
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }
              `}
            >
              {isLoading || swapState === "processing" ? (
                <div className="flex items-center justify-center">
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
                  Processing...
                </div>
              ) : (
                "Swap Tokens"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
