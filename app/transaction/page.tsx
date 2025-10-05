"use client";

import { useState, useEffect } from "react";
import { X, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Transaction {
  _id?: string;
  orderId?: string;
  username?: string;
  amount: number;
  walletProvider?: string;
  status: string;
  createdAt?: string;
  paidAt?: string;
}

const TransactionRecords = () => {
  const [activeFilter, setActiveFilter] = useState<"Recharge" | "Withdraw" | "Bonus">("Recharge");
  const [showReasonPrompt, setShowReasonPrompt] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Fetch real transactions from your API
  const fetchTransactions = async () => {
    try {
      const storedCredentials = localStorage.getItem("userCredentials");
      if (!storedCredentials) {
        console.error("No credentials found in localStorage");
        setIsLoading(false);
        return;
      }

      const { username, password } = JSON.parse(storedCredentials);

      const response = await fetch("https://game.zyronetworks.shop/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (data.success) {
        setTransactions(data.transactions || []);
      } else {
        console.error("API error:", data.message);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // 🔹 Function to auto-update "Pending" status
  const getUpdatedStatus = (transaction: Transaction) => {
    const status = transaction.status?.toLowerCase() || "";
    if (status !== "pending") return transaction.status;

    const createdAt = new Date(transaction.createdAt || "");
    const now = new Date();

    const diffMinutes = (now.getTime() - createdAt.getTime()) / 1000 / 60;

    const isToday =
      createdAt.getDate() === now.getDate() &&
      createdAt.getMonth() === now.getMonth() &&
      createdAt.getFullYear() === now.getFullYear();

    // 🔸 Mark as failed if created today but older than 10 minutes
    if (isToday && diffMinutes > 10) return "Failed";

    // 🔸 Mark as failed if it's not today
    if (!isToday) return "Failed";

    // 🔸 Otherwise still pending
    return "Pending";
  };

  // 🔹 Only deposits are currently returned from API (Recharge type)
  const filteredTransactions = transactions
    .filter((t) => {
      if (activeFilter === "Recharge") return true; // deposits
      if (activeFilter === "Withdraw") return false;
      if (activeFilter === "Bonus") return false;
      return true;
    })
    .map((t) => ({
      ...t,
      status: getUpdatedStatus(t),
    }));

  const getStatusTextColor = (status: string) => {
    const lower = status.toLowerCase();
    if (["success", "paid", "received", "successful"].includes(lower)) return "text-green-500";
    if (["reviewing", "pending"].includes(lower)) return "text-blue-500";
    if (["processing"].includes(lower)) return "text-sky-500";
    if (["failed", "declined"].includes(lower)) return "text-red-500";
    return "text-gray-400";
  };

  const TransactionCard = ({
    transaction,
    isLast = false,
  }: {
    transaction: Transaction;
    isLast?: boolean;
  }) => (
    <div className="w-full text-white px-3 py-2">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs text-white/70">
          <span>Date</span>
          <span>{new Date(transaction.createdAt || "").toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-xs text-white/70">
          <span>Order ID</span>
          <span>{transaction.orderId || "N/A"}</span>
        </div>

        {transaction.walletProvider && (
          <div className="flex justify-between text-xs text-white/70">
            <span>Channel</span>
            <span>LGpay</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-white/70">Amount</span>
          <span className="text-orange-400">₹ {transaction.amount?.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-white/70">Status</span>
          <div className="flex items-center gap-1">
            <span className={`font-semibold ${getStatusTextColor(transaction.status)}`}>
              {transaction.status}
            </span>
            {transaction.status.toLowerCase() === "failed" && (
              <HelpCircle
                className="w-4 h-4 text-yellow-400 border border-yellow-400 rounded-full cursor-pointer"
                onClick={() => setShowReasonPrompt(true)}
              />
            )}
          </div>
        </div>
      </div>

      {!isLast && <div className="mt-3 border-b border-dashed border-white/30" />}
    </div>
  );

  const TransactionFilters = () => {
    const filters = [
      { key: "Recharge" as const, label: "Recharge" },
      { key: "Withdraw" as const, label: "Withdraw" },
      { key: "Bonus" as const, label: "Bonus" },
    ];

    return (
      <div className="flex gap-2 mb-4 px-0">
        {filters.map((filter) => (
          <Button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={cn(
              "flex-1 rounded-sm py text-[12px] font-sm transition-all border border-white/30 bg-transparent text-white",
              activeFilter === filter.key && "bg-red-600 text-white"
            )}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#450b00]">
      <div className="relative z-10 h-full bg-black/ max-w-md mx-auto">
        <div className="bg-[#2b0d0d] px-5 py-3 flex items-center justify-between">
          <div className="w-2"></div>
          <h1 className="text-white text-center flex justify-center items-center text-sm font-semibold">
            Transaction
          </h1>
          <div className="flex items-center gap-2">
            <a href="/wallet">
              <X className="w-5 h-4 text-white" />
            </a>
          </div>
        </div>

        <div className="px-4">
          <TransactionFilters />
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-white">Loading transactions...</div>
        ) : filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction, index) => (
            <TransactionCard
              key={transaction._id || index}
              transaction={transaction}
              isLast={index === filteredTransactions.length - 1}
            />
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-white">No transactions found</p>
          </div>
        )}

        {filteredTransactions.length > 0 && (
          <div className="text-center py-2">
            <p className="text-white text-xs">No More Data</p>
          </div>
        )}
      </div>

      {showReasonPrompt && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#450b00]/60 border border-yellow-400 rounded-md p-4 w-80 relative text-white">
            <button
              className="absolute top-2 right-2 text-white"
              onClick={() => setShowReasonPrompt(false)}
            >
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-sm font-semibold mb-2">Reason:</h2>
            <p className="text-xs text-white">
              Transaction failed automatically — more than 10 minutes old.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionRecords;
