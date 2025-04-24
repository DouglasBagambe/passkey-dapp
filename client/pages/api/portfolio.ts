/* eslint-disable @typescript-eslint/no-unused-vars */
// client/pages/api/portfolio.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { Connection, PublicKey } from "@solana/web3.js";

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

  if (!publicKey) {
    return res.status(400).json({ error: "Missing publicKey" });
  }

  try {
    const pubKey = new PublicKey(publicKey as string);
    const tokenAccounts = await connection.getTokenAccountsByOwner(pubKey, {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    });

    const tokens = tokenAccounts.value.map((account) => ({
      mint: "Unknown", // Replace with actual mint address parsing
      balance: "Unknown", // Replace with actual balance parsing
    }));

    res.status(200).json({ tokens });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
}
