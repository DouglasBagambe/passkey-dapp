/* eslint-disable @typescript-eslint/no-explicit-any */
// client/components/SwapModal.tsx

import { FC, useState, useEffect } from "react";
import { useWallet } from "@lazorkit/wallet";

interface SwapModalProps {
  token: { mint: string; balance: string } | null;
  publicKey: string | null;
  onClose: () => void;
}

const SwapModal: FC<SwapModalProps> = ({ token, publicKey, onClose }) => {
  const { signMessage } = useWallet();
  const [quote, setQuote] = useState<any>(null);
  const [outputMint, setOutputMint] = useState(
    "So11111111111111111111111111111111111111112"
  ); // SOL
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (token && amount) {
      fetch(
        `/api/quote?inputMint=${token.mint}&outputMint=${outputMint}&amount=${amount}`
      )
        .then((res) => res.json())
        .then((data) => setQuote(data))
        .catch((err) => console.error("Quote fetch failed:", err));
    }
  }, [token, outputMint, amount]);

  const handleSwap = async () => {
    if (!quote || !publicKey) return;

    try {
      const response = await fetch("/api/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quote, publicKey }),
      });
      const { swapTransaction } = await response.json();

      const signature = await signMessage(
        new Uint8Array(Buffer.from(swapTransaction, "base64"))
      );
      console.log("Swap signed:", signature);
      onClose();
    } catch (err) {
      console.error("Swap failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Swap Tokens</h2>
        {token && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Input Token
              </label>
              <input
                type="text"
                value={token.mint}
                readOnly
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Output Token
              </label>
              <input
                type="text"
                value={outputMint}
                onChange={(e) => setOutputMint(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            {quote && (
              <p className="mb-4">
                Estimated Output: {quote.outAmount} {outputMint}
              </p>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSwap}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Swap
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SwapModal;
