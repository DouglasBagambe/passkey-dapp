// client/pages/index.tsx

"use client";
import { LazorConnect, useWallet } from "@lazorkit/wallet";
import { Connection } from "@solana/web3.js";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Buffer } from "buffer";

// Polyfills
window.Buffer = Buffer;
window.process = process;

const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com"
);

export default function Home() {
  const { isConnected, publicKey, connect } = useWallet(connection);
  const router = useRouter();

  useEffect(() => {
    if (isConnected && publicKey) {
      router.push("/dashboard");
    }
  }, [isConnected, publicKey, router]);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (err) {
      console.error("Connection failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Passkey DeFi dApp</h1>
        <p className="text-lg mb-6">
          Log in with Passkey to access your Solana portfolio and swap tokens.
        </p>
        <LazorConnect
          connection={connection}
          onConnect={handleConnect}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        />
      </div>
    </div>
  );
}
