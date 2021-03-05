import {
  Connection,
  Transaction,
} from "@solana/web3.js";

import Wallet from "@project-serum/sol-wallet-adapter";
import { targetCluster, COMMITMENT } from "./connection";

const PROVIDER_URL = "https://www.sollet.io";
export const wallet = new Wallet(PROVIDER_URL, targetCluster);

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
