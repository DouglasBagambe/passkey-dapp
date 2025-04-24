# Passkey DeFi dApp

A Solana dApp with Passkey authentication using Lazor Kit, integrated with Jupiter for DeFi swaps.

## Setup

1. Clone the repo: `git clone <repo-url>`
2. Install client dependencies: `cd client && npm install`
3. Install Anchor: `cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked`
4. Build and deploy smart contract: `cd programs/passkey-dapp && anchor build && anchor deploy`
5. Copy `.env.example` to `.env` and update with your keys.
6. Run the app: `cd client && npm run dev`

## Testing

- Run Anchor tests: `cd programs/passkey-dapp && anchor test`
- Test on Devnet with Passkey login and Jupiter swaps.

## Deployment

Deploy to Vercel: `vercel --prod`

## Video Walkthrough

[Link to video walkthrough]
