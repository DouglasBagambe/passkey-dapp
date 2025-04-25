// app/components/WalletControls.tsx
import React, { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { Copy, LogOut, Settings, ChevronDown } from "lucide-react";

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
    // Could add a toast notification here
  };

  return (
    <div className="flex items-center space-x-4">
      <div
        className="bg-gray-800 rounded-full py-1 px-4 flex items-center cursor-pointer group"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="bg-green-500 h-2 w-2 rounded-full mr-2"></div>
        <span className="text-sm text-gray-300 mr-2 hidden md:inline">
          Connected
        </span>
        <div
          className="text-sm text-gray-300 flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            copyAddress();
          }}
        >
          <span className="hidden md:inline">{truncatedAddress}</span>
          <Copy className="h-4 w-4 ml-1 opacity-50 group-hover:opacity-100" />
        </div>
        <ChevronDown
          className={`h-4 w-4 ml-2 text-gray-400 transition-transform ${
            showDropdown ? "rotate-180" : ""
          }`}
        />
      </div>

      <button className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
        <Settings className="h-5 w-5 text-white" />
      </button>

      {showDropdown && (
        <div className="absolute right-6 mt-24 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-800 z-10 overflow-hidden">
          <ul>
            <li>
              <button
                onClick={copyAddress}
                className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors text-gray-300"
              >
                <Copy className="h-4 w-4 mr-3 text-gray-400" />
                Copy Address
              </button>
            </li>
            <li className="border-t border-gray-800">
              <button
                onClick={handleDisconnect}
                className="flex items-center w-full px-4 py-3 text-left hover:bg-red-900/20 transition-colors text-red-400"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Disconnect Wallet
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
