/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/api/quote.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { inputMint, outputMint, amount } = req.query;

  if (!inputMint || !outputMint || !amount) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_JUPITER_API}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50`
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch quote" });
  }
}
