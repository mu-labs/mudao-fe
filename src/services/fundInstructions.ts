import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { FUND_PROGRAM_ID } from "../config/programId";

import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

import { connection } from "../services/targetCluster";
import { sendSignedTx, getWallet } from "../services/thirdPartyWallet";
import { FUNDS } from "../config/funds";
import { TOKENS } from "../config/tokens";
import { FUND_PROGRAM_PDA } from "../config/programId";
import BN from "bn.js";

const MULTIPLIER = 10000000000;

export const executeTransaction = async(
  txType: string,
  clientTokenAccount: string,
  clientFundTokenAccount: string,
  fundTokenAccount: string,
  amount: number,
) => {
  const wallet = await getWallet();
  const mint = new PublicKey(FUNDS.localnet[0].mint);
  const fund = new PublicKey(FUNDS.localnet[0].address);
  const byteArrayAmount = new BN(amount * MULTIPLIER).toArray("le", 8);

  let fundIx: TransactionInstruction;

  if (txType === "subscription") {
    fundIx = await createSubscriptionIx(
      wallet.publicKey,
      clientTokenAccount,
      clientFundTokenAccount,
      byteArrayAmount,
      FUND_PROGRAM_PDA,
      mint,
      fundTokenAccount,
    );
  } else if (txType === "redemption") {
    fundIx = await createRedemptionIx(
      wallet.publicKey,
      clientFundTokenAccount,
      clientTokenAccount,
      byteArrayAmount,
      FUND_PROGRAM_PDA,
      mint,
      fund,
      fundTokenAccount,
      FUND_PROGRAM_PDA,
    );
  } else {
    // Should never happen
    throw new Error("Invalid Transaction");
  }

  const tx = new Transaction().add(fundIx);

  return sendSignedTx(tx, connection);

};

export const createSubscriptionIx = async(
  clientAccountPubkey: PublicKey,
  clientTokenAccountPubkey: string,
  clientReceivingAccountPubkey: string,
  clientTransferAmount: number[],
  mintAuthorityPubkey: PublicKey,
  mintPubkey: PublicKey,
  fundReceivingAccountPubkey: string
) => {
  const clientTokenAccount = new PublicKey(clientTokenAccountPubkey);
  const clientReceivingAccount = new PublicKey(clientReceivingAccountPubkey);
  const fundReceivingAccount = new PublicKey(fundReceivingAccountPubkey);

  const subscriptionIx = new TransactionInstruction({
    programId: FUND_PROGRAM_ID,
    keys: [
      { pubkey: clientAccountPubkey, isSigner: true, isWritable: false },
      { pubkey: clientTokenAccount, isSigner: false, isWritable: true },
      { pubkey: clientReceivingAccount, isSigner: false, isWritable: true },
      { pubkey: mintAuthorityPubkey, isSigner: false, isWritable: false },
      { pubkey: mintPubkey, isSigner: false, isWritable: true },
      { pubkey: fundReceivingAccount, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data: Buffer.from(Uint8Array.of(0, ...clientTransferAmount)),
  });

  return subscriptionIx;
};

export const createRedemptionIx = async(
  clientAccount: PublicKey,
  clientBurnAccountPubkey: string,
  clientReceivingAccountPubkey: string,
  clientRedemptionAmount: number[],
  mintAuthorityPubkey: PublicKey,
  mintPubkey: PublicKey,
  fundPubkey: PublicKey,
  fundRedeemingAccountPubkey: string,
  signerPubkey: PublicKey,
) => {
  const clientFundTokenAccount = new PublicKey(clientBurnAccountPubkey);
  const clientReceivingAccount = new PublicKey(clientReceivingAccountPubkey);
  const fundReceivingAccount = new PublicKey(fundRedeemingAccountPubkey);

  const redemptionIx = new TransactionInstruction({
    programId: FUND_PROGRAM_ID,
    keys: [
      { pubkey: clientAccount, isSigner: true, isWritable: false },
      { pubkey: clientFundTokenAccount, isSigner: false, isWritable: true },
      { pubkey: clientReceivingAccount, isSigner: false, isWritable: true },
      { pubkey: mintAuthorityPubkey, isSigner: false, isWritable: false },
      { pubkey: mintPubkey, isSigner: false, isWritable: true },
      { pubkey: fundPubkey, isSigner: false, isWritable: false },
      { pubkey: fundReceivingAccount, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: signerPubkey, isSigner: false, isWritable: false },
    ],
    data: Buffer.from(Uint8Array.of(1, ...clientRedemptionAmount)),
  });

  return redemptionIx;
};
