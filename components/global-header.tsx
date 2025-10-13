"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { RefreshCw } from "lucide-react"
import DomainIcon from "./assets/Domain.png"
import toast from "react-hot-toast"

export default function GlobalHeader() {
  const [balance, setBalance] = useState(0)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)

  const formatBalance = (amount: number) => {
    return amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const loadBalance = async () => {
    setIsLoadingBalance(true)
    try {
      const userCredentials = localStorage.getItem("userCredentials")
      if (userCredentials) {
        const credentials = JSON.parse(userCredentials)
        const response = await fetch(
          `/api/auth/balance?username=${encodeURIComponent(credentials.username)}&password=${encodeURIComponent(credentials.password)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        )

        if (response.ok) {
          const data = await response.json()
          setBalance(Number.parseFloat(data.balance) || 0)
          toast.success("Balance refreshed!")
        } else {
          toast.error("Failed to refresh balance")
        }
      }
    } catch (error) {
      console.error("Failed to load balance:", error)
      toast.error("Failed to refresh balance")
    } finally {
      setIsLoadingBalance(false)
    }
  }

  useEffect(() => {
    loadBalance()
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur-md border-yellow-500/20 p-2 bg-burgundy-800 relative header-shine">
      <div className="relative z-10 max-w-6xl mx-auto flex items-center justify-between">
        {/* LEFT: Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/home">
            <img src={DomainIcon.src} alt="Logo" className="h-5 w-auto" />
          </Link>
        </div>

        {/* RIGHT: Balance pill */}
        <div className="flex items-center space-x-5">
          <Link
            href="/wallet"
            className="flex items-center bg-black/ py-1.5 rounded-sm space-x-2 transition-transform"
          >
            <button
              onClick={loadBalance}
              disabled={isLoadingBalance}
              className="rounded-sm transition-colors disabled:opacity-50 px-2 py-1"
              title="Refresh Balance"
            >
              <RefreshCw
                size={16}
                className={`text-yellow-400 ${isLoadingBalance ? "animate-spin" : ""}`}
              />
            </button>

            <div className="text-white font-semibold">₹</div>

            <span className="text-white font-semibold">
              {isLoadingBalance ? (
                <span className="animate-pulse text-yellow-400">...</span>
              ) : (
                formatBalance(balance)
              )}
            </span>

            <div className="w-full flex mx-2 items-center text-[14px] justify-center rounded-sm bg-orange-500 text-white px-2 py-3 h-5">
              Deposit
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}
