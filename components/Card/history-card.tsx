"use client";
import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react";
import Loading from "@/components/Loading/loading";

interface Token {
  contract_address: string;
  name: string;
  symbol: string;
}

interface Transaction {
  to: string;
  from: string;
  blockNumber: number | null;
  transactionHash: string | null;
  method: string;
  decimal: number | null;
  amount: string | null;
  token: Token;
  timestamp: string;
}

interface ApiResponse {
  status: string;
  data: Transaction[];
}

interface BalanceResponse {
  status: string;
  data: {
    balance: string;
  };
}

const HistoryCard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [availableToken, setAvailableToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransactions = fetch("https://evepay.onrender.com/maschain_token/api_get_all_transaction/0x91A9fd571BE76C48Abfa189BC6b575054800ee0c")
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP error! status: ${ response.status }");
        }
        return response.json();
      });

    const fetchBalance = fetch("https://evepay.onrender.com/maschain_token/api_check_balance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        wallet_address: "0x91A9fd571BE76C48Abfa189BC6b575054800ee0c",
        contract_address: "0xFF9fE4aB4F4C255D4419B6366321e534eBE5eEdf"
      })
    }).then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error! status: ${ response.status }");
      }
      return response.json();
    });

    setLoading(true);

    Promise.all([fetchTransactions, fetchBalance])
      .then(([transactionData, balanceData]) => {
        if (transactionData.status === 'success') {
          setTransactions(transactionData.data);
        } else {
          console.error('Failed to fetch transactions:', transactionData.message);
        }

        if (balanceData.status === 'success') {
          setAvailableToken(balanceData.data.result);
        } else {
          console.error('Failed to fetch balance:', balanceData.message);
        }

        // Set loading to false after data is fetched
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching the API:", error);

        // Set loading to false after data is fetched
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mt-8 w-full max-h-fit rounded-2xl overflow-hidden border-gray-300" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)' }}>
      <div className="px-4 py-5">
        <div className='flex flex-row items-center justify-between bg-lg-light-cyan rounded-full px-4 py-3'>
          <div className='text-white text-sm'>Available Token</div>
          <div className='text-white text-base font-bold'>{availableToken} EVEC</div>
        </div>
        <div className="py-8">
          <h2 className="text-base font-bold justify-center text-center py-4">Transaction History</h2>
          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <div key={index} className="flex justify-between text-base items-center pt-10 pb-2 border-b border-light-blacK">
                <div className="flex flex-col">
                  <div className="flex flex-row items-center">
                    <p className="text-base font-medium">{new Date(transaction.timestamp).toLocaleDateString()}</p>
                    {/* <div className="pl-3 flex items-center justify-center">
                      {transaction.from === "Alpha" && (
                        <span className="flex items-center justify-center bg-dark-green-transparent rounded-full px-3 py-0.5">
                          <Icon
                            icon="charm:circle-tick"
                            className="text-dark-green mr-2"
                            style={{ fontSize: "14px" }} // Adjust icon size as needed
                          />
                          <p className="text-xs font-semibold text-dark-green">Paid</p>
                        </span>
                      )}
                    </div> */}
                  </div>
                  <p className="text-sm font-medium text-xs-light-gray">{transaction.amount}</p>
                </div>
                {transaction.from === "Jason" ? (
                  <div className="text-base font-semibold text-light-red">- {transaction.amount}</div>
                ) : (
                  <div className="text-base font-semibold text-dark-green">+ {transaction.amount}</div>
                )}
              </div>
            ))
          ) : (
            <p>No transactions found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default HistoryCard;