import {
  Connection,
  Transaction,
} from "@solana/web3.js";

import Wallet from "@project-serum/sol-wallet-adapter";

const PROVIDER_URL = "https://www.sollet.io";
export const wallet = new Wallet(PROVIDER_URL, "http://localhost:8899");

export const sendSignedTx = async(
  tx: Transaction,
  connection: Connection,
) => {
  tx.setSigners(wallet.publicKey);
  tx.recentBlockhash = (await connection.getRecentBlockhash("max")).blockhash;

  const signed = await wallet.signTransaction(tx);
  const txid = await connection.sendRawTransaction(signed.serialize(), {
    skipPreflight: false,
    preflightCommitment: "singleGossip",
  });

  return connection.confirmTransaction(txid, "singleGossip");
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
