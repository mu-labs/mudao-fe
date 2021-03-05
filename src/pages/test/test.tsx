import React, { useState } from "react";
import { Connection, Account, Transaction } from "@solana/web3.js";
import { createSubscriptionIx, createRedemptionIx } from "../../services/fundInstructions";
import { sendSignedTx, getWallet } from "../../services/thirdPartyWallet";
import { COMMITMENT } from "../../services/targetCluster";

const connection = new Connection("http://localhost:8899", "singleGossip");

export default function Test() {
  const [clientPrivateKey, setClientPrivateKey] = useState("");
  const [externalSignature, setExternalSignature] = useState(true);
  const [clientTokenAccount, setClientTokenAccount] = useState("");
  const [clientReceivingAccount, setClientReceivingAccount] = useState("");
  const [mintAuthority, setMintAuthority] = useState("");
  const [mint, setMint] = useState("");
  const [fund, setFund] = useState("");
  const [fundReceivingAccount, setFundReceivingAccount] = useState("");
  const [amount, setAmount] = useState(0);
  const [signingAccount, setSigningAccount] = useState("");

  const resetUI = () => {
    setClientPrivateKey("");
    setClientTokenAccount("");
    setClientReceivingAccount("");
    setMint("");
    setFund("");
    setFundReceivingAccount("");
    setAmount(0);
  };

  const initSubcription = async() => {
    const wallet = await getWallet();
    let clientAccount: Account;
    if (!externalSignature) {
      const clientDecodedPrivateKey = clientPrivateKey.split(',').map(s => parseInt(s));
      clientAccount = new Account(clientDecodedPrivateKey);
    };

    const subscription = await createSubscriptionIx(
      externalSignature ? wallet.publicKey : clientAccount!.publicKey,
      clientTokenAccount,
      clientReceivingAccount,
      amount,
      mintAuthority,
      mint,
      fundReceivingAccount,
    );

    const tx = new Transaction().add(subscription);

    return externalSignature
      ? sendSignedTx(tx, connection)
      : connection.sendTransaction(
        tx,
        [clientAccount!],
        {skipPreflight: false, preflightCommitment: COMMITMENT},
      );
  };

  const initRedemption = async() => {
    const wallet = await getWallet();
    let clientAccount: Account;

    if (!externalSignature) {
      const clientDecodedPrivateKey = clientPrivateKey.split(',').map(s => parseInt(s));
      clientAccount = new Account(clientDecodedPrivateKey);
    };

    const redemption = await createRedemptionIx(
      externalSignature ? wallet.publicKey : clientAccount!.publicKey,
      clientReceivingAccount,
      clientTokenAccount,
      amount,
      mintAuthority,
      mint,
      fund,
      fundReceivingAccount,
      signingAccount,
    );

    const tx = new Transaction().add(redemption);

    return externalSignature
      ? sendSignedTx(tx, connection)
      : connection.sendTransaction(
        tx,
        [clientAccount!],
        {skipPreflight: false, preflightCommitment: COMMITMENT},
      );
  };

  return (
    <>
      <p className="title">TEST UI</p>
      <div>
        <div className="mb-1">
          <label>Client Private Key</label>
          <input
            className="display-block"
            type="text"
            onChange={e => setClientPrivateKey(e.target.value)}
          />
        </div>
        <button onClick={_ => setExternalSignature(!externalSignature)}>Use Wallet</button>
        <div className="mb-1">
          <label>Client Token Account</label>
          <input
            className="display-block"
            type="text"
            onChange={e => setClientTokenAccount(e.target.value)}
          />
        </div>
        <div className="mb-1">
          <label>Client Fund Token Account</label>
          <input
            className="display-block"
            type="text"
            onChange={e => setClientReceivingAccount(e.target.value)}
          />
        </div>
        <div className="mb-1">
          <label>Mint Authority</label>
          <input
            className="display-block"
            type="text"
            onChange={e => setMintAuthority(e.target.value)}
          />
        </div>
        <div className="mb-1">
          <label>Mint</label>
          <input
            className="display-block"
            type="text"
            onChange={e => setMint(e.target.value)}
          />
        </div>
        <div className="mb-1">
          <label>Fund Owner Pubkey</label>
          <input
            className="display-block"
            type="text"
            onChange={e => setFund(e.target.value)}
          />
        </div>
        <div className="mb-1">
          <label>Fund Token Account</label>
          <input
            className="display-block"
            type="text"
            onChange={e => setFundReceivingAccount(e.target.value)}
          />
        </div>
        <div className="mb-1">
          <label>Signator</label>
          <input
            className="display-block"
            type="text"
            onChange={e => setSigningAccount(e.target.value)}
          />
        </div>
        <div className="mb-1">
          <label>Amount</label>
          <input
            className="display-block"
            type="text"
            onChange={e => setAmount(+e.target.value)}
          />
        </div>
        <button onClick={resetUI}>Reset</button>
        <button onClick={initSubcription}>Subscribe</button>
        <button onClick={initRedemption}>Redeem</button>
      </div>
    </>
  );
}
