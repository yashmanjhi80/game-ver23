"use client";

import { useState } from "react";
import { X, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import link from "next/link";

interface Transaction {
  id: string;
  date: string;
  type: "Deposit" | "Withdrawal" | "Bonus";
  channel: string;
  amount: number;
  status:
    | "Pending"
    | "Success"
    | "Failed"
    | "Reviewing"
    | "Processing"
    | "Received";
  currency?: string;
}

const TransactionRecords = () => {
  const [activeFilter, setActiveFilter] = useState<"Recharge" | "Withdraw" | "Bonus">("Recharge");
  const [showReasonPrompt, setShowReasonPrompt] = useState(false);

  const transactions: Transaction[] = [
    { id: "1", date: "2025-09-19 12:07:10", type: "Deposit", channel: "LGpay", amount: 2000, status: "Pending" },
    { id: "2", date: "2025-09-19 10:30:25", type: "Withdrawal", channel: "Fpay", amount: 1500, status: "Success" },
    { id: "3", date: "2025-09-19 09:15:42", type: "Bonus", channel: "Welcome Bonus", amount: 500, status: "Received" },
    { id: "4", date: "2025-09-18 18:22:11", type: "Deposit", channel: "Fpay", amount: 5000, status: "Success" },
    { id: "5", date: "2025-09-18 16:45:33", type: "Withdrawal", channel: "Bank Transfer", amount: 3000, status: "Failed" },
    { id: "6", date: "2025-09-19 10:30:25", type: "Withdrawal", channel: "PhonePe", amount: 1500, status: "Reviewing" },
    { id: "7", date: "2025-09-19 10:30:25", type: "Withdrawal", channel: "PhonePe", amount: 1500, status: "Processing" },
  ];

  const filteredTransactions = transactions.filter(transaction => {
    if (activeFilter === "Recharge") return transaction.type === "Deposit";
    if (activeFilter === "Withdraw") return transaction.type === "Withdrawal";
    if (activeFilter === "Bonus") return transaction.type === "Bonus";
    return true;
  });

  const getStatusTextColor = (status: Transaction["status"]) => {
    switch (status) {
      case "Success":
      case "Received":
        return "text-green-500";
      case "Pending":
      case "Reviewing":
        return "text-orange-500";
      case "Processing":
        return "text-blue-500";
      case "Failed":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  const TransactionCard = ({
    transaction,
    isLast = false,
  }: {
    transaction: Transaction;
    isLast?: boolean;
  }) => (
    <div className="w-full text-white">
      <div className="px-3 py-2">
        <div className="text-xs mb-2">{transaction.date}</div>

        <div className="grid grid-cols-2 gap-3 mb-2">
          <div>
            <div className="text-xs">Type:</div>
            <div className="text-sm font-medium">{transaction.type}</div>
          </div>
          <div className="text-right">
            <div className="text-xs">Amount:</div>
            <div className="text-sm font-bold text-yellow-400">
              {transaction.currency || "₹"} {transaction.amount.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-2">
          <div>
            <div className="text-xs">Channel:</div>
            <div className="text-sm font-medium">{transaction.channel}</div>
          </div>
          <div className="text-right flex items-center justify-end gap-2">
            <div className="text-xs">Status:</div>
            <span className={`text-xs font-semibold ${getStatusTextColor(transaction.status)}`}>
              {transaction.status}
            </span>
            {transaction.type === "Withdrawal" && transaction.status === "Failed" && (
              <HelpCircle
                className="w-4 h-4 text-yellow-400 border border-yellow-400 rounded-full cursor-pointer"
                onClick={() => setShowReasonPrompt(true)}
              />
            )}
          </div>
        </div>
      </div>

      {!isLast && (
        <div className="mx-4">
          <div className="border-b border-dashed border-white/30" />
        </div>
      )}
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
            <a href="/profile">
              <X className="w-5 h-4 text-white" />
            </a>
          </div>
        </div>

        <div className="px-4">
          <TransactionFilters />
        </div>

        <div>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                isLast={index === filteredTransactions.length - 1}
              />
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-white">No More Data</p>
            </div>
          )}
        </div>

        {filteredTransactions.length > 0 && (
          <div className="text-center py-2">
            <p className="text-white text-xs">No More Data</p>
          </div>
        )}
      </div>

      {/* Reason Prompt */}
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
            <p className="text-xs text-white">Added through admin panel</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionRecords;