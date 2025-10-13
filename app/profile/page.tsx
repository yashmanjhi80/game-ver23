"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  CreditCard,
  Bell,
  Notebook,
  Headphones,
  Gift,
  Settings,
  ChevronRight,
} from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { Badge } from "@/components/ui/badge"
import BottomNavigation from "@/components/bottom-navigation"
import VipCard from "@/components/vip-card"

interface UserCredentials {
  username: string
  password: string
}

interface UserData {
  username: string
  email: string
  vip: number
  vipProgress: number
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [balance, setBalance] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isBalanceLoading, setIsBalanceLoading] = useState(true)
  const router = useRouter()

  // ✅ Load user data from localStorage & fetch profile (no balance)
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedCredentials = localStorage.getItem("userCredentials")
        const storedUser = localStorage.getItem("userData")

        if (storedUser) {
          setUserData(JSON.parse(storedUser))
        }

        if (storedCredentials) {
          const credentials: UserCredentials = JSON.parse(storedCredentials)
          await fetchUserData(credentials.username, credentials.password)
          await fetchBalance(credentials.username, credentials.password)
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [])

  // ✅ Fetch user info (without balance)
  const fetchUserData = async (username: string, password: string) => {
    try {
      const response = await fetch("https://game.zyronetworks.shop/get-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()

      if (data.success && data.user) {
        const user: UserData = {
          username: data.user.username,
          email: data.user.email,
          vip: data.user.vip,
          vipProgress: data.user.vipProgress,
        }
        setUserData(user)
        localStorage.setItem("userData", JSON.stringify(user))
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  // ✅ Fetch balance separately from your /api route
  const fetchBalance = async (username: string, password: string) => {
    setIsBalanceLoading(true)
    try {
      const response = await fetch(
        `/api/auth/balance?username=${encodeURIComponent(
          username
        )}&password=${encodeURIComponent(password)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      )
      if (response.ok) {
        const data = await response.json()
        setBalance(Number.parseFloat(data.balance) || 0)
      }
    } catch (error) {
      console.error("Error fetching balance:", error)
    } finally {
      setIsBalanceLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("userCredentials")
    localStorage.removeItem("userData")
    toast.success("Logged out successfully!")
    setTimeout(() => router.push("/"), 500)
  }

  const formatBalance = (amount: number) => {
    return amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const menuItems = [
    { icon: Bell, label: "Notifications", badge: 1, href: "/inbox" },
    { icon: CreditCard, label: "Transaction", href: "/transaction" },
    { icon: Notebook, label: "Bets", href: "/bets" },
    { icon: Headphones, label: "Live Support", href: "/help" },
    { icon: Gift, label: "Gifts", href: "/gifts" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  return (
    <div className="min-h-screen bg-[#450b00]">
      <Toaster position="top-center" toastOptions={{
        success: {
          style: {
            background: 'rgba(34, 197, 94, 0.6)',
            color: 'white',
          },
        },
        error: {
          style: {
            background: 'rgba(239, 68, 68, 0.6)',
            color: 'white',
          },
        },
      }} />
      <div className="max-w-md bg-[#450b00] mx-auto px-3 py-6 pb-20">
        {/* Profile Header */}
        <div className="flex items-center justify-between mb-8">
          {/* Avatar + Username */}
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 ml-2 rounded-full border-white border-1 overflow-hidden">
              <img
                src="/assets/avatar.png"
                alt="Profile Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <div className="text-lg font-semibold text-white mb-1">
                {userData?.username || "Loading..."}
              </div>
              <div className="text-sm text-gray-400">
                uid: {userData?.username || "N/A"}
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="text-right pr-10">
            <div className="text-lg font-bold text-yellow-400">
              ₹
              {isBalanceLoading
                ? ".."
                : formatBalance(balance || 0)}
            </div>
          </div>
        </div>

        {/* VIP Card */}
        <VipCard
          level={(userData?.vip || 0) as 0 | 1 | 2 | 3 | 4 | 5 | 6}
          username={userData?.username || ""}
          progress={userData?.vipProgress || 0}
          className="mb-6 mt-4"
        />

        {/* Menu */}
        <div className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                onClick={() => item.href && router.push(item.href)}
                className="menu-item flex items-center justify-between bg-gradient-to-r from-yellow-700/30 to-red-600/30 rounded-xl p-4 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-6 h-6 text-yellow-400" />
                  <span className="text-white font-medium">{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <Badge className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                      {item.badge}
                    </Badge>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            )
          })}
        </div>

        {/* Logout */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLogout}
            className="bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-600 text-black font-bold py-2 px-12 rounded-full text-base hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-lg border border-yellow-400"
          >
            Logout
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
