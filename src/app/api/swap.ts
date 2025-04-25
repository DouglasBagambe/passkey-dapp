/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/api/swap.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { Connection } from "@solana/web3.js";

const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com"
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { quote, publicKey } = req.body;

  if (!quote || !publicKey) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_JUPITER_API}/swap`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteResponse: quote,
          userPublicKey: publicKey,
        }),
      }
    );
    const { swapTransaction } = await response.json();

    // Note: Signing requires client-side signMessage due to Lazor Kit's popup
    res.status(200).json({ swapTransaction });
  } catch (err) {
    res.status(500).json({ error: "Failed to execute swap" });
  }
}
