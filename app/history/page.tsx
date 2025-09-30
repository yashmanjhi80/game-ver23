"use client"

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  date: string;
  type: "Deposit" | "Withdrawal" | "Bonus";
  channel: string;
  amount: number;
  status: "Completed" | "In Payment" | "Failed" | "Pending";
  currency?: string;
}

const TransactionRecords = () => {
  const [activeFilter, setActiveFilter] = useState<"Recharge" | "Withdraw" | "Bonus">("Recharge");

  // Mock transaction data
  const transactions: Transaction[] = [
    {
      id: "1",
      date: "2025-09-19 12:07:10",
      type: "Deposit",
      channel: "FuntecPay",
      amount: 2000,
      status: "In Payment",
    },
    {
      id: "2",
      date: "2025-09-19 10:30:25",
      type: "Withdrawal",
      channel: "PhonePe",
      amount: 1500,
      status: "Completed",
    },
    {
      id: "3",
      date: "2025-09-19 09:15:42",
      type: "Bonus",
      channel: "Welcome Bonus",
      amount: 500,
      status: "Completed",
    },
    {
      id: "4",
      date: "2025-09-18 18:22:11",
      type: "Deposit",
      channel: "UPI",
      amount: 5000,
      status: "Completed",
    },
    {
      id: "5",
      date: "2025-09-18 16:45:33",
      type: "Withdrawal",
      channel: "Bank Transfer",
      amount: 3000,
      status: "Failed",
    },
  ];

  const filteredTransactions = transactions.filter(transaction => {
    if (activeFilter === "Recharge") return transaction.type === "Deposit";
    if (activeFilter === "Withdraw") return transaction.type === "Withdrawal";
    if (activeFilter === "Bonus") return transaction.type === "Bonus";
    return true;
  });

  const getStatusVariant = (status: Transaction["status"]) => {
    switch (status) {
      case "Completed":
        return "success";
      case "In Payment":
      case "Pending":
        return "warning";
      case "Failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getTypeColor = (type: Transaction["type"]) => {
    switch (type) {
      case "Deposit":
        return "text-success";
      case "Withdrawal":
        return "text-destructive";
      case "Bonus":
        return "text-warning";
      default:
        return "text-foreground";
    }
  };

  const TransactionCard = ({ 
    transaction, 
    isLast = false 
  }: { 
    transaction: Transaction; 
    isLast?: boolean; 
  }) => (
    <div className="w-full">
      <div className="px-4 py-3">
        <div className="text-xs text-muted-foreground mb-2">
          {transaction.date}
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div>
            <div className="text-xs text-muted-foreground">Type:</div>
            <div className={`text-sm font-medium ${getTypeColor(transaction.type)}`}>
              {transaction.type}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Amount:</div>
            <div className="text-sm font-bold text-foreground">
              {transaction.currency || "₹"} {transaction.amount.toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Channel:</div>
            <div className="text-sm font-medium text-foreground">{transaction.channel}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Status:</div>
            <Badge 
              variant={getStatusVariant(transaction.status) as any}
              className="text-xs h-5"
            >
              {transaction.status}
            </Badge>
          </div>
        </div>
      </div>
      
      {!isLast && (
        <div className="mx-4">
          <div className="border-b border-dashed border-border/50" />
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
      <div className="flex gap-2 mb-6">
        {filters.map((filter) => (
          <Button
            key={filter.key}
            variant={activeFilter === filter.key ? "default" : "secondary"}
            onClick={() => setActiveFilter(filter.key)}
            className={cn(
              "flex-1 rounded-xl py-3 font-medium transition-all duration-200",
              activeFilter === filter.key
                ? "bg-success text-success-foreground shadow-lg"
                : "bg-secondary/50 text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ background: "var(--transaction-bg)" }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 to-background/90" />
      
      {/* Content */}
      <div className="relative z-10 py-6 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-4">
          <h1 className="text-xl font-bold text-foreground">Transaction Records</h1>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-foreground hover:bg-secondary/20 rounded-full"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Filters */}
        <div className="px-4">
          <TransactionFilters />
        </div>

        {/* Transaction List */}
        <div className="bg-card">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                isLast={index === filteredTransactions.length - 1}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No More Data</p>
            </div>
          )}
        </div>

        {/* No more data message for when there are transactions */}
        {filteredTransactions.length > 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No More Data</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionRecords;
