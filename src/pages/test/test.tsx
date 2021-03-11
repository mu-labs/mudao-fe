import React, { useState, useEffect } from "react";
import { executeTransaction, TransactionType, MULTIPLIER } from "../../services/fundInstructions";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { connection, COMMITMENT } from "../../services/connection";
import { getWallet } from "../../services/wallet";
import { parseTokenAccountData } from "../../services/data";
import { TOKENS } from "../../config/tokens";
import { FUNDS } from "../../config/funds";

type TokenAccount = { pubkey: string, mint: string, owner: string, amount: number };
enum AccountOwner {
  FUND,
  CLIENT,
};

export default function Test() {
  const [fundMint, setFundMint] = useState("");
  const [fundTokenAccounts, setFundTokenAccounts] = useState(Array<TokenAccount>());
  const [clientTokenAccounts, setClientTokenAccounts] = useState(Array<TokenAccount>());
  const [clientTokenAccount, setClientTokenAccount] = useState("");
  const [clientTokenBalance, setClientTokenBalance] = useState(0);
  const [clientReceivingAccount, setClientReceivingAccount] = useState("");
  const [fundReceivingAccount, setFundReceivingAccount] = useState("");
  const [amount, setAmount] = useState(0);


  const initFundTransaction = async(txType: TransactionType) => {
    executeTransaction(
      txType,
      clientTokenAccount,
      clientReceivingAccount,
      fundReceivingAccount,
      amount,
    );
  };

  const getInfo = async(acOwner: AccountOwner) => {
    let wallet: PublicKey;

    switch (acOwner) {
      case AccountOwner.CLIENT:
        const result = await getWallet();
        wallet = result.publickey;
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

    return acOwner === AccountOwner.CLIENT
      ? setClientTokenAccounts(tokenAccounts)
      : setFundTokenAccounts(tokenAccounts);
  };

  useEffect(() => { getInfo(AccountOwner.FUND) }, []);

  //These two functions share a lot of patterns, could be abstracted out to reduce repetition
  const getTokenMintAddress = (tokenName: string) => {
    for (const token of TOKENS.localnet) {
      if (token.tokenName === tokenName) {
        return token.mintAddress;
      }
    }
    throw new Error("No tokens with name: " + tokenName);
  };

  const getTokenAddress = (tokenAccounts: Array<TokenAccount>, tokenMint: string) => {
    for (const account of tokenAccounts) {
      if (account.mint === tokenMint) {
        return account;
      }
    }
    throw new Error("No token account associated with this token");
  };

  const test = (tokenName: string) => {
    const tokenMintAddress = getTokenMintAddress(tokenName);
    const clientTokenAddress = getTokenAddress(clientTokenAccounts, tokenMintAddress);
    setClientTokenAccount(clientTokenAddress.pubkey);
    // This is not a good approach, client accounts are cached and not updated between tx.
    setClientTokenBalance(clientTokenAddress.amount / MULTIPLIER);
    setClientReceivingAccount(
      getTokenAddress(clientTokenAccounts, fundMint).pubkey
    );
    setFundReceivingAccount(
      getTokenAddress(fundTokenAccounts, tokenMintAddress).pubkey
    );
  };

  useEffect(() => setFundMint(FUNDS.localnet[0].mint), []);

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
                    onChange={e => test(e.target.value)}
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
                <input placeholder="0.00" className="bg-transparent text-white-500 text-xl" />
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
            <button className="bg-blue-300 w-full py-2 text-white rounded mt-4 mb-4" onClick={() => getInfo()}>
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
