import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { FUND_PROGRAM_ID, FUND_PROGRAM_PDA } from "../config/programId";

import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

import { connection } from "../services/connection";
import { sendSignedTransaction, getWallet } from "../services/wallet";
import { FUNDS } from "../config/funds";
//import { TOKENS } from "../config/tokens";
import BN from "bn.js";

const MULTIPLIER = 1000000000;

export enum TransactionType {
  SUBSCRIPTION,
  REDEMPTION,
};

export const executeTransaction = async(
  txType: TransactionType,
  clientTokenAccount: string,
  clientFundTokenAccount: string,
  fundTokenAccount: string,
  amount: number,
) => {
  const wallet = await getWallet();
  const mintPubkey = new PublicKey(FUNDS.localnet[0].mint);
  const fundPubkey = new PublicKey(FUNDS.localnet[0].address);
  const clientTokenAccountPubkey = new PublicKey(clientTokenAccount);
  const clientFundTokenAccountPubkey = new PublicKey(clientFundTokenAccount);
  const fundTokenAccountPubkey = new PublicKey(fundTokenAccount);
  const byteArrayAmount = new BN(amount * MULTIPLIER).toArray("le", 8);

  let fundIx: TransactionInstruction;

  switch (txType) {
    case TransactionType.SUBSCRIPTION:
      fundIx = await createSubscriptionIx(
        wallet.publicKey,
        clientTokenAccountPubkey,
        clientFundTokenAccountPubkey,
        FUND_PROGRAM_PDA,
        mintPubkey,
        fundTokenAccountPubkey,
        byteArrayAmount,
    );
    break;
    case TransactionType.REDEMPTION:
      fundIx = await createRedemptionIx(
        wallet.publicKey,
        clientFundTokenAccountPubkey,
        clientTokenAccountPubkey,
        FUND_PROGRAM_PDA,
        mintPubkey,
        fundPubkey,
        fundTokenAccountPubkey,
        FUND_PROGRAM_PDA,
        byteArrayAmount,
    );
    break;
    default:
      // Should never happen
      throw new Error("Invalid Transaction");
  }

  const tx = new Transaction().add(fundIx);

  return sendSignedTransaction(tx, connection);
};

export const createSubscriptionIx = async(
  clientAccount: PublicKey,
  clientTokenAccount: PublicKey,
  clientFundTokenAccount: PublicKey,
  mintAuthority: PublicKey,
  mint: PublicKey,
  fundTokenAccount: PublicKey,
  clientTransferAmount: number[],
): Promise<TransactionInstruction> => {
  const subscriptionIx = new TransactionInstruction({
    programId: FUND_PROGRAM_ID,
    keys: [
      { pubkey: clientAccount, isSigner: true, isWritable: false },
      { pubkey: clientTokenAccount, isSigner: false, isWritable: true },
      { pubkey: clientFundTokenAccount, isSigner: false, isWritable: true },
      { pubkey: mintAuthority, isSigner: false, isWritable: false },
      { pubkey: mint, isSigner: false, isWritable: true },
      { pubkey: fundTokenAccount, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data: Buffer.from(Uint8Array.of(0, ...clientTransferAmount)),
  });

  return subscriptionIx;
};

export const createRedemptionIx = async(
  clientAccount: PublicKey,
  clientFundTokenAccount: PublicKey,
  clientTokenAccount: PublicKey,
  mintAuthority: PublicKey,
  mint: PublicKey,
  fund: PublicKey,
  fundTokenAccount: PublicKey,
  signer: PublicKey,
  clientRedemptionAmount: number[],
): Promise<TransactionInstruction> => {
  const redemptionIx = new TransactionInstruction({
    programId: FUND_PROGRAM_ID,
    keys: [
      { pubkey: clientAccount, isSigner: true, isWritable: false },
      { pubkey: clientFundTokenAccount, isSigner: false, isWritable: true },
      { pubkey: clientTokenAccount, isSigner: false, isWritable: true },
      { pubkey: mintAuthority, isSigner: false, isWritable: false },
      { pubkey: mint, isSigner: false, isWritable: true },
      { pubkey: fund, isSigner: false, isWritable: false },
      { pubkey: fundTokenAccount, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: signer, isSigner: false, isWritable: false },
    ],
    data: Buffer.from(Uint8Array.of(1, ...clientRedemptionAmount)),
  });

  return redemptionIx;
};
