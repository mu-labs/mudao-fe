import React, { useState, useEffect } from "react";
import {
  executeTransaction,
  TransactionType,
  MULTIPLIER,
} from "../../services/fundInstructions";

import {
  getTokenAccountInfo,
  getTokenMintAddress,
  getTokenAddress,
  AccountOwner,
  TokenAccount,
} from "../../services/wallet";

import { FUNDS } from "../../config/funds";

export default function Test() {
  const [fundMint, setFundMint] = useState("");
  const [fundTokenAccounts, setFundTokenAccounts] = useState(Array<TokenAccount>());
  const [clientTokenAccounts, setClientTokenAccounts] = useState(Array<TokenAccount>());
  const [clientTokenAccount, setClientTokenAccount] = useState("");
  const [clientTokenBalance, setClientTokenBalance] = useState(0);
  const [clientReceivingAccount, setClientReceivingAccount] = useState("");
  const [fundReceivingAccount, setFundReceivingAccount] = useState("");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    getTokenAccountInfo(AccountOwner.FUND)
      .then(res => setFundTokenAccounts(res));
    setFundMint(FUNDS.localnet[0].mint);
  }, []);

  const initFundTransaction = (txType: TransactionType) => {
    executeTransaction(
      txType,
      clientTokenAccount,
      clientReceivingAccount,
      fundReceivingAccount,
      amount,
    );
  };

  const selectToken = (tokenName: string) => {
    const tokenMintAddress = getTokenMintAddress(tokenName);
    const clientTokenAddress = getTokenAddress(clientTokenAccounts, tokenMintAddress);

    if (!clientTokenAccounts || !fundTokenAccounts) {
      throw new Error("Missing token account data.");
    }
    setClientTokenBalance(clientTokenAddress.amount / MULTIPLIER); //Doesn't update after tx -> clientAccounts are cached
    setClientTokenAccount(clientTokenAddress.pubkey);
    setClientReceivingAccount(
      getTokenAddress(clientTokenAccounts, fundMint).pubkey
    );
    setFundReceivingAccount(
      getTokenAddress(fundTokenAccounts, tokenMintAddress).pubkey
    );
  };

  return (
    <>
      <p className="title">TEST UI</p>
      <div>
        <div className="flex justify-center pt-4 pb-6">
          <div className="bg-gray-300 lg:w-1/3 w-full mx-4">
            <div className="grid grid-cols-2 border-b border-gray-400 mb-4 text-white text-center">
              <p className="border-b-2 border-blue-300 py-2">
                Subscribe
              </p>
              <p className="py-2">
                Redeem
              </p>
            </div>
            <div className="border-2 flex justify-between border-gray-400 p-2 px-4 rounded-xl text-white">
              <div>
                <p className="font-poppins mb-2">
                  Input
                </p>
                <input
                  placeholder="0.00"
                  className="bg-transparent text-white-500 text-xl"
                  onChange={e => setAmount(+e.target.value)}
                />
              </div>
              <div>
                <div className="flex font-poppins">
                  <p className="mr-2">
                    Balance:
                  </p>
                  <p>
                    {clientTokenBalance || 0.0000}
                  </p>
                </div>
                <div className="flex items-center">
                  <select
                    className="text-white bg-transparent"
                    name="tokens"
                    id="tokens"
                    onChange={e => selectToken(e.target.value)}
                  >
                    <option value="TEST0">T0</option>
                    <option value="TEST1">T1</option>
                    <option value="TEST2">T2</option>
                    <option value="TEST3">T3</option>
                  </select>
                </div>
              </div>

            </div>
            <div className="flex justify-center my-4">
            </div>
            <div className="border-2 flex justify-between border-gray-400 p-2 px-4 rounded-xl text-white">
              <div>
                <p className="font-poppins mb-2">
                  To (estimate)
                </p>
                <input placeholder="0.00" value={ amount || 0 } className="bg-transparent text-white-500 text-xl" />
              </div>
              <div>
                <div className="flex font-poppins">
                  <p className="mr-2">
                    Balance:
                  </p>
                  <p>
                    0.000
                  </p>
                </div>
                <div className="flex items-center">
                  <select className="text-white bg-transparent" name="tokens" id="tokens">
                    <option value="FUND0">F0</option>
                  </select>
                </div>
              </div>

            </div>
            <button className="bg-blue-300 w-full py-2 text-white rounded mt-4 mb-4"
              onClick={() =>
                getTokenAccountInfo(AccountOwner.CLIENT)
                  .then(res => setClientTokenAccounts(res))
              }
            >
              Connect Wallet
            </button>
          </div>
        </div>
        <div className="flex">
          <p className="transform mb-12 font-poppins text-sm -rotate-90 text-white">
            MUDAO
          </p>
          <button onClick={() => initFundTransaction(TransactionType.SUBSCRIPTION)}>Subscribe</button>
          <button onClick={() => initFundTransaction(TransactionType.REDEMPTION)}>Redeem</button>
        </div>
      </div>
    </>
  );
}
