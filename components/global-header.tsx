"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { RefreshCw } from "lucide-react"
import DomainIcon from "./assets/Domain.png"

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
        }
      }
    } catch (error) {
      console.error("Failed to load balance:", error)
    } finally {
      setIsLoadingBalance(false)
    }
  }

  useEffect(() => {
    loadBalance()
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur-md border-yellow-500/20 p-1 bg-[#450b00] header-shine">
      <div className="relative z-10 max-w-6xl mx-auto  flex items-center justify-between">
        {/* LEFT: Logo */}
        <div className="flex items-center space">
          <Link href="/home">
            <img src={DomainIcon.src} alt="Logo" className="h-5 w-auto" />
          </Link>
        </div>

        {/* RIGHT: Balance pill */}
        <div className="flex items-center space-x-5">
          <Link
            href="/wallet"
            className="flex items-center bg-black/ py-1 rounded-sm space-x-2 transition-transform"
          >
          

            <div className="text-white text-[20px] font-semibold">₹</div>

            <span className="text-white text-[20px] font-semibold">
              {isLoadingBalance ? (
                <span className="animate-pulse text-yellow-400">...</span>
              ) : (
                formatBalance(balance)
              )}
            </span>

            <div className="w-full mx-2 flex items-center font-semibold text-sm justify-center rounded-sm bg-orange-500 text-white px-4 py-3 h-5">
              Deposit
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}

