// components/WalletControls.tsx
import React, { useState } from "react";
import { PublicKey } from "@solana/web3.js";

interface WalletControlsProps {
  publicKey: PublicKey | null;
  disconnect: () => void;
}

export default function WalletControls({
  publicKey,
  disconnect,
}: WalletControlsProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  if (!publicKey) return null;

  const truncatedAddress =
    publicKey.toString().slice(0, 4) + "..." + publicKey.toString().slice(-4);

  const handleDisconnect = () => {
    disconnect();
    window.location.href = "/";
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(publicKey.toString());
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow border border-gray-200 hover:bg-gray-50"
      >
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        <span className="font-medium">{truncatedAddress}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
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

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <ul>
            <li>
              <button
                onClick={copyAddress}
                className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50 rounded-t-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
                Copy Address
              </button>
            </li>
            <li>
              <button
                onClick={handleDisconnect}
                className="flex items-center w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-b-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Disconnect
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
