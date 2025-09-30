"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, RefreshCw } from "lucide-react"
import DomainIcon from "./assets/domain.png"

export default function GlobalHeader() {
  const [balance, setBalance] = useState(0)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)

  const formatBalance = (amount: number) => {
    return amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
          },
        )

        if (response.ok) {
          const data = await response.json()
          setBalance(Number.parseFloat(data.balance) || 0)
        }
      }
    } catch (error) {
      console.error("Failed to load balance:", error)
    } finally {
      setIsLoadingBalance(false)
    }
  }

  const refreshBalance = () => {
    loadBalance()
  }

  useEffect(() => {
    loadBalance()
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur-md border-yellow-500/20 p-3 bg-burgundy-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* LEFT: Logo + Username */}
        <div className="flex items-center space-x-3">
          <Link href="/home">
            <img
              src={DomainIcon.src}
              alt="Logo"
              className="h-6 w-auto "
            />
          </Link>
        </div>
        {/* END OF LEFT SECTION */}

        {/* RIGHT: Balance pill (clickable) */}
        <div className="flex items-center   space-x-5">
          <Link
            href="/deposit"
            className="flex items-center bg-black/ px-3 py-1.5 rounded-full space-x-2 hover:scale-105 transition-transform"
          >
              {/* Refresh balance */}
          <button
            onClick={refreshBalance}
            disabled={isLoadingBalance}
            className="bg-orange/60  hover:bg-black/80 border border-yellow-500/30 rounded-lg transition-colors disabled:opacity-50 p-"
            title="Refresh Balance"
          >
            <RefreshCw size={20} className={`text-orange-400 ${isLoadingBalance ? "animate-spin" : ""}`} />
          </button>
            <div className="text-white font-bold  ">
              ₹
            </div>

            
            <span className="text-white font-extrabold ">
              {isLoadingBalance ? <span className="animate-pulse text-yellow-400">...</span> : formatBalance(balance)}
            </span>
            <div className="w-full flex items-center justify-center rounded-lg bg-orange-500 text-white hover:bg-yellow-600 px-1.5 h-6">Deposit
             
            </div>
          </Link>

        
        </div>
      </div>
    </header>
  )
}
