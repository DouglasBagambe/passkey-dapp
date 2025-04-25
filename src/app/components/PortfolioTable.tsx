// src/app/components/PortfolioTable.tsx
import React from "react";
import { ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";

interface Token {
  mint: string;
  symbol: string;
  name: string;
  icon?: string;
  balance: string;
  usdValue: number;
  price: number;
  change24h: number;
}

interface PortfolioTableProps {
  portfolio: Token[];
  onSwap: (token: { mint: string; symbol: string; balance: string }) => void;
}

export default function PortfolioTable({
  portfolio,
  onSwap,
}: PortfolioTableProps) {
  const totalUsdValue = portfolio.reduce(
    (sum, token) => sum + token.usdValue,
    0
  );

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
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/60 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Your Assets</h2>
        <div className="flex space-x-2">
          <button className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center">
            <RefreshCw className="h-4 w-4 mr-1" />
            <span className="text-sm">Refresh</span>
          </button>
          <button className="text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg px-3 py-1 text-sm">
            Sort by Value
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
                      <div className="font-medium text-white">{token.name}</div>
                      <div className="text-sm text-gray-400">
                        {token.symbol}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="font-mono text-white">
                    {parseFloat(token.balance).toLocaleString(undefined, {
                      maximumFractionDigits: token.symbol === "BONK" ? 0 : 4,
                    })}
                  </div>
                </td>
                <td>
                  <div className="font-mono text-white">
                    $
                    {token.price < 0.01
                      ? token.price.toExponential(2)
                      : token.price.toFixed(2)}
                  </div>
                </td>
                <td>
                  <div className="font-medium text-white">
                    ${token.usdValue.toFixed(2)}
                  </div>
                </td>
                <td>
                  <div
                    className={`flex items-center ${
                      token.change24h >= 0 ? "text-green-500" : "text-red-500"
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
                        onSwap({
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
                      <ArrowUpRight className="h-4 w-4 text-white" />
                    </button>
                    <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors">
                      <ArrowDownRight className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 pt-6 border-t border-gray-800">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Total Portfolio Value</span>
          <span className="text-xl font-bold text-white">
            ${totalUsdValue.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
