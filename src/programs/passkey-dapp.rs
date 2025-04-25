use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod passkey_dapp {
    use super::*;

    pub fn initialize_portfolio(ctx: Context<InitializePortfolio>) -> Result<()> {
        let portfolio = &mut ctx.accounts.portfolio;
        portfolio.owner = *ctx.accounts.user.key;
        portfolio.total_value = 0;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePortfolio<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 8,
        seeds = [b"portfolio", user.key().as_ref()],
        bump
    )]
    pub portfolio: Account<'info, Portfolio>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Portfolio {
    pub owner: Pubkey,
    pub total_value: u64,
}