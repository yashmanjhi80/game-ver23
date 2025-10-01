"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, CreditCard } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Bell, Shield,Notebook , Headphones, Gift, Settings, Ticket, LogOut, Camera, ChevronRight } from "lucide-react"
import BottomNavigation from "@/components/bottom-navigation"
import { RandomAvatarForAvatar } from "@/components/random-avatar"
import VipCard from "@/components/vip-card"

interface UserCredentials {
  username: string
  password: string
  user?: {
    username: string
    email: string
  }
  loginTime: string
}

export default function ProfilePage() {
  const [userCredentials, setUserCredentials] = useState<UserCredentials | null>(null)
  const router = useRouter()
  const [balance, setBalance] = useState<string>("Loading...")
  const [isLoadingBalance, setIsLoadingBalance] = useState(true)
  const [showBalance, setShowBalance] = useState(true)
  const [username, setUsername] = useState<string>("")

  useEffect(() => {
    const loadUserDataAndBalance = async () => {
      try {
        const storedCredentials = localStorage.getItem("userCredentials")
        if (storedCredentials) {
          const credentials: UserCredentials = JSON.parse(storedCredentials)
          setUsername(credentials.username)
          await fetchBalance(credentials.username, credentials.password)
        } else {
          setBalance("0")
          setIsLoadingBalance(false)
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        setBalance("Error")
        setIsLoadingBalance(false)
      }
    }

    loadUserDataAndBalance()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("userCredentials")
    localStorage.removeItem("userData")
    router.push("/")
  }

  const fetchBalance = async (username: string, password: string) => {
    try {
      setIsLoadingBalance(true)
      const response = await fetch(
        `/api/auth/balance?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
      )
      const data = await response.json()

      if (data.success) {
        const balanceValue = data.balance || data.rawResponse || "0"
        setBalance(balanceValue.toString())
      } else {
        setBalance("Error")
        console.error("Balance fetch failed:", data.message)
      }
    } catch (error) {
      console.error("Error fetching balance:", error)
      setBalance("Error")
    } finally {
      setIsLoadingBalance(false)
    }
  }

  useEffect(() => {
    const storedCredentials = localStorage.getItem("userCredentials")
    if (storedCredentials) {
      setUserCredentials(JSON.parse(storedCredentials))
    }
  }, [])

  const formatBalance = (balance: string) => {
    if (balance === "Loading..." || balance === "Error") return balance
    try {
      const num = Number.parseFloat(balance)
      if (isNaN(num)) return balance
      return num.toLocaleString()
    } catch {
      return balance
    }
  }

  const refreshBalance = async () => {
    const storedCredentials = localStorage.getItem("userCredentials")
    if (storedCredentials) {
      const credentials: UserCredentials = JSON.parse(storedCredentials)
      await fetchBalance(credentials.username, credentials.password)
    }
  }

  const menuItems = [
    { icon: Bell, label: "Notifications", badge: 1, href: "/inbox" },
    { icon: CreditCard, label: "Transaction", href: "/transaction" },
    { icon: Notebook, label: "Bets", href: "/bets" },
    { icon: Headphones, label: "Live Support", href: "/help" },
    { icon: Gift, label: "Gifts", href: "/gifts" },
 
      { icon: Settings, label: "Settings", href: "/settings" },
    { icon: LogOut, label: "Logout", onClick: handleLogout },
  ]

  const vipLevel = ((username?.charCodeAt(0) || 0) % 6) + 1
  const vipProgress = ((username?.length || 1) * 13) % 100

  return (
    <div className="min-h-screen bg-linear-65 from-burgundy-800 to-burgundy-960">


      <div className="max-w-md mx-auto px-4 py-6 pb-20">
        {/* Profile Header */}
        <div className="text-center mb-8">
          {/* Profile Info */}
          <div className="flex items-center space-x-4 mb-6">
            {/* Profile Avatar with Badge */}
            <div className="relative">
              <div className="profile-avatar w-20 h-20 rounded-full p-1 card-shadow">
                <Avatar className="w-full h-full">
                  <RandomAvatarForAvatar username={username} alt="Profile Avatar" className="object-cover" />
                  <AvatarFallback className="bg-burgundy-700 text-gold-400 text-lg font-semibold">
                    {username ? username.substring(0, 2).toUpperCase() : "P7"}
                  </AvatarFallback>
                </Avatar>
              </div>
             
            </div>

            {/* Player Info */}
            <div className="flex-1 text-left">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-lg font-semibold text-white">{username || "Player74835887"}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-sm text-gray-400 mb-2">uid:{username || "74835887"}</div>
              <div className="text-lg font-bold text-gold-400">
                ₹{isLoadingBalance ? "Loading..." : formatBalance(balance)}
              </div>
            </div>
          </div>
        </div>

        {/* VIP Card */}
        <VipCard
          level={vipLevel as 1 | 2 | 3 | 4 | 5 | 6}
          username={username}
          progress={vipProgress}
          className="mb-6"
        />

        {/* Menu Section */}
        <div className="space-y-2">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon

            const handleClick = () => {
              if (item.onClick) {
                item.onClick()
              } else if (item.href) {
                router.push(item.href)
              }
            }

            return (
              <div
                key={index}
                onClick={handleClick}
                className="menu-item flex items-center justify-between bg-burgundy-800/50 rounded-xl p-4 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className="w-6 h-6 text-gold-400" />
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
      </div>
      <BottomNavigation />
    </div>
  )
}
