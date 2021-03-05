import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

import {
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";

import BN from "bn.js";

const FUND_PROGRAM_ID = new PublicKey("4rN7fSdF75xWuEhpgNFfRjLHfvF9ZkGWeKNMYVTCu1uJ");

export const createSubscriptionIx = async(
  clientAccountPubkey: PublicKey,
  clientTokenAccountPubkey: string,
  clientReceivingAccountPubkey: string,
  clientTransferAmount: number,
  mintAuthorityPubkey: string,
  mintPubkey: string,
  fundReceivingAccountPubkey: string
) => {
  const clientTokenAccount = new PublicKey(clientTokenAccountPubkey);
  const clientReceivingAccount = new PublicKey(clientReceivingAccountPubkey);
  const mintAuthority = new PublicKey(mintAuthorityPubkey);
  const mint = new PublicKey(mintPubkey);
  const fundReceivingAccount = new PublicKey(fundReceivingAccountPubkey);

  const subscriptionIx = new TransactionInstruction({
    programId: FUND_PROGRAM_ID,
    keys: [
      { pubkey: clientAccountPubkey, isSigner: true, isWritable: false },
      { pubkey: clientTokenAccount, isSigner: false, isWritable: true },
      { pubkey: clientReceivingAccount, isSigner: false, isWritable: true },
      { pubkey: mintAuthority, isSigner: false, isWritable: false },
      { pubkey: mint, isSigner: false, isWritable: true },
      { pubkey: fundReceivingAccount, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data: Buffer.from(Uint8Array.of(0, ...new BN(clientTransferAmount).toArray("le", 8))),
  });

  return subscriptionIx;
};

export const createRedemptionIx = async(
  clientAccount: PublicKey,
  clientBurnAccountPubkey: string,
  clientReceivingAccountPubkey: string,
  clientRedemptionAmount: number,
  mintAuthorityPubkey: string,
  mintPubkey: string,
  fundAuthorityPubkey: string,
  fundRedeemingAccountPubkey: string,
  signatorPubKey: string
) => {
  const clientTokenAccount = new PublicKey(clientBurnAccountPubkey);
  const clientReceivingAccount = new PublicKey(clientReceivingAccountPubkey);
  const mintAuthority = new PublicKey(mintAuthorityPubkey);
  const mint = new PublicKey(mintPubkey);
  const fundAuthority = new PublicKey(fundAuthorityPubkey);
  const fundReceivingAccount = new PublicKey(fundRedeemingAccountPubkey);
  const signator = new PublicKey(signatorPubKey);

  const redemptionIx = new TransactionInstruction({
    programId: FUND_PROGRAM_ID,
    keys: [
      { pubkey: clientAccount, isSigner: true, isWritable: false },
      { pubkey: clientTokenAccount, isSigner: false, isWritable: true },
      { pubkey: clientReceivingAccount, isSigner: false, isWritable: true },
      { pubkey: mintAuthority, isSigner: false, isWritable: false },
      { pubkey: mint, isSigner: false, isWritable: true },
      { pubkey: fundAuthority, isSigner: false, isWritable: false },
      { pubkey: fundReceivingAccount, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: signator, isSigner: false, isWritable: false },
    ],
    data: Buffer.from(Uint8Array.of(1, ...new BN(clientRedemptionAmount).toArray("le", 8))),
  });

  return redemptionIx;
};
