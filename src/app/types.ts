// src/app/types.ts
export interface Token {
  mint: string;
  symbol: string;
  name: string;
  icon?: string; // Make icon optional to accommodate both uses
  balance: string;
  usdValue: number;
  price: number;
  change24h: number;
}
