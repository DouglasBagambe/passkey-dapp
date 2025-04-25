/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/api/portfolio.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { Connection, PublicKey } from "@solana/web3.js";
import { PasskeyDappClient } from "../lib/anchorClient";

const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com"
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { publicKey } = req.query;

  if (!publicKey || typeof publicKey !== "string") {
    return res.status(400).json({ error: "Missing or invalid publicKey" });
  }

  try {
    const pubKey = new PublicKey(publicKey);
    // Mock wallet for Anchor provider (since this is an API route)
    const wallet = {
      publicKey: pubKey,
      signTransaction: async (tx: any) => tx,
      signAllTransactions: async (txs: any[]) => txs,
    };
    const client = new PasskeyDappClient(connection, wallet);

    // Fetch portfolio data
    let portfolio = await client.fetchPortfolio(pubKey);

    // If portfolio doesn't exist, initialize it
    if (!portfolio) {
      await client.initializePortfolio(pubKey);
      portfolio = await client.fetchPortfolio(pubKey);
    }

    if (!portfolio) {
      throw new Error("Failed to initialize or fetch portfolio");
    }

    // For now, return portfolio data as is. You can enhance this with token data if needed.
    res.status(200).json({
      owner: portfolio.owner,
      totalValue: portfolio.totalValue,
      tokens: [], // Add token fetching logic if needed
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
}
