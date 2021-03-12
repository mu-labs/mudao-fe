import Wallet from "@project-serum/sol-wallet-adapter";
import { PublicKey, Connection, Transaction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { connection, targetCluster, COMMITMENT } from "./connection";
import { parseTokenAccountData } from "./data";
import { FUNDS } from "../config/funds";
import { TOKENS } from "../config/tokens";

const PROVIDER_URL = "https://www.sollet.io";
export const wallet = new Wallet(PROVIDER_URL, targetCluster);

export type TokenAccount = {
  pubkey: string,
  mint: string,
  owner: string,
  amount: number,
};

export enum AccountOwner {
  FUND,
  CLIENT,
};

export const sendSignedTransaction = async(
  tx: Transaction,
  connection: Connection,
) => {
  tx.setSigners(wallet.publicKey);
  tx.recentBlockhash = (await connection.getRecentBlockhash("max")).blockhash;

  const signed = await wallet.signTransaction(tx);
  const txid = await connection.sendRawTransaction(signed.serialize(), {
    skipPreflight: false,
    preflightCommitment: COMMITMENT,
  });

  return connection.confirmTransaction(txid, COMMITMENT);
};

const connectWallet = () => {
  if (!wallet.connected) {
    return wallet.connect() as Promise<void>;
  } else {
    return Promise.resolve();
  }
};

export const getWallet = async(): Promise<any> => {
  await connectWallet();
  return wallet;
};

export const getTokenAccountInfo = async(acOwner: AccountOwner) => {
  let wallet: PublicKey;

  switch (acOwner) {
    case AccountOwner.CLIENT:
      const result = await getWallet();
      wallet = result._publicKey;
      break;
    case AccountOwner.FUND:
      wallet = new PublicKey(FUNDS.localnet[0].address);
      break;
    default:
      // Should never happen
      throw new Error("Invalid account owner.");
  }

  const accountInfo = await connection.getTokenAccountsByOwner(
    wallet,
    { programId: TOKEN_PROGRAM_ID },
    COMMITMENT
  );

  const tokenAccounts = accountInfo.value
    .map(e => [e.pubkey, e.account.data])
    .map(e => parseTokenAccountData(e));

  return tokenAccounts;
};

export const getTokenMintAddress = (tokenName: string) => {
  for (const token of TOKENS.localnet) {
    if (token.tokenName === tokenName) {
      return token.mintAddress;
    }
  }
  throw new Error("No tokens with name: " + tokenName);
};

export const getTokenAddress = (tokenAccounts: Array<TokenAccount>, tokenMint: string) => {
  for (const account of tokenAccounts) {
    if (account.mint === tokenMint) {
      return account;
    }
  }
  throw new Error("No token account associated with this token");
};
