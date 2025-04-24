// client/components/WalletControls.tsx

import { FC } from "react";

interface WalletControlsProps {
  publicKey: string | null;
  disconnect: () => void;
}

const WalletControls: FC<WalletControlsProps> = ({ publicKey, disconnect }) => {
  return (
    <div className="flex items-center space-x-4">
      {publicKey && (
        <>
          <span className="text-sm text-gray-600">
            {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
          </span>
          <button
            onClick={disconnect}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Disconnect
          </button>
        </>
      )}
    </div>
  );
};

export default WalletControls;
