"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, RefreshCw } from "lucide-react"
import DomainIcon from "./assets/Domain.png"

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
    <header className="sticky top-0 z-40 border-b backdrop-blur-md border-yellow-500/20 p-2 bg-burgundy-800">
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
            href="/wallet"
            className="flex items-center bg-black/  py-1.5 rounded-sm space-x-2  transition-transform"
          >
              {/* Refresh balance */}
          <button
            onClick={refreshBalance}
            disabled={isLoadingBalance}
            className="bg-orange/60  hover:bg-black/80 border border-yellow-500/30 rounded-sm transition-colors disabled:opacity-50 p-"
            title="Refresh Balance"
          >
            <RefreshCw size={16} className={`text-yellow-400 ${isLoadingBalance ? "animate-spin" : ""}`} />
          </button>
            <div className="text-white font-semibold  ">
              ₹
            </div>

            
            <span className="text-white font-semibold ">
              {isLoadingBalance ? <span className="animate-pulse text-yellow-400">...</span> : formatBalance(balance)}
            </span>
            <div className="w-full flex items-center  text-[14px] justify-center rounded-sm bg-orange-500 text-white  px-2 py-3 h-5">Deposit
             
            </div>
          </Link>

        
        </div>
      </div>
    </header>
  )
}
