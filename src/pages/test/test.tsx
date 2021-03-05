import React, { useState } from "react";
import { executeTransaction, TransactionType } from "../../services/fundInstructions";

export default function Test() {
  const [clientTokenAccount, setClientTokenAccount] = useState("");
  const [clientReceivingAccount, setClientReceivingAccount] = useState("");
  const [fundReceivingAccount, setFundReceivingAccount] = useState("");
  const [amount, setAmount] = useState(0);

  const resetUI = () => {
    setClientTokenAccount("");
    setClientReceivingAccount("");
    setFundReceivingAccount("");
    setAmount(0);
  };

  const initFundTransaction = async(txType: TransactionType) => {
    executeTransaction(
      txType,
      clientTokenAccount,
      clientReceivingAccount,
      fundReceivingAccount,
      amount,
    );
  };

  return (
    <>
      <p className="title">TEST UI</p>
      <div>
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
          <label>Fund Token Account</label>
          <input
            className="display-block"
            type="text"
            onChange={e => setFundReceivingAccount(e.target.value)}
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
        <button onClick={() => initFundTransaction(TransactionType.SUBSCRIPTION)}>Subscribe</button>
        <button onClick={() => initFundTransaction(TransactionType.REDEMPTION)}>Redeem</button>
      </div>
    </>
  );
}
