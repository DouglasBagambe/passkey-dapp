/* eslint-disable @next/next/no-img-element */
// components/PortfolioTable.tsx
import React from "react";

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
  onSwap: (token: { mint: string; balance: string }) => void;
}

export default function PortfolioTable({
  portfolio,
  onSwap,
}: PortfolioTableProps) {
  // Mock data for demo if portfolio is empty
  const mockData: Token[] =
    portfolio.length > 0
      ? portfolio
      : [
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
        ];

  const totalUsdValue = mockData.reduce(
    (sum, token) => sum + token.usdValue,
    0
  );

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Your Portfolio
          </h2>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Value</p>
            <p className="text-2xl font-bold">${totalUsdValue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Token
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Balance
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                24h
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Value
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockData.map((token) => (
              <tr key={token.mint} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {token.icon ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src="/api/placeholder/32/32"
                          alt={token.name}
                        />
                      ) : (
                        <span className="text-lg font-medium">
                          {token.symbol.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {token.symbol}
                      </div>
                      <div className="text-sm text-gray-500">{token.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {parseFloat(token.balance).toFixed(6)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm text-gray-900">
                    ${token.price.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span
                    className={`inline-flex text-sm ${
                      token.change24h >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {token.change24h >= 0 ? "+" : ""}
                    {token.change24h.toFixed(2)}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  ${token.usdValue.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() =>
                      onSwap({ mint: token.mint, balance: token.balance })
                    }
                    className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md"
                  >
                    Swap
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
