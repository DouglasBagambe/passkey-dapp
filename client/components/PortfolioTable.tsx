// client/components/PortfolioTable.tsx

import { FC } from "react";

interface PortfolioTableProps {
  portfolio: { mint: string; balance: string }[];
  onSwap: (token: { mint: string; balance: string }) => void;
}

const PortfolioTable: FC<PortfolioTableProps> = ({ portfolio, onSwap }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Token
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Balance
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {portfolio.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                No tokens found
              </td>
            </tr>
          ) : (
            portfolio.map((token, index) => (
              <tr key={index} className="border-t">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {token.mint}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {token.balance}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onSwap(token)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Swap
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioTable;
