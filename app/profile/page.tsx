"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CreditCard } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  Notebook,
  Headphones,
  Gift,
  Settings,
  ChevronRight,
} from "lucide-react"
import BottomNavigation from "@/components/bottom-navigation"
import { RandomAvatarForAvatar } from "@/components/random-avatar"
import VipCard from "@/components/vip-card"

interface UserCredentials {
  username: string
  password: string
}

interface UserData {
  username: string
  email: string
  balance: string
  vip: number
  vipProgress: number
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // ✅ Load user data (from localStorage first, then API)
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedCredentials = localStorage.getItem("userCredentials")
        const storedUser = localStorage.getItem("userData")

        if (storedUser) {
          // Show cached data instantly
          setUserData(JSON.parse(storedUser))
          setIsLoading(false)
        }

        if (storedCredentials) {
          const credentials: UserCredentials = JSON.parse(storedCredentials)
          await fetchUserData(credentials.username, credentials.password)
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [])

  // ✅ Fetch from API and update state + localStorage
  const fetchUserData = async (username: string, password: string) => {
    try {
      setIsLoading(true)
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
          balance: data.user.balance,
          vip: data.user.vip,
          vipProgress: data.user.vipProgress,
        }
        setUserData(user)
        localStorage.setItem("userData", JSON.stringify(user))
      } else {
        console.error("Failed to fetch user data:", data.message)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("userCredentials")
    localStorage.removeItem("userData")
    router.push("/")
  }

  const formatBalance = (balance: string) => {
    if (!balance) return "0"
    try {
      const num = Number.parseFloat(balance)
      return isNaN(num) ? balance : num.toLocaleString()
    } catch {
      return balance
    }
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
      <div className="max-w-md bg-[#450b00] mx-auto px-3 py-6 pb-20">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <div className="profile-avatar w-20 h-20 rounded-full p-1 card-shadow">
                <Avatar className="w-full h-full">
                  <RandomAvatarForAvatar username={userData?.username || "Player"} alt="Profile Avatar" className="object-cover" />
                  <AvatarFallback className="bg-burgundy-700 text-gold-400 text-lg font-semibold">
                    {userData?.username ? userData.username.substring(0, 2).toUpperCase() : "P7"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div className="flex-1 text-left">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-lg font-semibold text-white">
                  {userData?.username || "Player74835887"}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-sm text-gray-400 mb-2">
                uid:{userData?.username || "74835887"}
              </div>
              <div className="text-lg font-bold text-gold-400">
                ₹{isLoading ? "Loading..." : formatBalance(userData?.balance || "0")}
              </div>
            </div>
          </div>
        </div>


        {/* vip card */}
        
        <VipCard
          level={(userData?.vip || 0) as 0 | 1 | 2 | 3 | 4 | 5 | 6}
          username={userData?.username || ""}
          progress={userData?.vipProgress || 0}
          className="mt-4"
        />


        {/* Menu Section */}
        <div className="space-y-2 ">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon

            const handleClick = () => {
              if (item.href) {
                router.push(item.href)
              }
            }

            return (
              <div
                key={index}
                onClick={handleClick}
                className="menu-item flex items-center justify-between bg-gradient-to-r  from-yellow-700/30 to-red-600/30 rounded-xl p-4 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className="w-6 h-6 text-yellow-400  rounded-full" />
                  <span className="text-white font-medium">{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <Badge className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center border-0">
                      {item.badge}
                    </Badge>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            )
          })}
        </div>

        {/* Logout Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLogout}
            className="bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-600 text-black font-bold py-2 px-12 rounded-full text-base hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-lg border border-yellow-400 relative overflow-hidden"
          >
            Logout
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
