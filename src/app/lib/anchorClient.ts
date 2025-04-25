/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AnchorProvider, Program, web3, BN, Idl } from "@project-serum/anchor";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import IDL from "../../programs/idl.json";

const PROGRAM_ID = new PublicKey(
  "4EPwafsr1NFCJ2NVc8ZSyv5ZwWbvteMy3MNbgiHWhWWk"
);

export interface PortfolioData {
  owner: string;
  totalValue: string;
}

export class PasskeyDappClient {
  private program: Program;
  private provider: AnchorProvider;

  constructor(connection: Connection, wallet: any) {
    this.provider = new AnchorProvider(connection, wallet, {});
    this.program = new Program(IDL as Idl, PROGRAM_ID, this.provider);
  }

  async getPortfolioPDA(user: PublicKey): Promise<[PublicKey, number]> {
    return web3.PublicKey.findProgramAddressSync(
      [Buffer.from("portfolio"), user.toBuffer()],
      PROGRAM_ID
    );
  }

  async initializePortfolio(user: PublicKey): Promise<string> {
    const [portfolioPDA, bump] = await this.getPortfolioPDA(user);
    const tx = await this.program.methods
      .initializePortfolio()
      .accounts({
        portfolio: portfolioPDA,
        user,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    return tx;
  }

  async fetchPortfolio(user: PublicKey): Promise<PortfolioData | null> {
    const [portfolioPDA] = await this.getPortfolioPDA(user);
    try {
      const portfolio = await this.program.account.portfolio.fetch(
        portfolioPDA
      );
      return {
        owner: portfolio.owner.toString(),
        totalValue: portfolio.totalValue.toString(),
      };
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      return null;
    }
  }
}
